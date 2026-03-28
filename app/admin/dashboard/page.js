import { redirect } from "next/navigation";
import Link from "next/link";
import { getAuthenticatedStaff } from "@/lib/auth";

export default async function AdminDashboardPage() {
  const staff = await getAuthenticatedStaff();

  if (!staff) {
    redirect("/admin/login");
  }

  return (
    <div className="space-y-6">
      <section className="admin-panel rounded-[1.75rem] p-6 md:p-7">
        <p className="admin-kicker">Admin Overview</p>
        <h1 className="mt-3 text-3xl font-black uppercase text-white">Dashboard</h1>
        <p className="mt-3 text-sm text-slate-300">
          Signed in as <strong>{staff.email}</strong>
        </p>
      </section>

      <section className="grid gap-4 md:grid-cols-3">
        <div className="admin-metric p-5">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">
            Workspace
          </p>
          <p className="mt-2 text-2xl font-bold text-white">Editorial</p>
          <p className="mt-2 text-sm text-slate-300">
            Review drafts, manage updates, and keep publishing consistent.
          </p>
        </div>
        <div className="admin-metric p-5">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">
            Status
          </p>
          <p className="mt-2 text-2xl font-bold text-white">Live System</p>
          <p className="mt-2 text-sm text-slate-300">
            Routes, sitemap, and admin publishing workflow are available.
          </p>
        </div>
        <div className="admin-metric p-5">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">
            Access
          </p>
          <p className="mt-2 text-2xl font-bold text-white">Staff Only</p>
          <p className="mt-2 text-sm text-slate-300">
            Signed in as <strong>{staff.email}</strong>
          </p>
        </div>
      </section>

      <section className="admin-panel rounded-[1.75rem] p-6 md:p-7">
        <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="admin-kicker">Quick Actions</p>
            <h2 className="mt-3 text-2xl font-bold text-white">Content Operations</h2>
            <p className="mt-2 text-sm text-slate-300">
              Jump straight into writing, editing, or ending the current staff session.
            </p>
          </div>
        </div>

        <div className="mt-6 grid gap-4 md:grid-cols-3">
          <Link href="/admin/blog/create" className="premium-btn-primary p-4 text-center">
            Create Blog
          </Link>
          <Link href="/admin/blog/list" className="premium-btn-secondary p-4 text-center">
            Blogs List
          </Link>
          <form action="/api/auth/logout" method="post">
            <button type="submit" className="premium-btn-ghost w-full p-4">
              Logout
            </button>
          </form>
        </div>
      </section>
    </div>
  );
}
