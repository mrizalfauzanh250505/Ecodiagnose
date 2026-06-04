import { createFileRoute } from "@tanstack/react-router";
import { queryOptions, useSuspenseQuery, useQueryClient } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { useMemo, useState } from "react";
import { Search, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { deleteScan, listScans } from "@/lib/scans.functions";

const scansQuery = () =>
  queryOptions({
    queryKey: ["scans"],
    queryFn: () => listScans(),
  });

export const Route = createFileRoute("/_authenticated/history")({
  head: () => ({ meta: [{ title: "Riwayat Analisis — EcoScan AI" }] }),
  loader: ({ context }) => context.queryClient.ensureQueryData(scansQuery()),
  errorComponent: ({ error }) => <div className="p-8">Gagal memuat: {error.message}</div>,
  notFoundComponent: () => <div className="p-8">Tidak ditemukan</div>,
  component: HistoryPage,
});

const statusBadge = (status: string) => {
  switch (status) {
    case "sehat":
      return "bg-success/20 text-success border-success/30";
    case "ringan":
      return "bg-warning/20 text-warning border-warning/30";
    case "sedang":
      return "bg-orange-500/20 text-orange-600 border-orange-500/30";
    default:
      return "bg-destructive/20 text-destructive border-destructive/30";
  }
};

function HistoryPage() {
  const { data } = useSuspenseQuery(scansQuery());
  const qc = useQueryClient();
  const del = useServerFn(deleteScan);
  const [q, setQ] = useState("");
  const [range, setRange] = useState("all");

  const filtered = useMemo(() => {
    const now = Date.now();
    const limit =
      range === "week" ? 7 : range === "month" ? 30 : range === "year" ? 365 : Infinity;
    return data
      .filter((s) => {
        const age = (now - new Date(s.created_at).getTime()) / (1000 * 60 * 60 * 24);
        return age <= limit;
      })
      .filter((s) =>
        q
          ? s.plant_name.toLowerCase().includes(q.toLowerCase()) ||
            s.diagnosis.toLowerCase().includes(q.toLowerCase())
          : true,
      );
  }, [data, q, range]);

  const remove = async (id: string) => {
    await del({ data: { id } });
    toast.success("Riwayat dihapus");
    qc.invalidateQueries({ queryKey: ["scans"] });
    qc.invalidateQueries({ queryKey: ["dashboard-stats"] });
  };

  return (
    <div className="mx-auto max-w-7xl space-y-6 p-6 lg:p-10">
      <div>
        <h1 className="font-display text-3xl font-bold">Riwayat Analisis</h1>
        <p className="text-muted-foreground">Pantau seluruh hasil scan tanaman Anda.</p>
      </div>

      <Card className="rounded-3xl border-border p-4">
        <div className="flex flex-wrap items-center gap-3">
          <div className="relative flex-1 min-w-[200px]">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Cari tanaman atau diagnosis…"
              value={q}
              onChange={(e) => setQ(e.target.value)}
              className="pl-9 rounded-full"
            />
          </div>
          <Select value={range} onValueChange={setRange}>
            <SelectTrigger className="w-40 rounded-full"><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Semua waktu</SelectItem>
              <SelectItem value="week">Mingguan</SelectItem>
              <SelectItem value="month">Bulanan</SelectItem>
              <SelectItem value="year">Tahunan</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </Card>

      <Card className="overflow-hidden rounded-3xl border-border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Foto</TableHead>
              <TableHead>Tanaman</TableHead>
              <TableHead>Diagnosis</TableHead>
              <TableHead>Kerusakan</TableHead>
              <TableHead>Tanggal</TableHead>
              <TableHead className="text-right">Aksi</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filtered.map((s) => (
              <TableRow key={s.id}>
                <TableCell>
                  {s.image_url ? (
                    <img
                      src={s.image_url}
                      alt={s.plant_name}
                      className="h-12 w-12 rounded-xl object-cover"
                    />
                  ) : (
                    <div className="h-12 w-12 rounded-xl bg-muted" />
                  )}
                </TableCell>
                <TableCell className="font-medium">{s.plant_name}</TableCell>
                <TableCell className="max-w-[280px] truncate text-sm text-muted-foreground">
                  {s.diagnosis}
                </TableCell>
                <TableCell>
                  <Badge variant="outline" className={`rounded-full ${statusBadge(s.status)}`}>
                    {Number(s.damage_level).toFixed(0)}% — {s.status}
                  </Badge>
                </TableCell>
                <TableCell className="text-sm text-muted-foreground">
                  {new Date(s.created_at).toLocaleDateString("id-ID")}
                </TableCell>
                <TableCell className="text-right">
                  <Button variant="ghost" size="icon" onClick={() => remove(s.id)}>
                    <Trash2 className="h-4 w-4 text-destructive" />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
            {filtered.length === 0 && (
              <TableRow>
                <TableCell colSpan={6} className="py-12 text-center text-muted-foreground">
                  Belum ada data sesuai filter.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </Card>
    </div>
  );
}
