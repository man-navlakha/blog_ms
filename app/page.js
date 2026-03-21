import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const recentPosts = [
  {
    title: "Conversations with London Mark & Co.",
    meta: "Olivia Rhye • 20 Jan 2024",
    excerpt:
      "We sat down with London's fast-growing brand and product design studio to find out how they've used Untitled UI.",
    image:
      "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?q=80&w=1200&auto=format&fit=crop",
    tags: ["Design", "Research", "Interviews"],
    href: "/blog",
  },
  {
    title: "A Relentless Pursuit of Perfection in Product Design",
    meta: "Phoenix Baker • 19 Jan 2024",
    excerpt: "I began to notice there was a sharp contrast between well-made and exceptional products.",
    image:
      "https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?q=80&w=900&auto=format&fit=crop",
    tags: ["Design", "Research"],
    href: "/blog",
  },
  {
    title: "How to Run a Successful Business With Your Partner",
    meta: "Lana Steiner • 18 Jan 2024",
    excerpt: "Starting a business with your spouse or significant other can be an exciting challenge.",
    image:
      "https://images.unsplash.com/photo-1545239351-1141bd82e8a6?q=80&w=900&auto=format&fit=crop",
    tags: ["Business", "Research"],
    href: "/blog",
  },
  {
    title: "Why Food Matters – Disease Prevention & Treatment",
    meta: "Lana Steiner • 18 Jan 2024",
    excerpt: "Eating more plants and less meat has been tied to a longer life and better wellness.",
    image:
      "https://images.unsplash.com/photo-1498837167922-ddd27525d352?q=80&w=900&auto=format&fit=crop",
    tags: ["Health", "Research"],
    href: "/blog",
  },
];

const allPosts = [
  {
    title: "A Continually Unfolding History — Hillview by Made by Hand",
    meta: "Alec Whitten • 17 Jan 2024",
    excerpt: "A single building occupies the hillside at Hillview in Tasmania's Bruny Island.",
    image:
      "https://images.unsplash.com/photo-1472224371017-08207f84aaae?q=80&w=1200&auto=format&fit=crop",
    tags: ["Design", "Architecture"],
  },
  {
    title: "Cognitive Dissonance Theory: Crash Course for UX Designers",
    meta: "Demi Wilkinson • 16 Jan 2024",
    excerpt: "We all like to think of ourselves as truthful and hard-working, but our actions don't always align.",
    image:
      "https://images.unsplash.com/photo-1485217988980-11786ced9454?q=80&w=1200&auto=format&fit=crop",
    tags: ["Product", "Research", "Frameworks"],
  },
  {
    title: "How Remote Work Drastically Improved My Design Skills",
    meta: "Candice Wu • 15 Jan 2024",
    excerpt: "Stanford research found remote employees were significantly more productive.",
    image:
      "https://images.unsplash.com/photo-1542744173-8e7e53415bb0?q=80&w=1200&auto=format&fit=crop",
    tags: ["Design", "Research"],
  },
  {
    title: "Exclusive Interview with Designer, Jasmin Chew",
    meta: "Natali Craig • 14 Jan 2024",
    excerpt: "Jasmin has worked with Spotify, Nike, Chews, and many global brands.",
    image:
      "https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=1200&auto=format&fit=crop",
    tags: ["Design", "Research", "Interviews"],
  },
  {
    title: "Improve Your UI Design Skills and Develop an Eye for Design",
    meta: "Drew Cano • 13 Jan 2024",
    excerpt: "Learn how to quickly develop an eye for UI design and improve your systems.",
    image:
      "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?q=80&w=1200&auto=format&fit=crop",
    tags: ["Design", "Tools", "Research"],
  },
  {
    title: "The Design Dilemma: Is Best UX Practice the Enemy of Creativity",
    meta: "Orlando Diggs • 12 Jan 2024",
    excerpt: "What happens when best practice UX design clashes with creativity?",
    image:
      "https://images.unsplash.com/photo-1521572267360-ee0c2909d518?q=80&w=1200&auto=format&fit=crop",
    tags: ["Design", "Theory", "Research"],
  },
];

