"use client";

import {
  Activity,
  Boxes,
  Factory,
  FileClock,
  FileUp,
  FolderTree,
  Gauge,
  LayoutTemplate,
  PackageSearch,
  Settings,
  ShieldCheck,
  ShoppingCart,
  Tags,
  Users,
  type LucideIcon,
} from "lucide-react";
import { useTranslations } from "next-intl";
import { useMemo, useState, type FormEvent, type ReactNode } from "react";
import { toast } from "sonner";

import { PortalShell, type PortalNavItem } from "@/components/portal/portal-shell";
import { TablePagination, usePagination } from "@/components/portal/table-pagination";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { formatMoney } from "@/core/services/commerce";
import type { AppLocale } from "@/i18n/routing";
import { mockCustomers, mockOrders, mockProducts } from "@/infrastructure/mock/fixtures";
import { cn } from "@/lib/utils";

import { ImportWizard } from "./import-wizard";

const sectionMeta = {
  dashboard: ["dashboard", "dashboardTitle", "dashboardText", Gauge],
  customers: ["customers", "customers", "customerDescription", Users],
  products: ["products", "products", "productDescription", PackageSearch],
  categories: ["categories", "categories", "categoryDescription", FolderTree],
  manufacturers: ["manufacturers", "manufacturers", "manufacturerDescription", Factory],
  orders: ["orders", "orders", "orderDescription", ShoppingCart],
  pricing: ["pricing", "pricing", "pricingDescription", Tags],
  inventory: ["inventory", "inventory", "inventoryDescription", Boxes],
  imports: ["imports", "imports", "importDescription", FileUp],
  cms: ["cms", "cms", "cmsDescription", LayoutTemplate],
  users: ["users", "users", "userDescription", Users],
  "audit-logs": ["auditLogs", "auditLogs", "auditDescription", FileClock],
  settings: ["settings", "settings", "settingsDescription", Settings],
} as const;
type Section = keyof typeof sectionMeta;
const inputClass = "min-h-10 rounded-md border border-slate-300 bg-white px-3 text-sm text-navy focus:border-blue focus:outline-none focus:ring-2 focus:ring-blue/10";

export function AdminConsole({ section, locale }: { section: string; locale: AppLocale }) {
  const t = useTranslations("portal");
  const current = (section in sectionMeta ? section : "dashboard") as Section;
  const items: PortalNavItem[] = (Object.entries(sectionMeta) as [Section, (typeof sectionMeta)[Section]][]).map(([key, meta]) => ({ href: key === "dashboard" ? "/admin" : `/admin/${key}`, label: t(meta[0]), icon: meta[3] }));
  const meta = sectionMeta[current];
  return <PortalShell items={items} title={t(meta[1])} subtitle="admin@vistula.example" user="Marta Kowalska" mode="admin" storefrontLabel={t("storefront")} demoLabel={t("demoEnvironment")}><SectionIntro title={t(meta[1])} description={t(meta[2])} />{renderSection(current, locale, t)}</PortalShell>;
}

type Translator = ReturnType<typeof useTranslations<"portal">>;

function renderSection(section: Section, locale: AppLocale, t: Translator) {
  switch (section) {
    case "dashboard": return <Dashboard locale={locale} t={t} />;
    case "customers": return <Customers t={t} />;
    case "products": return <Products locale={locale} t={t} />;
    case "categories": return <CatalogGroups mode="categories" locale={locale} t={t} />;
    case "manufacturers": return <CatalogGroups mode="manufacturers" locale={locale} t={t} />;
    case "orders": return <Orders locale={locale} t={t} />;
    case "pricing": return <Pricing locale={locale} t={t} />;
    case "inventory": return <Inventory t={t} />;
    case "imports": return <ImportWizard />;
    case "cms": return <Cms t={t} />;
    case "users": return <AdminUsers t={t} />;
    case "audit-logs": return <Audit t={t} />;
    case "settings": return <SettingsPanel t={t} />;
  }
}

function SectionIntro({ title, description }: { title: string; description: string }) { return <div className="mb-6"><h2 className="text-2xl font-black tracking-[-0.03em] text-navy">{title}</h2><p className="mt-1 text-sm text-muted">{description}</p></div>; }

