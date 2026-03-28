import { getPublishedBlogSummaries } from "@/lib/blogs";
import { getSiteUrl } from "@/lib/site";

export default async function sitemap() {
  const baseUrl = getSiteUrl();

  const staticRoutes = ["", "/blog"].map((path) => ({
    url: `${baseUrl}${path}`,
    lastModified: new Date(),
    changeFrequency: "weekly",
    priority: path === "" ? 1 : 0.8,
  }));

  const blogs = await getPublishedBlogSummaries();
  const blogRoutes = blogs.map((post) => ({
    url: `${baseUrl}/blog/${post.slug}`,
    lastModified: post.updated_at || new Date(),
    changeFrequency: "monthly",
    priority: 0.7,
  }));

  return [...staticRoutes, ...blogRoutes];
}
