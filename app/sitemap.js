import { dbQuery, getDatabaseConfigError } from "@/lib/db";

export default async function sitemap() {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://blog.mechanicsetu.tech";

  const staticRoutes = ["", "/blog"].map((path) => ({
    url: `${baseUrl}${path}`,
    lastModified: new Date(),
  }));

  if (getDatabaseConfigError()) {
    return staticRoutes;
  }

  let rows = [];
  try {
    const queryResult = await dbQuery(
      `
        select slug, updated_at
        from blogs
        where status = 'published' and deleted_at is null
        order by updated_at desc
        limit 5000
      `
    );
    rows = queryResult.rows || [];
  } catch {
    rows = [];
  }

  const blogRoutes = (rows || []).map((post) => ({
    url: `${baseUrl}/blog/${post.slug}`,
    lastModified: post.updated_at || new Date(),
  }));

  return [...staticRoutes, ...blogRoutes];
}