export default function Home() {
  const featured = recentPosts[0];
  const sidePosts = recentPosts.slice(1);

  return (
    <div className="theme-shell">
      <div className="h-1 w-full bg-gradient-to-r from-yellow-300 via-pink-400 to-violet-500" />

      <header className="mx-auto flex w-full max-w-7xl items-center justify-between px-5 py-5 md:px-8">
        <Link href="/" className="text-lg font-bold">Mechanic Setu</Link>
        <nav className="hidden items-center gap-6 text-sm font-medium md:flex">
          <Link href="/">Home</Link>
          <Link href="/blog">Blog</Link>
          <Link href="/admin/login">Admin</Link>
        </nav>
        <Button asChild variant="ghost" size="sm">
          <Link href="/admin/login">Get started</Link>
        </Button>
      </header>

      <main className="mx-auto w-full max-w-7xl px-5 pb-14 md:px-8">
        <section className="py-10 text-center md:py-14">
          <h1 className="mx-auto max-w-4xl text-4xl font-black leading-tight md:text-6xl">
            Inside Design: Stories and interviews
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-base text-muted-ink md:text-xl">
            Subscribe to learn about new product features, the latest in technology, and updates.
          </p>
          <div className="mx-auto mt-8 flex w-full max-w-xl flex-col gap-3 sm:flex-row">
            <Input placeholder="Enter your email" type="email" className="flex-1" />
            <Button variant="secondary">Subscribe</Button>
          </div>
        </section>

        <section className="py-6">
          <h2 className="mb-4 text-3xl font-bold">Recent blog posts</h2>
          <div className="grid gap-6 lg:grid-cols-[1.3fr_1fr]">
            <article className="glass-card p-4 md:p-5">
              <Image src={featured.image} alt={featured.title} width={920} height={560} className="h-[360px] w-full rounded-2xl object-cover" />
              <p className="mt-4 text-sm text-muted-ink">{featured.meta}</p>
              <h3 className="mt-1 text-3xl font-bold">{featured.title}</h3>
              <p className="mt-2 text-foreground/80">{featured.excerpt}</p>
              <TagRow tags={featured.tags} />
            </article>

            <div className="space-y-4">
              {sidePosts.map((post) => (
                <article key={post.title} className="glass-card grid grid-cols-[180px_1fr] gap-4 p-3">
                  <Image src={post.image} alt={post.title} width={360} height={220} className="h-full rounded-xl object-cover" />
                  <div>
                    <p className="text-xs text-muted-ink">{post.meta}</p>
                    <h3 className="mt-1 text-2xl font-bold leading-tight">{post.title}</h3>
                    <p className="mt-2 text-sm text-foreground/80">{post.excerpt}</p>
                    <TagRow tags={post.tags} />
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="py-6">
          <h2 className="mb-4 text-3xl font-bold">All blog posts</h2>
          <div className="grid gap-7 md:grid-cols-2 xl:grid-cols-3">
            {allPosts.map((post) => (
              <article key={post.title} className="glass-card p-4">
                <Image src={post.image} alt={post.title} width={720} height={420} className="h-56 w-full rounded-2xl object-cover" />
                <p className="mt-3 text-sm text-muted-ink">{post.meta}</p>
                <h3 className="mt-1 text-3xl font-bold leading-tight">{post.title}</h3>
                <p className="mt-2 text-foreground/80">{post.excerpt}</p>
                <TagRow tags={post.tags} />
              </article>
            ))}
          </div>

          <div className="mt-8 flex items-center justify-between border-t border-border-color pt-6">
            <Button variant="ghost" size="sm">Previous</Button>
            <div className="flex items-center gap-2 text-sm">
              <span className="rounded-md bg-primary px-3 py-1 text-primary-ink">1</span>
              <span>2</span>
              <span>3</span>
              <span>...</span>
              <span>10</span>
            </div>
            <Button variant="ghost" size="sm">Next</Button>
          </div>
        </section>
      </main>

      <footer className="mt-8 border-t border-border-color bg-transparent">
        <div className="mx-auto w-full max-w-7xl px-5 py-12 md:px-8">
          <div className="glass-card flex flex-col gap-4 p-6 md:flex-row md:items-end md:justify-between">
            <div>
              <h3 className="text-3xl font-bold">Sign up to our newsletter</h3>
              <p className="mt-2 text-muted-ink">Stay up to date with latest news, announcements, and articles.</p>
            </div>
            <div className="flex w-full max-w-md gap-3">
              <Input placeholder="Enter your email" type="email" className="flex-1" />
              <Button variant="secondary">Subscribe</Button>
            </div>
          </div>

          <div className="mt-10 grid gap-8 border-t border-border-color pt-8 md:grid-cols-4">
            <div>
              <h4 className="text-lg font-bold">Mechanic Setu</h4>
              <p className="mt-2 text-sm text-muted-ink">Design amazing digital experiences that create more happy drivers on the road.</p>
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

function TagRow({ tags }) {
  return (
    <div className="mt-3 flex flex-wrap gap-2">
      {tags.map((tag) => (
        <span key={tag} className="rounded-full border border-border-color bg-surface-soft px-2.5 py-1 text-xs font-medium text-muted-ink backdrop-blur-md">
          {tag}
        </span>
      ))}
    </div>
  );
}

function Column({ title, items }) {
  return (
    <div>
      <h5 className="text-sm font-semibold uppercase tracking-wide text-foreground/85">{title}</h5>
      <ul className="mt-3 space-y-2 text-sm text-foreground/75">
        {items.map((item) => (
          <li key={item}>{item}</li>
        ))}
      </ul>
    </div>
  );
}
