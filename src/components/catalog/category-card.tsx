import { ArrowRight } from "lucide-react";
import Image from "next/image";

import type { CatalogCategory } from "@/config/catalog";
import { Link } from "@/i18n/navigation";
import type { AppLocale } from "@/i18n/routing";
import { localizedText } from "@/lib/utils";

export function CategoryCard({ category, locale, productCountLabel }: { category: CatalogCategory; locale: AppLocale; productCountLabel: string }) {
  return (
    <Link href={`/catalog/${category.id}`} className="group grid min-h-40 grid-cols-[1fr_7.5rem] overflow-hidden rounded-xl border border-border bg-white shadow-sm transition hover:-translate-y-0.5 hover:border-blue/25 hover:shadow-card">
      <span className="flex flex-col justify-between p-4">
        <span>
          <span className="block text-sm font-extrabold text-navy group-hover:text-blue">{localizedText(category.name, locale)}</span>
          <span className="mt-2 line-clamp-2 block text-xs leading-5 text-muted">{localizedText(category.description, locale)}</span>
        </span>
        <span className="flex items-center gap-1.5 text-[0.6875rem] font-bold text-blue">{productCountLabel}<ArrowRight className="size-3" /></span>
      </span>
      <span className="relative bg-gradient-to-br from-slate-50 to-[#e9f1fa]">
        <Image src={category.imageUrl} alt="" fill sizes="120px" className="object-contain p-3 transition duration-300 group-hover:scale-105" />
      </span>
    </Link>
  );
}
