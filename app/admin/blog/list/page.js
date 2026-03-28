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

function formatUpdatedAt(value) {
  if (!value) return "Recently updated";

  return new Date(value).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

function getStatusBadgeClass(status) {
  return status === "published"
    ? "border-[rgba(111,191,151,0.18)] bg-[rgba(47,125,90,0.16)] text-emerald-300"
    : "border-[rgba(224,176,85,0.18)] bg-[rgba(120,88,34,0.18)] text-amber-300";
}

export default async function AdminBlogListPage() {
  const staff = await getAuthenticatedStaff();

  if (!staff) {
    redirect("/admin/login");
  }

  const blogs = await getBlogs();

  return (
    <div className="space-y-5">
      <section className="admin-panel rounded-[1.75rem] p-6 md:p-7">
        <p className="admin-kicker">Library</p>
        <h1 className="mt-3 text-3xl font-black uppercase text-white">Blogs List</h1>
        <p className="mt-2 text-sm text-slate-300">
          Review every article, track status, and open items for editing.
        </p>
      </section>

      <div className="admin-panel rounded-[1.75rem] p-6 md:p-7">
        {blogs.length === 0 ? (
          <p className="text-sm text-slate-300">No blogs yet.</p>
        ) : (
          <div className="overflow-hidden rounded-[1.5rem] border border-[rgba(151,179,219,0.14)] bg-[rgba(10,18,32,0.72)]">
            <table className="w-full min-w-[760px] border-collapse text-sm">
              <thead>
                <tr className="bg-[rgba(255,255,255,0.04)] text-slate-300">
                  <th className="border-b border-[rgba(151,179,219,0.12)] px-4 py-3 text-left text-xs font-semibold uppercase tracking-[0.18em]">
                    Title
                  </th>
                  <th className="border-b border-[rgba(151,179,219,0.12)] px-4 py-3 text-left text-xs font-semibold uppercase tracking-[0.18em]">
                    Slug
                  </th>
                  <th className="border-b border-[rgba(151,179,219,0.12)] px-4 py-3 text-left text-xs font-semibold uppercase tracking-[0.18em]">
                    Status
                  </th>
                  <th className="border-b border-[rgba(151,179,219,0.12)] px-4 py-3 text-right text-xs font-semibold uppercase tracking-[0.18em]">
                    Action
                  </th>
                </tr>
              </thead>
              <tbody>
                {blogs.map((blog) => (
                  <tr
                    key={blog.id}
                    className="border-t border-[rgba(151,179,219,0.1)] transition-colors hover:bg-white/4"
                  >
                    <td className="px-4 py-4">
                      <div>
                        <p className="font-semibold text-slate-100">{blog.title}</p>
                        <p className="mt-1 text-xs text-slate-400">
                          Updated {formatUpdatedAt(blog.updated_at)}
                        </p>
                      </div>
                    </td>
                    <td className="px-4 py-4 font-mono text-xs text-slate-400">
                      {blog.slug}
                    </td>
                    <td className="px-4 py-4">
                      <span
                        className={`inline-flex rounded-full border px-3 py-1 text-xs font-semibold uppercase tracking-[0.12em] ${getStatusBadgeClass(blog.status)}`}
                      >
                        {blog.status}
                      </span>
                    </td>
                    <td className="px-4 py-4 text-right">
                      <Link
                        href={`/admin/blog/${blog.slug}/edit`}
                        className="premium-btn-secondary px-4 py-2 text-xs"
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
