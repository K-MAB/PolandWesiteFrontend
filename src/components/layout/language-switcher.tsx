import { Languages } from "lucide-react";

import { Link } from "@/i18n/navigation";
import type { AppLocale } from "@/i18n/routing";

const localeNames: Record<AppLocale, string> = { pl: "PL", en: "EN", tr: "TR" };

export function LanguageSwitcher({ locale, label }: { locale: AppLocale; label: string }) {
  return (
    <div className="flex items-center gap-1" aria-label={label}>
      <Languages className="mr-1 size-3.5 text-slate-400" aria-hidden="true" />
      {(Object.keys(localeNames) as AppLocale[]).map((item) => (
        <Link
          key={item}
          href="/"
          locale={item}
          className={item === locale
            ? "rounded px-1.5 py-1 text-[0.6875rem] font-bold text-white ring-1 ring-white/25"
            : "rounded px-1.5 py-1 text-[0.6875rem] font-semibold text-slate-300 hover:text-white"}
          aria-current={item === locale ? "page" : undefined}
        >
          {localeNames[item]}
        </Link>
      ))}
    </div>
  );
}
