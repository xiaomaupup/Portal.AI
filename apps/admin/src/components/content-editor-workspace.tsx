"use client";

import { ReactNode } from "react";

type WorkspaceProps = {
  title: string;
  subtitle?: string;
  statusLabel?: string;
  actions?: ReactNode;
  main: ReactNode;
  sidebar?: ReactNode;
};

export function ContentEditorWorkspace({
  title,
  subtitle,
  statusLabel,
  actions,
  main,
  sidebar,
}: WorkspaceProps) {
  return (
    <>
      <div className="sticky top-0 z-20 border-b border-border/60 bg-background/95 backdrop-blur">
        <div className="flex items-center justify-between px-6 py-4">
          <div className="flex items-center gap-4">
            <div>
              <div className="text-lg font-semibold tracking-tight text-zinc-900">{title}</div>
              {subtitle ? <div className="mt-1 text-sm text-muted-foreground">{subtitle}</div> : null}
            </div>
            {statusLabel ? (
              <>
                <div className="hidden h-4 w-px bg-border/60 md:block" />
                <span className="hidden rounded-full bg-slate-100 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-600 md:inline-flex">
                  {statusLabel}
                </span>
              </>
            ) : null}
          </div>
          {actions ? <div className="flex items-center gap-2">{actions}</div> : null}
        </div>
      </div>

      <div className="px-6 py-6">
        <div className={sidebar ? "grid gap-8 xl:grid-cols-[minmax(0,1fr)_320px]" : "grid gap-8"}>
          <div className="space-y-6">{main}</div>
          {sidebar ? <div className="space-y-6">{sidebar}</div> : null}
        </div>
      </div>
    </>
  );
}

export function EditorSection({
  title,
  description,
  children,
}: {
  title: string;
  description?: string;
  children: ReactNode;
}) {
  return (
    <div className="overflow-hidden rounded-2xl border border-border/60 bg-white shadow-sm">
      <div className="border-b border-border/60 bg-slate-50 px-5 py-4">
        <div className="text-sm font-semibold text-slate-900">{title}</div>
        {description ? (
          <div className="mt-1 text-xs leading-5 text-slate-500">{description}</div>
        ) : null}
      </div>
      <div className="p-5">{children}</div>
    </div>
  );
}

export function EditorSidebarCard({
  title,
  children,
  accessory,
}: {
  title: string;
  children: ReactNode;
  accessory?: ReactNode;
}) {
  return (
    <div className="rounded-2xl border border-border/60 bg-slate-50 p-6">
      <div className="mb-4 flex items-center justify-between">
        <h3 className="text-sm font-semibold text-slate-900">{title}</h3>
        {accessory}
      </div>
      {children}
    </div>
  );
}
