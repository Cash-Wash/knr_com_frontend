"use client";

import React from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Users, Video, LogOut, User, FileText, Clock, Settings, PlaySquare, MessageCircle } from "lucide-react";

const menuItems = [
  { icon: Video, label: "Dashboard", href: "/admin" },
  { icon: PlaySquare, label: "Live", href: "/admin/lives" },
  { icon: MessageCircle, label: "Reunions", href: "/admin/reunions" },
  { icon: FileText, label: "Blog", href: "/admin/blog" },
  { icon: Clock, label: "Programme", href: "/admin/programme" },
  { icon: Users, label: "Utilisateurs", href: "/admin/users" },
  { icon: Settings, label: "Parametres", href: "/admin/settings" },
  { icon: User, label: "Profil", href: "/admin/profile" },
];

export default function AdminSidebar() {
  const pathname = usePathname();
  const router = useRouter();

  const handleLogout = () => {
    localStorage.removeItem("token");
    router.push("/auth/login");
  };

  return (
    <div className="flex h-full flex-col gap-6">
      <div className="rounded-[28px] border border-white/10 bg-white/5 p-5 shadow-[0_24px_60px_rgba(0,0,0,0.24)]">
        <div className="flex items-center gap-3">
          <div className="grid h-12 w-12 place-items-center rounded-2xl bg-sky-400 font-black text-slate-950">
            KNR
          </div>
          <div>
            <div className="text-lg font-bold tracking-wide">KNR COM</div>
            <p className="text-xs text-slate-300">Centre de pilotage media</p>
          </div>
        </div>
        <div className="mt-4 rounded-2xl border border-sky-400/20 bg-sky-400/10 px-4 py-3 text-sm text-sky-100">
          Espace admin dedie au live, a la regie et aux contenus.
        </div>
      </div>

      <nav className="flex-1 space-y-1">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const active = pathname === item.href;

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-medium transition-all ${
                active
                  ? "bg-sky-400 text-slate-950 shadow-lg shadow-sky-400/20"
                  : "text-slate-200 hover:bg-white/8 hover:text-white"
              }`}
            >
              <Icon className="h-4 w-4" />
              <span>{item.label}</span>
              {active && <span className="ml-auto h-2 w-2 rounded-full bg-slate-950" />}
            </Link>
          );
        })}
      </nav>

      <button
        onClick={handleLogout}
        className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm font-medium text-slate-200 transition hover:border-red-400/30 hover:bg-red-500/10 hover:text-red-100"
      >
        <LogOut className="h-4 w-4" />
        Deconnexion
      </button>
    </div>
  );
}
