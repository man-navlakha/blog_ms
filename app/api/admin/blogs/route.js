import { NextResponse } from "next/server";
import {
  authConstants,
  getAuthenticatedStaffFromToken,
} from "@/lib/auth";
import { slugify } from "@/lib/slug";
import { dbQuery, getDatabaseConfigError } from "@/lib/db";

function parseKeywords(input) {
  if (Array.isArray(input)) {
    return input.map((item) => String(item).trim()).filter(Boolean);
  }

  return String(input || "")
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);
}

export async function GET(request) {
  const token = request.cookies.get(authConstants.SESSION_COOKIE_NAME)?.value;
  const staff = await getAuthenticatedStaffFromToken(token);
  if (!staff) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  const dbError = getDatabaseConfigError();
  if (dbError) {
    return NextResponse.json(
      { message: dbError },
      { status: 500 }
    );
  }

  const { rows } = await dbQuery(
    `
      select id, title, slug, status, published_at, updated_at
      from blogs
      where deleted_at is null
      order by updated_at desc
      limit 200
    `
  );

  return NextResponse.json({ blogs: rows || [] });
}

export async function POST(request) {
  const token = request.cookies.get(authConstants.SESSION_COOKIE_NAME)?.value;
  const staff = await getAuthenticatedStaffFromToken(token);
  if (!staff) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  const dbError = getDatabaseConfigError();
  if (dbError) {
    return NextResponse.json(
      { message: dbError },
      { status: 500 }
    );
  }

  const body = await request.json();
  const title = String(body?.title || "").trim();
  const slug = slugify(body?.slug || title);
  const content = String(body?.content || "").trim();
  const status = body?.status === "published" ? "published" : "draft";

  if (!title || !slug || !content) {
    return NextResponse.json(
      { message: "Title, slug, and content are required." },
      { status: 400 }
    );
  }

  const keywords = parseKeywords(body?.keywords);

  try {
    const { rows } = await dbQuery(
      `
        insert into blogs
        (title, slug, content, meta_title, meta_description, banner_url, keywords, status, author_id, published_at, updated_at)
        values ($1,$2,$3,$4,$5,$6,$7::text[],$8,$9,case when $8='published' then now() else null end,now())
        returning id, slug
      `,
      [
        title,
        slug,
        content,
        String(body?.metaTitle || "").trim() || null,
        String(body?.metaDescription || "").trim() || null,
        String(body?.bannerUrl || "").trim() || null,
        keywords,
        status,
        staff.id,
      ]
    );

    const blog = rows[0];

    await dbQuery(
      `
        insert into audit_logs (staff_id, blog_id, action, payload)
        values ($1, $2, 'blog.create', $3::jsonb)
      `,
      [staff.id, blog.id, JSON.stringify({ slug: blog.slug })]
    );

    return NextResponse.json({ message: "Blog created.", blog });
  } catch (error) {
    return NextResponse.json(
      { message: "Could not create blog.", details: error?.message },
      { status: 500 }
    );
  }
}
