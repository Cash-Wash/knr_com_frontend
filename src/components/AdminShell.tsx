"use client";

import React from "react";
import AdminSidebar from "@/components/AdminSidebar";

export default function AdminShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top,_rgba(14,165,233,0.18),_transparent_35%),linear-gradient(180deg,#020617_0%,#0f172a_100%)] text-white">
      <div className="mx-auto flex min-h-screen w-full max-w-[1680px]">
        <aside className="sticky top-0 hidden h-screen w-[290px] shrink-0 border-r border-white/10 bg-black/30 px-4 py-5 backdrop-blur-xl lg:block">
          <AdminSidebar />
        </aside>
        <div className="flex min-h-screen flex-1 flex-col">
          <div className="lg:hidden border-b border-white/10 bg-black/30 px-4 py-4 backdrop-blur-xl">
            <AdminSidebar />
          </div>
          <main className="flex-1 px-4 py-6 sm:px-6 lg:px-8 lg:py-8">
            {children}
          </main>
        </div>
      </div>
    </div>
  );
}
