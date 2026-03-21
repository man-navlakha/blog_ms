export default function robots() {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://blog.mechanicsetu.tech";

  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/admin", "/api/auth"],
      },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}
