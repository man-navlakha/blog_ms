import { redirect } from "next/navigation";
import Link from "next/link";
import BlogEditor from "@/components/BlogEditor";
import { getAuthenticatedStaff } from "@/lib/auth";

export default async function AdminCreateBlogPage() {
  const staff = await getAuthenticatedStaff();

  if (!staff) {
    redirect("/admin/login");
  }

  return (
    <div className="space-y-5">
      <section className="admin-panel rounded-[1.75rem] p-6 md:p-7">
        <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="admin-kicker">Editor</p>
            <h1 className="mt-3 text-3xl font-black text-white">Create Blog Post</h1>
            <p className="mt-2 text-sm text-slate-300">
              Draft a new article, prepare metadata, and publish when ready.
            </p>
          </div>
          <Link href="/admin/dashboard" className="premium-btn-ghost inline-flex px-4 py-2">
            Back to Dashboard
          </Link>
        </div>
      </section>

      <div className="mx-auto w-full max-w-6xl">
        <BlogEditor mode="create" />
      </div>
    </div>
  );
}
