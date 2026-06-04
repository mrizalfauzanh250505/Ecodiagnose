import { Link, useRouterState, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Leaf, Menu, Moon, Sun, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useTheme } from "@/hooks/use-theme";
import { useAuth } from "@/hooks/use-auth";

const navItems = [
  { label: "Beranda", to: "/", hash: undefined },
  { label: "Cara Kerja", to: "/", hash: "#cara-kerja" },
  { label: "Fitur", to: "/", hash: "#fitur" },
  { label: "Demo", to: "/", hash: "#demo" },
  { label: "Edukasi", to: "/articles", hash: undefined },
];

export function Navbar() {
  const { theme, toggle } = useTheme();
  const { user } = useAuth();
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-all ${
        scrolled ? "glass-strong shadow-card" : ""
      }`}
    >
      <nav className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link to="/" className="flex items-center gap-2 font-display text-lg font-bold">
          <span className="grid h-9 w-9 place-items-center rounded-xl bg-gradient-to-br from-primary to-accent text-primary-foreground shadow-glow">
            <Leaf className="h-5 w-5" />
          </span>
          <span>EcoScan AI</span>
        </Link>

        <div className="hidden items-center gap-1 md:flex">
          {navItems.map((it) =>
            it.hash ? (
              <a
                key={it.label}
                href={it.hash}
                className="rounded-md px-3 py-2 text-sm font-medium text-foreground/70 transition-colors hover:text-foreground"
              >
                {it.label}
              </a>
            ) : (
              <Link
                key={it.label}
                to={it.to}
                className="rounded-md px-3 py-2 text-sm font-medium text-foreground/70 transition-colors hover:text-foreground"
              >
                {it.label}
              </Link>
            ),
          )}
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="icon"
            onClick={toggle}
            aria-label="Toggle theme"
            className="rounded-full"
          >
            {theme === "dark" ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
          </Button>
          {user ? (
            <Button asChild className="hidden rounded-full md:inline-flex">
              <Link to="/dashboard">Dashboard</Link>
            </Button>
          ) : (
            <>
              <Button asChild variant="ghost" className="hidden rounded-full md:inline-flex">
                <Link to="/auth">Masuk</Link>
              </Button>
              <Button asChild className="hidden rounded-full md:inline-flex">
                <Link to="/scan">Mulai Scan</Link>
              </Button>
            </>
          )}
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden"
            onClick={() => setOpen((v) => !v)}
            aria-label="Menu"
          >
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </Button>
        </div>
      </nav>

      {open && (
        <div className="glass-strong border-t border-border md:hidden">
          <div className="mx-auto flex max-w-7xl flex-col gap-2 px-4 py-4">
            {navItems.map((it) =>
              it.hash ? (
                <a
                  key={it.label}
                  href={it.hash}
                  onClick={() => setOpen(false)}
                  className="rounded-md px-3 py-2 text-sm font-medium"
                >
                  {it.label}
                </a>
              ) : (
                <Link
                  key={it.label}
                  to={it.to}
                  onClick={() => setOpen(false)}
                  className="rounded-md px-3 py-2 text-sm font-medium"
                >
                  {it.label}
                </Link>
              ),
            )}
            <div className="mt-2 flex gap-2">
              {user ? (
                <Button asChild className="flex-1 rounded-full">
                  <Link to="/dashboard">Dashboard</Link>
                </Button>
              ) : (
                <>
                  <Button asChild variant="outline" className="flex-1 rounded-full">
                    <Link to="/auth">Masuk</Link>
                  </Button>
                  <Button asChild className="flex-1 rounded-full">
                    <Link to="/scan">Mulai Scan</Link>
                  </Button>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
