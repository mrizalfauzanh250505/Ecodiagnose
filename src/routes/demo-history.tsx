import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import { Search, Trash2, History, Activity, ShieldAlert, CheckCircle2, AlertTriangle, X } from "lucide-react";
import { Navbar } from "@/components/site/navbar";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { getDemoHistory, removeDemoHistory, clearDemoHistory, type DemoHistoryItem } from "@/lib/demo-history";

export const Route = createFileRoute("/demo-history")({
  component: DemoHistoryPage,
  head: () => ({
    meta: [
      { title: "Riwayat Demo Scan — EcoScan AI" },
      { name: "description", content: "Telusuri kembali riwayat diagnosa demo AI scanner tanaman Anda." },
    ],
  }),
});

const statusMap = {
  sehat: { label: "Sehat", className: "bg-success text-success-foreground", icon: CheckCircle2 },
  ringan: { label: "Ringan", className: "bg-warning text-warning-foreground", icon: AlertTriangle },
  sedang: { label: "Sedang", className: "bg-orange-500 text-white", icon: ShieldAlert },
  berat: { label: "Berat", className: "bg-destructive text-destructive-foreground", icon: ShieldAlert },
} as const;

function formatDate(iso: string) {
  try {
    return new Date(iso).toLocaleString("id-ID", { dateStyle: "medium", timeStyle: "short" });
  } catch {
    return iso;
  }
}

