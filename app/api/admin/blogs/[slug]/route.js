import { NextResponse } from "next/server";
import { revalidatePath, revalidateTag } from "next/cache";
import {
  authConstants,
  getAuthenticatedStaffFromToken,
} from "@/lib/auth";
import { BLOGS_CACHE_TAG } from "@/lib/blogs";
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

async function getStaffFromRequest(request) {
  const token = request.cookies.get(authConstants.SESSION_COOKIE_NAME)?.value;
  return getAuthenticatedStaffFromToken(token);
}

export async function GET(request, { params }) {
  const staff = await getStaffFromRequest(request);
  if (!staff) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  const { slug } = await params;
  const dbError = getDatabaseConfigError();
  if (dbError) {
    return NextResponse.json(
      { message: dbError },
      { status: 500 }
    );
  }

  const { rows } = await dbQuery(
    `
      select id, title, slug, content, meta_title, meta_description, banner_url, keywords, status, published_at
      from blogs
      where slug = $1 and deleted_at is null
      limit 1
    `,
    [slug]
  );

  if (rows.length === 0) {
    return NextResponse.json({ message: "Blog not found." }, { status: 404 });
  }

  return NextResponse.json({ blog: rows[0] });
}

export async function PATCH(request, { params }) {
  const staff = await getStaffFromRequest(request);
  if (!staff) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  const { slug: currentSlug } = await params;
  const body = await request.json();
  const title = String(body?.title || "").trim();
  const slug = slugify(body?.slug || currentSlug);
  const content = String(body?.content || "").trim();
  const status = body?.status === "published" ? "published" : "draft";

  if (!title || !slug || !content) {
    return NextResponse.json(
      { message: "Title, slug, and content are required." },
      { status: 400 }
    );
  }

  const dbError = getDatabaseConfigError();
  if (dbError) {
    return NextResponse.json(
      { message: dbError },
      { status: 500 }
    );
  }

  try {
    const { rows } = await dbQuery(
      `
        update blogs
        set
          title = $1,
          slug = $2,
          content = $3,
          meta_title = $4,
          meta_description = $5,
          banner_url = $6,
          keywords = $7::text[],
          status = $8,
          published_at = case when $8='published' then coalesce(published_at, now()) else null end,
          updated_at = now()
        where slug = $9 and deleted_at is null
        returning id, slug
      `,
      [
        title,
        slug,
        content,
        String(body?.metaTitle || "").trim() || null,
        String(body?.metaDescription || "").trim() || null,
        String(body?.bannerUrl || "").trim() || null,
        parseKeywords(body?.keywords),
        status,
        currentSlug,
      ]
    );

    const blog = rows[0];
    if (!blog) {
      return NextResponse.json(
        { message: "Could not update blog." },
        { status: 500 }
      );
    }

    await dbQuery(
      `
        insert into audit_logs (staff_id, blog_id, action, payload)
        values ($1, $2, 'blog.update', $3::jsonb)
      `,
      [staff.id, blog.id, JSON.stringify({ slug: blog.slug })]
    );

    revalidateTag(BLOGS_CACHE_TAG);
    revalidatePath("/");
    revalidatePath("/blog");
    revalidatePath(`/blog/${currentSlug}`);
    revalidatePath(`/blog/${blog.slug}`);
    revalidatePath("/sitemap.xml");

    return NextResponse.json({ message: "Blog updated.", blog });
  } catch (error) {
    return NextResponse.json(
      { message: "Could not update blog.", details: error?.message },
      { status: 500 }
    );
  }
}

export async function DELETE(request, { params }) {
  const staff = await getStaffFromRequest(request);
  if (!staff) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  const { slug } = await params;
  const dbError = getDatabaseConfigError();
  if (dbError) {
    return NextResponse.json(
      { message: dbError },
      { status: 500 }
    );
  }

  try {
    const { rows } = await dbQuery(
      `
        update blogs
        set deleted_at = now(), updated_at = now()
        where slug = $1 and deleted_at is null
        returning id, slug
      `,
      [slug]
    );

    const blog = rows[0];
    if (!blog) {
      return NextResponse.json(
        { message: "Could not delete blog." },
        { status: 500 }
      );
    }

    await dbQuery(
      `
        insert into audit_logs (staff_id, blog_id, action, payload)
        values ($1, $2, 'blog.delete', $3::jsonb)
      `,
      [staff.id, blog.id, JSON.stringify({ slug: blog.slug })]
    );

    revalidateTag(BLOGS_CACHE_TAG);
    revalidatePath("/");
    revalidatePath("/blog");
    revalidatePath(`/blog/${slug}`);
    revalidatePath("/sitemap.xml");

    return NextResponse.json({ message: "Blog deleted." });
  } catch (error) {
    return NextResponse.json(
      { message: "Could not delete blog.", details: error?.message },
      { status: 500 }
    );
  }
}
