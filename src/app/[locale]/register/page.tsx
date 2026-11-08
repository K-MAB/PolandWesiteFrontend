import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";

import { Logo } from "@/components/brand/logo";
import { CustomerRegistrationForm } from "@/features/workflows/workflow-forms";
import { Link } from "@/i18n/navigation";
import type { AppLocale } from "@/i18n/routing";

export const metadata: Metadata = { title: "Create account | Vistula Components", robots: { index: false, follow: false } };
export default async function RegisterPage({ params }: { params: Promise<{ locale: AppLocale }> }) { const { locale } = await params; setRequestLocale(locale); const [t, common] = await Promise.all([getTranslations({ locale, namespace: "portal" }), getTranslations({ locale, namespace: "common" })]); return <main className="min-h-screen bg-[#f3f6fa] pb-16"><header className="border-b border-border bg-white"><div className="container-shell flex min-h-20 items-center justify-between"><Link href="/"><Logo tagline={common("brandTagline")} /></Link><Link href="/login" className="text-sm font-bold text-blue hover:underline">{t("signIn")}</Link></div></header><div className="container-shell py-10"><div className="mx-auto mb-8 max-w-2xl"><p className="eyebrow">{t("customerAccount")}</p><h1 className="mt-3 text-3xl font-black tracking-[-0.04em] text-navy sm:text-4xl">{t("registerTitle")}</h1><p className="mt-3 text-sm text-muted">{t("registerText")}</p></div><CustomerRegistrationForm /></div></main>; }
