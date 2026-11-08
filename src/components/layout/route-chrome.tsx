"use client";

import type { ReactNode } from "react";

import { usePathname } from "@/i18n/navigation";

export function RouteChrome({ children, header, footer }: { children: ReactNode; header: ReactNode; footer: ReactNode }) {
  const pathname = usePathname();
  const isStandalone = pathname === "/login" || pathname === "/register" || pathname.startsWith("/admin") || pathname.startsWith("/account");

  if (isStandalone) return children;
  return <>{header}{children}{footer}</>;
}
