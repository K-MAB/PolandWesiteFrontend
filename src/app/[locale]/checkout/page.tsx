import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";

import { WorkflowPage } from "@/components/layout/workflow-page";
import { CheckoutForm } from "@/features/workflows/workflow-forms";
import type { AppLocale } from "@/i18n/routing";

export const metadata: Metadata = { title: "Checkout | Vistula Components", robots: { index: false, follow: false } };

export default async function CheckoutPage({ params }: { params: Promise<{ locale: AppLocale }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: "portal" });
  return <WorkflowPage eyebrow={t("secureCheckout")} title={t("checkoutTitle")} description={t("checkoutText")}><CheckoutForm locale={locale} /></WorkflowPage>;
}
