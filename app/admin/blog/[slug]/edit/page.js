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
    <div className="space-y-5">
      <section className="admin-panel rounded-[1.75rem] p-6 md:p-7">
        <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="admin-kicker">Editor</p>
            <h1 className="mt-3 text-3xl font-black text-white">Edit Blog Post</h1>
            <p className="mt-2 text-sm text-slate-300">
              Update content, metadata, and publication status for this article.
            </p>
          </div>
          <Link href="/admin/blog/list" className="premium-btn-ghost inline-flex px-4 py-2">
            Back to Blog List
          </Link>
        </div>
      </section>

      <div className="mx-auto w-full max-w-6xl">
        <BlogEditor mode="edit" initialData={blog} />
      </div>
    </div>
  );
}
