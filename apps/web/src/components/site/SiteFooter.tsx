import Link from "next/link";

export function SiteFooter() {
  return (
    <footer className="w-full mt-20 bg-slate-100 border-t border-outline-variant/10">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-12 px-12 py-16 max-w-screen-2xl mx-auto">
        <div className="col-span-1 md:col-span-2 space-y-6">
          <div className="font-bold text-2xl text-blue-900 [font-family:var(--font-headline)]">
            模速空间创业加速器发展协会
          </div>
          <p className="text-sm leading-relaxed text-slate-500 max-w-md">
            聚焦创业孵化与加速器服务，链接空间、资本与产业资源，陪伴团队从 0 到 1 成长。
          </p>
          <div className="flex gap-4">
            <div className="w-10 h-10 rounded-full bg-slate-200 flex items-center justify-center text-slate-600 cursor-pointer hover:bg-secondary-container hover:text-white transition-all">
              <span className="material-symbols-outlined text-sm">language</span>
            </div>
            <div className="w-10 h-10 rounded-full bg-slate-200 flex items-center justify-center text-slate-600 cursor-pointer hover:bg-secondary-container hover:text-white transition-all">
              <span className="material-symbols-outlined text-sm">
                chat_bubble
              </span>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <h4 className="font-bold text-blue-900">快速链接</h4>
          <ul className="space-y-3 text-sm">
            <li>
              <Link
                className="text-slate-500 hover:text-blue-600 underline decoration-2 underline-offset-4 transition-colors"
                href="/courses"
              >
                课程中心
              </Link>
            </li>
            <li>
              <Link
                className="text-slate-500 hover:text-blue-600 underline decoration-2 underline-offset-4 transition-colors"
                href="/news"
              >
                新闻资讯
              </Link>
            </li>
            <li>
              <Link
                className="text-slate-500 hover:text-blue-600 underline decoration-2 underline-offset-4 transition-colors"
                href="/certificates"
              >
                职业认证
              </Link>
            </li>
            <li>
              <span className="text-slate-500">联系我们（待完善）</span>
            </li>
          </ul>
        </div>

        <div className="space-y-6">
          <h4 className="font-bold text-blue-900">法律与透明度</h4>
          <ul className="space-y-3 text-sm">
            <li>
              <span className="text-slate-500">隐私政策（待完善）</span>
            </li>
            <li>
              <span className="text-slate-500">服务条款（待完善）</span>
            </li>
            <li>
              <span className="text-slate-500">组织架构（待接入）</span>
            </li>
            <li>
              <span className="text-slate-500">协会标识（待接入）</span>
            </li>
          </ul>
        </div>
      </div>

      <div className="px-12 py-8 max-w-screen-2xl mx-auto border-t border-outline-variant/10">
        <p className="text-xs text-slate-400 text-center">
          版权所有 © 2024 模速空间创业加速器发展协会。京ICP备XXXXXXXX号
        </p>
      </div>
    </footer>
  );
}

