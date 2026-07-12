"use client";

import { AlertCircle, CheckCircle2, Loader2 } from "lucide-react";
import type { Toast } from "@/hooks/useToast";

interface ToastStackProps {
  toasts: Toast[];
}

export default function ToastStack({ toasts }: ToastStackProps) {
  if (toasts.length === 0) return null;

  return (
    <div className="fixed bottom-4 right-4 left-4 z-[999] flex flex-col items-end gap-2 pointer-events-none sm:left-auto sm:right-5 sm:bottom-5">
      {toasts.map((t) => (
        <div
          key={t.id}
          className={`pointer-events-auto flex w-full items-center gap-2 rounded-xl px-4 py-3 text-sm font-medium text-white shadow-lg sm:w-auto sm:max-w-sm ${
            t.type === "success" ? "bg-emerald-600" : t.type === "error" ? "bg-red-600" : "bg-stone-700"
          }`}
        >
          {t.type === "success" && <CheckCircle2 size={15} className="shrink-0" />}
          {t.type === "error" && <AlertCircle size={15} className="shrink-0" />}
          {t.type === "loading" && <Loader2 size={15} className="shrink-0 animate-spin" />}
          <span className="truncate">{t.message}</span>
        </div>
      ))}
    </div>
  );
}
