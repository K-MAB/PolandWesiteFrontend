import type { Metadata } from "next";
import Image from "next/image";
import { notFound } from "next/navigation";
import { getTranslations, setRequestLocale } from "next-intl/server";

import { Breadcrumbs } from "@/components/catalog/breadcrumbs";
import { ProductGrid, type ProductCardLabels } from "@/components/catalog/product-card";
import { catalogCategories, findCatalogCategory } from "@/config/catalog";
import { Link } from "@/i18n/navigation";
import type { AppLocale } from "@/i18n/routing";
import { repositories } from "@/infrastructure/repositories";
import { localizedText } from "@/lib/utils";

export function generateStaticParams() { return catalogCategories.map((category) => ({ category: category.id })); }
export const instant = false;

export async function generateMetadata({ params }: { params: Promise<{ locale: AppLocale; category: string }> }): Promise<Metadata> {
  const { locale, category: categoryId } = await params;
  const category = findCatalogCategory(categoryId);
  if (!category) return {};
  return { title: `${localizedText(category.name, locale)} | Vistula Components`, description: localizedText(category.description, locale) };
}

export default async function CategoryPage({ params }: { params: Promise<{ locale: AppLocale; category: string }> }) {
  const { locale, category: categoryId } = await params;
  const category = findCatalogCategory(categoryId);
  if (!category) notFound();
  setRequestLocale(locale);
  const [common, t, products] = await Promise.all([
    getTranslations({ locale, namespace: "common" }),
    getTranslations({ locale, namespace: "marketplace" }),
    repositories.products.search({ categoryId, pageSize: 50, inStockOnly: true, sort: "stock-desc" }),
  ]);
  const labels: ProductCardLabels = { stock: common("available"), moq: common("moq"), unit: common("unitPrice"), details: t("viewProduct") };

  return (
    <main className="min-h-[70vh] pb-16">
      <section className="overflow-hidden border-b border-border bg-white">
        <div className="container-shell py-8 sm:py-10">
          <Breadcrumbs items={[{ label: common("catalog"), href: "/catalog" }, { label: localizedText(category.name, locale) }]} />
          <div className="mt-6 grid items-center gap-8 lg:grid-cols-[1fr_18rem]">
            <div><p className="eyebrow">{t("categoryEyebrow")}</p><h1 className="mt-2 text-3xl font-black tracking-[-0.04em] text-navy sm:text-4xl">{localizedText(category.name, locale)}</h1><p className="mt-3 max-w-2xl text-sm leading-6 text-muted">{localizedText(category.description, locale)}. {t("categoryIntro")}</p><p className="mt-4 text-xs font-bold text-blue">{t("productCount", { count: products.total })}</p></div>
            <div className="relative hidden aspect-[2/1] rounded-xl bg-gradient-to-br from-slate-50 to-[#e7f1f8] lg:block"><Image src={category.imageUrl} alt="" fill priority sizes="288px" className="object-contain p-5" /></div>
          </div>
          <nav className="mt-7 flex gap-2 overflow-x-auto pb-1" aria-label={t("allCategories")}>
            {catalogCategories.map((item) => <Link key={item.id} href={`/catalog/${item.id}`} className={`shrink-0 rounded-full border px-3 py-2 text-xs font-bold ${item.id === categoryId ? "border-blue bg-blue text-white" : "border-border bg-white text-slate-700 hover:border-blue"}`}>{localizedText(item.name, locale)}</Link>)}
          </nav>
        </div>
      </section>
      <section className="container-shell py-8">
        <div className="mb-5 flex items-center justify-between"><h2 className="text-xl font-extrabold text-navy">{t("productsInCategory")}</h2><Link href={`/catalog?category=${categoryId}`} className="text-xs font-bold text-blue hover:underline">{t("openWithFilters")}</Link></div>
        <ProductGrid products={products.items} locale={locale} labels={labels} priorityFirst />
      </section>
    </main>
  );
}
