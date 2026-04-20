import Link from "next/link";
import Image from "next/image";
import { SiteShell } from "@/components/site/SiteShell";

export const metadata = {
  title: "职业认证",
  description:
    "官方 AI 能力证书查询、认证体系介绍与资源对接。连接认证人才与产业协作生态。",
};

const imgs = {
  cert1:
    "https://lh3.googleusercontent.com/aida-public/AB6AXuA7x4Wu9RpQdvVSnrpNBPh5XcbIB9LBiacTXxzXYtXELlgT5-D9Ir8sLo2XEI1tbVNp6CbUoq5mbCqt2bn0su9sGkm7UXvKJnjcw2-fp6gTcNrz2ppNxHn-_HjHszm6FDmguiwZjWr55X0MECacXA8MAtkv5xmLXaA4vXnm15e5rk7V7rtMGMrx0t-PSVyQm62EV_1m0-whAWnvIwHWgHmpVkgpAniOFHEKGmyMEMZaT0BBLHdHP6yuq3LqHw_pDcHmWWTuZezTKoH3",
  cert2:
    "https://lh3.googleusercontent.com/aida-public/AB6AXuDHCF7jMm3ySbL_oBOCLBFCInFAOeORNUVYVhn1q8BRJnO2wLkGJksZN3EjMDt9wFuE91E28vyVYYmJnYg_kwk5NEc1Fy1p4tl3o67WVejkMNFTnkKX4-Ed6lQqRhVu7MacXQZKoYqYjtOpjGCODUfPB0clpBbhw4clGYkXnnHSgUsMze4szoKxZDC1G0-QLUu61pbGLxmTM0FrStBQeK7hsdcf6WZhA5fJHoqcMUoWnvrjpnK8toGmHQ2qZS94PYlk1B1XWJsVaQ5g",
  cert3:
    "https://lh3.googleusercontent.com/aida-public/AB6AXuBtqCOrY8B-ZTtM5R9Re79j4BaVwlOsJ3NTJYgn0lmtWqZ4o5uTnj6NLQdST8bXcKdtXjikTMU63LwaY-gHSelG-jG7-aUfLqIL6SHU0kjOuBwY58GayWKvsEoneBLsUlnWe_rasbhoXANtaV75zqdEBJHRSpgVxJCHpcSoq5J9bTaqPyv8uRM5IqDHrRvas5TQZ7EOgv8E0Dmwj5wRzfuQOobzy0R-8graPlZXBtndULlAJJ4TVvIRJdUtBGQTaPYjKa-vmOWayRTs",
  ctaBg:
    "https://lh3.googleusercontent.com/aida-public/AB6AXuByBizdf9n1-BPCtIOrZN-oo7uCKPip3yCT4ojbIwAtcRrfPw7C9PjOpDoRhJS7NlWTjMQNx9uVFcGjv5yFTibZr-dFK1JId_OM1GRCXB6DqXKtVuEvL_e5GtMgDmcnb8VJ5tui3aAuAc-JadYLYpjwWf_UjmjEh08u-VZXdnSUTAP6bkuBUGOp4_Rycy_lhBSzFEOhRgOUVVHgDK7HBfB-VJ2giTRrMpEifQ6Ti7GTHutrF4mlu8bvSEiQLaI24tMkkpzE4JbN-8DI",
  collab1:
    "https://lh3.googleusercontent.com/aida-public/AB6AXuCtDCKeVlH-OOoO3MTeWkYPWRLKHIcGG_-Bd-cpc5GZ0F6VS07F2NLXY9mSywsUZEnAr2V3sp1rhZWpExs1xqHVgZab_Sp3fJrph4Wr9Gq3ZtYBm84IbpicBHxQW9OuEnb71iBsaD-iYyqbrxz7JNVbtZUGpGDOzeuh0s6CjHB9dKFOt6qhijbg9-cxoiHetWVPCNsFm84PhHaLuOBW9Viio-TreidfjZrBgKmRJVydjZbMC3_AkfZp_bWEbHRZ86we_y8ZHXw2gsrM",
  collab2:
    "https://lh3.googleusercontent.com/aida-public/AB6AXuATt-5iboXuaTNXe8HXduhWjpPRKsY-eYlocxMHYLJbTEs95GRggNR6SRj4fBNlOBWKXIB-E84Ksd_YA7bvemXbiouSGSHG7UQtaUZJsxLR940QxAlithgQuTNnQt04Zj0_Fl6-gTBnK1AeqfSWU7E0VXTQMNvh8ggaoOYqbC_G8hyjXkfQhnoXEhp0lRQGgkbt0SzQaDuJOt4XuZa9JgWyvuz5HPvSCHmrH44UcABUO7pZpZYxscY21wYa4eyd74LqDcwnTZ7P3qi",
};

