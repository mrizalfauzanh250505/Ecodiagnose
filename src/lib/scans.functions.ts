import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";

const ScanInput = z.object({
  imageDataUrl: z.string().min(20).max(15_000_000),
  save: z.boolean().optional().default(false),
});

const AnalysisSchema = z.object({
  plant_name: z.string(),
  status: z.enum(["sehat", "ringan", "sedang", "berat"]),
  confidence: z.number().min(0).max(100),
  damage_level: z.number().min(0).max(100),
  diagnosis: z.string(),
  treatment: z.array(z.string()),
  prevention: z.array(z.string()),
});

export type AnalysisResult = z.infer<typeof AnalysisSchema>;

async function callLovableAI(imageDataUrl: string): Promise<AnalysisResult> {
  const key = process.env.LOVABLE_API_KEY;
  if (!key) throw new Error("LOVABLE_API_KEY tidak tersedia");

  const systemPrompt = `Kamu adalah ahli patologi tanaman. Analisis foto tanaman yang diberikan dan kembalikan diagnosis dalam Bahasa Indonesia. Jika gambar bukan tanaman/daun, tetap kembalikan objek dengan plant_name "Tidak terdeteksi", status "sehat", confidence 0, dan diagnosis menjelaskan bahwa gambar bukan tanaman.`;

  const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${key}`,
    },
    body: JSON.stringify({
      model: "google/gemini-3-flash-preview",
      messages: [
        { role: "system", content: systemPrompt },
        {
          role: "user",
          content: [
            {
              type: "text",
              text: "Analisis foto tanaman ini. Identifikasi spesies, status kesehatan, persentase keyakinan, tingkat kerusakan (0-100), diagnosis penyakit, rekomendasi perawatan, dan langkah pencegahan.",
            },
            { type: "image_url", image_url: { url: imageDataUrl } },
          ],
        },
      ],
      tools: [
        {
          type: "function",
          function: {
            name: "report_diagnosis",
            description: "Laporkan diagnosis kesehatan tanaman",
            parameters: {
              type: "object",
              properties: {
                plant_name: { type: "string", description: "Nama tanaman dalam Bahasa Indonesia" },
                status: {
                  type: "string",
                  enum: ["sehat", "ringan", "sedang", "berat"],
                  description: "Status kesehatan",
                },
                confidence: { type: "number", description: "Keyakinan AI 0-100" },
                damage_level: { type: "number", description: "Tingkat kerusakan 0-100" },
                diagnosis: { type: "string", description: "Diagnosis singkat 1-2 kalimat" },
                treatment: {
                  type: "array",
                  items: { type: "string" },
                  description: "3-5 rekomendasi penanganan",
                },
                prevention: {
                  type: "array",
                  items: { type: "string" },
                  description: "3-5 langkah pencegahan",
                },
              },
              required: [
                "plant_name",
                "status",
                "confidence",
                "damage_level",
                "diagnosis",
                "treatment",
                "prevention",
              ],
            },
          },
        },
      ],
      tool_choice: { type: "function", function: { name: "report_diagnosis" } },
    }),
  });

  if (!response.ok) {
    const txt = await response.text();
    if (response.status === 429) {
      throw new Error("Batas penggunaan AI tercapai. Coba lagi sebentar.");
    }
    if (response.status === 402) {
      throw new Error("Kredit AI habis. Silakan tambah kredit di workspace.");
    }
    throw new Error(`AI gagal: ${response.status} ${txt.slice(0, 200)}`);
  }

  const data = await response.json();
  const toolCall = data?.choices?.[0]?.message?.tool_calls?.[0];
  if (!toolCall) throw new Error("AI tidak mengembalikan diagnosis terstruktur");
  const args = JSON.parse(toolCall.function.arguments);
  // Normalisasi: model kadang mengembalikan 0-1, ubah ke skala 0-100
  if (typeof args.confidence === "number" && args.confidence <= 1) args.confidence *= 100;
  if (typeof args.damage_level === "number" && args.damage_level <= 1) args.damage_level *= 100;
  args.confidence = Math.max(0, Math.min(100, Number(args.confidence) || 0));
  args.damage_level = Math.max(0, Math.min(100, Number(args.damage_level) || 0));
  return AnalysisSchema.parse(args);
}

// Public: tanpa login, tidak menyimpan
export const analyzeScanPublic = createServerFn({ method: "POST" })
  .inputValidator((input: unknown) =>
    z.object({ imageDataUrl: z.string().min(20).max(15_000_000) }).parse(input),
  )
  .handler(async ({ data }) => {
    const result = await callLovableAI(data.imageDataUrl);
    return result;
  });

// Authenticated: analisis + simpan ke riwayat
export const analyzeAndSaveScan = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input: unknown) => ScanInput.parse(input))
  .handler(async ({ data, context }) => {
    const { supabase, userId } = context;
    const result = await callLovableAI(data.imageDataUrl);

    let imageUrl = "";
    // Upload gambar ke storage privat
    try {
      const [, base64] = data.imageDataUrl.split(",");
      const mimeMatch = data.imageDataUrl.match(/^data:(image\/[a-z+]+);base64,/);
      const mime = mimeMatch?.[1] ?? "image/jpeg";
      const ext = mime.split("/")[1].replace("jpeg", "jpg");
      const bytes = Uint8Array.from(atob(base64), (c) => c.charCodeAt(0));
      const path = `${userId}/${crypto.randomUUID()}.${ext}`;
      const { error: upErr } = await supabase.storage
        .from("scan-images")
        .upload(path, bytes, { contentType: mime, upsert: false });
      if (!upErr) {
        const { data: signed } = await supabase.storage
          .from("scan-images")
          .createSignedUrl(path, 60 * 60 * 24 * 365);
        imageUrl = signed?.signedUrl ?? path;
      }
    } catch (e) {
      console.error("Upload image failed", e);
    }

    const { data: inserted, error } = await supabase
      .from("scans")
      .insert({
        user_id: userId,
        image_url: imageUrl,
        plant_name: result.plant_name,
        status: result.status,
        confidence: result.confidence,
        damage_level: result.damage_level,
        diagnosis: result.diagnosis,
        treatment: result.treatment,
        prevention: result.prevention,
        raw_json: result,
      })
      .select()
      .single();

    if (error) throw new Error(error.message);
    return { result, scan: inserted };
  });

export const listScans = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const { supabase, userId } = context;
    const { data, error } = await supabase
      .from("scans")
      .select("*")
      .eq("user_id", userId)
      .order("created_at", { ascending: false })
      .limit(200);
    if (error) throw new Error(error.message);
    return data ?? [];
  });

export const deleteScan = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input: unknown) => z.object({ id: z.string().uuid() }).parse(input))
  .handler(async ({ data, context }) => {
    const { supabase, userId } = context;
    const { error } = await supabase
      .from("scans")
      .delete()
      .eq("id", data.id)
      .eq("user_id", userId);
    if (error) throw new Error(error.message);
    return { ok: true };
  });

export const dashboardStats = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const { supabase, userId } = context;
    const [{ data: scans }, { count: bookmarkCount }] = await Promise.all([
      supabase
        .from("scans")
        .select("id, status, created_at")
        .eq("user_id", userId)
        .order("created_at", { ascending: false }),
      supabase
        .from("bookmarks")
        .select("id", { count: "exact", head: true })
        .eq("user_id", userId),
    ]);
    const all = scans ?? [];
    const total = all.length;
    const healthy = all.filter((s) => s.status === "sehat").length;
    const diseased = total - healthy;
    return {
      total,
      healthy,
      diseased,
      bookmarks: bookmarkCount ?? 0,
      scans: all,
    };
  });
