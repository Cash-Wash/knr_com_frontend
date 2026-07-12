"use client";

import Link from "next/link";
import { ExternalLink, Menu, PanelLeftClose, PanelLeftOpen } from "lucide-react";

interface NavbarProps {
  onMenuClick: () => void;
  isCollapsed?: boolean;
  toggleCollapse?: () => void;
}

export default function AdminNavbar({
  onMenuClick,
  isCollapsed = false,
  toggleCollapse,
}: NavbarProps) {
  return (
    <header className="sticky top-0 z-20 flex h-16 items-center justify-between gap-3 border-b border-stone-200 bg-white/90 px-4 backdrop-blur sm:px-5 md:px-6">
      <div className="flex min-w-0 items-center gap-2 sm:gap-3">
        <button
          type="button"
          onClick={onMenuClick}
          className="inline-flex shrink-0 rounded-lg p-2 text-stone-600 transition-colors hover:bg-stone-100 hover:text-stone-900 lg:hidden"
          aria-label="Ouvrir le menu"
        >
          <Menu size={22} />
        </button>

        {toggleCollapse && (
          <button
            type="button"
            onClick={toggleCollapse}
            className="hidden shrink-0 rounded-lg p-2 text-stone-500 transition-colors hover:bg-stone-100 hover:text-stone-900 lg:inline-flex"
            aria-label={isCollapsed ? "Étendre la sidebar" : "Réduire la sidebar"}
          >
            {isCollapsed ? <PanelLeftOpen size={18} /> : <PanelLeftClose size={18} />}
          </button>
        )}

        <div className="min-w-0">
          <p className="truncate text-sm font-semibold text-stone-900">Espace administration</p>
          <p className="hidden truncate text-xs text-stone-500 sm:block">KNR COM & Digital</p>
        </div>
      </div>

      <Link
        href="/"
        target="_blank"
        className="inline-flex shrink-0 items-center gap-1.5 text-sm font-semibold text-sky-500 transition-colors hover:text-sky-600"
        aria-label="Voir le site en direct"
      >
        <span className="hidden sm:inline">Voir le site en direct</span>
        <ExternalLink size={18} className="sm:hidden" />
      </Link>
    </header>
  );
}