function Dashboard({ locale, t }: { locale: AppLocale; t: Translator }) {
  const total = mockOrders.reduce((sum, order) => sum + order.total.amount, 0);
  const stats = [[t("sales"), formatMoney({ amount: total, currency: "PLN" }, locale), Activity], [t("customers"), String(mockCustomers.length), Users], [t("orders"), String(mockOrders.length), ShoppingCart], [t("stockAlerts"), String(mockProducts.filter((item) => item.stock < 100).length), Boxes]] as const;
  return <div className="space-y-6"><div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">{stats.map(([label, value, Icon]) => <StatCard key={label} label={label} value={value} icon={Icon} t={t} />)}</div><div className="grid gap-6 xl:grid-cols-[1.4fr_1fr]"><Panel title={t("recentOrders")}><OrdersTable orders={mockOrders.slice(0, 6)} locale={locale} t={t} /></Panel><Panel title={t("orderTrend")}><div className="flex h-64 items-end gap-3 px-2 pt-8">{[42, 63, 51, 78, 68, 92, 81, 100].map((height, index) => <div key={index} className="flex flex-1 flex-col items-center gap-2"><div className="w-full rounded-t bg-gradient-to-t from-blue to-cyan" style={{ height: `${height}%` }} /><span className="text-[0.625rem] text-muted">{t("weekShort")}{index + 1}</span></div>)}</div></Panel></div><Panel title={t("recentCustomers")}><CustomerTable t={t} compact /></Panel></div>;
}

function Customers({ t }: { t: Translator }) {
  const [query, setQuery] = useState("");
  return <Panel title={t("customers")} toolbar={<SearchBox label={t("search")} value={query} onChange={setQuery} />}><CustomerTable t={t} query={query} /></Panel>;
}
function CustomerTable({ t, compact = false, query = "" }: { t: Translator; compact?: boolean; query?: string }) {
  const [customers, setCustomers] = useState(mockCustomers.map((item) => ({ id: item.id, name: item.name, email: item.email, city: item.address.city, status: item.status })));
  const filtered = customers.filter((item) => `${item.name} ${item.email} ${item.city}`.toLocaleLowerCase().includes(query.toLocaleLowerCase()));
  const pagination = usePagination(compact ? filtered.slice(0, 5) : filtered);
  const shown = compact ? filtered.slice(0, 5) : pagination.items;
  return <><DataTable headers={[t("fullName"), t("email"), t("city"), t("status"), t("actions")]}>{shown.map((customer) => <tr key={customer.id}><Cell strong>{customer.name}</Cell><Cell>{customer.email}</Cell><Cell>{customer.city}</Cell><Cell><Status value={customer.status} t={t} /></Cell><Cell><MiniButton danger={customer.status === "active"} onClick={() => setCustomers((current) => current.map((item) => item.id === customer.id ? { ...item, status: item.status === "active" ? "disabled" : "active" } : item))}>{customer.status === "active" ? t("disable") : t("enable")}</MiniButton></Cell></tr>)}</DataTable>{!compact && <TablePagination {...pagination} onPageChange={pagination.setPage} />}</>;
}

function Products({ locale, t }: { locale: AppLocale; t: Translator }) {
  const [query, setQuery] = useState("");
  const [products, setProducts] = useState(mockProducts.slice(0, 24).map((item) => ({ id: item.id, sku: item.sku, mpn: item.mpn, name: item.name[locale] ?? item.name.en, manufacturer: item.manufacturer, price: item.basePrice.amount, stock: item.stock, status: item.status })));
  const filtered = products.filter((item) => `${item.sku} ${item.mpn} ${item.name}`.toLowerCase().includes(query.toLowerCase()));
  const pagination = usePagination(filtered);
  return <Panel title={t("products")} toolbar={<div className="flex gap-2"><input value={query} onChange={(event) => { setQuery(event.target.value); pagination.setPage(1); }} placeholder={t("search")} className={inputClass} /><Button type="button" onClick={() => { const id = `local-${Date.now()}`; setProducts((current) => [{ id, sku: `VC-NEW-${current.length + 1}`, mpn: "NEW-MPN", name: t("newComponent"), manufacturer: t("unassigned"), price: 0, stock: 0, status: "draft" }, ...current]); pagination.setPage(1); }}>{t("newProduct")}</Button></div>}><DataTable headers={["SKU / MPN", t("products"), t("manufacturers"), t("pricing"), t("inventory"), t("status"), t("actions")]}>{pagination.items.map((product) => <tr key={product.id}><Cell><span className="font-mono text-xs">{product.sku}</span><span className="block text-[0.6875rem] text-muted">{product.mpn}</span></Cell><Cell strong>{product.name}</Cell><Cell>{product.manufacturer}</Cell><Cell>{formatMoney({ amount: product.price, currency: "PLN" }, locale)}</Cell><Cell>{product.stock}</Cell><Cell><Status value={product.status} t={t} /></Cell><Cell><MiniButton onClick={() => setProducts((current) => current.map((item) => item.id === product.id ? { ...item, status: item.status === "active" ? "archived" : "active" } : item))}>{product.status === "active" ? t("archive") : t("activate")}</MiniButton></Cell></tr>)}</DataTable><TablePagination {...pagination} onPageChange={pagination.setPage} /></Panel>;
}

