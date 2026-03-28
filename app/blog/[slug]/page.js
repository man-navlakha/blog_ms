import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  getBlogDescription,
  getPublishedBlogBySlug,
  getPublishedBlogSlugs,
  normalizeKeywords,
} from "@/lib/blogs";
import { getSiteUrl } from "@/lib/site";

const siteUrl = getSiteUrl();
export const revalidate = 300;

function formatPublishDate(value) {
  if (!value) return null;

  return new Date(value).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

function getContentBlocks(content = "") {
  return String(content)
    .split(/\n{2,}/)
    .map((block) => block.trim())
    .filter(Boolean)
    .map((block, index) => {
      const lines = block.split("\n").map((line) => line.trim()).filter(Boolean);
      const headingMatch = lines[0]?.match(/^(#{1,3})\s+(.+)$/);

      if (headingMatch && lines.length === 1) {
        return {
          id: `${index}-heading`,
          type: "heading",
          level: headingMatch[1].length,
          content: headingMatch[2],
        };
      }

      if (lines.every((line) => /^[-*]\s+/.test(line))) {
        return {
          id: `${index}-list`,
          type: "list",
          items: lines.map((line) => line.replace(/^[-*]\s+/, "")),
        };
      }

      return {
        id: `${index}-paragraph`,
        type: "paragraph",
        content: lines.join(" "),
      };
    });
}

export async function generateStaticParams() {
  const slugs = await getPublishedBlogSlugs();
  return slugs.map((slug) => ({ slug }));
}

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const blog = await getPublishedBlogBySlug(slug);

  if (!blog) {
    return {
      title: "Post Not Found",
      robots: {
        index: false,
        follow: false,
      },
    };
  }

  const description = getBlogDescription(blog);
  const keywords = normalizeKeywords(blog.keywords);
  const canonicalPath = `/blog/${blog.slug}`;

  return {
    title: blog.meta_title || blog.title,
    description,
    keywords,
    alternates: {
      canonical: canonicalPath,
    },
    authors: [{ name: "Mechanic Setu Team" }],
    openGraph: {
      type: "article",
      url: `${siteUrl}${canonicalPath}`,
      title: blog.meta_title || blog.title,
      description,
      publishedTime: blog.published_at || undefined,
      modifiedTime: blog.updated_at || blog.published_at || undefined,
      authors: ["Mechanic Setu Team"],
      images: blog.banner_url
        ? [
            {
              url: blog.banner_url,
              alt: blog.title,
            },
          ]
        : undefined,
    },
    twitter: {
      card: "summary_large_image",
      title: blog.meta_title || blog.title,
      description,
      images: blog.banner_url ? [blog.banner_url] : undefined,
    },
    robots: {
      index: true,
      follow: true,
    },
  };
}

export default async function BlogDetailPage({ params }) {
  const { slug } = await params;
  const blog = await getPublishedBlogBySlug(slug);

  if (!blog) {
    notFound();
  }

  const keywords = normalizeKeywords(blog.keywords);
  const description = getBlogDescription(blog);
  const contentBlocks = getContentBlocks(blog.content);
  const articleSchema = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: blog.meta_title || blog.title,
    description,
    datePublished: blog.published_at || undefined,
    dateModified: blog.updated_at || blog.published_at || undefined,
    mainEntityOfPage: `${siteUrl}/blog/${blog.slug}`,
    image: blog.banner_url ? [blog.banner_url] : undefined,
    keywords,
    articleBody: blog.content,
    author: {
      "@type": "Organization",
      name: "Mechanic Setu",
    },
    publisher: {
      "@type": "Organization",
      name: "Mechanic Setu",
      logo: {
        "@type": "ImageObject",
        url: `${siteUrl}/favicon.ico`,
      },
    },
  };

  return (
    <div className="theme-shell px-6 py-10">
      <article className="glass-card mx-auto w-full max-w-4xl p-6 md:p-8">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }}
        />

        <div className="mb-6 flex items-center justify-between gap-3">
          <span className="clay-pill px-3 py-1 text-xs font-semibold uppercase tracking-wide text-foreground">
            Blog Post
          </span>
          <Button asChild variant="ghost" size="sm">
            <Link href="/blog">Back to Blog</Link>
          </Button>
        </div>

        {blog.banner_url ? (
          <Image
            src={blog.banner_url}
            alt={blog.title}
            width={1200}
            height={640}
            className="mb-6 h-72 w-full rounded-2xl object-cover md:h-96"
            priority
          />
        ) : null}

        <h1 className="mt-2 text-3xl font-black leading-tight md:text-5xl">
          {blog.title}
        </h1>
        <p className="mt-4 text-base text-muted-ink">{description}</p>
        <p className="mt-3 text-xs text-muted-ink">
          Published: {formatPublishDate(blog.published_at) || "-"}
        </p>

        {keywords.length > 0 ? (
          <div className="mt-5 flex flex-wrap gap-2">
            {keywords.map((keyword) => (
              <span
                key={keyword}
                className="clay-pill px-3 py-1 text-xs font-semibold text-foreground"
              >
                {keyword}
              </span>
            ))}
          </div>
        ) : null}

        <div className="glass-input mt-6 rounded-2xl p-5">
          <div className="space-y-5 text-base leading-8 text-foreground/90">
            {contentBlocks.map((block) => {
              if (block.type === "heading") {
                if (block.level === 1) {
                  return (
                    <h2 key={block.id} className="text-2xl font-bold">
                      {block.content}
                    </h2>
                  );
                }

                return (
                  <h3 key={block.id} className="text-xl font-bold">
                    {block.content}
                  </h3>
                );
              }

              if (block.type === "list") {
                return (
                  <ul key={block.id} className="list-disc space-y-2 pl-6">
                    {block.items.map((item) => (
                      <li key={item}>{item}</li>
                    ))}
                  </ul>
                );
              }

              return <p key={block.id}>{block.content}</p>;
            })}
          </div>
        </div>
      </article>
    </div>
  );
}
