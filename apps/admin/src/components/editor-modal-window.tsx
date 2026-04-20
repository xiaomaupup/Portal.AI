"use client";

import { ReactNode } from "react";
import { X } from "lucide-react";

type EditorModalWindowProps = {
  open: boolean;
  onClose: () => void;
  children: ReactNode;
};

export function EditorModalWindow({
  open,
  onClose,
  children,
}: EditorModalWindowProps) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-40 bg-black/20 backdrop-blur-[2px]">
      <div className="mx-auto mt-8 flex h-[calc(100vh-4rem)] w-[min(1280px,calc(100vw-3rem))] flex-col overflow-hidden rounded-3xl border border-border/60 bg-background shadow-2xl">
        <div className="flex justify-end border-b border-border/50 px-4 py-3">
          <button
            type="button"
            onClick={onClose}
            className="inline-flex h-9 w-9 items-center justify-center rounded-full text-slate-500 transition hover:bg-slate-100 hover:text-slate-900"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
        <div className="min-h-0 flex-1 overflow-hidden">{children}</div>
      </div>
    </div>
  );
}
