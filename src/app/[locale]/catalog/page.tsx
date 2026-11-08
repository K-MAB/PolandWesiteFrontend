import type { Metadata } from "next";
import { Filter, Search, SlidersHorizontal } from "lucide-react";
import { getTranslations, setRequestLocale } from "next-intl/server";

import { Breadcrumbs } from "@/components/catalog/breadcrumbs";
import { ProductGrid, type ProductCardLabels } from "@/components/catalog/product-card";
import { Button } from "@/components/ui/button";
import { catalogCategories, catalogManufacturers } from "@/config/catalog";
import type { ProductSearch } from "@/core/repositories/contracts";
import { Link } from "@/i18n/navigation";
import type { AppLocale } from "@/i18n/routing";
import { repositories } from "@/infrastructure/repositories";
import { localizedText } from "@/lib/utils";

type SearchParams = Record<string, string | string[] | undefined>;

export const instant = false;

export async function generateMetadata({ params }: { params: Promise<{ locale: AppLocale }> }): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "marketplace" });
  return { title: `${t("catalogTitle")} | Vistula Components`, description: t("catalogDescription") };
}

export default async function CatalogPage({ params, searchParams }: { params: Promise<{ locale: AppLocale }>; searchParams: Promise<SearchParams> }) {
  const { locale } = await params;
  const raw = await searchParams;
  setRequestLocale(locale);
  const [common, t] = await Promise.all([
    getTranslations({ locale, namespace: "common" }),
    getTranslations({ locale, namespace: "marketplace" }),
  ]);

  const query = first(raw.q);
  const categoryId = first(raw.category);
  const manufacturer = first(raw.manufacturer);
  const sort = validSort(first(raw.sort));
  const page = Math.max(1, Number.parseInt(first(raw.page) ?? "1", 10) || 1);
  const inStockOnly = first(raw.inStock) === "1";
  const result = await repositories.products.search({ query, categoryId, manufacturer, sort, page, pageSize: 12, inStockOnly });
  const labels: ProductCardLabels = { stock: common("available"), moq: common("moq"), unit: common("unitPrice"), details: t("viewProduct") };
  const totalPages = Math.max(1, Math.ceil(result.total / result.pageSize));

  return (
    <main className="min-h-[70vh] pb-16">
      <section className="border-b border-border bg-white">
        <div className="container-shell py-8 sm:py-10">
          <Breadcrumbs items={[{ label: common("catalog") }]} />
          <div className="mt-5 flex flex-wrap items-end justify-between gap-4">
            <div><p className="eyebrow">{t("catalogEyebrow")}</p><h1 className="mt-2 text-3xl font-black tracking-[-0.04em] text-navy sm:text-4xl">{t("catalogTitle")}</h1><p className="mt-3 max-w-2xl text-sm leading-6 text-muted">{t("catalogDescription")}</p></div>
            <p className="rounded-full bg-slate-100 px-3 py-1.5 text-xs font-bold text-slate-700">{t("productCount", { count: result.total })}</p>
          </div>
        </div>
      </section>

      <div className="container-shell grid gap-7 py-8 lg:grid-cols-[15rem_1fr]">
        <aside>
          <form action={`/${locale}/catalog`} className="sticky top-44 space-y-6 rounded-xl border border-border bg-white p-5 shadow-sm">
            <div className="flex items-center gap-2 border-b border-border pb-4"><Filter className="size-4 text-blue" /><h2 className="text-sm font-extrabold text-navy">{t("filters")}</h2></div>
            <label className="block"><span className="text-xs font-bold text-navy">{common("search")}</span><span className="relative mt-2 block"><Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted" /><input name="q" type="search" defaultValue={query} placeholder={common("searchPlaceholder")} className="h-10 w-full rounded-md border border-slate-300 pl-9 pr-3 text-xs focus:border-blue focus:outline-none" /></span></label>
            <FilterSelect label={common("categories")} name="category" defaultValue={categoryId ?? ""} options={catalogCategories.map((category) => ({ value: category.id, label: localizedText(category.name, locale) }))} allLabel={t("allCategories")} />
            <FilterSelect label={common("manufacturers")} name="manufacturer" defaultValue={manufacturer ?? ""} options={catalogManufacturers.map((name) => ({ value: name, label: name }))} allLabel={t("allManufacturers")} />
            <label className="flex cursor-pointer items-center gap-2 text-xs font-semibold text-slate-700"><input type="checkbox" name="inStock" value="1" defaultChecked={inStockOnly} className="size-4 rounded border-slate-300 accent-blue" />{t("inStockOnly")}</label>
            <input type="hidden" name="sort" value={sort ?? "relevance"} />
            <Button type="submit" className="w-full"><SlidersHorizontal className="size-4" />{t("applyFilters")}</Button>
            <Link href="/catalog" className="block text-center text-xs font-bold text-muted hover:text-blue">{common("clear")}</Link>
          </form>
        </aside>

        <section>
          <div className="mb-5 flex flex-wrap items-center justify-between gap-3 rounded-lg border border-border bg-white px-4 py-3">
            <p className="text-xs text-muted">{t("showingRange", { from: result.total === 0 ? 0 : (page - 1) * result.pageSize + 1, to: Math.min(page * result.pageSize, result.total), total: result.total })}</p>
            <form action={`/${locale}/catalog`} className="flex items-center gap-2">
              {query && <input type="hidden" name="q" value={query} />}{categoryId && <input type="hidden" name="category" value={categoryId} />}{manufacturer && <input type="hidden" name="manufacturer" value={manufacturer} />}{inStockOnly && <input type="hidden" name="inStock" value="1" />}
              <label htmlFor="sort" className="text-xs font-bold text-navy">{t("sortBy")}</label>
              <select id="sort" name="sort" defaultValue={sort ?? "relevance"} onChange={undefined} className="h-9 rounded-md border border-slate-300 bg-white px-2 text-xs" aria-label={t("sortBy")}>{sortOptions(t).map((option) => <option key={option.value} value={option.value}>{option.label}</option>)}</select>
              <Button type="submit" size="sm" variant="secondary">{t("sort")}</Button>
            </form>
          </div>

          {result.items.length ? <ProductGrid products={result.items} locale={locale} labels={labels} priorityFirst /> : <div className="grid min-h-72 place-items-center rounded-xl border border-dashed border-slate-300 bg-white p-8 text-center"><div><Search className="mx-auto size-8 text-slate-400" /><h2 className="mt-3 font-extrabold text-navy">{t("noProducts")}</h2><p className="mt-2 text-sm text-muted">{t("noProductsText")}</p><Button asChild className="mt-5" variant="secondary"><Link href="/catalog">{common("clear")}</Link></Button></div></div>}

          {totalPages > 1 && <nav aria-label="Pagination" className="mt-8 flex justify-center gap-2">{Array.from({ length: totalPages }, (_, index) => index + 1).map((targetPage) => <Link key={targetPage} href={catalogHref(raw, targetPage)} className={`grid size-10 place-items-center rounded-md border text-sm font-bold ${targetPage === page ? "border-blue bg-blue text-white" : "border-border bg-white text-navy hover:border-blue"}`}>{targetPage}</Link>)}</nav>}
        </section>
      </div>
    </main>
  );
}

