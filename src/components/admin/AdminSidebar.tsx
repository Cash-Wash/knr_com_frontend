"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  FileText,
  LayoutDashboard,
  LogOut,
  MessageSquare,
  Settings,
  Users,
  Video,
  X,
  Tv2,
  GraduationCap,
  Camera,
  Mic,
} from "lucide-react";

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
  isCollapsed?: boolean;
  toggleCollapse?: () => void;
}

const navItems = [
  { label: "Vue d'ensemble",     icon: LayoutDashboard, href: "/admin",              match: ["/admin"] },
  { label: "Articles & Blog",    icon: FileText,         href: "/admin/blog",         match: ["/admin/blog"] },
  { label: "Émissions Web TV",   icon: Tv2,              href: "/admin/emissions",    match: ["/admin/emissions"] },
  { label: "Formations",         icon: GraduationCap,    href: "/admin/formations",   match: ["/admin/formations"] },
  { label: "Location Équipements",icon: Camera,          href: "/admin/location",     match: ["/admin/location"] },
  { label: "Studio Podcast",     icon: Mic,              href: "/admin/studio",       match: ["/admin/studio"] },
  { label: "Notre Équipe",       icon: Users,            href: "/admin/equipe",       match: ["/admin/equipe"] },
  { label: "Émissions Vidéo",    icon: Video,            href: "/admin/webtv",        match: ["/admin/webtv"] },
  { label: "Messages Contact",   icon: MessageSquare,    href: "/admin/messages",     match: ["/admin/messages"], badge: "4" },
  { label: "Paramètres",         icon: Settings,         href: "/admin/parametres",   match: ["/admin/parametres"] },
];

export default function AdminSidebar({
  isOpen,
  onClose,
  isCollapsed = false,
}: SidebarProps) {
  const pathname = usePathname();

  return (
    <>
      {isOpen && (
        <button
          type="button"
          className="fixed inset-0 z-30 bg-black/40 backdrop-blur-sm lg:hidden"
          onClick={onClose}
          aria-label="Fermer le menu"
        />
      )}

      <aside
        className={[
          "fixed top-0 left-0 z-40 flex h-screen flex-col bg-neutral-950 transition-all duration-300 ease-in-out",
          isOpen ? "translate-x-0" : "-translate-x-full",
          isCollapsed ? "lg:w-20" : "lg:w-[265px]",
          "w-[265px] lg:translate-x-0",
        ].join(" ")}
      >
        {/* Logo */}
        <div
          className={[
            "flex items-center border-b border-white/10 py-4",
            isCollapsed ? "justify-center px-2" : "px-4",
          ].join(" ")}
        >
          <Link href="/admin" onClick={onClose} className="min-w-0">
            <img
              src="/images/logo.svg"
              alt="KNR COM & Digital"
              className={isCollapsed ? "h-9 w-9 object-contain" : "h-10 w-auto max-w-full object-contain"}
            />
          </Link>
          {!isCollapsed && (
            <button
              type="button"
              onClick={onClose}
              className="ml-auto rounded-lg p-2 text-white/60 transition-colors hover:bg-white/10 hover:text-white lg:hidden"
              aria-label="Fermer la sidebar"
            >
              <X size={18} />
            </button>
          )}
        </div>

        {/* Nav */}
        <nav className="flex-1 space-y-1 overflow-y-auto px-3 py-4 [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-track]:bg-neutral-950 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:bg-white/20">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = item.match.some(
              (prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`)
            );
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => { if (typeof window !== "undefined" && window.innerWidth < 1024) onClose(); }}
                className={[
                  "group flex items-center rounded-xl px-3 py-3 text-sm font-medium transition-all duration-150",
                  isCollapsed ? "justify-center" : "gap-3",
                  isActive
                    ? "bg-sky-500 text-white"
                    : "text-white/70 hover:bg-white/8 hover:text-white",
                ].join(" ")}
                title={isCollapsed ? item.label : undefined}
              >
                <Icon size={18} className="flex-shrink-0" />
                {!isCollapsed && <span className="flex-1">{item.label}</span>}
                {!isCollapsed && item.badge && (
                  <span className="inline-flex h-5 min-w-5 items-center justify-center rounded-full bg-sky-500/20 px-1.5 text-[10px] font-bold text-sky-300">
                    {item.badge}
                  </span>
                )}
              </Link>
            );
          })}
        </nav>

        {/* Footer */}
        <div className={["border-t border-white/10 px-4 py-4", isCollapsed ? "space-y-4" : "space-y-3"].join(" ")}>
          <div className={["flex items-center", isCollapsed ? "justify-center" : "gap-3"].join(" ")}>
            <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-sky-500 text-sm font-bold text-white">
              AD
            </div>
            {!isCollapsed && (
              <div className="min-w-0">
                <p className="truncate text-sm font-semibold text-white">Admin KNR</p>
                <p className="truncate text-xs text-white/55">admin@knrcom.bj</p>
              </div>
            )}
          </div>
          <button
            type="button"
            className={[
              "flex w-full items-center rounded-lg text-sm font-medium text-red-400 transition-colors hover:bg-white/8 hover:text-red-300",
              isCollapsed ? "justify-center p-2" : "gap-2 px-2 py-2",
            ].join(" ")}
            title={isCollapsed ? "Déconnexion" : undefined}
          >
            <LogOut size={16} />
            {!isCollapsed && <span>Déconnexion</span>}
          </button>
        </div>
      </aside>
    </>
  );
}
