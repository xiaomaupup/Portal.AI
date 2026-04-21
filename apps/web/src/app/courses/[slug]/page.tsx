import Link from "next/link";
import Image from "next/image";
import { getCourse } from "@/lib/api";
import type { Course } from "@/lib/api";
import { courseLevelLabel } from "@/lib/course-level-label";
import { imageNeedsUnoptimized } from "@/lib/image-utils";
import { SiteShell } from "@/components/site/SiteShell";
import { notFound } from "next/navigation";

export const dynamic = "force-dynamic";

const HIGHLIGHT_ICONS = ["history_edu", "psychology", "factory", "gavel"] as const;

const DEFAULT_HIGHLIGHTS: { icon: (typeof HIGHLIGHT_ICONS)[number]; title: string; desc: string }[] =
  [
    {
      icon: "history_edu",
      title: "体系化路径",
      desc: "从基础概念到应用场景，形成可复用的知识结构与学习路线。",
    },
    {
      icon: "psychology",
      title: "核心能力",
      desc: "理解关键方法与工具链，能够在真实业务语境中分析与落地。",
    },
    {
      icon: "factory",
      title: "行业视角",
      desc: "结合产业案例与最佳实践，缩短从学习到产出的路径。",
    },
    {
      icon: "gavel",
      title: "规范与责任",
      desc: "关注合规、伦理与协作方式，支撑可持续的智能化实践。",
    },
  ];

function buildHighlights(course: Course) {
  const tags = course.tags?.filter(Boolean) ?? [];
  if (tags.length === 0) {
    return DEFAULT_HIGHLIGHTS;
  }
  return tags.slice(0, 4).map((tag, i) => ({
    icon: HIGHLIGHT_ICONS[i % 4],
    title: tag,
    desc: `围绕「${tag}」设置专题讲解与案例，帮助建立可迁移的理解框架。`,
  }));
}

