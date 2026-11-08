import type { Metadata } from "next";
import { hasLocale, NextIntlClientProvider } from "next-intl";
import { getMessages, getTranslations, setRequestLocale } from "next-intl/server";
import { notFound } from "next/navigation";
import type { ReactNode } from "react";

import { routing } from "@/i18n/routing";
import { StorefrontFooter } from "@/components/layout/storefront-footer";
import { StorefrontHeader } from "@/components/layout/storefront-header";
import { RouteChrome } from "@/components/layout/route-chrome";

import "../globals.css";
import { AppProviders } from "../providers";

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) notFound();
  const t = await getTranslations({ locale, namespace: "metadata" });
  const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";

  return {
    metadataBase: new URL(appUrl),
    title: t("title"),
    description: t("description"),
    applicationName: "Vistula Components",
    alternates: {
      canonical: `/${locale}`,
      languages: { pl: "/pl", en: "/en", tr: "/tr", "x-default": "/pl" },
    },
    openGraph: {
      type: "website",
      locale: locale === "pl" ? "pl_PL" : locale === "tr" ? "tr_TR" : "en_GB",
      title: t("title"),
      description: t("description"),
      siteName: "Vistula Components",
    },
    robots: { index: true, follow: true },
  };
}

export default async function LocaleLayout({ children, params }: { children: ReactNode; params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) notFound();
  setRequestLocale(locale);
  const messages = await getMessages({ locale });

  return (
    <html lang={locale} className="h-full antialiased" data-scroll-behavior="smooth">
      <body className="min-h-full">
        <NextIntlClientProvider locale={locale} messages={messages}>
          <AppProviders>
            <RouteChrome header={<StorefrontHeader locale={locale} />} footer={<StorefrontFooter locale={locale} />}>
              {children}
            </RouteChrome>
          </AppProviders>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
