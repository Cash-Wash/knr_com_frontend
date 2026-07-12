"use client";

import React from "react";
import PrivateRoute from "@/components/PrivateRoute";
import AdminShell from "@/components/AdminShell";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
    return (
        <PrivateRoute>
            <AdminShell>{children}</AdminShell>
        </PrivateRoute>
    );
}