function CatalogGroups({ mode, locale, t }: { mode: "categories" | "manufacturers"; locale: AppLocale; t: Translator }) {
  const groups = useMemo(() => {
    const map = new Map<string, { name: string; count: number; stock: number }>();
    mockProducts.forEach((product) => { const name = mode === "categories" ? (product.categoryName[locale] ?? product.categoryName.en) : product.manufacturer; const current = map.get(name) ?? { name, count: 0, stock: 0 }; current.count += 1; current.stock += product.stock; map.set(name, current); });
    return [...map.values()].sort((a, b) => b.count - a.count);
  }, [locale, mode]);
  const pagination = usePagination(groups);
  return <Panel title={t(mode)}><DataTable headers={[mode === "categories" ? t("categories") : t("manufacturers"), t("products"), t("inventory"), t("status")]}>{pagination.items.map((group) => <tr key={group.name}><Cell strong>{group.name}</Cell><Cell>{group.count}</Cell><Cell>{group.stock.toLocaleString(locale)}</Cell><Cell><Status value="active" t={t} /></Cell></tr>)}</DataTable><TablePagination {...pagination} onPageChange={pagination.setPage} /></Panel>;
}

function Orders({ locale, t }: { locale: AppLocale; t: Translator }) {
  const [orders, setOrders] = useState(mockOrders.map((item) => ({ ...item })));
  const pagination = usePagination(orders);
  return <Panel title={t("orders")}><DataTable headers={[t("order"), t("customers"), t("sales"), t("status"), t("actions")]}>{pagination.items.map((order) => <tr key={order.id}><Cell mono>{order.orderNumber}</Cell><Cell>{order.customerName}</Cell><Cell strong>{formatMoney(order.total, locale)}</Cell><Cell><Status value={order.status} t={t} /></Cell><Cell><select aria-label={t("status")} value={order.status} onChange={(event) => setOrders((current) => current.map((item) => item.id === order.id ? { ...item, status: event.target.value as typeof item.status } : item))} className={inputClass}><option value="confirmed">{t("confirmed")}</option><option value="processing">{t("processing")}</option><option value="shipped">{t("shipped")}</option><option value="delivered">{t("delivered")}</option></select></Cell></tr>)}</DataTable><TablePagination {...pagination} onPageChange={pagination.setPage} /></Panel>;
}

function Pricing({ locale, t }: { locale: AppLocale; t: Translator }) { return <div className="grid gap-5 lg:grid-cols-3">{[{ name: t("storePrices"), value: 0, color: "bg-blue" }, { name: t("seasonalCampaign"), value: 10, color: "bg-cyan" }, { name: t("clearance"), value: 25, color: "bg-success" }].map((item) => <Panel key={item.name} title={item.name}><p className="text-3xl font-black text-navy">{item.value}%</p><p className="mt-1 text-xs text-muted">{t("publicDiscount")}</p><div className="mt-5 h-2 rounded-full bg-slate-100"><div className={cn("h-full rounded-full", item.color)} style={{ width: `${Math.max(8, item.value * 3)}%` }} /></div><p className="mt-5 text-sm font-bold text-navy">{t("example")}: {formatMoney({ amount: 428 * (1 - item.value / 100), currency: "PLN" }, locale)}</p></Panel>)}</div>; }

