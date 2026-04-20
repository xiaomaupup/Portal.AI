"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

type NavItem = { href: string; label: string };

const nav: NavItem[] = [
  { href: "/", label: "首页" },
  { href: "/courses", label: "课程中心" },
  { href: "/news", label: "新闻资讯" },
  { href: "/certificates", label: "职业认证" },
];

export function NavLinks() {
  const pathname = usePathname() ?? "/";

  return (
    <div className="hidden md:flex space-x-8 items-center font-semibold tracking-tight [font-family:var(--font-headline)]">
      {nav.map((item) => {
        const active =
          item.href === "/"
            ? pathname === "/"
            : pathname === item.href || pathname.startsWith(`${item.href}/`);

        return (
          <Link
            key={item.href}
            href={item.href}
            className={
              active
                ? "text-blue-700 border-b-2 border-blue-700 pb-1 transition-all duration-300"
                : "text-slate-600 hover:text-blue-900 transition-all duration-300"
            }
          >
            {item.label}
          </Link>
        );
      })}
    </div>
  );
}

