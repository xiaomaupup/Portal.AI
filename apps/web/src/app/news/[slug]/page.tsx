import Link from "next/link";
import Image from "next/image";
import { getPost, listPosts } from "@/lib/api";
import { postTypeLabel } from "@/lib/post-type-label";
import { SiteShell } from "@/components/site/SiteShell";
import { notFound } from "next/navigation";

export const dynamic = "force-dynamic";

export default async function NewsDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  let post: Awaited<ReturnType<typeof getPost>> | null = null;
  try {
    post = await getPost(slug);
  } catch (err: unknown) {
    if (err instanceof Error && err.message.includes("404")) {
      notFound();
    }
    throw err;
  }

  if (!post) {
    notFound();
  }

  const related = (await listPosts({ type: post.type }))
    .filter((item) => item.slug !== post.slug)
    .slice(0, 3);
  const heroImage =
    post.coverUrl ??
    "https://lh3.googleusercontent.com/aida-public/AB6AXuBiQ4JwfxJHQTQE0hAD10tzfOKWABpIufI0x6yrDYh_YWKmMmWHkQSxBtOGs9CdlvG9-nF5eyyvzqAXFCL6VuH1_xWK1l1426Oty-HhHdQJ7qHl1Q1KXFNs2rnqQMy4Rmz91VUbVu_2lRKFNi9wEklHwhhTYQ83nMWEcbBigU-rfJQ8KCKdcTqmcOBxSD9eOLpYbmuHzM8xJ5D2bZH8HOPSZvfK6ebjTExMclN8o6PIiNQG4GPjoUJvjSjCFp6VpuWr7q-R182lBRpD";
  const heroNeedsUnoptimized =
    heroImage.startsWith("http://localhost:") ||
    heroImage.startsWith("http://127.0.0.1:");

  return (
    <SiteShell>
      <div className="px-6 pb-20 pt-8">
        <div className="mx-auto max-w-4xl">
          <div className="mb-6 flex items-center justify-between text-sm font-semibold text-secondary">
            <div className="flex items-center gap-2 text-on-surface-variant">
              <Link className="transition hover:text-secondary" href="/">
                首页
              </Link>
              <span>/</span>
              <Link className="transition hover:text-secondary" href="/news">
                新闻资讯
              </Link>
              <span>/</span>
              <span className="truncate text-on-surface">{post.title}</span>
            </div>
            <Link className="transition hover:opacity-75" href="/news">
              返回列表
            </Link>
          </div>
        </div>

        <article className="mx-auto max-w-4xl rounded-3xl border border-outline-variant/20 bg-surface-container-lowest p-10 shadow-sm">
          <div className="mb-5 flex flex-wrap items-center gap-2 text-xs font-semibold tracking-wide text-outline">
            <span className="rounded-full bg-surface-container-high px-3 py-1 normal-case">
              {postTypeLabel(post.type)}
            </span>
            {post.category ? (
              <span className="rounded-full bg-surface-container-high px-3 py-1 normal-case">{post.category}</span>
            ) : null}
            {post.publishedAt ? (
              <span className="rounded-full bg-surface-container-high px-3 py-1 tabular-nums">
                {new Date(post.publishedAt).toISOString().slice(0, 10)}
              </span>
            ) : null}
          </div>

          <h1 className='text-[46px] font-bold leading-[1.25] tracking-normal text-primary [font-family:"PingFang_SC","Hiragino_Sans_GB","Microsoft_YaHei","Noto_Sans_SC",sans-serif]'>
            {post.title}
          </h1>
          {post.summary ? (
            <p className='mt-5 max-w-3xl text-[19px] font-normal leading-[1.8] text-[color:color-mix(in_oklab,var(--on-surface-variant)_78%,white_22%)] [font-family:"PingFang_SC","Hiragino_Sans_GB","Microsoft_YaHei","Noto_Sans_SC",sans-serif]'>
              {post.summary}
            </p>
          ) : null}

          <div className="mt-8 overflow-hidden rounded-2xl border border-outline-variant/20 bg-slate-300">
            <div className="relative aspect-[16/8.2]">
              <Image
                alt={post.title}
                className="h-full w-full object-cover"
                src={heroImage}
                fill
                sizes="(max-width: 1024px) 100vw, 900px"
                unoptimized={heroNeedsUnoptimized}
              />
            </div>
          </div>

          <div className="mx-auto mt-10 max-w-3xl">
            {post.tags?.length ? (
              <div className="mb-8 flex flex-wrap gap-2">
                {post.tags.map((tag) => (
                  <span
                    key={tag}
                    className="rounded-full border border-outline-variant/30 bg-surface-container-low px-3 py-1 text-xs font-medium text-on-surface-variant"
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            ) : null}
            {post.body ? (
              <div
                className="news-rich"
                dangerouslySetInnerHTML={{ __html: post.body }}
              />
            ) : (
              <div className="text-sm text-on-surface-variant">暂无正文</div>
            )}
          </div>
        </article>

        {related.length ? (
          <section className="mx-auto mt-12 max-w-4xl">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-2xl font-bold text-primary [font-family:var(--font-headline)]">相关推荐</h2>
              <Link className="text-sm font-semibold text-secondary hover:opacity-80" href="/news">
                查看更多 →
              </Link>
            </div>
            <div className="grid gap-4 md:grid-cols-3">
              {related.map((item) => (
                <Link
                  key={item.id}
                  href={`/news/${encodeURIComponent(item.slug)}`}
                  className="group rounded-2xl border border-outline-variant/20 bg-surface-container-lowest p-5 transition hover:-translate-y-0.5 hover:shadow-md"
                >
                  <div className="mb-2 flex items-center gap-2 text-[11px] font-semibold tracking-wide text-outline">
                    <span className="rounded bg-surface-container px-2 py-0.5 normal-case">
                      {postTypeLabel(item.type)}
                    </span>
                    {item.publishedAt ? <span>{new Date(item.publishedAt).toISOString().slice(0, 10)}</span> : null}
                  </div>
                  <div className="line-clamp-2 text-lg font-bold text-on-surface transition group-hover:text-secondary">
                    {item.title}
                  </div>
                  {item.summary ? (
                    <p className="mt-2 line-clamp-2 text-sm leading-6 text-on-surface-variant">{item.summary}</p>
                  ) : null}
                </Link>
              ))}
            </div>
          </section>
        ) : null}
      </div>
    </SiteShell>
  );
}

