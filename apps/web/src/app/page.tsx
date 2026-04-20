import type { Post } from "@/lib/api";
import { listPosts } from "@/lib/api";
import Link from "next/link";
import { SiteShell } from "@/components/site/SiteShell";
import Image from "next/image";

/** 首页大横幅：全宽背景（legacy）+ 右侧装饰图（仓库内静态图） */
const HERO_BG =
  "https://lh3.googleusercontent.com/aida-public/AB6AXuAS3SAFejB65wTgxTMPoB4lEclet0pe888iWrPirneNhwE3POyu8NJHLrqmK4WFeMnCUO3jQ2gnMhvcSD5XrjiaW4VS5TDSGCpUftcxl-1J_xkK2LKKffSaoNBWp3YjjU5YV64RXTqyjwPL21SMZHZzrLqCTzrN7al_Mcx_-gD37jX302hVMhkJP5e42STa_W1QMQ3mn0Gv8C_yQbq_s5eNmWJbIpB6xvHJKxHeyynDRlWkDaunGcateaMxsz2sMMEy1nYF2TVx9mDw";
/** 城市天际线河畔（public/images，与主色蒙层搭配） */
const HERO_SIDE = "/images/hero-side-city.png";
/** 特色课程模块配图（智能制造 / 工业机器人场景，public 静态资源） */
const FEATURED_COURSES_IMG = "/images/featured-courses.png";

