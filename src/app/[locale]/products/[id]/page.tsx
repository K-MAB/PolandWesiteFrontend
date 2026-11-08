import type { Metadata } from "next";
import { Box, CheckCircle2, Clock3, FileText, PackageCheck, ShieldCheck, Truck } from "lucide-react";
import Image from "next/image";
import { notFound } from "next/navigation";
import { getTranslations, setRequestLocale } from "next-intl/server";

import { Breadcrumbs } from "@/components/catalog/breadcrumbs";
import { ProductGrid, type ProductCardLabels } from "@/components/catalog/product-card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { formatMoney } from "@/core/services/commerce";
import { AddToCartButton } from "@/features/cart/add-to-cart-button";
import { Link } from "@/i18n/navigation";
import type { AppLocale } from "@/i18n/routing";
import { mockProducts } from "@/infrastructure/mock/fixtures";
import { repositories } from "@/infrastructure/repositories";
import { localizedText } from "@/lib/utils";

export function generateStaticParams() { return mockProducts.map((product) => ({ id: product.id })); }
export const instant = false;

export async function generateMetadata({ params }: { params: Promise<{ locale: AppLocale; id: string }> }): Promise<Metadata> {
  const { locale, id } = await params;
  const product = await repositories.products.findById(id);
  if (!product) return {};
  return { title: `${localizedText(product.name, locale)} | ${product.manufacturer}`, description: localizedText(product.description, locale), openGraph: { images: [product.imageUrl] } };
}