export default function CertificatesPage() {
  return (
    <SiteShell>
      <div className="bg-surface text-on-surface selection:bg-secondary-fixed selection:text-[color:var(--on-secondary-fixed)]">
        {/* Hero */}
        <header className="pt-28 pb-16 md:pb-20 px-6 md:px-8 max-w-screen-2xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-end">
            <div className="lg:col-span-8">
              <span className="text-on-tertiary-container bg-secondary-fixed px-3 py-1 rounded-full font-bold uppercase tracking-widest text-xs mb-6 inline-block">
                官方标准
              </span>
              <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold leading-[1.1] text-primary tracking-tight mb-8 [font-family:var(--font-headline)]">
                通过职业认证 <br />
                提升 AI 专业水平
              </h1>
              <p className="text-xl text-on-surface-variant max-w-2xl leading-relaxed">
                连接认证人才与领先的 AI 解决方案。服务个人成长与企业协作，构建双向赋能的专业生态。
              </p>
            </div>
            <div className="lg:col-span-4 flex justify-start lg:justify-end">
              <div className="flex flex-col gap-4">
                <div className="flex items-center gap-3">
                  <span className="material-symbols-outlined text-secondary-container text-2xl">verified</span>
                  <span className="font-bold text-primary [font-family:var(--font-headline)]">
                    12,400+ 已认证专业人才
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="material-symbols-outlined text-secondary-container text-2xl">hub</span>
                  <span className="font-bold text-primary [font-family:var(--font-headline)]">500+ 会员企业</span>
                </div>
              </div>
            </div>
          </div>
        </header>

        <main className="space-y-24 md:space-y-32 pb-24 md:pb-32">
          {/* 证书查询 + 横向证书卡 */}
          <section className="bg-surface-container-low py-16 md:py-24">
            <div className="max-w-screen-2xl mx-auto px-6 md:px-8">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
                <div>
                  <h2 className="text-3xl font-bold text-primary mb-6 [font-family:var(--font-headline)]">
                    官方 AI 能力证书查询
                  </h2>
                  <p className="text-on-surface-variant mb-10 text-lg leading-relaxed">
                    验证由工委会体系颁发的 AI 专业能力证书的真实性。请通过下方安全入口进行即时核验（展示页，查询能力后续接入）。
                  </p>
                  <div className="bg-surface-container-lowest p-8 rounded-xl shadow-[0_12px_40px_rgba(0,30,64,0.08)]">
                    <div className="space-y-6">
                      <div>
                        <label className="block text-sm font-bold text-primary mb-2" htmlFor="cert-no">
                          输入证书编号
                        </label>
                        <input
                          id="cert-no"
                          readOnly
                          className="w-full bg-surface-container-highest border-none rounded-md px-4 py-3 outline-none ring-2 ring-transparent focus:ring-secondary-fixed transition-all cursor-default"
                          placeholder="例如: CACEE-2024-AI-00123"
                          type="text"
                          defaultValue=""
                        />
                      </div>
                      <button
                        type="button"
                        className="w-full bg-primary-container text-on-primary py-4 rounded-md font-bold text-lg hover:shadow-xl transition-all hover:translate-y-[-2px] flex items-center justify-center gap-2 [font-family:var(--font-headline)]"
                      >
                        <span className="material-symbols-outlined">search</span>
                        验证证书
                      </button>
                    </div>
                  </div>
                </div>
                <div className="relative min-w-0">
                  <div className="flex overflow-x-auto gap-6 pb-8 snap-x snap-mandatory [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
                    {[
                      {
                        img: imgs.cert1,
                        imgAlt: "AI 通识基础认证证书样张",
                        imgClass: "object-cover object-center",
                        tone: "certificate" as const,
                        icon: "school",
                        top: "AI 通识基础",
                        title: "AI 通识基础认证",
                        desc: "涵盖人工智能基础原理及提示词工程基础应用。",
                        bg: "bg-slate-100",
                      },
                      {
                        img: imgs.cert2,
                        imgAlt: "AI 专业应用认证证书与研修场景",
                        imgClass: "object-cover object-center",
                        tone: "certificate" as const,
                        icon: "workspace_premium",
                        iconClass: "text-secondary",
                        top: "AI 专业应用",
                        title: "AI 专业应用认证",
                        desc: "针对特定行业的 AI 工作流及模型微调应用能力。",
                        bg: "bg-primary-container/10",
                      },
                      {
                        img: imgs.cert3,
                        imgAlt: "",
                        imgClass: "object-cover opacity-30",
                        tone: "abstract" as const,
                        icon: "star",
                        iconFill: true,
                        topClass: "text-on-primary",
                        top: "高级 AI 专家",
                        title: "高级 AI 架构师认证",
                        desc: "专注系统设计架构及 AI 伦理治理协议。",
                        bg: "bg-slate-900",
                        iconColor: "text-on-primary",
                      },
                    ].map((c) => (
                      <div
                        key={c.title}
                        className="flex-shrink-0 w-80 snap-center bg-white p-6 rounded-xl border border-outline-variant/15 shadow-sm"
                      >
                        <div
                          className={
                            c.tone === "certificate"
                              ? `h-52 rounded-lg mb-4 ${c.bg} relative overflow-hidden ring-1 ring-black/[0.06]`
                              : `h-52 rounded-lg mb-4 ${c.bg} relative flex items-center justify-center overflow-hidden ring-1 ring-black/[0.06]`
                          }
                        >
                          <Image
                            src={c.img}
                            alt={c.imgAlt}
                            fill
                            className={
                              c.tone === "certificate"
                                ? `${c.imgClass} opacity-100`
                                : `${c.imgClass}`
                            }
                            sizes="320px"
                            priority={c.tone === "certificate"}
                          />
                          {c.tone === "certificate" ? (
                            <>
                              <div className="absolute inset-0 bg-gradient-to-t from-white/92 via-white/20 to-transparent pointer-events-none" />
                              <div className="absolute bottom-0 left-0 right-0 z-10 px-2 pb-3 text-center">
                                <span
                                  className={`material-symbols-outlined text-4xl drop-shadow-sm ${c.iconClass ?? "text-primary"}`}
                                >
                                  {c.icon}
                                </span>
                                <p className="font-bold mt-1 text-sm [font-family:var(--font-headline)] text-primary drop-shadow-sm">
                                  {c.top}
                                </p>
                              </div>
                            </>
                          ) : (
                            <div className="relative z-10 text-center px-2">
                              <span
                                className={`material-symbols-outlined text-4xl ${c.iconColor ?? "text-primary"}`}
                                style={
                                  c.iconFill
                                    ? { fontVariationSettings: "'FILL' 1" }
                                    : undefined
                                }
                              >
                                {c.icon}
                              </span>
                              <p
                                className={`font-bold mt-2 [font-family:var(--font-headline)] ${c.topClass ?? "text-primary"}`}
                              >
                                {c.top}
                              </p>
                            </div>
                          )}
                        </div>
                        <h3 className="font-bold text-primary [font-family:var(--font-headline)]">{c.title}</h3>
                        <p className="text-sm text-on-surface-variant mt-2 leading-relaxed">{c.desc}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* 资源对接桥 */}
          <section className="max-w-screen-2xl mx-auto px-6 md:px-8">
            <div className="flex flex-col md:flex-row justify-between items-end mb-12 md:mb-16 gap-6">
              <div className="max-w-xl">
                <h2 className="text-3xl md:text-4xl font-extrabold text-primary mb-4 [font-family:var(--font-headline)]">
                  资源对接桥
                </h2>
                <p className="text-on-surface-variant text-lg leading-relaxed">
                  旨在连接 AI 创新者与组织需求的优质对接平台，促进高效协作。
                </p>
              </div>
              <div className="bg-surface-container-high p-4 rounded-xl flex gap-8 shrink-0">
                <div className="text-center">
                  <p className="text-2xl font-bold text-primary">240+</p>
                  <p className="text-xs uppercase tracking-widest font-bold text-outline">开放标讯</p>
                </div>
                <div className="text-center border-l border-outline-variant/30 pl-8">
                  <p className="text-2xl font-bold text-primary">50+</p>
                  <p className="text-xs uppercase tracking-widest font-bold text-outline">核心成员单位</p>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
              <div className="lg:col-span-7 space-y-6">
                <div className="flex flex-wrap items-center justify-between gap-4">
                  <h3 className="text-xl font-bold text-primary flex items-center gap-2 [font-family:var(--font-headline)]">
                    <span className="material-symbols-outlined text-secondary">business</span>
                    AI 企业解决方案
                  </h3>
                  <button
                    type="button"
                    className="text-secondary font-bold text-sm hover:underline"
                  >
                    查看所有合作伙伴
                  </button>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {[
                    {
                      icon: "description",
                      tag: "文本智能",
                      name: "达观数据",
                      desc: "领先的智能文本处理及机器人流程自动化 (RPA) 服务商。",
                    },
                    {
                      icon: "security",
                      tag: "AI 安全",
                      name: "安般科技",
                      desc: "专注于大语言模型对抗性防御与鲁棒性安全框架的开拓者。",
                    },
                    {
                      icon: "biotech",
                      tag: "医疗 AI",
                      name: "智医",
                      desc: "临床诊断辅助支持及医学影像加速诊断平台。",
                    },
                    {
                      icon: "precision_manufacturing",
                      tag: "智能工业",
                      name: "纽带智造",
                      desc: "基于物联网的预测性维护与供应链优化解决方案。",
                    },
                  ].map((x) => (
                    <div
                      key={x.name}
                      className="group bg-white p-6 rounded-xl hover:bg-surface-bright transition-all cursor-default shadow-sm hover:shadow-md border border-outline-variant/10"
                    >
                      <div className="flex justify-between items-start mb-4">
                        <div className="w-12 h-12 rounded bg-slate-100 flex items-center justify-center">
                          <span className="material-symbols-outlined text-primary">{x.icon}</span>
                        </div>
                        <span className="bg-on-tertiary-container/10 text-on-tertiary-container px-2 py-1 rounded text-[10px] font-bold uppercase">
                          {x.tag}
                        </span>
                      </div>
                      <h4 className="font-bold text-primary text-lg [font-family:var(--font-headline)]">{x.name}</h4>
                      <p className="text-sm text-on-surface-variant mt-2 leading-relaxed">{x.desc}</p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="lg:col-span-5 space-y-6">
                <h3 className="text-xl font-bold text-primary flex items-center gap-2 [font-family:var(--font-headline)]">
                  <span className="material-symbols-outlined text-secondary">campaign</span>
                  会员需求
                </h3>
                <div className="space-y-4">
                  {[
                    {
                      type: "培训需求",
                      time: "2小时前",
                      org: "某国企能源集团",
                      text: "寻求针对50余名高级工程师的“AI赋能能源网架管理”深度实地培训。",
                    },
                    {
                      type: "技术招标",
                      time: "5小时前",
                      org: "某地区总医院",
                      text: "拟部署符合合规要求的大模型，用于自动化预检分诊及病历摘要。",
                    },
                    {
                      type: "政策咨询",
                      time: "1天前",
                      org: "某市数智局",
                      text: "寻求有关地方 AI 治理框架及伦理准则制定的专家咨询服务。",
                    },
                  ].map((n) => (
                    <div
                      key={n.org + n.type}
                      className="bg-surface-container-low p-6 rounded-xl border-l-4 border-secondary shadow-sm"
                    >
                      <div className="flex justify-between mb-2 gap-2">
                        <span className="text-[10px] font-extrabold uppercase tracking-widest text-secondary">
                          {n.type}
                        </span>
                        <span className="text-xs text-on-surface-variant shrink-0">{n.time}</span>
                      </div>
                      <h4 className="font-bold text-primary mb-2 [font-family:var(--font-headline)]">{n.org}</h4>
                      <p className="text-sm text-on-surface-variant leading-relaxed">{n.text}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="mt-16 md:mt-20 relative rounded-3xl overflow-hidden p-10 md:p-12 text-on-primary bg-primary">
              <div className="absolute inset-0 z-0">
                <Image
                  src={imgs.ctaBg}
                  alt=""
                  fill
                  className="object-cover opacity-20"
                  sizes="100vw"
                />
              </div>
              <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-8">
                <div className="max-w-2xl">
                  <h2 className="text-2xl md:text-3xl font-extrabold mb-4 [font-family:var(--font-headline)]">
                    准备好对接了吗？
                  </h2>
                  <p className="text-on-primary-container text-lg leading-relaxed">
                    我们的「智能匹配」机制通过分析企业能力与组织需求，促进最具影响力的深度合作（展示说明）。
                  </p>
                </div>
                <button
                  type="button"
                  className="whitespace-nowrap bg-secondary-container hover:bg-secondary text-on-secondary px-10 py-5 rounded-xl font-bold text-xl shadow-2xl transition-all hover:scale-105 active:scale-95 [font-family:var(--font-headline)]"
                >
                  注册您的需求
                </button>
              </div>
            </div>
          </section>

          {/* 底部配图 */}
          <section className="max-w-screen-2xl mx-auto px-6 md:px-8 pb-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="h-64 rounded-3xl overflow-hidden shadow-lg relative">
                <Image
                  src={imgs.collab1}
                  alt="工业 AI 集成"
                  fill
                  className="object-cover"
                  sizes="(max-width:768px) 100vw, 50vw"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-primary/80 to-transparent flex items-end p-8">
                  <p className="font-bold text-on-primary text-xl [font-family:var(--font-headline)]">工业 AI 集成</p>
                </div>
              </div>
              <div className="h-64 rounded-3xl overflow-hidden shadow-lg relative">
                <Image
                  src={imgs.collab2}
                  alt="研发协同中心"
                  fill
                  className="object-cover"
                  sizes="(max-width:768px) 100vw, 50vw"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-primary/80 to-transparent flex items-end p-8">
                  <p className="font-bold text-on-primary text-xl [font-family:var(--font-headline)]">研发协同中心</p>
                </div>
              </div>
            </div>
          </section>
        </main>

        <div className="max-w-screen-2xl mx-auto px-6 md:px-8 pb-12 text-center">
          <Link href="/courses" className="text-secondary font-semibold hover:underline">
            ← 返回课程中心
          </Link>
        </div>
      </div>
    </SiteShell>
  );
}
