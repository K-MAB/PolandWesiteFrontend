"use client";

import { ShoppingCart } from "lucide-react";
import { useTranslations } from "next-intl";

import { Link } from "@/i18n/navigation";

import { useCartStore } from "./cart-store";

export function CartIndicator() {
  const t = useTranslations("common");
  const count = useCartStore((state) => state.lines.length);

  return (
    <Link href="/cart" className="relative flex min-h-10 items-center gap-2 rounded-md px-2 text-sm font-semibold text-navy hover:bg-slate-100">
      <ShoppingCart className="size-5" aria-hidden="true" />
      <span className="hidden lg:inline">{t("cart")}</span>
      <span className="flex size-5 items-center justify-center rounded-full bg-blue text-[0.6875rem] font-bold text-white" aria-label={`${count} ${t("cart")}`}>
        {count}
      </span>
    </Link>
  );
}
