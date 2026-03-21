import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { dbQuery, getDatabaseConfigError } from "@/lib/db";

export const metadata = {
  title: "Mechanic Setu Blog",
  description:
    "Read roadside assistance guides, maintenance tips, and local mechanic insights from Mechanic Setu.",
};

async function getPublishedBlogs() {
  if (getDatabaseConfigError()) return [];

  try {
    const { rows } = await dbQuery(
      `
        select id, title, slug, meta_description, published_at, banner_url
        from blogs
        where status = 'published' and deleted_at is null
        order by published_at desc nulls last
        limit 50
      `
    );

    return rows || [];
  } catch {
    return [];
  }
}

export default async function BlogListPage() {
  const blogs = await getPublishedBlogs();

  return (
    <div className="theme-shell px-6 py-10">
      <main className="mx-auto w-full max-w-7xl">
        <header className="mb-8 flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
          <div>
            <h1 className="text-4xl font-black md:text-5xl">All blog posts</h1>
            <p className="mt-2 text-muted-ink">Stories, interviews, how-to guides, and marketing content.</p>
          </div>
          <Button asChild variant="ghost">
            <Link href="/admin/login">Staff Admin</Link>
          </Button>
        </header>

        {blogs.length === 0 ? (
          <section className="glass-card p-6">
            <p className="text-sm text-muted-ink">No published posts yet.</p>
          </section>
        ) : (
          <section className="grid gap-8 md:grid-cols-2 xl:grid-cols-3">
            {blogs.map((blog) => (
              <article key={blog.id} className="glass-card p-4">
                <Image
                  src={
                    blog.banner_url ||
                    "https://images.unsplash.com/photo-1472224371017-08207f84aaae?q=80&w=1200&auto=format&fit=crop"
                  }
                  alt={blog.title}
                  width={720}
                  height={420}
                  className="h-56 w-full rounded-2xl object-cover"
                />
                <p className="mt-3 text-sm text-muted-ink">
                  {blog.published_at
                    ? new Date(blog.published_at).toLocaleDateString()
                    : "Draft"}
                </p>
                <h2 className="mt-1 text-3xl font-bold leading-tight">{blog.title}</h2>
                <p className="mt-2 text-foreground/80">{blog.meta_description || "Read full article for details."}</p>
                <Button asChild className="mt-4" variant="secondary" size="sm">
                  <Link href={`/blog/${blog.slug}`}>Read Article</Link>
                </Button>
              </article>
            ))}
          </section>
        )}
      </main>
    </div>
  );
}
