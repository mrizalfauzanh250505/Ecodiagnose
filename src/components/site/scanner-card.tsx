import { useRef, useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { motion, AnimatePresence } from "framer-motion";
import {
  Activity,
  AlertTriangle,
  CheckCircle2,
  Loader2,
  ScanLine,
  ShieldAlert,
  Sparkles,
  Upload,
  X,
} from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { analyzeAndSaveScan, analyzeScanPublic, type AnalysisResult } from "@/lib/scans.functions";
import { useAuth } from "@/hooks/use-auth";

const statusMap = {
  sehat: { label: "Sehat", className: "bg-success text-success-foreground", icon: CheckCircle2 },
  ringan: { label: "Terinfeksi Ringan", className: "bg-warning text-warning-foreground", icon: AlertTriangle },
  sedang: { label: "Terinfeksi Sedang", className: "bg-orange-500 text-white", icon: ShieldAlert },
  berat: { label: "Terinfeksi Berat", className: "bg-destructive text-destructive-foreground", icon: ShieldAlert },
} as const;

async function fileToDataUrl(file: File, maxDim = 1280): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const img = new Image();
      img.onload = () => {
        const scale = Math.min(1, maxDim / Math.max(img.width, img.height));
        const w = Math.round(img.width * scale);
        const h = Math.round(img.height * scale);
        const canvas = document.createElement("canvas");
        canvas.width = w;
        canvas.height = h;
        const ctx = canvas.getContext("2d");
        if (!ctx) return reject(new Error("Canvas tidak tersedia"));
        ctx.drawImage(img, 0, 0, w, h);
        resolve(canvas.toDataURL("image/jpeg", 0.85));
      };
      img.onerror = () => reject(new Error("Gagal memuat gambar"));
      img.src = String(reader.result);
    };
    reader.onerror = () => reject(new Error("Gagal membaca file"));
    reader.readAsDataURL(file);
  });
}