function DemoHistoryPage() {
  const [items, setItems] = useState<DemoHistoryItem[]>([]);
  const [query, setQuery] = useState("");
  const [active, setActive] = useState<DemoHistoryItem | null>(null);

  useEffect(() => {
    const refresh = () => setItems(getDemoHistory());
    refresh();
    window.addEventListener("demo-history:updated", refresh);
    window.addEventListener("storage", refresh);
    return () => {
      window.removeEventListener("demo-history:updated", refresh);
      window.removeEventListener("storage", refresh);
    };
  }, []);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return items;
    return items.filter((it) => {
      const r = it.result;
      return (
        r.plant_name?.toLowerCase().includes(q) ||
        r.diagnosis?.toLowerCase().includes(q) ||
        r.status?.toLowerCase().includes(q) ||
        r.treatment?.some((t) => t.toLowerCase().includes(q)) ||
        r.prevention?.some((t) => t.toLowerCase().includes(q))
      );
    });
  }, [items, query]);

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="mx-auto max-w-7xl px-4 pb-24 pt-28 sm:px-6 lg:px-8">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-border bg-card/60 px-3 py-1 text-xs font-medium text-muted-foreground">
              <History className="h-3.5 w-3.5" /> Riwayat Demo
            </div>
            <h1 className="mt-3 font-display text-3xl font-bold sm:text-4xl">Riwayat Diagnosa Demo</h1>
            <p className="mt-2 max-w-2xl text-muted-foreground">
              Semua hasil demo AI scanner di perangkat ini tersimpan otomatis. Cari berdasarkan nama tanaman, diagnosis, atau status.
            </p>
          </div>
          {items.length > 0 && (
            <Button
              variant="outline"
              className="rounded-full"
              onClick={() => {
                if (confirm("Hapus semua riwayat demo?")) clearDemoHistory();
              }}
            >
              <Trash2 className="mr-2 h-4 w-4" /> Bersihkan semua
            </Button>
          )}
        </div>

        <div className="mt-6 relative">
          <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Cari tanaman, diagnosis, status, perawatan…"
            className="h-12 rounded-full pl-11 pr-11"
          />
          {query && (
            <button
              type="button"
              onClick={() => setQuery("")}
              className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full p-1 text-muted-foreground hover:bg-muted"
              aria-label="Hapus pencarian"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>

        <p className="mt-3 text-sm text-muted-foreground">
          {filtered.length} dari {items.length} hasil
        </p>

        {items.length === 0 ? (
          <div className="mt-12 rounded-3xl border border-dashed border-border bg-card/40 p-12 text-center">
            <div className="mx-auto grid h-14 w-14 place-items-center rounded-2xl bg-muted">
              <History className="h-6 w-6 text-muted-foreground" />
            </div>
            <h3 className="mt-4 font-display text-lg font-semibold">Belum ada riwayat</h3>
            <p className="mt-1 text-sm text-muted-foreground">
              Coba demo AI scanner di halaman utama — hasilnya otomatis muncul di sini.
            </p>
          </div>
        ) : filtered.length === 0 ? (
          <div className="mt-12 rounded-3xl border border-dashed border-border bg-card/40 p-12 text-center">
            <p className="text-sm text-muted-foreground">Tidak ada hasil yang cocok dengan "{query}".</p>
          </div>
        ) : (
          <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {filtered.map((it, idx) => {
              const s = statusMap[it.result.status];
              const Icon = s.icon;
              return (
                <motion.button
                  key={it.id}
                  type="button"
                  onClick={() => setActive(it)}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: Math.min(idx * 0.03, 0.3) }}
                  className="group overflow-hidden rounded-3xl border border-border bg-card text-left shadow-card transition-all hover:-translate-y-1 hover:shadow-glow"
                >
                  <div className="relative h-40 overflow-hidden bg-muted">
                    <img src={it.image_url} alt={it.result.plant_name} className="h-full w-full object-cover transition-transform group-hover:scale-105" />
                    <Badge className={`absolute right-3 top-3 rounded-full ${s.className}`}>
                      <Icon className="mr-1 h-3 w-3" /> {s.label}
                    </Badge>
                  </div>
                  <div className="p-4">
                    <p className="text-xs text-muted-foreground">{formatDate(it.created_at)}</p>
                    <h3 className="mt-1 font-display text-lg font-semibold">{it.result.plant_name}</h3>
                    <p className="mt-1 line-clamp-2 text-sm text-muted-foreground">{it.result.diagnosis}</p>
                    <div className="mt-3 flex items-center justify-between text-xs">
                      <span className="text-muted-foreground">Keyakinan</span>
                      <span className="font-semibold">{it.result.confidence.toFixed(0)}%</span>
                    </div>
                    <Progress value={it.result.confidence} className="mt-1 h-1.5" />
                  </div>
                </motion.button>
              );
            })}
          </div>
        )}
      </main>

      {active && (
        <div
          className="fixed inset-0 z-50 flex items-end justify-center bg-background/80 p-4 backdrop-blur-sm sm:items-center"
          onClick={() => setActive(null)}
        >
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="relative max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-3xl border border-border bg-card p-6 shadow-glow"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              onClick={() => setActive(null)}
              className="absolute right-4 top-4 rounded-full p-2 hover:bg-muted"
              aria-label="Tutup"
            >
              <X className="h-5 w-5" />
            </button>
            <div className="overflow-hidden rounded-2xl">
              <img src={active.image_url} alt={active.result.plant_name} className="max-h-72 w-full object-cover" />
            </div>
            <div className="mt-4 flex items-start justify-between gap-3">
              <div>
                <p className="text-xs text-muted-foreground">{formatDate(active.created_at)}</p>
                <h3 className="font-display text-2xl font-bold">{active.result.plant_name}</h3>
              </div>
              <Badge className={`rounded-full ${statusMap[active.result.status].className}`}>
                {statusMap[active.result.status].label}
              </Badge>
            </div>
            <div className="mt-4 grid grid-cols-2 gap-3">
              <div className="rounded-2xl bg-muted/50 p-3">
                <p className="text-xs text-muted-foreground">Keyakinan AI</p>
                <p className="font-display text-2xl font-bold">{active.result.confidence.toFixed(0)}%</p>
                <Progress value={active.result.confidence} className="mt-2 h-1.5" />
              </div>
              <div className="rounded-2xl bg-muted/50 p-3">
                <p className="text-xs text-muted-foreground">Tingkat Kerusakan</p>
                <p className="font-display text-2xl font-bold">{active.result.damage_level.toFixed(0)}%</p>
                <Progress value={active.result.damage_level} className="mt-2 h-1.5" />
              </div>
            </div>
            <div className="mt-4">
              <p className="mb-1 flex items-center gap-2 text-sm font-semibold">
                <Activity className="h-4 w-4 text-primary" /> Diagnosis
              </p>
              <p className="text-sm text-muted-foreground">{active.result.diagnosis}</p>
            </div>
            <div className="mt-4 grid gap-4 sm:grid-cols-2">
              <div>
                <p className="mb-1 text-sm font-semibold">Rekomendasi Perawatan</p>
                <ul className="space-y-1 text-sm text-muted-foreground">
                  {active.result.treatment.map((t, i) => (
                    <li key={i} className="flex gap-2"><span className="text-primary">→</span>{t}</li>
                  ))}
                </ul>
              </div>
              <div>
                <p className="mb-1 text-sm font-semibold">Pencegahan</p>
                <ul className="space-y-1 text-sm text-muted-foreground">
                  {active.result.prevention.map((t, i) => (
                    <li key={i} className="flex gap-2"><span className="text-accent">✓</span>{t}</li>
                  ))}
                </ul>
              </div>
            </div>
            <div className="mt-6 flex justify-end">
              <Button
                variant="outline"
                className="rounded-full"
                onClick={() => {
                  removeDemoHistory(active.id);
                  setActive(null);
                }}
              >
                <Trash2 className="mr-2 h-4 w-4" /> Hapus dari riwayat
              </Button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
}
