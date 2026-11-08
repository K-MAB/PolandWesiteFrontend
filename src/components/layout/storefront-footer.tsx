import { MapPin, Phone } from "lucide-react";
import { getTranslations } from "next-intl/server";

import { Logo } from "@/components/brand/logo";
import { Link } from "@/i18n/navigation";
import type { AppLocale } from "@/i18n/routing";

export async function StorefrontFooter({ locale }: { locale: AppLocale }) {
  const t = await getTranslations({ locale, namespace: "home" });
  const common = await getTranslations({ locale, namespace: "common" });

  return (
    <footer className="bg-navy text-slate-300">
      <div className="container-shell grid gap-10 py-12 md:grid-cols-[1.5fr_1fr_1fr_1fr]">
        <div>
          <div className="w-fit rounded-md bg-white px-3 py-2">
            <Logo tagline={common("brandTagline")} />
          </div>
          <p className="mt-5 max-w-sm text-sm leading-6 text-slate-400">{t("footerDescription")}</p>
          <div className="mt-5 space-y-2 text-xs text-slate-400">
            <p className="flex items-center gap-2"><MapPin className="size-4" aria-hidden="true" />ul. Przemysłowa 24, 02-232 Warszawa</p>
            <p className="flex items-center gap-2"><Phone className="size-4" aria-hidden="true" />+48 22 307 14 80</p>
          </div>
        </div>
        <FooterColumn title={t("footerPlatform")} links={[
          { label: common("catalog"), href: "/catalog" },
          { label: common("compare"), href: "/compare" },
          { label: common("cart"), href: "/cart" },
        ]} />
        <FooterColumn title={t("footerInformation")} links={[
          { label: common("manufacturers"), href: "/catalog" },
          { label: t("capability2Title"), href: "/catalog" },
          { label: common("support") },
        ]} />
        <FooterColumn title={t("footerLegal")} links={[
          { label: t("privacy") },
          { label: t("terms") },
          { label: t("gdpr") },
        ]} />
      </div>
      <div className="border-t border-white/10">
        <div className="container-shell flex min-h-14 flex-wrap items-center justify-between gap-2 py-3 text-xs text-slate-500">
          <p>{t("copyright")}</p>
          <p>{t("frontendDemo")} · Warszawa, PL</p>
        </div>
      </div>
    </footer>
  );
}

function FooterColumn({ title, links }: { title: string; links: readonly { label: string; href?: string }[] }) {
  return (
    <div>
      <h2 className="text-xs font-bold uppercase tracking-[0.14em] text-white">{title}</h2>
      <ul className="mt-4 space-y-3 text-sm">
        {links.map((link) => (
          <li key={link.label}>
            {link.href ? <Link href={link.href} className="hover:text-white">{link.label}</Link> : <span className="text-slate-500">{link.label}</span>}
          </li>
        ))}
      </ul>
    </div>
  );
}
