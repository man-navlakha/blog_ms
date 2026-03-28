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
    <div className="theme-shell px-6 py-10">
      <div className="mx-auto w-full max-w-6xl">
        <div className="mb-4">
          <Link
            href="/admin/dashboard"
            className="premium-btn-ghost inline-flex px-4 py-2"
          >
            Back to Dashboard
          </Link>
        </div>
        <BlogEditor mode="create" />
      </div>
    </div>
  );
}