export default async function ProductPage({ params }: { params: Promise<{ locale: AppLocale; id: string }> }) {
  const { locale, id } = await params;
  const product = await repositories.products.findById(id);
  if (!product) notFound();
  setRequestLocale(locale);
  const [common, t, relatedResult] = await Promise.all([
    getTranslations({ locale, namespace: "common" }),
    getTranslations({ locale, namespace: "marketplace" }),
    repositories.products.search({ categoryId: product.categoryId, pageSize: 5, inStockOnly: true }),
  ]);
  const related = relatedResult.items.filter((item) => item.id !== product.id).slice(0, 4);
  const labels: ProductCardLabels = { stock: common("available"), moq: common("moq"), unit: common("unitPrice"), details: t("viewProduct") };
  const productName = localizedText(product.name, locale);
  const numberLocale = locale === "pl" ? "pl-PL" : locale === "tr" ? "tr-TR" : "en-GB";
  const productSchema = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: productName,
    sku: product.sku,
    mpn: product.mpn,
    brand: { "@type": "Brand", name: product.manufacturer },
    image: product.imageUrl,
    description: localizedText(product.description, locale),
    offers: { "@type": "Offer", priceCurrency: product.basePrice.currency, price: product.basePrice.amount, availability: "https://schema.org/InStock" },
  };

  return (
    <main className="min-h-[70vh] pb-16">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(productSchema).replaceAll("<", "\\u003c") }} />
      <div className="container-shell py-7">
        <Breadcrumbs items={[{ label: common("catalog"), href: "/catalog" }, { label: localizedText(product.categoryName, locale), href: `/catalog/${product.categoryId}` }, { label: product.mpn }]} />

        <section className="mt-6 grid gap-8 rounded-2xl border border-border bg-white p-5 shadow-sm sm:p-7 lg:grid-cols-[1fr_1.05fr]">
          <div>
            <div className="relative aspect-square overflow-hidden rounded-xl bg-gradient-to-br from-slate-50 to-[#e8f1f8]">
              <Image src={product.imageUrl} alt={productName} fill priority sizes="(max-width: 1024px) 90vw, 45vw" className="object-contain p-10" />
            </div>
            <div className="mt-3 grid grid-cols-3 gap-3">
              {[t("studioView"), t("packageView"), t("technicalView")].map((label, index) => <div key={label} className={`flex aspect-[1.5/1] items-center justify-center rounded-lg border text-[0.6875rem] font-bold ${index === 0 ? "border-blue bg-blue/5 text-blue" : "border-border bg-slate-50 text-muted"}`}>{label}</div>)}
            </div>
          </div>

          <div className="flex flex-col">
            <div className="flex flex-wrap items-center gap-2"><Badge tone="success">{common("available")}</Badge><Badge>{product.manufacturer}</Badge></div>
            <h1 className="mt-4 text-3xl font-black leading-tight tracking-[-0.04em] text-navy sm:text-4xl">{productName}</h1>
            <p className="mt-3 text-sm leading-6 text-muted">{localizedText(product.description, locale)}</p>
            <dl className="mt-5 grid grid-cols-2 gap-x-5 gap-y-3 rounded-lg bg-slate-50 p-4 text-xs">
              <Detail label="MPN" value={product.mpn} mono /><Detail label="SKU" value={product.sku} mono /><Detail label={common("manufacturer")} value={product.manufacturer} /><Detail label={t("packaging")} value={product.packagingType} />
            </dl>
            <div className="mt-6 border-y border-border py-5">
              <p className="text-xs font-bold uppercase tracking-[0.08em] text-muted">{common("unitPrice")}</p>
              <div className="mt-1 flex flex-wrap items-end gap-3"><p className="text-4xl font-black tracking-[-0.04em] text-navy">{formatMoney(product.basePrice, locale)}</p><p className="pb-1 text-xs text-muted">/ {t("pieceUnit")}</p></div>
              <div className="mt-4 flex flex-wrap gap-x-6 gap-y-2 text-xs"><span className="flex items-center gap-2 font-bold text-success"><PackageCheck className="size-4" />{product.stock.toLocaleString(numberLocale)} {t("pieceUnit")} {common("stock").toLowerCase()}</span><span className="flex items-center gap-2 text-slate-700"><Clock3 className="size-4 text-blue" />{product.leadTimeDays} {t("businessDays")}</span><span className="flex items-center gap-2 text-slate-700"><Box className="size-4 text-blue" />MOQ {product.moq}</span></div>
            </div>
            <AddToCartButton productId={product.id} sku={product.sku} name={productName} moq={product.moq} increment={product.quantityIncrement} unitPrice={product.basePrice} imageUrl={product.imageUrl} className="mt-6 min-h-12 w-full text-sm" />
            <Button asChild variant="secondary" className="mt-3 w-full"><Link href={`/compare?ids=${product.id}`}>{common("compare")}</Link></Button>
            <div className="mt-5 grid gap-3 sm:grid-cols-3"><Feature icon={ShieldCheck} text={t("genuineProduct")} /><Feature icon={Truck} text={t("fastDispatch")} /><Feature icon={FileText} text={t("technicalSupport")} /></div>
          </div>
        </section>

        <div className="mt-8 grid gap-7 lg:grid-cols-[1fr_0.75fr]">
          <section className="rounded-xl border border-border bg-white p-5 sm:p-7"><h2 className="text-xl font-black text-navy">{t("technicalSpecs")}</h2><dl className="mt-5 divide-y divide-border">{product.attributes.map((attribute) => <div key={attribute.code} className="grid grid-cols-[1fr_1.2fr] gap-4 py-3 text-sm"><dt className="text-muted">{localizedText(attribute.label, locale)}</dt><dd className="font-bold text-navy">{attribute.value}{attribute.unit ? ` ${attribute.unit}` : ""}</dd></div>)}<div className="grid grid-cols-[1fr_1.2fr] gap-4 py-3 text-sm"><dt className="text-muted">{t("packaging")}</dt><dd className="font-bold capitalize text-navy">{product.packagingType}</dd></div></dl></section>
          <section className="rounded-xl border border-border bg-white p-5 sm:p-7"><h2 className="text-xl font-black text-navy">{t("volumePricing")}</h2><p className="mt-2 text-xs leading-5 text-muted">{t("volumePricingText")}</p><div className="mt-5 overflow-hidden rounded-lg border border-border"><table className="w-full text-left text-sm"><thead className="bg-slate-50 text-xs text-muted"><tr><th className="px-4 py-3">{t("quantity")}</th><th className="px-4 py-3 text-right">{common("unitPrice")}</th></tr></thead><tbody className="divide-y divide-border">{product.volumePrices.map((tier) => <tr key={tier.minQuantity}><td className="px-4 py-3 font-bold">{tier.minQuantity.toLocaleString(numberLocale)}+ {t("pieceUnit")}</td><td className="px-4 py-3 text-right font-extrabold text-navy">{formatMoney(tier.unitPrice, locale)}</td></tr>)}</tbody></table></div><p className="mt-4 flex items-center gap-2 text-xs text-success"><CheckCircle2 className="size-4" />{t("tierAutomatic")}</p></section>
        </div>

        {related.length > 0 && <section className="mt-12"><div className="mb-6"><p className="eyebrow">{t("relatedEyebrow")}</p><h2 className="mt-2 text-2xl font-black tracking-tight text-navy">{t("relatedProducts")}</h2></div><ProductGrid products={related} locale={locale} labels={labels} /></section>}
      </div>
    </main>
  );
}

function Detail({ label, value, mono }: { label: string; value: string; mono?: boolean }) { return <div><dt className="text-muted">{label}</dt><dd className={`mt-1 font-bold text-navy ${mono ? "font-mono" : ""}`}>{value}</dd></div>; }
function Feature({ icon: Icon, text }: { icon: typeof ShieldCheck; text: string }) { return <div className="flex items-center gap-2 text-[0.6875rem] font-semibold text-slate-600"><Icon className="size-4 shrink-0 text-cyan" />{text}</div>; }
