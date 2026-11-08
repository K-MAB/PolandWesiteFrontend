import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";

import { Breadcrumbs } from "@/components/catalog/breadcrumbs";
import { CartPageClient } from "@/features/cart/cart-page-client";
import type { AppLocale } from "@/i18n/routing";

export async function generateMetadata({ params }: { params: Promise<{ locale: AppLocale }> }): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "marketplace" });
  return { title: `${t("cartPageTitle")} | Vistula Components` };
}

export default async function CartPage({ params }: { params: Promise<{ locale: AppLocale }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  const [common, t] = await Promise.all([getTranslations({ locale, namespace: "common" }), getTranslations({ locale, namespace: "marketplace" })]);
  return (
    <main className="min-h-[70vh] pb-16">
      <section className="border-b border-border bg-white"><div className="container-shell py-8"><Breadcrumbs items={[{ label: common("cart") }]} /><h1 className="mt-5 text-3xl font-black tracking-[-0.04em] text-navy sm:text-4xl">{t("cartPageTitle")}</h1><p className="mt-2 text-sm text-muted">{t("cartPageDescription")}</p></div></section>
      <div className="container-shell py-8"><CartPageClient locale={locale} labels={{ emptyTitle: t("cartEmptyTitle"), emptyText: t("cartEmptyText"), browse: t("browseProducts"), title: t("cartLines"), itemCount: t("cartItemCount"), orderTotal: t("orderTotal"), clear: t("clearCart"), checkout: t("checkout"), checkoutNote: t("checkoutNote"), remove: t("remove"), quantity: t("quantity"), unitPrice: common("unitPrice") }} /></div>
    </main>
  );
}
