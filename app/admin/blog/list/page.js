import { redirect } from "next/navigation";
import Link from "next/link";
import { getAuthenticatedStaff } from "@/lib/auth";
import { dbQuery, getDatabaseConfigError } from "@/lib/db";

async function getBlogs() {
  if (getDatabaseConfigError()) return [];

  try {
    const { rows } = await dbQuery(
      `
        select id, title, slug, status, updated_at
        from blogs
        where deleted_at is null
        order by updated_at desc
        limit 200
      `
    );

    return rows || [];
  } catch {
    return [];
  }
}

export default async function AdminBlogListPage() {
  const staff = await getAuthenticatedStaff();

  if (!staff) {
    redirect("/admin/login");
  }

  const blogs = await getBlogs();

  return (
    <div className="theme-shell px-6 py-10">
      <div className="glass-card mx-auto w-full max-w-5xl p-6 md:p-7">
        <h1 className="text-3xl font-black uppercase">Blogs List</h1>

        {blogs.length === 0 ? (
          <p className="mt-4 text-sm muted-text">No blogs yet.</p>
        ) : (
          <div className="mt-4 overflow-x-auto">
            <table className="morphism-table w-full text-sm">
              <thead>
                <tr>
                  <th className="border-b border-[var(--border-color)] p-2 text-left">Title</th>
                  <th className="border-b border-[var(--border-color)] p-2 text-left">Slug</th>
                  <th className="border-b border-[var(--border-color)] p-2 text-left">Status</th>
                  <th className="border-b border-[var(--border-color)] p-2 text-left">Action</th>
                </tr>
              </thead>
              <tbody>
                {blogs.map((blog) => (
                  <tr key={blog.id} className="border-t border-[var(--border-color)] even:bg-white/5">
                    <td className="p-2">{blog.title}</td>
                    <td className="p-2 muted-text">{blog.slug}</td>
                    <td className="p-2 uppercase muted-text">{blog.status}</td>
                    <td className="p-2">
                      <Link
                        href={`/admin/blog/${blog.slug}/edit`}
                        className="premium-btn-secondary px-3 py-1.5 text-xs"
                      >
                        Edit
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
