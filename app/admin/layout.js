import Link from "next/link";

export const metadata = {
  title: {
    default: "Admin",
    template: "%s | Admin | Mechanic Setu",
  },
  robots: {
    index: false,
    follow: false,
    nocache: true,
    googleBot: {
      index: false,
      follow: false,
      noimageindex: true,
    },
  },
};

export default function AdminLayout({ children }) {
  return (
    <div className="admin-shell">
      <div className="admin-grid" />
      <div className="mx-auto flex min-h-screen w-full max-w-7xl flex-col gap-6 px-4 py-5 md:px-6 lg:flex-row lg:items-start lg:py-6">
        <aside className="admin-sidebar rounded-[1.75rem] p-5 lg:sticky lg:top-6 lg:w-[290px] lg:flex-shrink-0">
          <div className="admin-kicker">Control Room</div>
          <h1 className="mt-4 text-2xl font-black tracking-tight text-white">
            Mechanic Setu Admin
          </h1>
          <p className="mt-2 text-sm text-slate-300">
            Manage articles, publishing flow, and staff operations from one place.
          </p>

          <nav className="mt-6 space-y-3">
            <Link href="/admin/dashboard" className="admin-nav-link">
              <span>Dashboard</span>
              <span className="text-xs uppercase tracking-[0.18em] text-slate-400">01</span>
            </Link>
            <Link href="/admin/blog/create" className="admin-nav-link">
              <span>Create Post</span>
              <span className="text-xs uppercase tracking-[0.18em] text-slate-400">02</span>
            </Link>
            <Link href="/admin/blog/list" className="admin-nav-link">
              <span>Blog Library</span>
              <span className="text-xs uppercase tracking-[0.18em] text-slate-400">03</span>
            </Link>
            <Link href="/" className="admin-nav-link">
              <span>View Site</span>
              <span className="text-xs uppercase tracking-[0.18em] text-slate-400">04</span>
            </Link>
          </nav>

          <div className="admin-panel mt-6 rounded-[1.4rem] p-4">
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-slate-400">
              Publishing
            </p>
            <p className="mt-2 text-sm text-slate-200">
              Keep titles, descriptions, and hero images production-ready before publishing.
            </p>
          </div>
        </aside>

        <main className="min-w-0 flex-1">{children}</main>
      </div>
    </div>
  );
}
