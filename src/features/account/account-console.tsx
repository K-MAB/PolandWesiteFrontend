"use client";

import { Gauge, Heart, MapPin, PackageCheck, ShoppingCart, UserRound } from "lucide-react";
import { useTranslations } from "next-intl";
import { type FormEvent, type ReactNode } from "react";
import { toast } from "sonner";

import { PortalShell, type PortalNavItem } from "@/components/portal/portal-shell";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { formatMoney } from "@/core/services/commerce";
import { Link } from "@/i18n/navigation";
import type { AppLocale } from "@/i18n/routing";
import { mockCustomers, mockOrders, mockProducts } from "@/infrastructure/mock/fixtures";
import { cn } from "@/lib/utils";

const inputClass = "min-h-10 w-full rounded-md border border-slate-300 bg-white px-3 text-sm text-navy focus:border-blue focus:outline-none focus:ring-2 focus:ring-blue/10";

export function AccountConsole({ segments, locale }: { segments: readonly string[]; locale: AppLocale }) {
  const t = useTranslations("portal");
  const section = segments[0] ?? "dashboard";
  const detail = segments[1];
  const nav: PortalNavItem[] = [
    { href: "/account", label: t("dashboard"), icon: Gauge },
    { href: "/account/orders", label: t("orders"), icon: ShoppingCart },
    { href: "/account/favorites", label: t("favorites"), icon: Heart },
    { href: "/account/addresses", label: t("addresses"), icon: MapPin },
    { href: "/account/profile", label: t("profile"), icon: UserRound },
  ];
  const titles: Record<string, string> = { dashboard: t("accountOverview"), orders: t("orders"), favorites: t("favorites"), addresses: t("addresses"), profile: t("profile") };
  return <PortalShell items={nav} title={titles[section] ?? t("myAccount")} subtitle="anna@example.com" user="Anna Wiśniewska" mode="account" storefrontLabel={t("storefront")} demoLabel={t("demoEnvironment")}><div className="mb-6"><h2 className="text-2xl font-black tracking-[-0.03em] text-navy">{titles[section] ?? t("myAccount")}</h2><p className="mt-1 text-sm text-muted">{section === "dashboard" ? t("accountOverviewText") : "Anna Wiśniewska · customer-anna"}</p></div>{render(section, detail, locale, t)}</PortalShell>;
}

type Translator = ReturnType<typeof useTranslations<"portal">>;
function render(section: string, detail: string | undefined, locale: AppLocale, t: Translator) {
  switch (section) {
    case "orders": return detail ? <OrderDetail id={detail} locale={locale} t={t} /> : <Orders locale={locale} t={t} />;
    case "favorites": return <Favorites locale={locale} t={t} />;
    case "addresses": return <Addresses t={t} />;
    case "profile": return <Profile t={t} />;
    default: return <Dashboard locale={locale} t={t} />;
  }
}

