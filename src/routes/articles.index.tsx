import { createFileRoute, Link } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { Bookmark } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Navbar } from "@/components/site/navbar";
import { Footer } from "@/components/site/footer";
import { articles } from "@/lib/articles";

export const Route = createFileRoute("/articles/")({
  head: () => ({
    meta: [
      { title: "Edukasi Tanaman — EcoScan AI" },
      { name: "description", content: "Artikel edukasi tentang penyakit tanaman, tips perawatan, pertanian modern, dan lingkungan." },
    ],
  }),
  component: ArticlesIndex,
});

function ArticlesIndex() {
  return (
    <div className="min-h-screen">
      <Navbar />
      <main className="hero-bg pt-28">
        <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <span className="text-xs font-semibold uppercase tracking-widest text-primary">Edukasi</span>
            <h1 className="mt-2 font-display text-4xl font-bold sm:text-5xl">Pustaka Tanaman</h1>
            <p className="mt-3 text-muted-foreground">
              Tips perawatan, penyakit tanaman, pertanian modern, dan lingkungan berkelanjutan.
            </p>
          </div>

          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {articles.map((a, i) => (
              <motion.div
                key={a.slug}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: i * 0.05 }}
                viewport={{ once: true }}
              >
                <Link to="/articles/$slug" params={{ slug: a.slug }}>
                  <Card className="group h-full overflow-hidden rounded-3xl border-border transition-all hover:-translate-y-1 hover:shadow-card">
                    <div className="aspect-[16/10] overflow-hidden">
                      <img
                        src={a.image}
                        alt={a.title}
                        loading="lazy"
                        width={1024}
                        height={640}
                        className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                    </div>
                    <div className="p-5">
                      <div className="flex items-center justify-between">
                        <Badge variant="secondary" className="rounded-full">{a.category}</Badge>
                        <span className="text-xs text-muted-foreground">{a.readTime}</span>
                      </div>
                      <h2 className="mt-3 line-clamp-2 font-display text-lg font-semibold">{a.title}</h2>
                      <p className="mt-2 line-clamp-2 text-sm text-muted-foreground">{a.excerpt}</p>
                      <p className="mt-4 text-xs text-muted-foreground">{a.date}</p>
                    </div>
                  </Card>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
