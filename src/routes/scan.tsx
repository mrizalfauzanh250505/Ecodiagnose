import { createFileRoute } from "@tanstack/react-router";
import { Navbar } from "@/components/site/navbar";
import { Footer } from "@/components/site/footer";
import { ScannerCard } from "@/components/site/scanner-card";

export const Route = createFileRoute("/scan")({
  head: () => ({
    meta: [
      { title: "Scan Tanaman — EcoScan AI" },
      { name: "description", content: "Scan foto tanaman Anda dengan AI dan dapatkan diagnosis serta rekomendasi perawatan." },
    ],
  }),
  component: ScanPage,
});

function ScanPage() {
  return (
    <div className="min-h-screen">
      <Navbar />
      <main className="hero-bg pt-28">
        <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <span className="text-xs font-semibold uppercase tracking-widest text-primary">Scanner</span>
            <h1 className="mt-2 font-display text-4xl font-bold sm:text-5xl">
              Analisis Kesehatan Tanaman
            </h1>
            <p className="mt-3 text-muted-foreground">
              Unggah foto tanaman untuk mendapatkan diagnosis instan dari AI. Login untuk
              menyimpan hasil ke riwayat.
            </p>
          </div>
          <div className="mt-12">
            <ScannerCard />
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
