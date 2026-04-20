import Link from "next/link";
import { NavLinks } from "./NavLinks";

export function SiteHeader() {
  return (
    <header className="fixed top-0 w-full z-50 bg-slate-50/60 backdrop-blur-md shadow-[0_12px_40px_rgba(0,30,64,0.08)]">
      <nav className="flex justify-between items-center w-full px-8 py-4 max-w-screen-2xl mx-auto">
        <Link
          href="/"
          className="text-xl font-bold text-blue-900 tracking-tighter [font-family:var(--font-headline)]"
        >
          模速空间创业加速器发展协会
        </Link>

        <NavLinks />

        <div className="flex items-center gap-4">
          <Link
            href="/courses"
            className="bg-primary-container text-white px-6 py-2.5 rounded-xl font-semibold text-sm hover:translate-y-[-1px] transition-transform shadow-lg"
          >
            立即加入
          </Link>
        </div>
      </nav>
    </header>
  );
}

