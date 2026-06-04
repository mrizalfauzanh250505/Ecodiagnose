import { createFileRoute } from "@tanstack/react-router";
import { queryOptions, useSuspenseQuery, useQueryClient } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { useEffect, useState } from "react";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { getProfile, updateProfile } from "@/lib/profile.functions";
import { useAuth } from "@/hooks/use-auth";

const profileQuery = () =>
  queryOptions({ queryKey: ["profile"], queryFn: () => getProfile() });

export const Route = createFileRoute("/_authenticated/profile")({
  head: () => ({ meta: [{ title: "Profil — EcoScan AI" }] }),
  loader: ({ context }) => context.queryClient.ensureQueryData(profileQuery()),
  errorComponent: ({ error }) => <div className="p-8">Gagal memuat: {error.message}</div>,
  notFoundComponent: () => <div className="p-8">Tidak ditemukan</div>,
  component: ProfilePage,
});

function ProfilePage() {
  const { data } = useSuspenseQuery(profileQuery());
  const { user } = useAuth();
  const qc = useQueryClient();
  const update = useServerFn(updateProfile);
  const [name, setName] = useState(data?.full_name ?? "");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    setName(data?.full_name ?? "");
  }, [data]);

  const save = async () => {
    setSaving(true);
    try {
      await update({ data: { full_name: name } });
      toast.success("Profil diperbarui");
      qc.invalidateQueries({ queryKey: ["profile"] });
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Gagal menyimpan");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="mx-auto max-w-2xl space-y-6 p-6 lg:p-10">
      <div>
        <h1 className="font-display text-3xl font-bold">Profil</h1>
        <p className="text-muted-foreground">Kelola informasi akun Anda.</p>
      </div>

      <Card className="rounded-3xl border-border p-6">
        <div className="flex items-center gap-4">
          <span className="grid h-16 w-16 place-items-center rounded-2xl bg-gradient-to-br from-primary to-accent font-display text-2xl font-bold text-primary-foreground">
            {(name || user?.email || "?")[0]?.toUpperCase()}
          </span>
          <div>
            <p className="font-display text-lg font-semibold">{name || "Pengguna EcoScan"}</p>
            <p className="text-sm text-muted-foreground">{user?.email}</p>
          </div>
        </div>

        <div className="mt-6 space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Nama Lengkap</Label>
            <Input id="name" value={name} onChange={(e) => setName(e.target.value)} />
          </div>
          <div className="space-y-2">
            <Label>Email</Label>
            <Input value={user?.email ?? ""} disabled />
          </div>
          <Button onClick={save} disabled={saving} className="rounded-full">
            {saving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />} Simpan Perubahan
          </Button>
        </div>
      </Card>
    </div>
  );
}
