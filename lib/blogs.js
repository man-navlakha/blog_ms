import { unstable_cache } from "next/cache";
import { dbQuery, getDatabaseConfigError } from "@/lib/db";

export const BLOGS_CACHE_TAG = "blogs";
export const PUBLIC_BLOGS_REVALIDATE = 300;

function stripMarkdown(text = "") {
  return String(text)
    .replace(/```[\s\S]*?```/g, " ")
    .replace(/`([^`]+)`/g, "$1")
    .replace(/!\[([^\]]*)\]\([^)]+\)/g, "$1")
    .replace(/\[([^\]]+)\]\([^)]+\)/g, "$1")
    .replace(/^#{1,6}\s+/gm, "")
    .replace(/^[-*+]\s+/gm, "")
    .replace(/^>\s+/gm, "")
    .replace(/\*\*|__|\*|_/g, "")
    .replace(/\s+/g, " ")
    .trim();
}

export function getExcerpt(text = "", maxLength = 160) {
  const cleanText = stripMarkdown(text);
  if (cleanText.length <= maxLength) {
    return cleanText;
  }

  return `${cleanText.slice(0, maxLength).trimEnd()}...`;
}

export function normalizeKeywords(keywords = []) {
  if (Array.isArray(keywords)) {
    return keywords.map((keyword) => String(keyword).trim()).filter(Boolean);
  }

  return String(keywords || "")
    .split(",")
    .map((keyword) => keyword.trim())
    .filter(Boolean);
}

export function getBlogDescription(blog) {
  return (
    blog?.meta_description ||
    getExcerpt(blog?.content || blog?.content_excerpt || "", 160) ||
    "Mechanic Setu article about roadside assistance and vehicle care."
  );
}

const getPublishedBlogSummariesCached = unstable_cache(
  async () => {
    if (getDatabaseConfigError()) return [];

    const { rows } = await dbQuery(
      `
        select
          id,
          title,
          slug,
          meta_title,
          meta_description,
          left(content, 1200) as content_excerpt,
          published_at,
          updated_at,
          banner_url,
          keywords
        from blogs
        where status = 'published' and deleted_at is null
        order by published_at desc nulls last, updated_at desc
        limit 200
      `
    );

    return rows || [];
  },
  ["published-blog-summaries"],
  {
    revalidate: PUBLIC_BLOGS_REVALIDATE,
    tags: [BLOGS_CACHE_TAG],
  }
);

const getPublishedBlogBySlugCached = unstable_cache(
  async (slug) => {
    if (getDatabaseConfigError() || !slug) return null;

    const { rows } = await dbQuery(
      `
        select
          id,
          title,
          slug,
          content,
          meta_title,
          meta_description,
          published_at,
          updated_at,
          banner_url,
          keywords
        from blogs
        where slug = $1 and status = 'published' and deleted_at is null
        limit 1
      `,
      [slug]
    );

    return rows[0] || null;
  },
  ["published-blog-by-slug"],
  {
    revalidate: PUBLIC_BLOGS_REVALIDATE,
    tags: [BLOGS_CACHE_TAG],
  }
);

export async function getPublishedBlogSummaries() {
  try {
    return await getPublishedBlogSummariesCached();
  } catch {
    return [];
  }
}

export async function getPublishedBlogBySlug(slug) {
  try {
    return await getPublishedBlogBySlugCached(slug);
  } catch {
    return null;
  }
}

export async function getPublishedBlogSlugs() {
  const blogs = await getPublishedBlogSummaries();
  return blogs.map((blog) => blog.slug).filter(Boolean);
}
