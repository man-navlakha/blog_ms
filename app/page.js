import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  getBlogDescription,
  getPublishedBlogSummaries,
} from "@/lib/blogs";

const ITEMS_PER_PAGE = 6;

export const revalidate = 300;

function getCurrentPage(pageParam) {
  const parsedPage = Number.parseInt(String(pageParam || "1"), 10);
  return Number.isFinite(parsedPage) && parsedPage > 0 ? parsedPage : 1;
}

function getPageNumbers(currentPage, totalPages) {
  const pages = [];
  const maxVisible = 5;

  if (totalPages <= maxVisible) {
    for (let page = 1; page <= totalPages; page += 1) {
      pages.push(page);
    }
    return pages;
  }

  pages.push(1);

  if (currentPage > 3) {
    pages.push("...");
  }

  const start = Math.max(2, currentPage - 1);
  const end = Math.min(totalPages - 1, currentPage + 1);

  for (let page = start; page <= end; page += 1) {
    if (!pages.includes(page)) {
      pages.push(page);
    }
  }

  if (currentPage < totalPages - 2) {
    pages.push("...");
  }

  pages.push(totalPages);

  return pages;
}

function getPageHref(pageNumber) {
  return pageNumber <= 1 ? "/" : `/?page=${pageNumber}`;
}

export async function generateMetadata({ searchParams }) {
  const resolvedSearchParams = await searchParams;
  const currentPage = getCurrentPage(resolvedSearchParams?.page);
  const isFirstPage = currentPage === 1;

  return {
    title: isFirstPage ? "Mechanic Setu Blog" : `Mechanic Setu Blog - Page ${currentPage}`,
    description:
      "Roadside assistance guides, vehicle maintenance tips, and local mechanic insights from Mechanic Setu.",
    alternates: {
      canonical: isFirstPage ? "/" : `/?page=${currentPage}`,
    },
    robots: {
      index: isFirstPage,
      follow: true,
    },
  };
}

