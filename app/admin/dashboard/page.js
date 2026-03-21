import { redirect } from "next/navigation";
import Link from "next/link";
import { getAuthenticatedStaff } from "@/lib/auth";

export default async function AdminDashboardPage() {
  const staff = await getAuthenticatedStaff();

  if (!staff) {
    redirect("/admin/login");
  }

  return (
    <div className="theme-shell px-6 py-10">
      <div className="mx-auto flex w-full max-w-5xl flex-col gap-6">
        <section className="glass-card p-6 md:p-7">
          <p className="text-sm font-semibold uppercase muted-text">Admin</p>
          <h1 className="mt-2 text-3xl font-black uppercase">Dashboard</h1>
          <p className="mt-3 text-sm muted-text">
            Signed in as <strong>{staff.email}</strong>
          </p>
        </section>

        <section className="grid gap-4 md:grid-cols-3">
          <Link
            href="/admin/blog/create"
            className="premium-btn-primary p-4 text-center"
          >
            Create Blog
          </Link>
          <Link
            href="/admin/blog/list"
            className="premium-btn-secondary p-4 text-center"
          >
            Blogs List
          </Link>
          <form action="/api/auth/logout" method="post">
            <button
              type="submit"
              className="premium-btn-ghost w-full p-4"
            >
              Logout
            </button>
          </form>
        </section>
      </div>
    </div>
  );
}
