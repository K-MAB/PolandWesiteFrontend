import { ArrowRight, Box, FileCheck2, PackageCheck, ShieldCheck, Truck } from "lucide-react";
import Image from "next/image";
import { getTranslations, setRequestLocale } from "next-intl/server";

import { CategoryCard } from "@/components/catalog/category-card";
import { ProductGrid, type ProductCardLabels } from "@/components/catalog/product-card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { catalogCategories } from "@/config/catalog";
import { formatMoney } from "@/core/services/commerce";
import { Link } from "@/i18n/navigation";
import type { AppLocale } from "@/i18n/routing";
import { repositories } from "@/infrastructure/repositories";
import { localizedText } from "@/lib/utils";

export default async function HomePage({ params }: { params: Promise<{ locale: AppLocale }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  const [t, common, marketplace, popularResult, automationResult, selectedResult] = await Promise.all([
    getTranslations({ locale, namespace: "home" }),
    getTranslations({ locale, namespace: "common" }),
    getTranslations({ locale, namespace: "marketplace" }),
    repositories.products.search({ pageSize: 50, inStockOnly: true, sort: "stock-desc" }),
    repositories.products.search({ categoryId: "automation", pageSize: 10, inStockOnly: true }),
    repositories.products.search({ pageSize: 50, inStockOnly: true, sort: "price-desc" }),
  ]);

  const productLabels: ProductCardLabels = {
    stock: common("available"),
    moq: common("moq"),
    unit: common("unitPrice"),
    details: marketplace("viewProduct"),
  };
  const popular = distinctProductFamilies(popularResult.items).slice(0, 8);
  const automation = distinctProductFamilies(automationResult.items);
  const selected = distinctProductFamilies(selectedResult.items).slice(0, 4);
  const heroProduct = selected[0]!;
  const categoryCount = (id: string) => id === "microcontrollers" || id === "passives" || id === "automation" ? 10 : 5;

  const organizationSchema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "Vistula Components",
    url: process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000",
    address: { "@type": "PostalAddress", addressCountry: "PL", addressLocality: "Warszawa" },
    areaServed: "European Union",
  };

  return (
    <main>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema).replaceAll("<", "\\u003c") }} />

      <section className="overflow-hidden bg-navy text-white">
        <div className="technical-grid">
          <div className="container-shell grid min-h-[520px] items-center gap-10 py-12 lg:grid-cols-[1.05fr_0.95fr] lg:py-16">
            <div className="max-w-2xl">
              <p className="mb-4 flex items-center gap-2 text-xs font-extrabold uppercase tracking-[0.16em] text-cyan"><span className="size-1.5 rounded-full bg-cyan" />{t("eyebrow")}</p>
              <h1 className="text-4xl font-black leading-[1.05] tracking-[-0.045em] sm:text-5xl lg:text-[3.65rem]">{t("heroTitle")}</h1>
              <p className="mt-5 max-w-xl text-base leading-7 text-slate-300 sm:text-lg">{t("heroDescription")}</p>
              <div className="mt-8 flex flex-wrap gap-3">
                <Button asChild size="lg" variant="cyan"><Link href="/catalog">{t("browseCatalog")}<ArrowRight className="size-4" /></Link></Button>
                <Button asChild size="lg" variant="secondary" className="border-white/20 bg-white/5 text-white hover:bg-white/10"><Link href="/catalog/automation">{marketplace("automationCta")}</Link></Button>
              </div>
              <div className="mt-9 flex flex-wrap gap-x-6 gap-y-3 border-t border-white/10 pt-5 text-xs text-slate-300">
                <span className="flex items-center gap-2"><PackageCheck className="size-4 text-cyan" />48k+ {t("productsInStock")}</span>
                <span className="flex items-center gap-2"><Truck className="size-4 text-cyan" />{t("dispatch")}</span>
                <span className="flex items-center gap-2"><ShieldCheck className="size-4 text-cyan" />{marketplace("verifiedSupply")}</span>
              </div>
            </div>

            <Link href={`/products/${heroProduct.id}`} className="group relative mx-auto w-full max-w-xl overflow-hidden rounded-2xl border border-white/10 bg-white text-navy shadow-2xl shadow-black/25">
              <div className="flex items-center justify-between border-b border-border px-5 py-3"><Badge tone="info">{marketplace("topStock")}</Badge><span className="text-xs font-bold text-muted">{heroProduct.manufacturer}</span></div>
              <div className="grid items-center sm:grid-cols-[1.05fr_0.95fr]">
                <div className="relative aspect-square bg-gradient-to-br from-slate-50 to-[#e9f2fa]">
                  <Image src={heroProduct.imageUrl} alt={localizedText(heroProduct.name, locale)} fill priority sizes="300px" className="object-contain p-7 transition duration-300 group-hover:scale-105" />
                </div>
                <div className="p-5 sm:p-6">
                  <p className="font-mono text-xs font-semibold text-blue">{heroProduct.mpn}</p>
                  <h2 className="mt-2 text-xl font-extrabold leading-tight">{localizedText(heroProduct.name, locale)}</h2>
                  <p className="mt-3 text-sm leading-6 text-muted">{localizedText(heroProduct.description, locale)}</p>
                  <p className="mt-5 text-2xl font-black">{formatMoney(heroProduct.basePrice, locale)}</p>
                  <p className="text-[0.6875rem] text-muted">{common("unitPrice")} / pcs · MOQ {heroProduct.moq}</p>
                  <span className="mt-5 flex items-center gap-2 text-xs font-bold text-blue">{marketplace("viewProduct")}<ArrowRight className="size-3.5" /></span>
                </div>
              </div>
            </Link>
          </div>
        </div>
      </section>

      <section className="border-b border-border bg-white py-4">
        <div className="container-shell grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          <TrustItem icon={ShieldCheck} title={marketplace("trustAuthentic")} text={marketplace("trustAuthenticText")} />
          <TrustItem icon={Truck} title={marketplace("trustDelivery")} text={marketplace("trustDeliveryText")} />
          <TrustItem icon={FileCheck2} title={marketplace("trustDatasheets")} text={marketplace("trustDatasheetsText")} />
          <TrustItem icon={Box} title={marketplace("trustMoq")} text={marketplace("trustMoqText")} />
        </div>
      </section>

      <section className="py-12 sm:py-16">
        <div className="container-shell">
          <SectionHeading eyebrow={t("categoryEyebrow")} title={t("categoryTitle")} description={t("categoryDescription")} href="/catalog" linkLabel={marketplace("allCategories")} />
          <div className="mt-7 grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {catalogCategories.map((category) => <CategoryCard key={category.id} category={category} locale={locale} productCountLabel={`${categoryCount(category.id)} ${t("products")}`} />)}
          </div>
        </div>
      </section>

      <section className="border-y border-border bg-white py-12 sm:py-16">
        <div className="container-shell">
          <SectionHeading eyebrow={marketplace("popularEyebrow")} title={marketplace("popularTitle")} description={marketplace("popularDescription")} href="/catalog?sort=stock-desc" linkLabel={marketplace("seeAll")} />
          <div className="mt-7"><ProductGrid products={popular} locale={locale} labels={productLabels} /></div>
        </div>
      </section>

      <section className="py-12 sm:py-16">
        <div className="container-shell">
          <div className="grid gap-5 lg:grid-cols-[0.72fr_1.28fr]">
            <div className="technical-grid flex min-h-80 flex-col justify-end overflow-hidden rounded-2xl bg-blue p-7 text-white sm:p-9">
              <Badge className="w-fit bg-white/10 text-white ring-white/15">{marketplace("automationBadge")}</Badge>
              <h2 className="mt-4 max-w-sm text-3xl font-black tracking-[-0.035em]">{marketplace("automationTitle")}</h2>
              <p className="mt-3 max-w-md text-sm leading-6 text-blue-100">{marketplace("automationDescription")}</p>
              <Button asChild variant="secondary" className="mt-6 w-fit border-white/20 bg-white text-blue"><Link href="/catalog/automation">{marketplace("browseAutomation")}<ArrowRight className="size-4" /></Link></Button>
            </div>
            <ProductGrid products={automation} locale={locale} labels={productLabels} className="lg:grid-cols-2 xl:grid-cols-2" />
          </div>
        </div>
      </section>

      <section className="border-y border-border bg-white py-12 sm:py-16">
        <div className="container-shell">
          <SectionHeading eyebrow={marketplace("selectedEyebrow")} title={marketplace("selectedTitle")} description={marketplace("selectedDescription")} href="/catalog" linkLabel={marketplace("seeAll")} />
          <div className="mt-7"><ProductGrid products={selected} locale={locale} labels={productLabels} /></div>
        </div>
      </section>

      <section className="bg-[#e7f1f6] py-12 sm:py-16">
        <div className="container-shell flex flex-col items-start justify-between gap-8 rounded-2xl border border-white bg-white/70 p-7 shadow-card sm:p-10 lg:flex-row lg:items-center">
          <div className="max-w-2xl"><p className="eyebrow">{t("shoppingEyebrow")}</p><h2 className="mt-3 text-3xl font-black tracking-[-0.035em] text-navy">{t("shoppingTitle")}</h2><p className="mt-3 text-sm leading-6 text-muted">{t("shoppingDescription")}</p></div>
          <Button asChild size="lg"><Link href="/catalog">{t("shoppingCta")}<ArrowRight className="size-4" /></Link></Button>
        </div>
      </section>
    </main>
  );
}

