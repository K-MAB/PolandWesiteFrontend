import type { Metadata } from "next";
import Image from "next/image";
import { getTranslations, setRequestLocale } from "next-intl/server";

import { WorkflowPage } from "@/components/layout/workflow-page";
import { AddToCartButton } from "@/features/cart/add-to-cart-button";
import type { AppLocale } from "@/i18n/routing";
import { mockProducts } from "@/infrastructure/mock/fixtures";
import { localizedText } from "@/lib/utils";

export const metadata: Metadata = { title: "Compare products | Vistula Components" };

export default async function ComparePage({ params, searchParams }: { params: Promise<{ locale: AppLocale }>; searchParams: Promise<{ ids?: string }> }) {
  const { locale } = await params;
  const { ids } = await searchParams;
  setRequestLocale(locale);
  const [common, marketplace] = await Promise.all([getTranslations({ locale, namespace: "common" }), getTranslations({ locale, namespace: "marketplace" })]);
  const requested = ids?.split(",").filter(Boolean) ?? [];
  const selected = (requested.length ? requested.map((id) => mockProducts.find((item) => item.id === id)).filter(Boolean) : mockProducts.slice(0, 3)) as (typeof mockProducts)[number][];
  const products = [...selected, ...mockProducts.filter((item) => !selected.includes(item))].slice(0, 3);
  return <WorkflowPage eyebrow={marketplace("technicalSelection")} title={common("compare")} description={marketplace("compareDescription")}><div className="overflow-x-auto rounded-2xl border border-border bg-white shadow-card"><table className="w-full min-w-[800px] table-fixed text-sm"><thead><tr><th className="w-44 border-b border-r border-border bg-slate-50 p-4 text-left text-xs uppercase tracking-[0.08em] text-muted">{marketplace("product")}</th>{products.map((product) => <th key={product.id} className="border-b border-border p-5 text-left align-top"><div className="relative aspect-[1.7/1] rounded-lg bg-slate-50"><Image src={product.imageUrl} alt={localizedText(product.name, locale)} fill sizes="240px" className="object-contain p-4" /></div><p className="mt-4 font-black text-navy">{localizedText(product.name, locale)}</p><p className="mt-1 font-mono text-xs font-normal text-muted">{product.mpn}</p><AddToCartButton productId={product.id} sku={product.sku} name={localizedText(product.name, locale)} moq={product.moq} increment={product.quantityIncrement} unitPrice={product.basePrice} imageUrl={product.imageUrl} className="mt-4" /></th>)}</tr></thead><tbody>{[[common("manufacturer"), products.map((item) => item.manufacturer)], [common("unitPrice"), products.map((item) => `${item.basePrice.amount.toFixed(2)} PLN`)], [common("stock"), products.map((item) => `${item.stock.toLocaleString(locale)} ${marketplace("pieceUnit")}`)], [common("moq"), products.map((item) => String(item.moq))], [common("leadTime"), products.map((item) => `${item.leadTimeDays} ${marketplace("dayUnit")}`)], ...[0, 1, 2].map((index) => [marketplace("specification", { number: index + 1 }), products.map((item) => item.attributes[index]?.value ?? "—")])].map(([label, values]) => <tr key={String(label)} className="border-t border-border"><th className="border-r border-border bg-slate-50 p-4 text-left text-xs font-bold text-muted">{String(label)}</th>{(values as string[]).map((value, index) => <td key={`${String(label)}-${products[index]?.id}`} className="p-4 font-semibold text-navy">{value}</td>)}</tr>)}</tbody></table></div></WorkflowPage>;
}
