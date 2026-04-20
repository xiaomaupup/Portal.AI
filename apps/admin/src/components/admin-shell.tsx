"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { PropsWithChildren } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

const nav = [
  { href: "/", label: "概览" },
  { href: "/posts", label: "资讯管理" },
  { href: "/courses", label: "课程管理" },
];

function resolvePageTitle(pathname: string) {
  if (pathname === "/") return "概览";
  if (pathname.startsWith("/posts")) return "资讯管理";
  if (pathname.startsWith("/courses")) return "课程管理";
  if (pathname.startsWith("/login")) return "登录";
  return "管理后台";
}

export function AdminShell({ children }: PropsWithChildren) {
  const pathname = usePathname();
  const router = useRouter();
  const pageTitle = resolvePageTitle(pathname ?? "/");

  const isLogin = pathname === "/login";
  if (isLogin) return <>{children}</>;

  return (
    <div className="min-h-screen bg-slate-50">
      <aside className="fixed left-0 top-0 h-full w-60 border-r bg-white p-4">
        <div className="flex items-center gap-2">
          <div className="text-lg font-bold tracking-tight">Portal CMS</div>
          <Badge variant="secondary">v1</Badge>
        </div>
        <div className="mt-1 text-xs text-slate-500">shadcn + Radix</div>
        <nav className="mt-6 space-y-1">
          {nav.map((item) => {
            const active =
              item.href === "/"
                ? pathname === "/"
                : pathname === item.href || pathname?.startsWith(`${item.href}/`);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`block rounded-md px-3 py-2 text-sm font-medium transition ${
                  active
                    ? "bg-slate-900 text-white"
                    : "text-slate-700 hover:bg-slate-100"
                }`}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>
      </aside>

      <div className="ml-60">
        <header className="sticky top-0 z-30 border-b bg-white/90 backdrop-blur">
          <div className="flex h-14 items-center justify-between px-4">
            <div className="text-sm font-semibold text-slate-900">{pageTitle}</div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                localStorage.removeItem("admin_token");
                localStorage.removeItem("admin_user");
                router.push("/login");
              }}
            >
              退出登录
            </Button>
          </div>
        </header>
        <main className="p-4">{children}</main>
      </div>
    </div>
  );
}

