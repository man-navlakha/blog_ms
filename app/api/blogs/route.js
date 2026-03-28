import { NextResponse } from "next/server";
import { dbQuery, getDatabaseConfigError } from "@/lib/db";

export async function GET(request) {
  const dbError = getDatabaseConfigError();
  if (dbError) {
    return NextResponse.json(
      { blogs: [], error: dbError },
      { status: 500 }
    );
  }

  try {
    const { rows } = await dbQuery(
      `
        select id, title, slug, meta_description, published_at, banner_url
        from blogs
        where status = 'published' and deleted_at is null
        order by published_at desc nulls last
        limit 100
      `
    );

    return NextResponse.json({ blogs: rows || [] });
  } catch (error) {
    console.error("Error fetching blogs:", error);
    return NextResponse.json(
      { blogs: [], error: "Failed to fetch blogs" },
      { status: 500 }
    );
  }
}
