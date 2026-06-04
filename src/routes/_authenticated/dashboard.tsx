import { createFileRoute, Link } from "@tanstack/react-router";
import { queryOptions, useSuspenseQuery } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import {
  AreaChart,
  Area,
  ResponsiveContainer,
  XAxis,
  YAxis,
  Tooltip,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts";
import {
  Bookmark,
  Leaf,
  ScanLine,
  ShieldAlert,
  Sparkles,
  TrendingUp,
} from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { dashboardStats } from "@/lib/scans.functions";

const statsQuery = () =>
  queryOptions({
    queryKey: ["dashboard-stats"],
    queryFn: () => dashboardStats(),
  });

export const Route = createFileRoute("/_authenticated/dashboard")({
  head: () => ({ meta: [{ title: "Dashboard — EcoScan AI" }] }),
  loader: ({ context }) => context.queryClient.ensureQueryData(statsQuery()),
  errorComponent: ({ error }) => <div className="p-8">Gagal memuat: {error.message}</div>,
  notFoundComponent: () => <div className="p-8">Tidak ditemukan</div>,
  component: DashboardPage,
});

const COLORS = ["hsl(145 65% 45%)", "hsl(75 75% 50%)", "hsl(35 90% 55%)", "hsl(0 75% 55%)"];

function DashboardPage() {
  const { data } = useSuspenseQuery(statsQuery());
  const fetchStats = useServerFn(dashboardStats);

  // Build weekly trend (last 7 days)
  const today = new Date();
  const trend = Array.from({ length: 7 }).map((_, idx) => {
    const d = new Date(today);
    d.setDate(today.getDate() - (6 - idx));
    const key = d.toISOString().slice(0, 10);
    const count = data.scans.filter((s) => s.created_at.slice(0, 10) === key).length;
    return { day: d.toLocaleDateString("id-ID", { weekday: "short" }), scans: count };
  });

  const statusCounts = ["sehat", "ringan", "sedang", "berat"].map((st, i) => ({
    name: st,
    value: data.scans.filter((s) => s.status === st).length,
    color: COLORS[i],
  }));

  const cards = [
    { label: "Total Scan", value: data.total, icon: ScanLine, accent: "from-primary to-accent" },
    { label: "Penyakit Terdeteksi", value: data.diseased, icon: ShieldAlert, accent: "from-destructive to-warning" },
    { label: "Tanaman Sehat", value: data.healthy, icon: Leaf, accent: "from-success to-primary" },
    { label: "Bookmark Tersimpan", value: data.bookmarks, icon: Bookmark, accent: "from-accent to-warning" },
  ];

  return (
    <div className="mx-auto max-w-7xl space-y-8 p-6 lg:p-10">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="font-display text-3xl font-bold">Halo 👋</h1>
          <p className="text-muted-foreground">Ringkasan aktivitas analisis tanaman Anda.</p>
        </div>
        <Button asChild className="rounded-full">
          <Link to="/scan"><Sparkles className="mr-2 h-4 w-4" />Scan Baru</Link>
        </Button>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {cards.map((c) => (
          <Card key={c.label} className="rounded-3xl border-border p-5">
            <div className="flex items-center justify-between">
              <span className={`grid h-11 w-11 place-items-center rounded-xl bg-gradient-to-br ${c.accent} text-primary-foreground`}>
                <c.icon className="h-5 w-5" />
              </span>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </div>
            <p className="mt-4 text-xs uppercase tracking-wide text-muted-foreground">{c.label}</p>
            <p className="font-display text-3xl font-bold">{c.value}</p>
          </Card>
        ))}
      </div>

      <div className="grid gap-5 lg:grid-cols-3">
        <Card className="rounded-3xl border-border p-5 lg:col-span-2">
          <h3 className="font-display text-lg font-semibold">Aktivitas 7 Hari Terakhir</h3>
          <div className="mt-4 h-64">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={trend}>
                <defs>
                  <linearGradient id="g1" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="hsl(145 65% 45%)" stopOpacity={0.6} />
                    <stop offset="95%" stopColor="hsl(145 65% 45%)" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <XAxis dataKey="day" stroke="hsl(220 10% 60%)" fontSize={12} />
                <YAxis stroke="hsl(220 10% 60%)" fontSize={12} allowDecimals={false} />
                <Tooltip contentStyle={{ borderRadius: 12 }} />
                <Area type="monotone" dataKey="scans" stroke="hsl(145 65% 45%)" strokeWidth={2} fill="url(#g1)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </Card>

        <Card className="rounded-3xl border-border p-5">
          <h3 className="font-display text-lg font-semibold">Distribusi Status</h3>
          <div className="mt-4 h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={statusCounts} dataKey="value" nameKey="name" innerRadius={50} outerRadius={80} paddingAngle={4}>
                  {statusCounts.map((s, i) => <Cell key={i} fill={s.color} />)}
                </Pie>
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </div>

      <Card className="rounded-3xl border-border p-5">
        <div className="flex items-center justify-between">
          <h3 className="font-display text-lg font-semibold">Scan Terbaru</h3>
          <Button variant="ghost" asChild><Link to="/history">Lihat semua</Link></Button>
        </div>
        <div className="mt-4 divide-y divide-border">
          {data.scans.slice(0, 5).map((s) => (
            <div key={s.id} className="flex items-center justify-between py-3">
              <div>
                <p className="font-medium">{s.status === "sehat" ? "Sehat" : "Terdiagnosis"}</p>
                <p className="text-xs text-muted-foreground">{new Date(s.created_at).toLocaleString("id-ID")}</p>
              </div>
              <span className="text-xs uppercase text-muted-foreground">{s.status}</span>
            </div>
          ))}
          {data.scans.length === 0 && (
            <div className="py-8 text-center text-sm text-muted-foreground">
              Belum ada scan. <Link to="/scan" className="text-primary underline">Mulai sekarang</Link>.
            </div>
          )}
        </div>
      </Card>
    </div>
  );
}