export default async function CourseDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  let course: Awaited<ReturnType<typeof getCourse>> | null = null;
  try {
    course = await getCourse(slug);
  } catch (err: unknown) {
    if (err instanceof Error && err.message.includes("404")) {
      notFound();
    }
    throw err;
  }

  if (!course) {
    notFound();
  }

  const heroSrc =
    course.coverUrl ??
    "https://lh3.googleusercontent.com/aida-public/AB6AXuAH6Pst6LUTNmQRMFXOWuLm_G-14FUEye-EKC8YhEm2AuhlO1-1Pey9pZOJyWpxjOt1SBdIE7Nzmmx9aT_WZCpiv-MBM35BVvIYnI8I9g492AITxd2ctsUOa0GEfO0rJXAFUagxEiHM4BAVsU1Pyk0fAGAzskr8vvVu21tfcDcutxb_aC4iM9M29f3FIt6_CWCtpWeX7lDe8y6-6nDmvxC7iQo-HmLj9F3-_SwyXKT_N2MtvxFq7nwhuT4EhAT6oTpqZIzMoNVF8abR";

  const highlights = buildHighlights(course);
  const levelLine =
    course.level === "BEGINNER"
      ? "无硬性前置要求"
      : course.level === "INTERMEDIATE"
        ? "建议具备相关基础"
        : "适合进阶拓展";

  return (
    <SiteShell>
      <div className="bg-surface selection:bg-secondary-fixed selection:text-[color:var(--on-secondary-fixed)]">
        {/* 面包屑 */}
        <div className="max-w-screen-2xl mx-auto px-6 md:px-8 pt-6 pb-4">
          <nav className="flex flex-wrap items-center gap-2 text-sm font-medium text-on-surface-variant">
            <Link className="transition hover:text-secondary" href="/">
              首页
            </Link>
            <span className="text-outline-variant">/</span>
            <Link className="transition hover:text-secondary" href="/courses">
              课程中心
            </Link>
            <span className="text-outline-variant">/</span>
            <span className="truncate text-primary max-w-[min(100%,42rem)]">{course.title}</span>
          </nav>
        </div>

        {/* Hero */}
        <section className="relative w-full overflow-hidden bg-primary text-on-primary px-6 md:px-8 py-20 md:py-28">
          <div className="absolute inset-0 z-0">
            <Image
              alt={course.title}
              className="object-cover opacity-30"
              src={heroSrc}
              fill
              sizes="100vw"
              priority
              unoptimized={imageNeedsUnoptimized(heroSrc)}
            />
            <div className="absolute inset-0 bg-gradient-to-r from-primary via-primary/80 to-transparent" />
          </div>
          <div className="relative z-10 max-w-screen-2xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div>
              <span className="inline-block px-4 py-1 bg-secondary-container text-on-secondary text-xs font-bold tracking-widest uppercase rounded-full mb-6">
                {course.category ?? "在线研修"}
              </span>
              <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight leading-tight mb-4 [font-family:var(--font-headline)]">
                {course.title}
                {course.industry ? (
                  <span className="block text-on-primary-container text-2xl md:text-4xl font-bold mt-3">
                    {course.industry}
                  </span>
                ) : null}
              </h1>
              <p className="text-lg md:text-xl text-on-primary-container max-w-xl mb-10 leading-relaxed">
                {course.summary ??
                  "本课程提供结构化的学习路径与实践参考，帮助你在工作中更安全、更高效地运用人工智能相关能力。"}
              </p>
              <div className="flex flex-wrap gap-4">
                <button
                  type="button"
                  className="inline-flex items-center gap-2 bg-surface-container-lowest text-primary font-bold px-8 py-4 rounded-xl shadow-xl hover:translate-y-[-4px] transition-transform [font-family:var(--font-headline)]"
                >
                  <span>立即报名</span>
                  <span className="material-symbols-outlined text-lg">arrow_forward</span>
                </button>
                <button
                  type="button"
                  className="inline-flex items-center justify-center bg-white/10 backdrop-blur-md text-on-primary font-bold px-8 py-4 rounded-xl hover:bg-white/20 transition-all border border-white/20 [font-family:var(--font-headline)]"
                >
                  下载大纲
                </button>
              </div>
            </div>
            <div className="hidden md:block">
              <div className="bg-white/5 backdrop-blur-xl rounded-3xl p-8 border border-white/10 shadow-2xl">
                <div className="grid grid-cols-2 gap-8">
                  <div className="space-y-1">
                    <p className="text-on-primary-container/70 text-xs font-bold tracking-widest uppercase">
                      课程时长
                    </p>
                    <p className="text-3xl font-bold [font-family:var(--font-headline)]">
                      {course.durationWks} 周
                    </p>
                    <p className="text-on-primary-container/50 text-sm">在线学习节奏可自主安排</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-on-primary-container/70 text-xs font-bold tracking-widest uppercase">
                      学分
                    </p>
                    <p className="text-3xl font-bold [font-family:var(--font-headline)]">
                      {course.credits} 学分
                    </p>
                    <p className="text-on-primary-container/50 text-sm">以机构认定规则为准</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-on-primary-container/70 text-xs font-bold tracking-widest uppercase">
                      难易程度
                    </p>
                    <p className="text-3xl font-bold [font-family:var(--font-headline)]">
                      {courseLevelLabel(course.level)}
                    </p>
                    <p className="text-on-primary-container/50 text-sm">{levelLine}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-on-primary-container/70 text-xs font-bold tracking-widest uppercase">
                      适用领域
                    </p>
                    <p className="text-3xl font-bold [font-family:var(--font-headline)] line-clamp-2">
                      {course.industry ?? "通用"}
                    </p>
                    <p className="text-on-primary-container/50 text-sm">可结合岗位场景迁移</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 学习目标 + 课程详情 */}
        <section className="py-16 md:py-24 px-6 md:px-8 max-w-screen-2xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
            <div className="lg:col-span-5">
              <h2 className="text-3xl md:text-4xl font-bold text-primary mb-6 leading-tight [font-family:var(--font-headline)]">
                你将收获的能力与视野
              </h2>
              <p className="text-on-surface-variant text-lg leading-relaxed mb-10">
                {course.summary
                  ? `${course.summary}`
                  : "课程设置强调理解方式与落地路径，帮助你在不断变化的技术环境中保持判断力与执行力。"}
              </p>
              <div className="space-y-8">
                {highlights.map((item) => (
                  <div className="flex gap-6 group" key={item.title}>
                    <div className="w-12 h-12 rounded-xl bg-secondary-fixed/40 flex-shrink-0 flex items-center justify-center text-secondary group-hover:bg-secondary group-hover:text-on-secondary transition-all">
                      <span className="material-symbols-outlined">{item.icon}</span>
                    </div>
                    <div>
                      <h4 className="text-xl font-bold text-primary mb-2 [font-family:var(--font-headline)]">
                        {item.title}
                      </h4>
                      <p className="text-on-surface-variant text-sm md:text-base leading-relaxed">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div
              className="lg:col-span-7 bg-surface-container-low rounded-[2rem] p-8 md:p-12"
              id="course-content"
            >
              <h3 className="text-2xl font-bold text-primary mb-8 flex items-center gap-3 [font-family:var(--font-headline)]">
                <span className="material-symbols-outlined text-secondary">menu_book</span>
                课程详情
              </h3>
              {course.tags?.length ? (
                <div className="flex flex-wrap gap-2 mb-8">
                  {course.tags.map((tag) => (
                    <span
                      key={tag}
                      className="rounded-full bg-surface-container-lowest border border-outline-variant/40 px-3 py-1 text-xs font-semibold text-on-surface-variant"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>
              ) : null}
              {course.body ? (
                <div
                  className="news-rich max-w-none"
                  dangerouslySetInnerHTML={{ __html: course.body }}
                />
              ) : (
                <p className="text-on-surface-variant text-sm leading-relaxed">
                  详细大纲与章节说明可由教务人员在后台补充；当前暂无正文。
                </p>
              )}
            </div>
          </div>
        </section>

        {/* 师资（展示位，与静态页一致的结构；后续可对接真实数据） */}
        <section className="bg-surface-container-high py-16 md:py-24 px-6 md:px-8">
          <div className="max-w-screen-2xl mx-auto">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-12 gap-6">
              <div className="max-w-2xl">
                <h2 className="text-3xl md:text-4xl font-bold text-primary mb-4 [font-family:var(--font-headline)]">
                  教学与产业专家
                </h2>
                <p className="text-on-surface-variant text-lg">
                  课程由合作高校、成员单位与行业专家共同参与设计与讲授，具体名单以开班通知为准。
                </p>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[
                {
                  name: "学术导师（示例）",
                  org: "合作高校 / 研究院",
                  desc: "负责体系化课程框架与关键理论模块，保障知识结构的完整性与前沿性。",
                },
                {
                  name: "产业讲师（示例）",
                  org: "成员单位技术负责人",
                  desc: "带来真实业务场景与工程实践，帮助你将方法映射到产线与流程。",
                },
                {
                  name: "助教与运营",
                  org: "CACEE 教务团队",
                  desc: "提供学习节奏提醒、作业与项目辅导，保障学习体验与答疑通道。",
                },
              ].map((f) => (
                <div
                  key={f.name}
                  className="bg-surface-container-lowest rounded-3xl overflow-hidden shadow-lg border border-outline-variant/15"
                >
                  <div className="h-48 bg-gradient-to-br from-primary-container/30 via-secondary-fixed/25 to-surface-container-high flex items-center justify-center">
                    <span className="material-symbols-outlined text-6xl text-secondary/40">person</span>
                  </div>
                  <div className="p-8">
                    <h4 className="text-xl font-bold text-primary mb-1 [font-family:var(--font-headline)]">{f.name}</h4>
                    <p className="text-secondary font-semibold mb-4 text-sm">{f.org}</p>
                    <p className="text-on-surface-variant text-sm leading-relaxed">{f.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* 认证与凭证 */}
        <section className="py-16 md:py-24 px-6 md:px-8 max-w-screen-2xl mx-auto">
          <div className="bg-primary rounded-[2.5rem] md:rounded-[3rem] overflow-hidden relative">
            <div className="absolute inset-0 bg-gradient-to-br from-primary-container/40 to-transparent pointer-events-none" />
            <div className="relative z-10 grid grid-cols-1 md:grid-cols-2 gap-12 p-10 md:p-16 lg:p-20 items-center">
              <div>
                <h2 className="text-3xl md:text-4xl font-extrabold text-on-primary mb-6 [font-family:var(--font-headline)]">
                  学习成果与证明
                </h2>
                <p className="text-on-primary-container text-lg mb-8 leading-relaxed">
                  按规定完成学习与考核后，可申请由工委会相关合作机制颁发的学习证明或认证路径指引（以当期规则为准）。
                </p>
                <ul className="space-y-4 mb-10 text-on-primary">
                  <li className="flex items-center gap-3">
                    <span
                      className="material-symbols-outlined text-on-tertiary-container"
                      style={{ fontVariationSettings: "'FILL' 1" }}
                    >
                      verified
                    </span>
                    <span>可核验的学习记录与成绩说明</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <span
                      className="material-symbols-outlined text-on-tertiary-container"
                      style={{ fontVariationSettings: "'FILL' 1" }}
                    >
                      verified
                    </span>
                    <span>适用于职业发展与岗位能力说明材料</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <span
                      className="material-symbols-outlined text-on-tertiary-container"
                      style={{ fontVariationSettings: "'FILL' 1" }}
                    >
                      verified
                    </span>
                    <span>可持续关注进阶课与认证体系更新</span>
                  </li>
                </ul>
                <Link
                  className="inline-flex bg-secondary text-on-secondary font-bold px-10 py-4 rounded-xl shadow-2xl hover:opacity-95 transition-opacity [font-family:var(--font-headline)]"
                  href="/certificates"
                >
                  了解认证体系
                </Link>
              </div>
              <div className="flex justify-center">
                <div className="relative w-full max-w-sm aspect-[3/4] bg-white/5 backdrop-blur-md rounded-2xl border border-white/20 p-4 shadow-2xl rotate-3 flex items-center justify-center">
                  <div className="text-center text-on-primary-container/80 text-sm px-4">
                    <span className="material-symbols-outlined text-5xl mb-3 block text-on-tertiary-container/90">
                      workspace_premium
                    </span>
                    证书样式与发放规则以当期通知为准
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 学员与专家评价（静态文案，与参考页层次一致） */}
        <section className="py-16 md:py-24 px-6 md:px-8 bg-surface">
          <div className="max-w-screen-2xl mx-auto">
            <h2 className="text-3xl font-bold text-primary mb-12 text-center [font-family:var(--font-headline)]">
              学员与产业反馈
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="bg-surface-container-lowest p-10 rounded-[2rem] shadow-[0_8px_30px_rgb(0,0,0,0.04)] relative border border-outline-variant/10">
                <span className="material-symbols-outlined text-secondary-fixed-dim text-6xl absolute top-8 right-10 opacity-20">
                  format_quote
                </span>
                <p className="text-on-surface-variant text-lg italic leading-relaxed mb-8 relative z-10">
                  「课程把概念、工具与落地节奏串在一起，团队里不同背景的人都能在同一套语言下协作推进。」
                </p>
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 rounded-full bg-surface-container-high shrink-0" />
                  <div>
                    <h5 className="font-bold text-primary [font-family:var(--font-headline)]">匿名学员</h5>
                    <p className="text-sm text-on-surface-variant">制造业 · 数字化负责人</p>
                  </div>
                </div>
              </div>
              <div className="bg-surface-container-lowest p-10 rounded-[2rem] shadow-[0_8px_30px_rgb(0,0,0,0.04)] relative border border-outline-variant/10">
                <span className="material-symbols-outlined text-secondary-fixed-dim text-6xl absolute top-8 right-10 opacity-20">
                  format_quote
                </span>
                <p className="text-on-surface-variant text-lg italic leading-relaxed mb-8 relative z-10">
                  「伦理与治理部分讲得很克制但够用，帮助我们在上线前把风险清单和流程对齐。」
                </p>
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 rounded-full bg-surface-container-high shrink-0" />
                  <div>
                    <h5 className="font-bold text-primary [font-family:var(--font-headline)]">匿名学员</h5>
                    <p className="text-sm text-on-surface-variant">医疗信息化 · 产品负责人</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </SiteShell>
  );
}
