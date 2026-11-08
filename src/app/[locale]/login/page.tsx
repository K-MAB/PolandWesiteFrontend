import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";

import { Logo } from "@/components/brand/logo";
import { LoginForm } from "@/features/workflows/workflow-forms";
import { Link } from "@/i18n/navigation";
import type { AppLocale } from "@/i18n/routing";

export const metadata: Metadata = { title: "Sign in | Vistula Components", robots: { index: false, follow: false } };

export default async function LoginPage({ params }: { params: Promise<{ locale: AppLocale }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  const [t, common] = await Promise.all([getTranslations({ locale, namespace: "portal" }), getTranslations({ locale, namespace: "common" })]);
  return <main className="grid min-h-screen place-items-center bg-[radial-gradient(circle_at_top_left,rgba(8,127,156,.16),transparent_36%),#f3f6fa] p-4 sm:p-8">
    <div className="w-full max-w-4xl"><Link href="/" className="mb-8 inline-block rounded-md bg-white px-4 py-3 shadow-sm"><Logo tagline={common("brandTagline")} /></Link><div className="mb-7"><p className="eyebrow">{t("customerAccount")}</p><h1 className="mt-3 text-3xl font-black tracking-[-0.04em] text-navy sm:text-4xl">{t("loginTitle")}</h1><p className="mt-2 text-sm text-muted">{t("loginText")}</p></div><LoginForm /></div>
  </main>;
}
