import { redirect } from "next/navigation";
import Link from "next/link";
import BlogEditor from "@/components/BlogEditor";
import { getAuthenticatedStaff } from "@/lib/auth";
import { dbQuery, getDatabaseConfigError } from "@/lib/db";

export const metadata = {
  title: "Edit Blog",
  description: "Edit and update existing blog posts in Mechanic Setu admin.",
};

async function getBlog(slug) {
  if (getDatabaseConfigError()) return null;

  try {
    const { rows } = await dbQuery(
      `
        select id, title, slug, content, meta_title, meta_description, banner_url, keywords, status
        from blogs
        where slug = $1 and deleted_at is null
        limit 1
      `,
      [slug]
    );

    return rows[0] || null;
  } catch {
    return null;
  }
}

export default async function AdminEditBlogPage({ params }) {
  const staff = await getAuthenticatedStaff();

  if (!staff) {
    redirect("/admin/login");
  }

  const { slug } = await params;
  const blog = await getBlog(slug);

  if (!blog) {
    redirect("/admin/blog/list");
  }

  return (
    <div className="theme-shell px-6 py-10">
      <div className="mx-auto w-full max-w-6xl">
        <div className="mb-4">
          <Link href="/admin/blog/list" className="premium-btn-ghost inline-flex px-4 py-2">
            Back to Blog List
          </Link>
        </div>
        <BlogEditor mode="edit" initialData={blog} />
      </div>
    </div>
  );
}