export default function Home() {
  const postsPromise = listPosts();

  return (
    <SiteShell>
      {/* Hero Section (ported from legacy-static/index.html) */}
      <section className="relative flex min-h-[min(640px,82vh)] items-start overflow-x-hidden bg-primary pb-24 pt-4 md:min-h-[min(700px,78vh)] md:pb-28 md:pt-6 lg:items-center">
        <div className="absolute inset-0 z-0">
          <Image
            className="object-cover"
            alt="深蓝科技感的网络与数据连接背景"
            src={HERO_BG}
            fill
            sizes="100vw"
            priority
          />
          {/* 左侧压暗保证标题可读，右侧渐隐露出背景图纹理 */}
          <div className="absolute inset-0 bg-gradient-to-r from-primary from-[0%] via-primary/88 via-[48%] to-primary/25" />
          <div className="absolute inset-0 bg-gradient-to-t from-primary/55 via-transparent to-primary/25" />
        </div>

        <div className="relative z-10 mx-auto grid min-h-0 w-full max-w-screen-2xl grid-cols-1 items-start gap-10 px-8 lg:grid-cols-2 lg:items-center lg:gap-16">
          <div className="min-h-0 space-y-8">
            <div className="inline-flex items-center px-4 py-2 bg-secondary-container/20 text-on-primary-container rounded-full text-xs font-bold tracking-widest uppercase">
              官方网站
            </div>
            <h1 className="text-5xl md:text-7xl font-extrabold text-white leading-[1.2] tracking-tight [font-family:var(--font-headline)]">
              创意孵化 <br />
              <span className="text-secondary-fixed-dim">加速成长</span>
              <br />
              链接产业生态
            </h1>
            <p className="text-xl text-on-primary-container max-w-xl leading-relaxed">
              为创业者与成长型企业提供空间、资源与产业协同，链接资本与场景，加速产品落地与商业化。
            </p>
            <div className="flex flex-wrap gap-4">
              <Link
                href="/courses"
                className="bg-secondary-container text-white px-8 py-4 rounded-xl font-bold text-lg shadow-xl hover:translate-y-[-2px] transition-all flex items-center gap-2"
              >
                立即加入
                <span className="material-symbols-outlined">arrow_forward</span>
              </Link>
              <Link
                href="/courses"
                className="bg-white/10 backdrop-blur-md text-white border border-white/20 px-8 py-4 rounded-xl font-bold text-lg hover:bg-white/20 transition-all"
              >
                探索课程
              </Link>
            </div>
          </div>

          {/* 装饰配图：静态资源 + 透明蒙层 */}
          <div className="relative z-[1] w-full max-w-xl justify-self-center pb-6 pt-2 lg:justify-self-end lg:pt-0">
            <div
              className="absolute -right-4 -top-4 h-24 w-24 rounded-full bg-secondary-container/25 blur-3xl sm:h-32 sm:w-32 sm:-right-6 sm:-top-6"
              aria-hidden
            />
            <div
              className="absolute -bottom-4 -left-4 h-32 w-32 rounded-full bg-primary-fixed-dim/20 blur-3xl sm:h-40 sm:w-40"
              aria-hidden
            />
            <div className="relative h-[196px] w-full overflow-hidden rounded-2xl shadow-[0_20px_50px_rgba(0,0,0,0.3)] ring-1 ring-white/20 sm:h-[216px] sm:rounded-[1.75rem] lg:h-[232px]">
              <Image
                src={HERO_SIDE}
                alt="现代城市河畔天际线"
                width={1600}
                height={900}
                className="absolute inset-0 h-full w-full object-cover object-center"
                sizes="(max-width: 1024px) min(100vw - 4rem, 36rem), 560px"
                priority
              />
              {/* 整图透明蒙层（主色半透明，统一视觉并压高光） */}
              <div
                className="pointer-events-none absolute inset-0 bg-primary/50 mix-blend-multiply"
                aria-hidden
              />
              <div
                className="pointer-events-none absolute inset-0 bg-gradient-to-b from-primary/20 via-primary/35 to-primary/55"
                aria-hidden
              />
              <div
                className="pointer-events-none absolute bottom-0 left-0 right-0 h-[62%] bg-gradient-to-t from-primary/92 to-transparent"
                aria-hidden
              />
              <div className="absolute bottom-0 left-0 right-0 z-[2] flex flex-col gap-2 px-4 py-3 text-on-primary sm:gap-2.5 sm:px-5 sm:py-4">
                <div className="flex flex-wrap gap-2">
                  <span className="rounded-full bg-white/15 px-3 py-1 text-xs font-semibold text-white shadow-md backdrop-blur-md ring-1 ring-white/25 sm:px-4 sm:py-1.5">
                    孵化器
                  </span>
                  <span className="rounded-full bg-white/15 px-3 py-1 text-xs font-semibold text-white shadow-md backdrop-blur-md ring-1 ring-white/25 sm:px-4 sm:py-1.5">
                    产业协同
                  </span>
                </div>
                <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-on-primary-container/95 sm:text-xs">
                  一站式加速
                </p>
                <p className="text-sm font-bold leading-snug [font-family:var(--font-headline)] sm:text-base">
                  空间 · 资本 · 场景 · 课程
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Key Stats */}
      <section className="relative z-20 -mt-16 max-w-screen-xl mx-auto px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-0 rounded-2xl overflow-hidden shadow-2xl bg-surface-container-lowest">
          <div className="p-10 flex flex-col items-center text-center border-r border-outline-variant/10">
            <span className="text-5xl font-extrabold text-primary tracking-tighter">
              1162+
            </span>
            <span className="text-on-surface-variant font-medium mt-2">
              会员单位
            </span>
          </div>
          <div className="p-10 flex flex-col items-center text-center border-r border-outline-variant/10">
            <span className="text-5xl font-extrabold text-primary tracking-tighter">
              50+
            </span>
            <span className="text-on-surface-variant font-medium mt-2">
              AI领军企业
            </span>
          </div>
          <div className="p-10 flex flex-col items-center text-center">
            <span className="text-5xl font-extrabold text-primary tracking-tighter">
              7+
            </span>
            <span className="text-on-surface-variant font-medium mt-2">
              核心通识课程
            </span>
          </div>
        </div>
      </section>

      {/* Modules Overview (bento) */}
      <section className="py-24 max-w-screen-2xl mx-auto px-8">
        <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-6">
          <div>
            <h2 className="text-4xl font-bold text-primary tracking-tight [font-family:var(--font-headline)]">
              生态模块
            </h2>
            <p className="text-on-surface-variant mt-2 text-lg">
              为创业者与成长型企业提供空间、课程与资源协同的一站式服务。
            </p>
          </div>
          <div className="h-px flex-grow bg-outline-variant/20 mx-8 hidden md:block" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
          {/* Course Center (large highlight) */}
          <div className="group relative overflow-hidden rounded-3xl bg-surface-container-low p-8 md:col-span-8 md:p-10 lg:p-12">
            <div className="pointer-events-none absolute -right-16 -top-16 h-56 w-56 rounded-full bg-secondary-fixed/30 blur-3xl" />
            <div className="pointer-events-none absolute -bottom-20 left-10 h-52 w-52 rounded-full bg-primary-fixed-dim/25 blur-3xl" />

            <div className="relative z-10 grid grid-cols-1 gap-8 lg:grid-cols-[minmax(0,1fr)_300px] lg:items-stretch lg:gap-10">
              <div className="max-w-2xl space-y-6">
                <span className="inline-flex rounded-full bg-primary px-3 py-1 text-xs font-bold text-white">
                  课程中心
                </span>
                <h3 className="text-3xl font-bold leading-tight text-primary [font-family:var(--font-headline)] md:text-4xl">
                  特色课程：精选推荐
                </h3>
                <p className="max-w-xl text-on-surface-variant leading-relaxed md:text-lg">
                  面向工程与产业实践，围绕 AI 核心能力、落地场景与协同方法，提供体系化学习路径。
                </p>

                <div className="flex flex-wrap gap-2">
                  <span className="rounded-full bg-surface-container-lowest px-3 py-1 text-xs font-semibold text-on-surface-variant ring-1 ring-outline-variant/30">
                    核心能力构建
                  </span>
                  <span className="rounded-full bg-surface-container-lowest px-3 py-1 text-xs font-semibold text-on-surface-variant ring-1 ring-outline-variant/30">
                    产业案例实战
                  </span>
                  <span className="rounded-full bg-surface-container-lowest px-3 py-1 text-xs font-semibold text-on-surface-variant ring-1 ring-outline-variant/30">
                    持续进阶路径
                  </span>
                </div>

                <div className="pt-1">
                  <Link
                    href="/courses"
                    className="inline-flex items-center gap-2 rounded-xl bg-secondary px-5 py-2.5 text-sm font-bold text-white shadow-md transition-all hover:translate-y-[-1px] hover:shadow-lg"
                  >
                    浏览课程
                    <span className="material-symbols-outlined text-base">trending_flat</span>
                  </Link>
                </div>
              </div>

              <div className="relative hidden aspect-square w-full overflow-hidden rounded-2xl border border-white/40 bg-surface-container-lowest/60 shadow-xl lg:block">
                <Image
                  className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.04]"
                  alt="智能制造与工业机器人场景"
                  src={FEATURED_COURSES_IMG}
                  fill
                  sizes="300px"
                />
                <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-primary/45 via-transparent to-transparent" />
              </div>
            </div>
          </div>

          {/* News */}
          <div className="md:col-span-4 bg-surface-container-highest rounded-3xl p-10 flex flex-col justify-between">
            <div>
              <span className="text-primary text-xs font-bold tracking-widest">
                最新动态
              </span>
              <h3 className="text-2xl font-bold text-primary mt-4 mb-6 [font-family:var(--font-headline)]">
                新闻资讯
              </h3>
              <AsyncNewsTeasers promise={postsPromise} />
            </div>
            <Link
              href="/news"
              className="mt-8 text-on-surface-variant hover:text-primary transition-colors text-sm font-bold flex items-center gap-1"
            >
              全部资讯{" "}
              <span className="material-symbols-outlined text-sm">north_east</span>
            </Link>
          </div>

          {/* 职业认证（跳转频道页） */}
          <Link
            href="/certificates"
            className="md:col-span-6 bg-gradient-to-br from-blue-900 to-primary-container rounded-3xl p-10 text-white relative overflow-hidden group block hover:opacity-[0.98] transition-opacity"
          >
            <div className="relative z-10 flex flex-col h-full justify-between">
              <div>
                <span className="bg-white/20 text-white text-xs font-bold px-3 py-1 rounded-full backdrop-blur-md">
                  证书查询
                </span>
                <h3 className="text-3xl font-bold mt-6 mb-4 [font-family:var(--font-headline)]">
                  职业认证
                </h3>
                <p className="text-white/70 max-w-sm">
                  官方 AI 能力评价与证书核验说明、资源对接与会员需求展示。
                </p>
              </div>
              <div className="mt-8 pointer-events-none">
                <div className="flex bg-white/10 rounded-xl p-1 backdrop-blur-md border border-white/10">
                  <span className="text-white/50 flex-grow px-4 py-2 text-sm">请输入证书编号</span>
                  <span className="bg-white text-primary px-6 py-2 rounded-lg font-bold text-sm">查询</span>
                </div>
                <p className="text-white/60 text-sm mt-3 flex items-center gap-1">
                  进入职业认证频道
                  <span className="material-symbols-outlined text-base group-hover:translate-x-0.5 transition-transform">
                    arrow_forward
                  </span>
                </p>
              </div>
            </div>
            <span className="absolute -right-12 -bottom-12 material-symbols-outlined text-[200px] opacity-10">
              verified
            </span>
          </Link>

          {/* Resource Matching placeholder */}
          <div className="md:col-span-6 bg-surface-container-low rounded-3xl p-10 flex items-center group cursor-pointer hover:bg-surface-bright transition-all">
            <div className="flex-grow">
              <span className="text-on-tertiary-container text-xs font-bold tracking-widest uppercase">
                桥接产业
              </span>
              <h3 className="text-3xl font-bold text-primary mt-2 mb-4 [font-family:var(--font-headline)]">
                资源对接
              </h3>
              <p className="text-on-surface-variant max-w-md">
                链接AI企业与真实工业应用场景，加速技术成果转化与落地（后续接入企业/需求/案例模块）。
              </p>
            </div>
            <div className="shrink-0 ml-4 h-16 w-16 rounded-full bg-secondary-container/10 flex items-center justify-center text-secondary group-hover:scale-110 transition-transform">
              <span className="material-symbols-outlined text-3xl">hub</span>
            </div>
          </div>
        </div>
      </section>

      {/* Partners */}
      <section className="bg-surface-container-low py-20 overflow-hidden">
        <div className="max-w-screen-2xl mx-auto px-8">
          <div className="text-center mb-12">
            <h2 className="text-lg font-bold text-outline uppercase tracking-[0.3em]">
              合作伙伴与协作机构
            </h2>
          </div>
          <div className="flex flex-wrap justify-center items-center gap-16 grayscale opacity-60 hover:grayscale-0 transition-all">
            <div className="h-12 w-48 bg-outline-variant/30 rounded flex items-center justify-center font-bold text-outline">
              学术合作伙伴
            </div>
            <div className="h-12 w-48 bg-outline-variant/30 rounded flex items-center justify-center font-bold text-outline">
              技术联盟
            </div>
            <div className="h-12 w-48 bg-outline-variant/30 rounded flex items-center justify-center font-bold text-outline">
              政府机关
            </div>
            <div className="h-12 w-48 bg-outline-variant/30 rounded flex items-center justify-center font-bold text-outline">
              产业伙伴
            </div>
          </div>
        </div>
      </section>
    </SiteShell>
  );
}

async function AsyncNewsTeasers(props: { promise: Promise<Post[]> }) {
  const posts = await props.promise;
  return (
    <ul className="space-y-6">
      {posts.slice(0, 3).map((p) => (
        <li key={p.id} className="flex gap-4 items-start border-b border-outline-variant/20 pb-4">
          <span className="text-xs font-bold text-secondary-container bg-white px-2 py-1 rounded shrink-0">
            {/* simple date badge */}
            {p.publishedAt ? new Date(p.publishedAt).toISOString().slice(5, 10) : "--"}
          </span>
          <Link
            href={`/news/${encodeURIComponent(p.slug)}`}
            className="text-sm font-semibold hover:text-secondary cursor-pointer transition-colors line-clamp-2"
          >
            {p.title}
          </Link>
        </li>
      ))}
      {posts.length === 0 ? (
        <li className="text-sm text-on-surface-variant">暂无已发布资讯</li>
      ) : null}
    </ul>
  );
}
