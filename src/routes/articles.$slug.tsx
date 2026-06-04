import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { ArrowLeft, Bookmark, BookmarkCheck } from "lucide-react";
import { useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Navbar } from "@/components/site/navbar";
import { Footer } from "@/components/site/footer";
import { getArticle } from "@/lib/articles";
import { toggleBookmark } from "@/lib/profile.functions";
import { useAuth } from "@/hooks/use-auth";

export const Route = createFileRoute("/articles/$slug")({
  head: ({ params }) => {
    const a = getArticle(params.slug);
    return {
      meta: [
        { title: a ? `${a.title} — EcoScan AI` : "Artikel — EcoScan AI" },
        { name: "description", content: a?.excerpt ?? "Artikel edukasi tanaman EcoScan AI" },
        { property: "og:title", content: a?.title ?? "Artikel EcoScan AI" },
        { property: "og:description", content: a?.excerpt ?? "" },
        ...(a ? [{ property: "og:image" as const, content: a.image }] : []),
      ],
    };
  },
  loader: ({ params }) => {
    const a = getArticle(params.slug);
    if (!a) throw notFound();
    return { article: a };
  },
  errorComponent: ({ error }) => <div className="p-10 text-center">Gagal memuat: {error.message}</div>,
  notFoundComponent: () => (
    <div className="p-10 text-center">
      <p>Artikel tidak ditemukan.</p>
      <Link to="/articles" className="text-primary underline">Kembali ke daftar</Link>
    </div>
  ),
  component: ArticleDetail,
});

function ArticleDetail() {
  const { article } = Route.useLoaderData();
  const { user } = useAuth();
  const [bookmarked, setBookmarked] = useState(false);
  const bookmarkFn = useServerFn(toggleBookmark);

  const onBookmark = async () => {
    if (!user) {
      toast.info("Login untuk menyimpan artikel");
      return;
    }
    const res = await bookmarkFn({ data: { slug: article.slug } });
    setBookmarked(res.bookmarked);
    toast.success(res.bookmarked ? "Artikel disimpan" : "Bookmark dihapus");
  };

  return (
    <div className="min-h-screen">
      <Navbar />
      <main className="pt-28">
        <article className="mx-auto max-w-3xl px-4 py-12 sm:px-6 lg:px-8">
          <Link to="/articles" className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground">
            <ArrowLeft className="h-4 w-4" /> Semua artikel
          </Link>
          <div className="mt-6 flex items-center gap-3">
            <Badge variant="secondary" className="rounded-full">{article.category}</Badge>
            <span className="text-xs text-muted-foreground">{article.readTime} • {article.date}</span>
          </div>
          <h1 className="mt-4 font-display text-4xl font-bold leading-tight sm:text-5xl">
            {article.title}
          </h1>
          <p className="mt-4 text-lg text-muted-foreground">{article.excerpt}</p>
          <div className="mt-6 flex gap-2">
            <Button variant="outline" className="rounded-full" onClick={onBookmark}>
              {bookmarked ? <BookmarkCheck className="mr-2 h-4 w-4" /> : <Bookmark className="mr-2 h-4 w-4" />}
              {bookmarked ? "Tersimpan" : "Simpan"}
            </Button>
          </div>
          <img
            src={article.image}
            alt={article.title}
            loading="lazy"
            width={1024}
            height={640}
            className="mt-8 aspect-[16/10] w-full rounded-3xl object-cover shadow-card"
          />
          <div className="prose prose-neutral mt-10 max-w-none whitespace-pre-wrap text-foreground/90">
            {article.content}
          </div>
        </article>
      </main>
      <Footer />
    </div>
  );
}