export default async function Home({ searchParams }) {
  const resolvedSearchParams = await searchParams;
  const requestedPage = getCurrentPage(resolvedSearchParams?.page);
  const blogs = await getPublishedBlogSummaries();
  const featured = blogs[0];
  const sidePosts = blogs.slice(1, 4);
  const totalPages = Math.max(1, Math.ceil(blogs.length / ITEMS_PER_PAGE));
  const currentPage = Math.min(requestedPage, totalPages);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const currentPosts = blogs.slice(startIndex, startIndex + ITEMS_PER_PAGE);

  return (
    <div className="theme-shell public-shell px-5 pb-14 md:px-8">
      <header className="glass-card mx-auto mt-6 flex w-full max-w-7xl items-center justify-between rounded-3xl px-5 py-4 md:px-7">
        <Link href="/" className="text-xl font-black tracking-tight">
          Mechanic Setu
        </Link>
        <nav className="hidden items-center gap-3 text-sm font-semibold md:flex">
          <Link href="/" className="clay-pill px-4 py-2">
            Home
          </Link>
          <Link href="/blog" className="clay-pill px-4 py-2">
            Blog
          </Link>
          <Link href="/admin/login" className="clay-pill px-4 py-2">
            Admin
          </Link>
        </nav>
        <Button asChild variant="secondary" size="sm">
          <Link href="/admin/login">Get started</Link>
        </Button>
      </header>

      <main className="mx-auto w-full max-w-7xl pt-8">
        <section className="glass-card px-5 py-10 text-center md:px-10 md:py-14">
          <div className="clay-pill mb-6 inline-block px-4 py-2 text-sm font-semibold text-foreground">
            Vehicle Care + Roadside Assistance
          </div>
          <h1 className="mx-auto max-w-4xl text-4xl font-black leading-tight md:text-6xl">
            Master Vehicle Care &{" "}
            <span className="bg-gradient-to-r from-orange-500 via-amber-400 to-sky-500 bg-clip-text text-transparent">
              Emergency Assistance
            </span>
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-lg text-muted-ink md:text-xl">
            Expert tips, maintenance guides, and roadside assistance advice from the
            Mechanic Setu team. Stay ahead with practical automotive knowledge.
          </p>
          <div className="mx-auto mt-10 flex w-full max-w-xl flex-col gap-3 sm:flex-row">
            <Input
              placeholder="Enter your email for updates"
              type="email"
              className="flex-1"
            />
            <Button variant="secondary">Subscribe</Button>
          </div>
          <p className="mt-3 text-sm text-muted-ink">No spam. Unsubscribe anytime.</p>
        </section>

        {blogs.length === 0 ? (
          <section className="glass-card mt-8 py-8 text-center md:py-12">
            <p className="text-muted-ink">No articles published yet.</p>
          </section>
        ) : (
          <>
            <section className="py-8 md:py-12">
              <div className="mb-6">
                <h2 className="text-3xl font-bold md:text-4xl">Latest Guides & Tips</h2>
                <p className="mt-2 text-muted-ink">
                  Expert advice to keep your vehicle running smoothly
                </p>
              </div>
              <div className="grid gap-6 lg:grid-cols-[1.3fr_1fr]">
                {featured ? (
                  <article className="glass-card p-4 md:p-5">
                    <Image
                      src={
                        featured.banner_url ||
                        "https://images.unsplash.com/photo-1581092918056-0c4c3acd3789?q=80&w=1200&auto=format&fit=crop"
                      }
                      alt={featured.title}
                      width={920}
                      height={560}
                      className="h-[360px] w-full rounded-2xl object-cover"
                    />
                    <p className="mt-4 text-sm text-muted-ink">
                      {featured.published_at
                        ? new Date(featured.published_at).toLocaleDateString("en-US", {
                            year: "numeric",
                            month: "short",
                            day: "numeric",
                          })
                        : "Recently published"}
                    </p>
                    <h3 className="mt-1 text-3xl font-bold">{featured.title}</h3>
                    <p className="mt-2 text-foreground/80">{getBlogDescription(featured)}</p>
                    <Button asChild className="mt-4" variant="secondary" size="sm">
                      <Link href={`/blog/${featured.slug}`}>Read Article</Link>
                    </Button>
                  </article>
                ) : null}

                <div className="space-y-4">
                  {sidePosts.map((post) => (
                    <article
                      key={post.id}
                      className="glass-card grid gap-4 p-3 sm:grid-cols-[180px_1fr]"
                    >
                      <Image
                        src={
                          post.banner_url ||
                          "https://images.unsplash.com/photo-1552820728-8ac41f1ce891?q=80&w=900&auto=format&fit=crop"
                        }
                        alt={post.title}
                        width={360}
                        height={220}
                        className="h-48 w-full rounded-xl object-cover sm:h-full"
                      />
                      <div>
                        <p className="text-xs text-muted-ink">
                          {post.published_at
                            ? new Date(post.published_at).toLocaleDateString("en-US", {
                                year: "numeric",
                                month: "short",
                                day: "numeric",
                              })
                            : "Recently published"}
                        </p>
                        <h3 className="mt-1 text-2xl font-bold leading-tight">{post.title}</h3>
                        <p className="mt-2 text-sm text-foreground/80">
                          {getBlogDescription(post)}
                        </p>
                        <Button asChild className="mt-2" variant="ghost" size="sm">
                          <Link href={`/blog/${post.slug}`}>Read More</Link>
                        </Button>
                      </div>
                    </article>
                  ))}
                </div>
              </div>
            </section>

            <section className="py-8 md:py-12">
              <div className="mb-6">
                <h2 className="text-3xl font-bold md:text-4xl">Browse All Articles</h2>
                <p className="mt-2 text-muted-ink">
                  Comprehensive resources for vehicle maintenance and emergency assistance
                </p>
              </div>
              <div className="grid gap-7 md:grid-cols-2 xl:grid-cols-3">
                {currentPosts.map((post) => (
                  <article key={post.id} className="glass-card p-4">
                    <Image
                      src={
                        post.banner_url ||
                        "https://images.unsplash.com/photo-1581092918056-0c4c3acd3789?q=80&w=1200&auto=format&fit=crop"
                      }
                      alt={post.title}
                      width={720}
                      height={420}
                      className="h-56 w-full rounded-2xl object-cover"
                    />
                    <p className="mt-3 text-sm text-muted-ink">
                      {post.published_at
                        ? new Date(post.published_at).toLocaleDateString("en-US", {
                            year: "numeric",
                            month: "short",
                            day: "numeric",
                          })
                        : "Recently published"}
                    </p>
                    <h3 className="mt-1 text-3xl font-bold leading-tight">{post.title}</h3>
                    <p className="mt-2 text-foreground/80">{getBlogDescription(post)}</p>
                    <Button asChild className="mt-4" variant="secondary" size="sm">
                      <Link href={`/blog/${post.slug}`}>Read Article</Link>
                    </Button>
                  </article>
                ))}
              </div>

              {blogs.length > ITEMS_PER_PAGE ? (
                <div className="glass-card mt-8 flex flex-wrap items-center justify-between gap-3 border-t border-border-color p-4 md:flex-nowrap md:p-5">
                  {currentPage > 1 ? (
                    <Button asChild variant="ghost" size="sm">
                      <Link href={getPageHref(currentPage - 1)}>Previous</Link>
                    </Button>
                  ) : (
                    <span className="premium-btn-ghost cursor-not-allowed px-3 py-2 opacity-60">
                      Previous
                    </span>
                  )}

                  <div className="flex items-center gap-2 text-sm">
                    {getPageNumbers(currentPage, totalPages).map((page, index) => (
                      <span key={`${page}-${index}`}>
                        {page === "..." ? (
                          <span className="px-2 py-1">...</span>
                        ) : (
                          <Link
                            href={getPageHref(page)}
                            aria-current={currentPage === page ? "page" : undefined}
                            className={`rounded-md px-3 py-1 transition-all ${
                              currentPage === page
                                ? "clay-pill border border-white/30 bg-[var(--secondary)] text-secondary-ink"
                                : "clay-pill cursor-pointer text-foreground"
                            }`}
                          >
                            {page}
                          </Link>
                        )}
                      </span>
                    ))}
                  </div>

                  {currentPage < totalPages ? (
                    <Button asChild variant="ghost" size="sm">
                      <Link href={getPageHref(currentPage + 1)}>Next</Link>
                    </Button>
                  ) : (
                    <span className="premium-btn-ghost cursor-not-allowed px-3 py-2 opacity-60">
                      Next
                    </span>
                  )}
                </div>
              ) : null}
            </section>
          </>
        )}
      </main>

      <footer className="mt-8 bg-transparent">
        <div className="mx-auto w-full max-w-7xl py-12">
          <div className="glass-card flex flex-col gap-4 p-6 md:flex-row md:items-end md:justify-between">
            <div>
              <h3 className="text-3xl font-bold">Stay Updated on Vehicle Care Tips</h3>
              <p className="mt-2 text-muted-ink">
                Get the latest maintenance guides, emergency tips, and expert advice
                delivered to your inbox.
              </p>
            </div>
            <div className="flex w-full max-w-md gap-3">
              <Input placeholder="Enter your email" type="email" className="flex-1" />
              <Button variant="secondary">Subscribe</Button>
            </div>
          </div>

          <div className="glass-card mt-10 grid gap-8 p-6 md:grid-cols-4 md:p-8">
            <div className="md:col-span-1">
              <h4 className="text-lg font-bold">Mechanic Setu</h4>
              <p className="mt-2 text-sm text-muted-ink">
                Design amazing digital experiences that create more happy drivers on the
                road.
              </p>
            </div>
            <Column title="Product" items={["Overview", "Features", "Solutions", "Pricing"]} />
            <Column title="Resources" items={["Blog", "Newsletter", "Events", "Help centre"]} />
            <Column title="Company" items={["About us", "Careers", "Press", "Contact"]} />
          </div>
        </div>
      </footer>
    </div>
  );
}

function Column({ title, items }) {
  return (
    <div>
      <h5 className="text-sm font-semibold uppercase tracking-wide text-foreground/85">
        {title}
      </h5>
      <ul className="mt-3 space-y-2 text-sm text-foreground/75">
        {items.map((item) => (
          <li key={item}>{item}</li>
        ))}
      </ul>
    </div>
  );
}
