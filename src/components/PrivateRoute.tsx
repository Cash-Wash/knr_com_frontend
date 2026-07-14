"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function PrivateRoute({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const hasToken = typeof window !== "undefined" && !!localStorage.getItem("token");

  useEffect(() => {
    if (!hasToken) {
      router.replace("/auth/login");
    }
  }, [hasToken, router]);

  if (!hasToken) {
    return null;
  }

  return children;
}