export function ScannerCard({ allowSave = true }: { allowSave?: boolean }) {
  const { user } = useAuth();
  const [preview, setPreview] = useState<string | null>(null);
  const [dragOver, setDragOver] = useState(false);
  const [analyzing, setAnalyzing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const analyzePublic = useServerFn(analyzeScanPublic);
  const analyzeSave = useServerFn(analyzeAndSaveScan);

  const handleFile = async (file: File) => {
    if (!file.type.startsWith("image/")) {
      toast.error("File harus berupa gambar (JPG, PNG, atau WEBP)");
      return;
    }
    if (file.size > 8 * 1024 * 1024) {
      toast.error("Ukuran maksimum 8MB");
      return;
    }
    try {
      const dataUrl = await fileToDataUrl(file);
      setPreview(dataUrl);
      setResult(null);
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Gagal memproses gambar");
    }
  };

  const onDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    const f = e.dataTransfer.files?.[0];
    if (f) handleFile(f);
  };

  const startAnalysis = async () => {
    if (!preview) return;
    setAnalyzing(true);
    setProgress(8);
    const interval = setInterval(() => {
      setProgress((p) => (p < 90 ? p + Math.random() * 8 : p));
    }, 300);
    try {
      const fn = user && allowSave ? analyzeSave : analyzePublic;
      const data = await fn({
        data: user && allowSave ? { imageDataUrl: preview, save: true } : { imageDataUrl: preview },
      });
      setProgress(100);
      const final = "result" in data ? data.result : (data as AnalysisResult);
      setResult(final);
      if (user && allowSave) toast.success("Analisis disimpan ke riwayat");
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Analisis gagal");
    } finally {
      clearInterval(interval);
      setTimeout(() => setAnalyzing(false), 400);
    }
  };

  const reset = () => {
    setPreview(null);
    setResult(null);
    setProgress(0);
    if (inputRef.current) inputRef.current.value = "";
  };

  const statusInfo = result ? statusMap[result.status] : null;
  const StatusIcon = statusInfo?.icon;

  return (
    <div className="grid gap-6 lg:grid-cols-2">
      <div
        onDragOver={(e) => {
          e.preventDefault();
          setDragOver(true);
        }}
        onDragLeave={() => setDragOver(false)}
        onDrop={onDrop}
        className={`relative flex min-h-[360px] flex-col items-center justify-center overflow-hidden rounded-3xl border-2 border-dashed p-8 text-center transition-all ${
          dragOver ? "border-primary bg-primary/5" : "border-border bg-card/60"
        }`}
      >
        {preview ? (
          <>
            <img
              src={preview}
              alt="Pratinjau tanaman"
              className="absolute inset-0 h-full w-full object-cover opacity-80"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-background/90 via-background/30 to-transparent" />
            {analyzing && (
              <div className="pointer-events-none absolute inset-x-4 top-4 bottom-4 overflow-hidden rounded-2xl">
                <div className="animate-scan-line absolute inset-x-0 h-1 bg-gradient-to-r from-transparent via-primary to-transparent shadow-glow" />
              </div>
            )}
            <div className="relative z-10 mt-auto flex w-full flex-wrap items-center justify-center gap-2">
              {!analyzing && !result && (
                <Button onClick={startAnalysis} size="lg" className="rounded-full">
                  <Sparkles className="mr-2 h-4 w-4" /> Mulai Analisis AI
                </Button>
              )}
              {analyzing && (
                <Button disabled size="lg" className="rounded-full">
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" /> AI sedang menganalisis…
                </Button>
              )}
              <Button variant="outline" onClick={reset} size="lg" className="rounded-full">
                <X className="mr-2 h-4 w-4" /> Ganti Foto
              </Button>
            </div>
          </>
        ) : (
          <>
            <div className="grid h-16 w-16 place-items-center rounded-2xl bg-gradient-to-br from-primary to-accent text-primary-foreground shadow-glow">
              <Upload className="h-7 w-7" />
            </div>
            <h3 className="mt-5 font-display text-xl font-semibold">Unggah Foto Tanaman</h3>
            <p className="mt-2 max-w-xs text-sm text-muted-foreground">
              Tarik & lepas foto di sini, atau pilih file. Format JPG, PNG, atau WEBP (maks 8MB).
            </p>
            <Button
              onClick={() => inputRef.current?.click()}
              className="mt-5 rounded-full"
              size="lg"
            >
              Pilih File
            </Button>
            <input
              ref={inputRef}
              type="file"
              accept="image/jpeg,image/png,image/webp"
              className="hidden"
              onChange={(e) => {
                const f = e.target.files?.[0];
                if (f) handleFile(f);
              }}
            />
          </>
        )}
      </div>

      <div className="relative min-h-[360px] rounded-3xl border border-border bg-card p-6 shadow-card">
        {analyzing && (
          <div className="flex h-full flex-col justify-center gap-4">
            <div className="flex items-center gap-3">
              <ScanLine className="h-5 w-5 animate-pulse text-primary" />
              <span className="font-display text-lg font-semibold">AI sedang berpikir…</span>
            </div>
            <Progress value={progress} className="h-2" />
            <ul className="space-y-1 text-sm text-muted-foreground">
              <li className={progress > 20 ? "text-foreground" : ""}>• Memproses gambar</li>
              <li className={progress > 50 ? "text-foreground" : ""}>• Mendeteksi spesies tanaman</li>
              <li className={progress > 75 ? "text-foreground" : ""}>• Menganalisis penyakit</li>
              <li className={progress > 90 ? "text-foreground" : ""}>• Menyusun rekomendasi</li>
            </ul>
          </div>
        )}

        <AnimatePresence>
          {!analyzing && result && statusInfo && StatusIcon && (
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="flex h-full flex-col gap-4"
            >
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="text-xs uppercase tracking-wide text-muted-foreground">
                    Tanaman terdeteksi
                  </p>
                  <h3 className="font-display text-2xl font-bold">{result.plant_name}</h3>
                </div>
                <Badge className={`rounded-full px-3 py-1 ${statusInfo.className}`}>
                  <StatusIcon className="mr-1 h-3.5 w-3.5" /> {statusInfo.label}
                </Badge>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="rounded-2xl bg-muted/50 p-3">
                  <p className="text-xs text-muted-foreground">Keyakinan AI</p>
                  <p className="font-display text-2xl font-bold">{result.confidence.toFixed(0)}%</p>
                  <Progress value={result.confidence} className="mt-2 h-1.5" />
                </div>
                <div className="rounded-2xl bg-muted/50 p-3">
                  <p className="text-xs text-muted-foreground">Tingkat Kerusakan</p>
                  <p className="font-display text-2xl font-bold">{result.damage_level.toFixed(0)}%</p>
                  <Progress value={result.damage_level} className="mt-2 h-1.5" />
                </div>
              </div>

              <div>
                <p className="mb-1 flex items-center gap-2 text-sm font-semibold">
                  <Activity className="h-4 w-4 text-primary" /> Diagnosis
                </p>
                <p className="text-sm text-muted-foreground">{result.diagnosis}</p>
              </div>

              <div className="grid gap-3 sm:grid-cols-2">
                <div>
                  <p className="mb-1 text-sm font-semibold">Rekomendasi Perawatan</p>
                  <ul className="space-y-1 text-sm text-muted-foreground">
                    {result.treatment.slice(0, 5).map((t, i) => (
                      <li key={i} className="flex gap-2"><span className="text-primary">→</span>{t}</li>
                    ))}
                  </ul>
                </div>
                <div>
                  <p className="mb-1 text-sm font-semibold">Pencegahan</p>
                  <ul className="space-y-1 text-sm text-muted-foreground">
                    {result.prevention.slice(0, 5).map((t, i) => (
                      <li key={i} className="flex gap-2"><span className="text-accent">✓</span>{t}</li>
                    ))}
                  </ul>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {!analyzing && !result && (
          <div className="flex h-full flex-col items-center justify-center gap-3 text-center">
            <div className="grid h-14 w-14 place-items-center rounded-2xl bg-muted">
              <Sparkles className="h-6 w-6 text-primary" />
            </div>
            <h3 className="font-display text-lg font-semibold">Hasil Analisis</h3>
            <p className="max-w-xs text-sm text-muted-foreground">
              Unggah foto dan tekan tombol untuk melihat diagnosis AI dalam hitungan detik.
            </p>
            {!user && allowSave && (
              <p className="mt-2 rounded-full bg-muted px-3 py-1 text-xs text-muted-foreground">
                Login untuk menyimpan hasil ke riwayat
              </p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