function Inventory({ t }: { t: Translator }) {
  const [rows, setRows] = useState(mockProducts.slice(0, 20).map((item) => ({ id: item.id, sku: item.sku, mpn: item.mpn, stock: item.stock, reserved: Math.min(120, Math.floor(item.stock * .03)) })));
  const pagination = usePagination(rows);
  return <Panel title={t("inventory")}><DataTable headers={["SKU / MPN", t("availableStock"), t("reservedStock"), t("actions")]}>{pagination.items.map((row) => <tr key={row.id}><Cell><strong className="font-mono text-xs">{row.sku}</strong><span className="block text-[0.6875rem] text-muted">{row.mpn}</span></Cell><Cell strong>{row.stock.toLocaleString()}</Cell><Cell>{row.reserved}</Cell><Cell><div className="flex gap-2"><MiniButton onClick={() => setRows((current) => current.map((item) => item.id === row.id ? { ...item, stock: item.stock + 10 } : item))}>+10</MiniButton><MiniButton danger onClick={() => setRows((current) => current.map((item) => item.id === row.id ? { ...item, stock: Math.max(0, item.stock - 10) } : item))}>−10</MiniButton></div></Cell></tr>)}</DataTable><TablePagination {...pagination} onPageChange={pagination.setPage} /></Panel>;
}

function Cms({ t }: { t: Translator }) {
  const [items, setItems] = useState([{ id: 1, nameKey: "homepageBanner" as const, typeKey: "banner" as const, active: true }, { id: 2, nameKey: "deliveryInformation" as const, typeKey: "page" as const, active: true }, { id: 3, nameKey: "autumnCampaign" as const, typeKey: "banner" as const, active: false }]);
  const pagination = usePagination(items);
  return <Panel title={t("cms")}><DataTable headers={[t("content"), t("type"), t("status"), t("actions")]}>{pagination.items.map((item) => <tr key={item.id}><Cell strong>{t(item.nameKey)}</Cell><Cell>{t(item.typeKey)}</Cell><Cell><Status value={item.active ? "active" : "draft"} t={t} /></Cell><Cell><MiniButton onClick={() => setItems((current) => current.map((entry) => entry.id === item.id ? { ...entry, active: !entry.active } : entry))}>{item.active ? t("unpublish") : t("publish")}</MiniButton></Cell></tr>)}</DataTable><TablePagination {...pagination} onPageChange={pagination.setPage} /></Panel>;
}

function AdminUsers({ t }: { t: Translator }) {
  const [users, setUsers] = useState<{ id: number; name: string; email: string; roleKey: "superAdmin" | "catalogManager" | "supportRole"; status: string }[]>([{ id: 1, name: "Marta Kowalska", email: "admin@vistula.example", roleKey: "superAdmin", status: "active" }, { id: 2, name: "Piotr Nowak", email: "catalog@vistula.example", roleKey: "catalogManager", status: "active" }]);
  const pagination = usePagination(users);
  return <Panel title={t("users")} toolbar={<Button type="button" onClick={() => { setUsers((current) => [...current, { id: Date.now(), name: t("invitedUser"), email: `invite${current.length + 1}@vistula.example`, roleKey: "supportRole", status: "invited" }]); pagination.setPage(Math.ceil((users.length + 1) / pagination.pageSize)); }}>{t("inviteUser")}</Button>}><DataTable headers={[t("users"), t("email"), t("role"), t("status"), t("actions")]}>{pagination.items.map((user) => <tr key={user.id}><Cell strong>{user.name}</Cell><Cell>{user.email}</Cell><Cell>{t(user.roleKey)}</Cell><Cell><Status value={user.status} t={t} /></Cell><Cell><MiniButton onClick={() => setUsers((current) => current.map((item) => item.id === user.id ? { ...item, status: item.status === "active" ? "disabled" : "active" } : item))}>{user.status === "active" ? t("disable") : t("enable")}</MiniButton></Cell></tr>)}</DataTable><TablePagination {...pagination} onPageChange={pagination.setPage} /></Panel>;
}

