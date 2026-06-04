import { Link } from "@tanstack/react-router";
import { Github, Instagram, Leaf, Linkedin } from "lucide-react";

export function Footer() {
  return (
    <footer className="border-t border-border bg-card/40">
      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-14 sm:px-6 lg:grid-cols-4 lg:px-8">
        <div>
          <Link to="/" className="flex items-center gap-2 font-display text-lg font-bold">
            <span className="grid h-9 w-9 place-items-center rounded-xl bg-gradient-to-br from-primary to-accent text-primary-foreground shadow-glow">
              <Leaf className="h-5 w-5" />
            </span>
            <span>EcoScan AI</span>
          </Link>
          <p className="mt-4 max-w-sm text-sm text-muted-foreground">
            Platform AgriTech berbasis AI untuk mendeteksi penyakit tanaman dan mendukung
            pertanian berkelanjutan.
          </p>
        </div>

        <div>
          <h4 className="font-display text-sm font-semibold">Menu</h4>
          <ul className="mt-4 space-y-2 text-sm text-muted-foreground">
            <li><Link to="/" className="hover:text-foreground">Beranda</Link></li>
            <li><a href="/#fitur" className="hover:text-foreground">Fitur</a></li>
            <li><Link to="/articles" className="hover:text-foreground">Edukasi</Link></li>
            <li><a href="/#cara-kerja" className="hover:text-foreground">Tentang Kami</a></li>
          </ul>
        </div>

        <div>
          <h4 className="font-display text-sm font-semibold">Produk</h4>
          <ul className="mt-4 space-y-2 text-sm text-muted-foreground">
            <li><Link to="/scan" className="hover:text-foreground">Scan Tanaman</Link></li>
            <li><Link to="/dashboard" className="hover:text-foreground">Dashboard</Link></li>
            <li><Link to="/history" className="hover:text-foreground">Riwayat</Link></li>
            <li><Link to="/bookmarks" className="hover:text-foreground">Bookmark</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="font-display text-sm font-semibold">Ikuti Kami</h4>
          <div className="mt-4 flex gap-3">
            <a href="#" aria-label="Instagram" className="grid h-10 w-10 place-items-center rounded-full border border-border hover:bg-accent">
              <Instagram className="h-4 w-4" />
            </a>
            <a href="#" aria-label="LinkedIn" className="grid h-10 w-10 place-items-center rounded-full border border-border hover:bg-accent">
              <Linkedin className="h-4 w-4" />
            </a>
            <a href="#" aria-label="GitHub" className="grid h-10 w-10 place-items-center rounded-full border border-border hover:bg-accent">
              <Github className="h-4 w-4" />
            </a>
          </div>
        </div>
      </div>
      <div className="border-t border-border">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-2 px-4 py-6 text-xs text-muted-foreground sm:flex-row sm:px-6 lg:px-8">
          <span>© 2026 EcoScan AI. Semua hak dilindungi.</span>
          <span>Mendukung SDG 15 — Life on Land 🌱</span>
        </div>
      </div>
    </footer>
  );
}
