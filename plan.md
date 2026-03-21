

## ✅ **Complete Plan: SEO-Optimized Mechanic Setu Blog Platform**

I've created a comprehensive, actionable plan for your blog website. Here's the strategic overview:

### **What We're Building**
A **marketing blog for Mechanic Setu** with:
- 🌍 **Public Blog**: SEO-optimized content (how-to guides, tips, local search optimization, brand awareness)
- 🔐 **Private Admin Panel**: Staff-only access (@mechanicsetu.tech email + OTP)
- 📝 **Content Management**: Write/edit blogs with markdown + banner image upload
- 🎯 **SEO Features**: Auto keyword suggestions, real-time SEO scoring, structured data, sitemap
- 🚀 **Zero User Auth**: No public login—just pure content for Google to rank

---

### **Implementation Phases (1-2 Months)**

**PHASE 1: Architecture & Database (Week 1-2)** – Execute in parallel
- Database schema (PostgreSQL): blogs, keywords, staff_accounts, audit_logs
- Email OTP authentication system (10-min expiry, @mechanicsetu.tech domain lock)
- Supabase project setup with migrations

**PHASE 2: Admin Dashboard & Content Editor (Week 2-3)** – Depends on Phase 1
- Admin routes: `/admin/login`, `/admin/dashboard`, `/admin/blog/create`, `/admin/blog/[slug]/edit`
- Blog editor: Textarea (markdown + plain text), banner image upload, auto-slug generation
- Real-time SEO scoring: keyword difficulty, title/description validation, content length check
- Keyword suggestions dropdown (curated list for Mechanic Setu domain)

**PHASE 3: Public Blog & SEO (Week 3-4)** – Depends on Phase 2
- Blog homepage, listing page (blog), individual blog posts (`/blog/[slug]`)
- Dynamic SEO metadata (OG tags, canonical URLs)
- Sitemap auto-generation, robots.txt, schema.org structured data
- Internal linking (related posts by keyword match)
- Table of Contents auto-generation from headings

**PHASE 4: Analytics & Monitoring (Week 4)** – Depends on Phase 3
- Google Search Console integration (sitemap submission)
- Google Analytics 4 tracking
- Optional: Admin analytics dashboard (top blogs by traffic)

**PHASE 5: QA & Launch (Week 4-End)** – Final integration
- Vercel deployment (auto-deploy from GitHub)
- Lighthouse/SEO validation
- Admin & content writer documentation

---

### **Key Tech Stack**
| Component | Choice | Why |
|-----------|--------|-----|
| Framework | Next.js 16 | Already installed, optimal for SEO |
| Database | PostgreSQL (Supabase) | Full-text search, scalable queries |
| Auth | Email OTP | Simple, secure, no SMS cost |
| Storage | Supabase Storage or Vercel Blob | Images, fast CDN |
| Hosting | Vercel | Best Next.js experience, auto-deploy |
| Design | Neo-Brutalism tokens (existing) | Use workspace UI-UX data |
| Editor | Textarea + Markdown | Keep scope tight, no heavy editor |

---

### **Database Schema (Quick View)**
```
blogs:
  - id, title, slug, content, markdown, banner_url
  - meta_title, meta_description, keywords
  - author_id, status (Draft/Published), published_at
  - created_at, updated_at

keywords:
  - id, keyword, search_volume, difficulty_score (1-100), blog_id, priority

staff_accounts:
  - id, email (@mechanicsetu.tech), otp_hash, otp_expires_at
  - role, last_login, created_at

audit_logs:
  - id, staff_id, action, blog_id, timestamp (track who changed what)
```

---

### **Admin Workflow (What Your Staff Does)**
1. Visit `/admin/login` → Enter email (@mechanicsetu.tech)
2. Check email → Enter 6-digit OTP
3. Dashboard shows all blogs (drafts & published)
4. Click "New Blog" → Fill form:
   - Title (with slug auto-generation)
   - Content (markdown or plain text)
   - Banner image (auto-resize to 1200x600px)
   - Meta title & description (with character counters)
   - Keywords (comma-separated, autocomplete suggestions)
   - SEO score shows in real-time (0-100)
5. Choose "Save as Draft" or "Publish"
6. Published blogs go live on `/blog/[slug]` instantly

---

### **Public Website Flow (How Google Sees It)**
- Homepage (`/`) → Hero + featured blogs
- Blog listing (blog) → Paginated (10 per page) with search/filter
- Blog post (`/blog/[slug]`) → Full article with:
  - Proper meta tags for Google
  - Breadcrumbs + structured data (schema.org Article)
  - Table of Contents
  - Related posts (same keywords)
  - No user comments (pure content)

---

### **Important Files to Create**
```
Critical:
  db/migrations/001_init_schema.sql
  lib/auth.js
  lib/supabase.js
  lib/seo-scoring.js
  components/BlogEditor.js
  components/SEOScoreWidget.js
  app/admin/login/page.js
  app/admin/dashboard/page.js
  app/admin/blog/create/page.js
  app/admin/blog/[slug]/edit/page.js
  app/blog/page.js
  app/blog/[slug]/page.js
  app/api/auth/send-otp.js
  app/api/auth/verify-otp.js
  app/api/upload-banner.js
  app/api/search.js
  
Documentation:
  docs/BLOG-ADMIN-GUIDE.md (How staff uses this)
  docs/CONTENT-GUIDELINES.md (How to write for SEO)
```

---

### **MVP Scope (Intentionally Excluding)**
✗ User comments, discussions
✗ Blog categories/tags (add in Phase 2 if time)
✗ Multi-language support
✗ Email newsletter
✗ Collaborative real-time editing
✗ Automated keyword research API (using curated list for launch)

---

### **Your Immediate Next Steps**
1. **Approve this plan** — Any changes needed?
2. **Gather keyword list** — 15-20 core keywords Mechanic Setu blogs will target (e.g., "puncture repair in Ahmedabad", "car battery replacement cost", etc.)
3. **Decide image storage** — Supabase Storage (included, 1GB free) or Vercel Blob?
4. **Choose blog domain** — `blog.mechanicsetu.tech` or `mechanicsetu.tech/blog`?

---

**The plan is now saved to `/memories/session/plan.md` for reference. Ready to proceed with implementation?**