function Audit({ t }: { t: Translator }) { const entries = [t("auditOrderConfirmed"), t("auditInventoryAdjusted"), t("auditBannerPublished"), t("auditOrderProcessing"), t("auditPriceUpdated"), t("auditCustomerUpdated")]; const pagination = usePagination(entries); return <Panel title={t("auditEvents")}><div className="divide-y divide-border">{pagination.items.map((entry, index) => <div key={entry} className="flex gap-4 px-3 py-4"><span className="grid size-9 shrink-0 place-items-center rounded-full bg-blue/8 text-blue"><ShieldCheck className="size-4" /></span><div><p className="text-sm font-bold text-navy">{entry}</p><p className="mt-1 text-xs text-muted">admin@vistula.example · {28 - ((pagination.page - 1) * pagination.pageSize + index)} {t("octoberShort")} 2026 · {10 + index}:2{index}</p></div></div>)}</div><TablePagination {...pagination} onPageChange={pagination.setPage} /></Panel>; }
function SettingsPanel({ t }: { t: Translator }) { return <Panel title={t("settings")}><form className="max-w-2xl space-y-5" onSubmit={(event: FormEvent) => { event.preventDefault(); toast.success(t("saved")); }}><label className="block text-xs font-bold text-navy">{t("defaultCurrency")}<select className={`${inputClass} mt-2 w-full`} defaultValue="PLN"><option>PLN</option><option>EUR</option></select></label><label className="block text-xs font-bold text-navy">{t("lowStockThreshold")}<input type="number" min={0} defaultValue={100} className={`${inputClass} mt-2 w-full`} /></label><label className="flex items-center gap-3 rounded-lg border border-border p-4 text-sm font-semibold text-navy"><input type="checkbox" defaultChecked className="size-4 accent-blue" />{t("emailNotifications")}</label><Button type="submit">{t("save")}</Button></form></Panel>; }

function StatCard({ label, value, icon: Icon, t }: { label: string; value: string; icon: LucideIcon; t: Translator }) { return <div className="rounded-xl border border-border bg-white p-5 shadow-sm"><div className="flex items-center justify-between"><span className="grid size-10 place-items-center rounded-lg bg-blue/8 text-blue"><Icon className="size-5" /></span><span className="text-[0.625rem] font-bold uppercase tracking-[0.1em] text-success">{t("liveDemo")}</span></div><p className="mt-5 text-2xl font-black tracking-[-0.03em] text-navy">{value}</p><p className="mt-1 text-xs font-semibold text-muted">{label}</p></div>; }
function Panel({ title, toolbar, children }: { title: string; toolbar?: ReactNode; children: ReactNode }) { return <section className="overflow-hidden rounded-xl border border-border bg-white shadow-sm"><div className="flex flex-col gap-3 border-b border-border px-5 py-4 sm:flex-row sm:items-center sm:justify-between"><h3 className="font-black text-navy">{title}</h3>{toolbar}</div><div className="overflow-x-auto p-1 sm:p-4">{children}</div></section>; }
function DataTable({ headers, children }: { headers: readonly string[]; children: ReactNode }) { return <table className="w-full min-w-[720px] text-left text-xs"><thead><tr className="text-[0.6875rem] uppercase tracking-[0.08em] text-muted">{headers.map((header) => <th key={header} className="px-3 py-3 font-bold">{header}</th>)}</tr></thead><tbody className="divide-y divide-border">{children}</tbody></table>; }
function Cell({ children, strong, mono }: { children: ReactNode; strong?: boolean; mono?: boolean }) { return <td className={cn("px-3 py-3.5 text-slate-700", strong && "font-bold text-navy", mono && "font-mono")}>{children}</td>; }
function Status({ value, t }: { value: string; t: Translator }) { const positive = ["active", "accepted", "delivered", "shipped", "confirmed", "published"].includes(value); const warning = ["pending", "draft", "submitted", "under-review", "processing", "invited", "negotiation", "quoted"].includes(value); const known = ["active", "disabled", "archived", "confirmed", "processing", "shipped", "delivered", "draft", "invited", "published"] as const; const key = known.find((item) => item === value); return <Badge tone={positive ? "success" : warning ? "warning" : "neutral"}>{key ? t(key) : value.replaceAll("-", " ")}</Badge>; }
function MiniButton({ children, onClick, danger }: { children: ReactNode; onClick: () => void; danger?: boolean }) { return <button type="button" onClick={onClick} className={cn("min-h-8 rounded-md border border-border px-2.5 text-[0.6875rem] font-bold text-blue hover:bg-blue/5", danger && "text-error hover:bg-red-50")}>{children}</button>; }
function SearchBox({ label, value, onChange }: { label: string; value: string; onChange: (value: string) => void }) { return <input type="search" value={value} onChange={(event) => onChange(event.target.value)} placeholder={label} aria-label={label} className={inputClass} />; }
function OrdersTable({ orders, locale, t }: { orders: typeof mockOrders; locale: AppLocale; t: Translator }) { return <DataTable headers={[t("order"), t("customers"), t("value"), t("status")]}>{orders.map((order) => <tr key={order.id}><Cell mono>{order.orderNumber}</Cell><Cell>{order.customerName}</Cell><Cell strong>{formatMoney(order.total, locale)}</Cell><Cell><Status value={order.status} t={t} /></Cell></tr>)}</DataTable>; }
