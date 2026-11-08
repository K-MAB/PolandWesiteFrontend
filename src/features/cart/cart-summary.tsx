"use client";

import { PackageOpen, Trash2, X } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";

import { Button } from "@/components/ui/button";
import { formatMoney } from "@/core/services/commerce";
import type { AppLocale } from "@/i18n/routing";

import { useCartStore } from "./cart-store";

export function CartSummary() {
  const t = useTranslations("home");
  const common = useTranslations("common");
  const marketplace = useTranslations("marketplace");
  const locale = useLocale() as AppLocale;
  const lines = useCartStore((state) => state.lines);
  const clear = useCartStore((state) => state.clear);
  const removeLine = useCartStore((state) => state.removeLine);
  const total = lines.reduce((sum, line) => sum + line.unitPrice.amount * line.quantity, 0);

  return (
    <section id="cart-summary" className="scroll-mt-40 border-y border-border bg-white py-10 sm:py-14">
      <div className="container-shell">
        <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="eyebrow">{common("cart")}</p>
            <h2 className="mt-2 text-2xl font-bold tracking-tight text-navy">{t("cartTitle")}</h2>
            <p className="mt-1 text-sm text-muted">{t("cartDescription")}</p>
          </div>
          {lines.length > 0 && (
            <Button variant="ghost" size="sm" onClick={clear}>
              <Trash2 className="size-4" aria-hidden="true" />
              {common("clear")}
            </Button>
          )}
        </div>

        {lines.length === 0 ? (
          <div className="flex min-h-36 flex-col items-center justify-center rounded-lg border border-dashed border-slate-300 bg-slate-50 px-6 text-center">
            <PackageOpen className="mb-3 size-7 text-slate-400" aria-hidden="true" />
            <p className="text-sm text-muted">{t("cartEmpty")}</p>
          </div>
        ) : (
          <div className="overflow-hidden rounded-lg border border-border">
            <div className="divide-y divide-border bg-white">
              {lines.map((line) => (
                <div key={line.productId} className="grid grid-cols-[1fr_auto] items-center gap-4 px-4 py-3 sm:grid-cols-[1.5fr_0.5fr_0.5fr_auto]">
                  <div>
                    <p className="font-semibold text-navy">{line.name}</p>
                    <p className="mt-0.5 font-mono text-xs text-muted">{line.sku}</p>
                  </div>
                  <p className="hidden text-sm text-muted sm:block">{line.quantity} {marketplace("pieceUnit")}</p>
                  <p className="hidden text-right text-sm font-semibold tabular-nums text-navy sm:block">
                    {formatMoney({ amount: line.unitPrice.amount * line.quantity, currency: line.unitPrice.currency }, locale)}
                  </p>
                  <button type="button" onClick={() => removeLine(line.productId)} className="rounded-md p-2 text-muted hover:bg-red-50 hover:text-error" aria-label={`${marketplace("remove")} ${line.sku}`}>
                    <X className="size-4" aria-hidden="true" />
                  </button>
                </div>
              ))}
            </div>
            <div className="flex items-center justify-between bg-slate-50 px-4 py-4">
              <span className="text-sm font-semibold text-muted">{t("cartLines", { count: lines.length })}</span>
              <span className="text-base font-bold tabular-nums text-navy">
                {t("orderTotal")}: {formatMoney({ amount: total, currency: "PLN" }, locale)}
              </span>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
