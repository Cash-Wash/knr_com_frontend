"use client";

import React, { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import PrivateRoute from "@/components/PrivateRoute";
import AdminSidebar from "@/components/admin/AdminSidebar";
import AdminNavbar from "@/components/admin/AdminNavbar";

export default function AdminShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);

  const legacyRoutes = ["/admin/blog", "/admin/emissions", "/admin/formations"];
  const useLegacyShell = legacyRoutes.some((route) => pathname === route || pathname.startsWith(`${route}/`));

  useEffect(() => {
    document.body.style.overflow = isSidebarOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [isSidebarOpen]);

  if (useLegacyShell) {
    return <>{children}</>;
  }

  return (
    <PrivateRoute>
      <div className="admin-light min-h-screen text-stone-900">
        <AdminSidebar
          isOpen={isSidebarOpen}
          onClose={() => setIsSidebarOpen(false)}
          isCollapsed={isCollapsed}
          toggleCollapse={() => setIsCollapsed((value) => !value)}
        />

        <div className={`min-h-screen transition-all duration-300 ${isCollapsed ? "lg:pl-20" : "lg:pl-[265px]"}`}>
          <AdminNavbar
            onMenuClick={() => setIsSidebarOpen((value) => !value)}
            isCollapsed={isCollapsed}
            toggleCollapse={() => setIsCollapsed((value) => !value)}
          />
          <main className="px-4 pb-12 pt-5 lg:px-8 lg:pt-6 space-y-5">
            {children}
          </main>
        </div>
      </div>
    </PrivateRoute>
  );
}
