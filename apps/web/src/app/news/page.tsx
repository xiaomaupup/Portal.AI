import { listPosts } from "@/lib/api";
import { postTypeLabel } from "@/lib/post-type-label";
import Link from "next/link";
import { SiteShell } from "@/components/site/SiteShell";
import Image from "next/image";

export const dynamic = "force-dynamic";

export default async function NewsPage({
  searchParams,
}: {
  searchParams?: Promise<{ type?: string; q?: string }>;
}) {
  const params = (await searchParams) ?? {};
  const type =
    params.type === "NEWS" || params.type === "POLICY" || params.type === "REPORT"
      ? params.type
      : undefined;
  const q = params.q?.trim() || undefined;

  const posts = await listPosts({ type, q });
  const featured = posts[0];
  const rest = posts.slice(1, 5);
  const featuredImageSrc =
    featured?.coverUrl ??
    "https://lh3.googleusercontent.com/aida-public/AB6AXuBiQ4JwfxJHQTQE0hAD10tzfOKWABpIufI0x6yrDYh_YWKmMmWHkQSxBtOGs9CdlvG9-nF5eyyvzqAXFCL6VuH1_xWK1l1426Oty-HhHdQJ7qHl1Q1KXFNs2rnqQMy4Rmz91VUbVu_2lRKFNi9wEklHwhhTYQ83nMWEcbBigU-rfJQ8KCKdcTqmcOBxSD9eOLpYbmuHzM8xJ5D2bZH8HOPSZvfK6ebjTExMclN8o6PIiNQG4GPjoUJvjSjCFp6VpuWr7q-R182lBRpD";
  const featuredNeedsUnoptimized =
    featuredImageSrc.startsWith("http://localhost:") ||
    featuredImageSrc.startsWith("http://127.0.0.1:");
  return (
    <SiteShell>
      <div className="pt-8 pb-20">
        {/* Hero Search Section (ported from legacy-static/资讯.html) */}
        <section className="max-w-screen-2xl mx-auto px-8 mb-16">
          <div className="flex flex-col md:flex-row justify-between items-end gap-8">
            <div className="max-w-2xl">
              <span className="text-secondary font-semibold tracking-widest text-xs uppercase mb-4 block">
                知识库
              </span>
              <h1 className="text-5xl font-extrabold text-primary tracking-tight mb-4 [font-family:var(--font-headline)]">
                新闻资讯中心
              </h1>
              <p className="text-on-surface-variant text-lg leading-relaxed">
                实时掌握行业动态、政策变革及平台最新举措，共同关注创新与成长。
              </p>
            </div>
            <div className="w-full md:w-96 relative group">
              <form method="get">
                <input
                  name="q"
                  defaultValue={q}
                  className="w-full bg-surface-container-highest border-none rounded-xl py-4 pl-12 pr-4 focus:ring-2 focus:ring-secondary-fixed transition-all outline-none"
                  placeholder="搜索新闻、政策或报告..."
                />
                {type ? <input type="hidden" name="type" value={type} /> : null}
              </form>
              <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-outline">
                search
              </span>
            </div>
          </div>
        </section>

        {/* Category Filter Tabs (UI only) */}
        <section className="max-w-screen-2xl mx-auto px-8 mb-12">
          <div className="flex flex-wrap gap-4 items-center">
            <Link
              href={`/news${q ? `?q=${encodeURIComponent(q)}` : ""}`}
              className={`px-6 py-2 rounded-full font-medium text-sm transition-all shadow-md ${
                !type ? "bg-primary text-on-primary" : "bg-surface-container-low text-on-surface-variant hover:bg-surface-container-high"
              }`}
            >
              最新动态
            </Link>
            <Link
              href={`/news?type=NEWS${q ? `&q=${encodeURIComponent(q)}` : ""}`}
              className={`px-6 py-2 rounded-full font-medium text-sm transition-all ${
                type === "NEWS"
                  ? "bg-primary text-on-primary shadow-md"
                  : "bg-surface-container-low text-on-surface-variant hover:bg-surface-container-high"
              }`}
            >
              机构动态
            </Link>
            <Link
              href={`/news?type=POLICY${q ? `&q=${encodeURIComponent(q)}` : ""}`}
              className={`px-6 py-2 rounded-full font-medium text-sm transition-all ${
                type === "POLICY"
                  ? "bg-primary text-on-primary shadow-md"
                  : "bg-surface-container-low text-on-surface-variant hover:bg-surface-container-high"
              }`}
            >
              国家政策
            </Link>
            <Link
              href={`/news?type=REPORT${q ? `&q=${encodeURIComponent(q)}` : ""}`}
              className={`px-6 py-2 rounded-full font-medium text-sm transition-all ${
                type === "REPORT"
                  ? "bg-primary text-on-primary shadow-md"
                  : "bg-surface-container-low text-on-surface-variant hover:bg-surface-container-high"
              }`}
            >
              研究报告
            </Link>
          </div>
        </section>

        {/* Featured + Feed */}
        <section className="max-w-screen-2xl mx-auto px-8 grid grid-cols-1 lg:grid-cols-12 gap-12 mb-24">
          <div className="lg:col-span-7">
            {featured ? (
              <Link
                href={`/news/${encodeURIComponent(featured.slug)}`}
                className="block relative rounded-2xl overflow-hidden group"
              >
                <div className="relative aspect-[16/10] bg-slate-200">
                  <Image
                    alt="Featured"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                    src={featuredImageSrc}
                    fill
                    sizes="(max-width: 1024px) 100vw, 56vw"
                    unoptimized={featuredNeedsUnoptimized}
                  />
                </div>
                <div className="absolute inset-0 bg-gradient-to-t from-primary/90 via-primary/30 to-transparent p-8 flex flex-col justify-end">
                  <div className="flex items-center gap-3 mb-4">
                    <span className="px-3 py-1 bg-on-tertiary-container/10 backdrop-blur-md text-on-tertiary-container text-[10px] font-bold rounded-md tracking-wide">
                      {postTypeLabel(featured.type)}
                    </span>
                    {featured.category ? (
                      <span className="px-3 py-1 bg-white/15 backdrop-blur-md text-white text-[10px] font-bold rounded-md tracking-wider">
                        {featured.category}
                      </span>
                    ) : null}
                    <span className="text-white/70 text-sm font-medium">
                      {featured.publishedAt
                        ? new Date(featured.publishedAt)
                            .toISOString()
                            .slice(0, 10)
                        : ""}
                    </span>
                  </div>
                  <h2 className="text-3xl font-bold text-white mb-4 leading-tight max-w-xl [font-family:var(--font-headline)]">
                    {featured.title}
                  </h2>
                  <p className="text-white/80 text-base mb-6 max-w-xl line-clamp-2">
                    {featured.summary ?? "点击查看详情"}
                  </p>
                  <span className="flex items-center gap-2 text-white font-bold group/link">
                    阅读全文
                    <span className="material-symbols-outlined group-hover/link:translate-x-1 transition-transform">
                      arrow_forward
                    </span>
                  </span>
                </div>
              </Link>
            ) : (
              <div className="rounded-2xl bg-surface-container-lowest p-10 text-on-surface-variant">
                暂无已发布内容
              </div>
            )}
          </div>

          <div className="lg:col-span-5 space-y-8">
            {rest.map((p) => (
              <Link
                key={p.id}
                href={`/news/${encodeURIComponent(p.slug)}`}
                className="block group"
              >
                <div className="flex justify-between items-start mb-3">
                  <span className="text-xs font-bold text-secondary tracking-wide">
                    {postTypeLabel(p.type)}
                  </span>
                  <span className="text-xs text-outline">
                    {p.publishedAt
                      ? new Date(p.publishedAt).toISOString().slice(0, 10)
                      : ""}
                  </span>
                </div>
                <h3 className="text-xl font-bold text-on-surface mb-2 group-hover:text-secondary transition-colors [font-family:var(--font-headline)]">
                  {p.title}
                </h3>
                {p.tags?.length ? (
                  <div className="mb-2 flex flex-wrap gap-2">
                    {p.tags.slice(0, 3).map((tag) => (
                      <span
                        key={tag}
                        className="rounded-full bg-surface-container-low px-2 py-0.5 text-[11px] text-outline"
                      >
                        #{tag}
                      </span>
                    ))}
                  </div>
                ) : null}
                {p.summary ? (
                  <p className="text-on-surface-variant text-sm line-clamp-2">
                    {p.summary}
                  </p>
                ) : null}
              </Link>
            ))}

            <div className="pt-4">
              <Link
                href="/news"
                className="block w-full text-center py-4 border border-outline-variant rounded-xl text-on-surface font-semibold hover:bg-surface-container-low transition-colors"
              >
                查看所有近期动态
              </Link>
            </div>
          </div>
        </section>

        {/* Fallback plain list (helps QA / simple browsing) */}
        <section className="max-w-screen-2xl mx-auto px-8">
          <div className="rounded-2xl bg-surface-container-lowest shadow-sm overflow-hidden">
            <div className="px-8 py-6 border-b border-outline-variant/20 flex items-center justify-between">
              <div className="text-lg font-bold text-primary [font-family:var(--font-headline)]">
                全部资讯（简表）
              </div>
              <Link className="text-sm font-bold text-secondary" href="/">
                返回首页
              </Link>
            </div>
            <div className="divide-y divide-outline-variant/20">
              {posts.map((p) => (
                <Link
                  key={p.id}
                  href={`/news/${encodeURIComponent(p.slug)}`}
                  className="block px-8 py-6 hover:bg-surface-container-low transition-colors"
                >
                  <div className="font-bold text-on-surface">{p.title}</div>
                  {p.summary ? (
                    <div className="mt-2 line-clamp-2 text-sm text-on-surface-variant">
                      {p.summary}
                    </div>
                  ) : null}
                </Link>
              ))}
              {posts.length === 0 ? (
                <div className="px-8 py-10 text-sm text-on-surface-variant">
                  暂无已发布内容
                </div>
              ) : null}
            </div>
          </div>
        </section>
      </div>
    </SiteShell>
  );
}

