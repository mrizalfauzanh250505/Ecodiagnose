import { createFileRoute, Link } from "@tanstack/react-router";
import { queryOptions, useSuspenseQuery } from "@tanstack/react-query";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { listBookmarks } from "@/lib/profile.functions";
import { articles } from "@/lib/articles";

const bookmarksQuery = () =>
  queryOptions({
    queryKey: ["bookmarks"],
    queryFn: () => listBookmarks(),
  });

export const Route = createFileRoute("/_authenticated/bookmarks")({
  head: () => ({ meta: [{ title: "Bookmark — EcoScan AI" }] }),
  loader: ({ context }) => context.queryClient.ensureQueryData(bookmarksQuery()),
  errorComponent: ({ error }) => <div className="p-8">Gagal memuat: {error.message}</div>,
  notFoundComponent: () => <div className="p-8">Tidak ditemukan</div>,
  component: BookmarksPage,
});

function BookmarksPage() {
  const { data } = useSuspenseQuery(bookmarksQuery());
  const saved = articles.filter((a) => data.some((b) => b.article_slug === a.slug));

  return (
    <div className="mx-auto max-w-7xl space-y-6 p-6 lg:p-10">
      <div>
        <h1 className="font-display text-3xl font-bold">Bookmark</h1>
        <p className="text-muted-foreground">Artikel edukasi yang Anda simpan.</p>
      </div>

      {saved.length === 0 ? (
        <Card className="rounded-3xl border-border p-10 text-center">
          <p className="text-muted-foreground">
            Belum ada bookmark. <Link to="/articles" className="text-primary underline">Jelajahi artikel</Link>.
          </p>
        </Card>
      ) : (
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {saved.map((a) => (
            <Link key={a.slug} to="/articles/$slug" params={{ slug: a.slug }}>
              <Card className="group h-full overflow-hidden rounded-3xl border-border transition-all hover:-translate-y-1 hover:shadow-card">
                <img src={a.image} alt={a.title} loading="lazy" className="aspect-[16/10] w-full object-cover" />
                <div className="p-5">
                  <Badge variant="secondary" className="rounded-full">{a.category}</Badge>
                  <h2 className="mt-3 line-clamp-2 font-display text-lg font-semibold">{a.title}</h2>
                  <p className="mt-2 line-clamp-2 text-sm text-muted-foreground">{a.excerpt}</p>
                </div>
              </Card>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
