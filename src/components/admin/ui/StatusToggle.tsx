"use client";

import { Eye, EyeOff, Loader2 } from "lucide-react";

interface StatusToggleProps {
  status: "published" | "draft";
  onToggle: () => void;
  loading?: boolean;
}

export default function StatusToggle({ status, onToggle, loading }: StatusToggleProps) {
  const published = status === "published";
  return (
    <button
      type="button"
      onClick={onToggle}
      disabled={loading}
      className="inline-flex items-center gap-2 rounded-lg px-2.5 py-1.5 text-xs font-semibold transition-all disabled:opacity-60"
      style={{
        background: published ? "#f0fdf4" : "#f9fafb",
        border: `1.5px solid ${published ? "#bbf7d0" : "#e5e7eb"}`,
        color: published ? "#15803d" : "#9ca3af",
      }}
    >
      {loading ? (
        <Loader2 size={12} className="animate-spin" />
      ) : published ? (
        <Eye size={12} />
      ) : (
        <EyeOff size={12} />
      )}
      <span className="hidden sm:inline">{published ? "Publié" : "Brouillon"}</span>
      <span
        className="relative inline-flex h-4 w-7 shrink-0 rounded-full transition-colors duration-200"
        style={{ background: published ? "#0ea5e9" : "#d1d5db" }}
      >
        <span
          className="absolute top-0.5 h-3 w-3 rounded-full bg-white shadow-sm transition-transform duration-200"
          style={{ left: published ? "14px" : "2px" }}
        />
      </span>
    </button>
  );
}
