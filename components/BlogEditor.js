"use client";

import { useMemo, useState } from "react";
import SEOScoreWidget from "@/components/SEOScoreWidget";
import { calculateSeoScore } from "@/lib/seo-scoring";
import { slugify } from "@/lib/slug";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { TagInput } from "@/components/ui/tag-input";
import { FileUpload } from "@/components/ui/file-upload";

const DEFAULT_FORM = {
  title: "",
  slug: "",
  content: "",
  metaTitle: "",
  metaDescription: "",
  keywords: [],
  bannerUrl: "",
  status: "draft",
};

export default function BlogEditor({ mode = "create", initialData = null }) {
  const originalSlug = initialData?.slug || "";
  const [form, setForm] = useState(
    initialData
      ? {
          title: initialData.title || "",
          slug: initialData.slug || "",
          content: initialData.content || "",
          metaTitle: initialData.meta_title || "",
          metaDescription: initialData.meta_description || "",
          keywords: Array.isArray(initialData.keywords)
            ? initialData.keywords
            : typeof initialData.keywords === "string"
              ? initialData.keywords.split(",").map((k) => k.trim())
              : [],
          bannerUrl: initialData.banner_url || "",
          status: initialData.status || "draft",
        }
      : DEFAULT_FORM
  );
  const [submitting, setSubmitting] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState("");

  const scoreData = useMemo(
    () =>
      calculateSeoScore({
        title: form.title,
        metaTitle: form.metaTitle,
        metaDescription: form.metaDescription,
        content: form.content,
        keywords: form.keywords,
        bannerUrl: form.bannerUrl,
      }),
    [form]
  );

  function updateField(field, value) {
    setForm((prev) => ({
      ...prev,
      [field]: value,
      ...(field === "title" && !prev.slug ? { slug: slugify(value) } : {}),
    }));
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setSubmitting(true);
    setMessage("");

    const payload = {
      title: form.title,
      slug: slugify(form.slug || form.title),
      content: form.content,
      metaTitle: form.metaTitle,
      metaDescription: form.metaDescription,
      keywords: form.keywords,
      bannerUrl: form.bannerUrl,
      status: form.status,
    };

    const endpoint =
      mode === "edit"
        ? `/api/admin/blogs/${encodeURIComponent(originalSlug)}`
        : "/api/admin/blogs";
    const method = mode === "edit" ? "PATCH" : "POST";

    const response = await fetch(endpoint, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    const data = await response.json();
    setSubmitting(false);

    if (!response.ok) {
      setMessage(data?.message || "Could not save blog.");
      return;
    }

    setMessage(mode === "edit" ? "Blog updated." : "Blog created.");

    if (mode === "create") {
      setForm(DEFAULT_FORM);
    }
  }

  async function handleFileUpload(file) {
    if (!file) return;

    setUploading(true);
    setMessage("");

    const formData = new FormData();
    formData.append("file", file);

    const response = await fetch("/api/storage/upload", {
      method: "POST",
      body: formData,
    });

    const data = await response.json();
    setUploading(false);

    if (!response.ok) {
      setMessage(data?.message || "Could not upload banner.");
      return;
    }

    updateField("bannerUrl", data.fileUrl);
    setMessage("Banner uploaded successfully.");
  }

  return (
    <div className="grid gap-6 lg:grid-cols-[1fr_300px]">
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="glass-card p-6 md:p-7">
          <h1 className="mb-6 text-3xl font-bold">{mode === "edit" ? "Edit Blog" : "Create Blog"}</h1>

          {message && (
            <div className="clay-card mb-4 rounded-xl border border-primary/30 bg-primary/10 p-3 text-sm text-foreground">
              {message}
            </div>
          )}

          <div className="space-y-5">
            <div className="space-y-2">
              <Label htmlFor="title">Title *</Label>
              <Input
                id="title"
                value={form.title}
                onChange={(e) => updateField("title", e.target.value)}
                required
                placeholder="Enter blog title"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="slug">Slug *</Label>
              <Input
                id="slug"
                value={form.slug}
                onChange={(e) => updateField("slug", e.target.value)}
                required
                placeholder="url-friendly-slug"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="meta-title">Meta Title</Label>
              <Input
                id="meta-title"
                value={form.metaTitle}
                onChange={(e) => updateField("metaTitle", e.target.value)}
                placeholder="SEO meta title"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="meta-desc">Meta Description</Label>
              <textarea
                id="meta-desc"
                value={form.metaDescription}
                onChange={(e) => updateField("metaDescription", e.target.value)}
                rows={3}
                placeholder="SEO meta description"
                className="glass-input flex w-full rounded-xl px-3 py-2 text-sm placeholder:text-muted-ink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--focus-ring)]"
              />
            </div>

            <div className="space-y-2">
              <Label>Keywords</Label>
              <TagInput
                value={form.keywords}
                onChange={(tags) => updateField("keywords", tags)}
                placeholder="Type keyword and press Enter..."
              />
            </div>

            <div className="space-y-2">
              <Label>Banner Image</Label>
              <FileUpload
                onFileSelect={handleFileUpload}
                loading={uploading}
                preview={form.bannerUrl}
                accept="image/*"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="content">Content *</Label>
              <textarea
                id="content"
                value={form.content}
                onChange={(e) => updateField("content", e.target.value)}
                rows={14}
                required
                placeholder="Enter blog content (supports Markdown)"
                className="glass-input flex w-full rounded-xl px-3 py-2 text-sm placeholder:text-muted-ink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--focus-ring)]"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="status">Status</Label>
              <select
                id="status"
                value={form.status}
                onChange={(e) => updateField("status", e.target.value)}
                className="glass-input flex h-11 w-full rounded-xl px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--focus-ring)]"
              >
                <option value="draft">Draft</option>
                <option value="published">Published</option>
              </select>
            </div>

            <div className="flex gap-3">
              <Button type="submit" disabled={submitting}>
                {submitting ? "Saving..." : mode === "edit" ? "Update Blog" : "Create Blog"}
              </Button>
              <Button type="button" variant="ghost">
                Cancel
              </Button>
            </div>
          </div>
        </div>
      </form>

      <SEOScoreWidget score={scoreData.score} tips={scoreData.tips} />
    </div>
  );
}
