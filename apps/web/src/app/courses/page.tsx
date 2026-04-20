import { listCourses } from "@/lib/api";
import { courseLevelLabel } from "@/lib/course-level-label";
import { imageNeedsUnoptimized } from "@/lib/image-utils";
import Link from "next/link";
import { SiteShell } from "@/components/site/SiteShell";
import Image from "next/image";

export default async function CoursesPage({
  searchParams,
}: {
  searchParams?: Promise<{ level?: string; industry?: string; q?: string }>;
}) {
  const params = (await searchParams) ?? {};
  const level =
    params.level === "BEGINNER" ||
    params.level === "INTERMEDIATE" ||
    params.level === "ADVANCED"
      ? params.level
      : undefined;
  const industry = params.industry?.trim() || undefined;
  const q = params.q?.trim() || undefined;

  const courses = await listCourses({ level, industry, q });
  return (
    <SiteShell>
      <div className="pt-12 pb-20 px-8 max-w-screen-2xl mx-auto min-h-screen">
        {/* Header section (ported from legacy-static/课程中心.html) */}
        <header className="mb-12">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div>
              <h1 className="text-5xl font-extrabold text-primary tracking-tight mb-2 [font-family:var(--font-headline)]">
                课程中心
              </h1>
              <p className="text-on-surface-variant text-lg max-w-2xl">
                助力职业发展，获取行业认可的AI认证与专家引领的课程体系。
              </p>
            </div>
            <div className="w-full md:w-96">
              <div className="relative group">
                <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-outline">
                  search
                </span>
                <form method="get">
                  <input
                    name="q"
                    defaultValue={q}
                    className="w-full pl-12 pr-4 py-4 bg-surface-container-highest rounded-xl border-none focus:ring-2 focus:ring-secondary-fixed transition-all text-on-surface outline-none"
                    placeholder="搜索课程、工具或师资..."
                  />
                  {level ? <input type="hidden" name="level" value={level} /> : null}
                  {industry ? (
                    <input type="hidden" name="industry" value={industry} />
                  ) : null}
                </form>
              </div>
            </div>
          </div>

          {/* Advanced Filtering (UI only for now) */}
          <div className="mt-10 p-6 bg-surface-container-low rounded-xl flex flex-wrap gap-8 items-center">
            <div className="flex flex-col gap-2">
              <span className="text-xs font-bold uppercase tracking-widest text-outline">
                分类
              </span>
              <select className="bg-transparent border-none text-primary font-semibold focus:ring-0 cursor-pointer p-0 pr-8">
                <option>全部分类</option>
                <option>专业课程</option>
                <option>认证课程</option>
              </select>
            </div>
            <div className="h-10 w-[1px] bg-outline-variant/30 hidden md:block" />
            <div className="flex flex-col gap-2">
              <span className="text-xs font-bold uppercase tracking-widest text-outline">
                行业
              </span>
              <select
                name="industry"
                defaultValue={industry ?? ""}
                form="course-filters"
                className="bg-transparent border-none text-primary font-semibold focus:ring-0 cursor-pointer p-0 pr-8"
              >
                <option value="">全部行业</option>
                <option value="制造">制造业</option>
                <option value="医疗">医疗</option>
                <option value="金融">金融</option>
              </select>
            </div>
            <div className="h-10 w-[1px] bg-outline-variant/30 hidden md:block" />
            <div className="flex flex-col gap-2">
              <span className="text-xs font-bold uppercase tracking-widest text-outline">
                难度
              </span>
              <select
                name="level"
                defaultValue={level ?? ""}
                form="course-filters"
                className="bg-transparent border-none text-primary font-semibold focus:ring-0 cursor-pointer p-0 pr-8"
              >
                <option value="">全部</option>
                <option value="BEGINNER">{courseLevelLabel("BEGINNER")}</option>
                <option value="INTERMEDIATE">{courseLevelLabel("INTERMEDIATE")}</option>
                <option value="ADVANCED">{courseLevelLabel("ADVANCED")}</option>
              </select>
            </div>
            <div className="ml-auto">
              <form id="course-filters" method="get" className="inline-flex gap-2">
                {q ? <input type="hidden" name="q" value={q} /> : null}
                <button className="flex items-center gap-2 text-secondary font-bold hover:opacity-80 transition-opacity">
                  <span className="material-symbols-outlined">filter_alt</span>
                  应用筛选
                </button>
              </form>
              <Link
                href="/courses"
                className="ml-4 inline-flex items-center gap-2 text-secondary font-bold hover:opacity-80 transition-opacity"
              >
                <span className="material-symbols-outlined">filter_list</span>
                清除筛选
              </Link>
            </div>
          </div>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          {/* Course Grid */}
          <div className="lg:col-span-9">
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
              {courses.map((c) => {
                const coverSrc =
                  c.coverUrl ??
                  "https://lh3.googleusercontent.com/aida-public/AB6AXuAH6Pst6LUTNmQRMFXOWuLm_G-14FUEye-EKC8YhEm2AuhlO1-1Pey9pZOJyWpxjOt1SBdIE7Nzmmx9aT_WZCpiv-MBM35BVvIYnI8I9g492AITxd2ctsUOa0GEfO0rJXAFUagxEiHM4BAVsU1Pyk0fAGAzskr8vvVu21tfcDcutxb_aC4iM9M29f3FIt6_CWCtpWeX7lDe8y6-6nDmvxC7iQo-HmLj9F3-_SwyXKT_N2MtvxFq7nwhuT4EhAT6oTpqZIzMoNVF8abR";
                return (
                <Link
                  key={c.id}
                  href={`/courses/${encodeURIComponent(c.slug)}`}
                  className="bg-surface-container-lowest rounded-xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 group flex flex-col"
                >
                  <div className="relative h-48 overflow-hidden">
                    <Image
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                      alt={c.title}
                      src={coverSrc}
                      fill
                      sizes="(max-width: 768px) 100vw, (max-width: 1280px) 50vw, 33vw"
                      unoptimized={imageNeedsUnoptimized(coverSrc)}
                    />
                    <div className="absolute top-4 left-4 bg-primary-container text-on-primary text-[10px] font-bold px-3 py-1 rounded-full tracking-widest">
                      {courseLevelLabel(c.level)}
                    </div>
                    {c.category ? (
                      <div className="absolute top-4 right-4 bg-white/85 text-primary text-[10px] font-bold px-3 py-1 rounded-full tracking-widest">
                        {c.category}
                      </div>
                    ) : null}
                  </div>
                  <div className="p-6 flex flex-col flex-grow">
                    <h3 className="text-xl font-bold text-primary mb-3 leading-tight [font-family:var(--font-headline)]">
                      {c.title}
                    </h3>
                    {c.summary ? (
                      <p className="text-on-surface-variant text-sm mb-6 flex-grow line-clamp-3">
                        {c.summary}
                      </p>
                    ) : (
                      <div className="flex-grow" />
                    )}
                    {c.tags?.length ? (
                      <div className="mb-4 flex flex-wrap gap-2">
                        {c.tags.slice(0, 3).map((tag) => (
                          <span
                            key={tag}
                            className="rounded-full bg-surface-container-low px-2 py-0.5 text-[11px] text-outline"
                          >
                            #{tag}
                          </span>
                        ))}
                      </div>
                    ) : null}
                    <div className="space-y-3 mb-6">
                      <div className="flex items-center gap-3 text-xs text-outline font-medium">
                        <span className="material-symbols-outlined text-sm">
                          schedule
                        </span>
                        <span>{c.durationWks}周</span>
                      </div>
                      <div className="flex items-center gap-3 text-xs text-outline font-medium">
                        <span className="material-symbols-outlined text-sm">
                          school
                        </span>
                        <span>{c.credits} 学分</span>
                      </div>
                    </div>
                    <div className="w-full bg-secondary text-on-secondary py-3 rounded-xl font-bold hover:bg-primary transition-colors flex items-center justify-center gap-2 group-hover:translate-y-[-2px]">
                      了解更多
                      <span className="material-symbols-outlined text-sm">
                        arrow_forward
                      </span>
                    </div>
                  </div>
                </Link>
                );
              })}
            </div>

            <div className="mt-16 flex justify-center">
              <button className="px-8 py-4 border border-outline-variant rounded-xl font-bold text-primary hover:bg-surface-container-low transition-colors">
                查看全部课程
              </button>
            </div>

            {courses.length === 0 ? (
              <div className="mt-10 text-sm text-on-surface-variant">
                暂无已发布课程
              </div>
            ) : null}
          </div>

          {/* Sidebar (kept as static UI from legacy) */}
          <aside className="lg:col-span-3 space-y-8">
            <div className="bg-primary text-on-primary p-8 rounded-xl relative overflow-hidden">
              <div className="relative z-10">
                <h4 className="text-xl font-bold mb-4 [font-family:var(--font-headline)]">
                  学习路径
                </h4>
                <p className="text-primary-fixed-dim text-sm mb-6">
                  定制化职业成长路径。
                </p>
                <ul className="space-y-4 mb-8">
                  <li className="flex items-center gap-3 text-sm">
                    <span className="material-symbols-outlined text-on-tertiary-container text-lg">
                      verified
                    </span>
                    AI开发路径
                  </li>
                  <li className="flex items-center gap-3 text-sm">
                    <span className="material-symbols-outlined text-on-tertiary-container text-lg">
                      verified
                    </span>
                    业务战略路径
                  </li>
                  <li className="flex items-center gap-3 text-sm">
                    <span className="material-symbols-outlined text-on-tertiary-container text-lg">
                      verified
                    </span>
                    伦理与治理
                  </li>
                </ul>
                <Link
                  className="inline-flex items-center gap-2 text-secondary-fixed font-bold hover:underline"
                  href="#"
                >
                  开始定制
                  <span className="material-symbols-outlined text-sm">
                    open_in_new
                  </span>
                </Link>
              </div>
              <div className="absolute -right-8 -bottom-8 w-32 h-32 bg-secondary/20 rounded-full blur-3xl" />
            </div>

            <div className="bg-surface-container-low p-8 rounded-xl">
              <h4 className="text-primary font-bold mb-6 [font-family:var(--font-headline)]">
                我的学习进度
              </h4>
              <div className="space-y-8">
                <div>
                  <div className="flex justify-between items-end mb-2">
                    <span className="text-sm font-bold text-on-surface">
                      证书追踪
                    </span>
                    <span className="text-xs font-bold text-secondary">65%</span>
                  </div>
                  <div className="w-full bg-surface-container-highest h-2 rounded-full overflow-hidden">
                    <div
                      className="bg-secondary h-full rounded-full"
                      style={{ width: "65%" }}
                    />
                  </div>
                </div>
                <div className="space-y-4 pt-4 border-t border-outline-variant/30">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-surface-container-highest flex items-center justify-center text-primary">
                      <span className="material-symbols-outlined">menu_book</span>
                    </div>
                    <div>
                      <div className="text-xs font-bold text-on-surface">
                        进行中课程
                      </div>
                      <div className="text-sm text-on-surface-variant">
                        3 门课程正在学习
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-surface-container-highest flex items-center justify-center text-primary">
                      <span className="material-symbols-outlined">star</span>
                    </div>
                    <div>
                      <div className="text-xs font-bold text-on-surface">
                        已获得学分
                      </div>
                      <div className="text-sm text-on-surface-variant">
                        14 / 30 学分
                      </div>
                    </div>
                  </div>
                </div>
                <button className="w-full bg-white text-primary border border-outline-variant py-3 rounded-xl font-bold text-sm shadow-sm hover:shadow-md transition-all">
                  进入个人中心
                </button>
              </div>
            </div>

            <div className="p-8 border-2 border-dashed border-outline-variant rounded-xl text-center">
              <span className="material-symbols-outlined text-4xl text-outline mb-4">
                support_agent
              </span>
              <h5 className="text-primary font-bold mb-2">需要指导？</h5>
              <p className="text-on-surface-variant text-xs mb-4">
                联系专家委员会获取学术建议。
              </p>
              <button className="text-secondary font-bold text-sm hover:underline">
                联系专家委员会
              </button>
            </div>
          </aside>
        </div>
      </div>
    </SiteShell>
  );
}