function Dashboard({ locale, t }: { locale: AppLocale; t: Translator }) {
  const orders = mockOrders.filter((item) => item.customerId === "customer-anna");
  return <div className="space-y-6"><div className="grid gap-4 sm:grid-cols-3"><Metric label={t("orders")} value={String(orders.length)} /><Metric label={t("deliveredOrders")} value={String(orders.filter((item) => item.status === "delivered").length)} /><Metric label={t("favorites")} value="5" /></div><Panel title={t("recentOrders")}><OrderRows orders={orders} locale={locale} t={t} link /></Panel></div>;
}
function Orders({ locale, t }: { locale: AppLocale; t: Translator }) { return <Panel title={t("orders")}><OrderRows orders={mockOrders.filter((item) => item.customerId === "customer-anna")} locale={locale} t={t} link /></Panel>; }
function OrderRows({ orders, locale, t, link = false }: { orders: readonly (typeof mockOrders)[number][]; locale: AppLocale; t: Translator; link?: boolean }) { return <Table headers={[t("order"), t("date"), t("value"), t("status")]}>{orders.map((order) => <tr key={order.id}><Td mono>{link ? <Link href={`/account/orders/${order.id}`} className="font-bold text-blue hover:underline">{order.orderNumber}</Link> : order.orderNumber}</Td><Td>{new Intl.DateTimeFormat(locale, { dateStyle: "medium" }).format(new Date(order.createdAt))}</Td><Td strong>{formatMoney(order.total, locale)}</Td><Td><State value={order.status} t={t} /></Td></tr>)}</Table>; }
function OrderDetail({ id, locale, t }: { id: string; locale: AppLocale; t: Translator }) { const order = mockOrders.find((item) => item.id === id && item.customerId === "customer-anna"); if (!order) return <Panel title={t("orderNotFound")}><p className="text-sm text-muted">{t("orderUnavailable")}</p></Panel>; return <Panel title={order.orderNumber}><div className="grid gap-4 sm:grid-cols-3"><Info label={t("created")} value={new Intl.DateTimeFormat(locale, { dateStyle: "long" }).format(new Date(order.createdAt))} /><Info label={t("status")} value={t(order.status)} /><Info label={t("total")} value={formatMoney(order.total, locale)} /></div></Panel>; }
function Favorites({ locale, t }: { locale: AppLocale; t: Translator }) { return <Panel title={t("favorites")}><div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">{mockProducts.slice(0, 5).map((product) => <Link key={product.id} href={`/products/${product.id}`} className="rounded-xl border border-border p-4 transition hover:border-blue/40 hover:shadow-sm"><p className="font-mono text-xs text-muted">{product.mpn}</p><p className="mt-2 font-bold text-navy">{product.name[locale] ?? product.name.en}</p><p className="mt-3 text-sm font-black text-blue">{formatMoney(product.basePrice, locale)}</p></Link>)}</div></Panel>; }
function Addresses({ t }: { t: Translator }) { const customer = mockCustomers[0]!; return <Panel title={t("addresses")}><form className="max-w-2xl space-y-4" onSubmit={(event: FormEvent) => { event.preventDefault(); toast.success(t("saved")); }}><Field label={t("address")} defaultValue={customer.address.street} /><div className="grid gap-4 sm:grid-cols-2"><Field label={t("postalCode")} defaultValue={customer.address.postalCode} /><Field label={t("city")} defaultValue={customer.address.city} /></div><Button type="submit">{t("save")}</Button></form></Panel>; }
function Profile({ t }: { t: Translator }) { const customer = mockCustomers[0]!; return <Panel title={t("profile")}><form className="grid max-w-2xl gap-4 sm:grid-cols-2" onSubmit={(event: FormEvent) => { event.preventDefault(); toast.success(t("saved")); }}><Field label={t("fullName")} defaultValue={customer.name} /><Field label={t("email")} type="email" defaultValue={customer.email} /><div className="sm:col-span-2"><Button type="submit">{t("save")}</Button></div></form></Panel>; }

function Metric({ label, value }: { label: string; value: string }) { return <div className="rounded-xl border border-border bg-white p-5 shadow-sm"><span className="grid size-10 place-items-center rounded-lg bg-blue/8 text-blue"><PackageCheck className="size-5" /></span><p className="mt-5 text-2xl font-black text-navy">{value}</p><p className="mt-1 text-xs font-semibold text-muted">{label}</p></div>; }
function Panel({ title, children }: { title: string; children: ReactNode }) { return <section className="overflow-hidden rounded-xl border border-border bg-white shadow-sm"><div className="border-b border-border px-5 py-4"><h3 className="font-black text-navy">{title}</h3></div><div className="overflow-x-auto p-4">{children}</div></section>; }
function Table({ headers, children }: { headers: readonly string[]; children: ReactNode }) { return <table className="w-full min-w-[640px] text-left text-xs"><thead><tr className="uppercase tracking-[0.08em] text-muted">{headers.map((header) => <th key={header} className="px-3 py-3 font-bold">{header}</th>)}</tr></thead><tbody className="divide-y divide-border">{children}</tbody></table>; }
function Td({ children, strong, mono }: { children: ReactNode; strong?: boolean; mono?: boolean }) { return <td className={cn("px-3 py-3.5 text-slate-700", strong && "font-bold text-navy", mono && "font-mono")}>{children}</td>; }
function State({ value, t }: { value: "confirmed" | "processing" | "shipped" | "delivered"; t: Translator }) { return <Badge tone={["delivered", "shipped", "confirmed"].includes(value) ? "success" : "warning"}>{t(value)}</Badge>; }
function Field({ label, ...props }: { label: string } & React.InputHTMLAttributes<HTMLInputElement>) { return <label className="block text-xs font-bold text-navy">{label}<input {...props} className={`${inputClass} mt-2`} /></label>; }
function Info({ label, value }: { label: string; value: string }) { return <div className="rounded-lg bg-slate-50 p-4"><p className="text-xs text-muted">{label}</p><p className="mt-1 font-bold text-navy">{value}</p></div>; }
