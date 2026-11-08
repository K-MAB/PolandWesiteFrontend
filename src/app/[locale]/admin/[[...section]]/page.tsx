import type { Metadata } from "next";
import { setRequestLocale } from "next-intl/server";

import { AdminConsole } from "@/features/admin/admin-console";
import type { AppLocale } from "@/i18n/routing";

export const metadata: Metadata = { title: "Admin | Vistula Components", robots: { index: false, follow: false } };
export const instant = false;
export function generateStaticParams() {
  return [undefined, "customers", "products", "categories", "manufacturers", "orders", "pricing", "inventory", "imports", "cms", "users", "audit-logs", "settings"].map((value) => value ? { section: [value] } : { section: [] });
}

export default async function AdminPage({ params }: { params: Promise<{ locale: AppLocale; section?: string[] }> }) {
  const { locale, section } = await params;
  setRequestLocale(locale);
  return <AdminConsole section={section?.[0] ?? "dashboard"} locale={locale} />;
}