function TrustItem({ icon: Icon, title, text }: { icon: typeof ShieldCheck; title: string; text: string }) {
  return <div className="flex items-center gap-3 px-2 py-2"><span className="grid size-10 shrink-0 place-items-center rounded-full bg-cyan/10 text-cyan"><Icon className="size-5" /></span><span><strong className="block text-xs text-navy">{title}</strong><span className="mt-0.5 block text-[0.6875rem] text-muted">{text}</span></span></div>;
}

function SectionHeading({ eyebrow, title, description, href, linkLabel }: { eyebrow: string; title: string; description: string; href: string; linkLabel: string }) {
  return <div className="flex flex-wrap items-end justify-between gap-5"><div className="max-w-2xl"><p className="eyebrow">{eyebrow}</p><h2 className="mt-2 text-2xl font-black tracking-[-0.03em] text-navy sm:text-3xl">{title}</h2><p className="mt-2 text-sm leading-6 text-muted">{description}</p></div><Link href={href} className="flex items-center gap-1.5 text-sm font-bold text-blue hover:underline">{linkLabel}<ArrowRight className="size-4" /></Link></div>;
}

function distinctProductFamilies<T extends { imageUrl: string }>(products: readonly T[]): T[] {
  const seen = new Set<string>();
  return products.filter((product) => {
    if (seen.has(product.imageUrl)) return false;
    seen.add(product.imageUrl);
    return true;
  });
}
