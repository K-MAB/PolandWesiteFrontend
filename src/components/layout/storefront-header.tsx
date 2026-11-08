import { ChevronDown, Headphones, Search, UserRound } from "lucide-react";
import { getTranslations } from "next-intl/server";

import { Logo } from "@/components/brand/logo";
import { Button } from "@/components/ui/button";
import { CartIndicator } from "@/features/cart/cart-indicator";
import { Link } from "@/i18n/navigation";
import type { AppLocale } from "@/i18n/routing";

import { LanguageSwitcher } from "./language-switcher";

export async function StorefrontHeader({ locale }: { locale: AppLocale }) {
  const t = await getTranslations({ locale, namespace: "common" });

  return (
    <header className="sticky top-0 z-40 border-b border-border bg-white/95 backdrop-blur">
      <div className="bg-navy text-white">
        <div className="container-shell flex min-h-8 items-center justify-between gap-4 text-[0.6875rem]">
          <div className="flex items-center gap-4 text-slate-300 sm:gap-6">
            <span className="font-semibold text-white">{t("freeShipping")}</span>
            <span className="hidden sm:inline">{t("securePayments")}</span>
          </div>
          <div className="flex items-center gap-4">
            <span className="hidden items-center gap-1.5 text-slate-300 md:flex">
              <Headphones className="size-3.5" aria-hidden="true" />
              {t("support")}: +48 22 307 14 80
            </span>
            <LanguageSwitcher locale={locale} label={t("language")} />
          </div>
        </div>
      </div>

      <div className="container-shell flex min-h-20 items-center gap-5 py-3">
        <Link href="/" locale={locale} className="shrink-0" aria-label="Vistula Components home">
          <Logo tagline={t("brandTagline")} compactOnMobile />
        </Link>

        <form action={`/${locale}/catalog`} className="relative hidden flex-1 lg:block">
          <label htmlFor="header-search" className="sr-only">{t("search")}</label>
          <Search className="pointer-events-none absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-slate-400" aria-hidden="true" />
          <input
            id="header-search"
            name="q"
            type="search"
            placeholder={t("searchPlaceholder")}
            className="h-11 w-full rounded-md border border-slate-300 bg-slate-50 pl-10 pr-28 text-sm text-navy placeholder:text-slate-400 focus:border-blue focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue/10"
          />
          <Button type="submit" size="sm" className="absolute right-1.5 top-1/2 -translate-y-1/2">
            {t("search")}
          </Button>
        </form>

        <nav className="ml-auto flex items-center gap-1" aria-label="Account navigation">
          <Link href="/login" className="flex min-h-10 items-center gap-2 rounded-md px-2 text-sm font-semibold text-navy hover:bg-slate-50 hover:text-blue">
            <UserRound className="size-5" aria-hidden="true" />
            <span className="hidden xl:inline">{t("account")}</span>
          </Link>
          <CartIndicator />
        </nav>
      </div>

      <div className="border-t border-slate-100">
        <nav className="no-scrollbar container-shell flex min-h-11 items-center gap-7 overflow-x-auto text-sm font-semibold text-slate-700" aria-label="Catalog navigation">
          <Link href="/catalog" className="flex shrink-0 items-center gap-1.5 text-navy hover:text-blue">
            {t("categories")}
            <ChevronDown className="size-3.5" aria-hidden="true" />
          </Link>
          <Link href="/catalog?sort=stock-desc" className="shrink-0 hover:text-blue">{t("popular")}</Link>
          <Link href="/catalog/automation" className="shrink-0 hover:text-blue">{t("automation")}</Link>
          <Link href="/compare" className="shrink-0 hover:text-blue">{t("compare")}</Link>
          <span className="ml-auto hidden rounded bg-cyan/10 px-2.5 py-1 text-[0.6875rem] font-bold uppercase tracking-[0.12em] text-cyan lg:inline">
            Vistula Official Store
          </span>
        </nav>
      </div>
    </header>
  );
}
