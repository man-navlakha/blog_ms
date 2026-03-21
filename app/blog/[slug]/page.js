import Image from "next/image";
import { notFound } from "next/navigation";
import { dbQuery, getDatabaseConfigError } from "@/lib/db";

async function getBlogBySlug(slug) {
  if (getDatabaseConfigError()) return null;

  try {
    const { rows } = await dbQuery(
      `
        select title, slug, content, meta_title, meta_description, published_at, banner_url
        from blogs
        where slug = $1 and status = 'published' and deleted_at is null
        limit 1
      `,
      [slug]
    );

    return rows[0] || null;
  } catch {
    return null;
  }
}

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const blog = await getBlogBySlug(slug);

  if (!blog) {
    return {
      title: "Post Not Found | Mechanic Setu Blog",
    };
  }

  return {
    title: blog.meta_title || blog.title,
    description:
      blog.meta_description ||
      "Mechanic Setu article about roadside assistance and vehicle care.",
  };
}

export default async function BlogDetailPage({ params }) {
  const { slug } = await params;
  const blog = await getBlogBySlug(slug);

  if (!blog) {
    notFound();
  }

  return (
    <div className="theme-shell px-6 py-10">
      <article className="glass-card mx-auto w-full max-w-4xl p-6 md:p-8">
        {blog.banner_url ? (
          <Image
            src={blog.banner_url}
            alt={blog.title}
            width={1200}
            height={640}
            className="mb-6 h-72 w-full rounded-2xl object-cover md:h-96"
          />
        ) : null}
        <p className="text-xs font-semibold uppercase text-muted-ink">Blog Post</p>
        <h1 className="mt-2 text-3xl font-black leading-tight">{blog.title}</h1>
        <p className="mt-2 text-xs text-muted-ink">
          Published: {blog.published_at ? new Date(blog.published_at).toLocaleDateString() : "-"}
        </p>
        <div className="mt-6 whitespace-pre-wrap text-base leading-8 text-foreground/80">{blog.content}</div>
      </article>
    </div>
  );
}
