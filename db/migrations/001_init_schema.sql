create extension if not exists pgcrypto;

create table if not exists staff_accounts (
  id uuid primary key default gen_random_uuid(),
  email text not null unique,
  role text not null default 'editor',
  otp_hash text,
  otp_expires_at timestamptz,
  session_token_hash text,
  session_expires_at timestamptz,
  last_login timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint staff_email_domain_check check (lower(email) like '%@mechanicsetu.tech')
);

create table if not exists blogs (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  slug text not null unique,
  content text not null,
  meta_title text,
  meta_description text,
  banner_url text,
  keywords text[] not null default '{}',
  status text not null default 'draft',
  author_id uuid references staff_accounts(id) on delete set null,
  published_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  deleted_at timestamptz,
  constraint blogs_status_check check (status in ('draft', 'published'))
);

create table if not exists keyword_entries (
  id uuid primary key default gen_random_uuid(),
  blog_id uuid not null references blogs(id) on delete cascade,
  keyword text not null,
  difficulty_score int,
  search_volume_estimate int,
  priority int not null default 3,
  created_at timestamptz not null default now(),
  constraint keyword_entries_difficulty_check check (difficulty_score is null or (difficulty_score >= 1 and difficulty_score <= 100)),
  constraint keyword_entries_priority_check check (priority between 1 and 5)
);

create table if not exists audit_logs (
  id uuid primary key default gen_random_uuid(),
  staff_id uuid references staff_accounts(id) on delete set null,
  blog_id uuid references blogs(id) on delete set null,
  action text not null,
  payload jsonb,
  created_at timestamptz not null default now()
);

create index if not exists idx_blogs_status_published_at on blogs(status, published_at desc);
create index if not exists idx_blogs_slug on blogs(slug);
create index if not exists idx_blogs_keywords_gin on blogs using gin (keywords);
create index if not exists idx_keyword_entries_blog_id on keyword_entries(blog_id);
create index if not exists idx_audit_logs_staff_id on audit_logs(staff_id);
