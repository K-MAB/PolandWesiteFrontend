import type { Metadata } from "next";
import { setRequestLocale } from "next-intl/server";

import { AccountConsole } from "@/features/account/account-console";
import type { AppLocale } from "@/i18n/routing";
import { mockOrders } from "@/infrastructure/mock/fixtures";

export const metadata: Metadata = { title: "My account | Vistula Components", robots: { index: false, follow: false } };
export const instant = false;
export function generateStaticParams() { return [{ section: [] }, ...["orders", "favorites", "addresses", "profile"].map((value) => ({ section: [value] })), ...mockOrders.filter((order) => order.customerId === "customer-anna").map((order) => ({ section: ["orders", order.id] }))]; }
export default async function AccountPage({ params }: { params: Promise<{ locale: AppLocale; section?: string[] }> }) { const { locale, section } = await params; setRequestLocale(locale); return <AccountConsole segments={section ?? []} locale={locale} />; }