function first(value: string | string[] | undefined): string | undefined { return Array.isArray(value) ? value[0] : value; }
function validSort(value?: string): ProductSearch["sort"] { return ["relevance", "price-asc", "price-desc", "stock-desc", "name-asc"].includes(value ?? "") ? value as ProductSearch["sort"] : "relevance"; }
function catalogHref(raw: SearchParams, page: number) { const params = new URLSearchParams(); for (const key of ["q", "category", "manufacturer", "sort", "inStock"]) { const value = first(raw[key]); if (value) params.set(key, value); } params.set("page", String(page)); return `/catalog?${params.toString()}`; }

function FilterSelect({ label, name, defaultValue, options, allLabel }: { label: string; name: string; defaultValue: string; options: readonly { value: string; label: string }[]; allLabel: string }) {
  return <label className="block"><span className="text-xs font-bold text-navy">{label}</span><select name={name} defaultValue={defaultValue} className="mt-2 h-10 w-full rounded-md border border-slate-300 bg-white px-2 text-xs"><option value="">{allLabel}</option>{options.map((option) => <option key={option.value} value={option.value}>{option.label}</option>)}</select></label>;
}

function sortOptions(t: Awaited<ReturnType<typeof getTranslations>>) { return [{ value: "relevance", label: t("sortRelevance") }, { value: "price-asc", label: t("sortPriceAsc") }, { value: "price-desc", label: t("sortPriceDesc") }, { value: "stock-desc", label: t("sortStock") }, { value: "name-asc", label: t("sortName") }]; }
