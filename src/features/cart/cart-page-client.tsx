"use client";

import { Minus, Plus, ShoppingBag, Trash2 } from "lucide-react";
import Image from "next/image";
import { useSyncExternalStore } from "react";

import { Button } from "@/components/ui/button";
import { formatMoney } from "@/core/services/commerce";
import { Link } from "@/i18n/navigation";
import type { AppLocale } from "@/i18n/routing";

import { useCartStore } from "./cart-store";

interface CartLabels {
  emptyTitle: string;
  emptyText: string;
  browse: string;
  title: string;
  itemCount: string;
  orderTotal: string;
  clear: string;
  checkout: string;
  checkoutNote: string;
  remove: string;
  quantity: string;
  unitPrice: string;
}

const subscribeToHydration = (callback: () => void) => {
  const offStart = useCartStore.persist.onHydrate(callback);
  const offFinish = useCartStore.persist.onFinishHydration(callback);
  return () => { offStart(); offFinish(); };
};

export function CartPageClient({ locale, labels }: { locale: AppLocale; labels: CartLabels }) {
  const hydrated = useSyncExternalStore(subscribeToHydration, () => useCartStore.persist.hasHydrated(), () => false);
  const lines = useCartStore((state) => state.lines);
  const removeLine = useCartStore((state) => state.removeLine);
  const setQuantity = useCartStore((state) => state.setQuantity);
  const clear = useCartStore((state) => state.clear);
  const total = lines.reduce((sum, line) => sum + line.unitPrice.amount * line.quantity, 0);
  const currency = lines[0]?.unitPrice.currency ?? "PLN";

  if (!hydrated) return <div className="min-h-72 animate-pulse rounded-xl border border-border bg-white" />;
  if (lines.length === 0) return (
    <div className="grid min-h-96 place-items-center rounded-2xl border border-dashed border-slate-300 bg-white p-8 text-center">
      <div><span className="mx-auto grid size-16 place-items-center rounded-full bg-blue/8 text-blue"><ShoppingBag className="size-7" /></span><h2 className="mt-5 text-xl font-black text-navy">{labels.emptyTitle}</h2><p className="mt-2 max-w-md text-sm text-muted">{labels.emptyText}</p><Button asChild className="mt-6"><Link href="/catalog">{labels.browse}</Link></Button></div>
    </div>
  );

  return (
    <div className="grid gap-7 lg:grid-cols-[1fr_22rem]">
      <section className="overflow-hidden rounded-xl border border-border bg-white">
        <div className="flex items-center justify-between border-b border-border px-5 py-4"><h2 className="font-extrabold text-navy">{labels.title}</h2><span className="text-xs text-muted">{labels.itemCount}</span></div>
        <div className="divide-y divide-border">
          {lines.map((line) => (
            <article key={line.productId} className="grid gap-4 p-4 sm:grid-cols-[7rem_1fr_auto] sm:items-center">
              <Link href={`/products/${line.productId}`} className="relative aspect-square overflow-hidden rounded-lg bg-slate-50"><Image src={line.imageUrl || "/products/microcontroller.png"} alt={line.name} fill sizes="112px" className="object-contain p-3" /></Link>
              <div className="min-w-0"><Link href={`/products/${line.productId}`} className="font-bold text-navy hover:text-blue">{line.name}</Link><p className="mt-1 truncate font-mono text-xs text-muted">{line.sku}</p><p className="mt-3 text-xs text-muted">{labels.unitPrice}: <strong className="text-navy">{formatMoney(line.unitPrice, locale)}</strong></p></div>
              <div className="flex items-center justify-between gap-5 sm:block sm:text-right">
                <div className="inline-flex items-center overflow-hidden rounded-md border border-border"><button type="button" className="grid size-9 place-items-center hover:bg-slate-50 disabled:opacity-40" disabled={line.quantity <= line.moq} onClick={() => setQuantity(line.productId, line.quantity - line.increment)} aria-label={`- ${labels.quantity}`}><Minus className="size-3" /></button><span className="min-w-12 px-2 text-center text-xs font-bold tabular-nums">{line.quantity}</span><button type="button" className="grid size-9 place-items-center hover:bg-slate-50" onClick={() => setQuantity(line.productId, line.quantity + line.increment)} aria-label={`+ ${labels.quantity}`}><Plus className="size-3" /></button></div>
                <p className="mt-2 text-sm font-black text-navy">{formatMoney({ amount: line.unitPrice.amount * line.quantity, currency: line.unitPrice.currency }, locale)}</p>
                <button type="button" onClick={() => removeLine(line.productId)} className="mt-2 inline-flex items-center gap-1 text-[0.6875rem] font-bold text-error hover:underline"><Trash2 className="size-3" />{labels.remove}</button>
              </div>
            </article>
          ))}
        </div>
      </section>

      <aside className="h-fit rounded-xl border border-border bg-white p-5 shadow-sm lg:sticky lg:top-44">
        <h2 className="text-lg font-black text-navy">{labels.orderTotal}</h2>
        <dl className="mt-5 text-sm"><div className="flex justify-between border-t border-border pt-4"><dt className="font-bold text-navy">{labels.orderTotal}</dt><dd className="text-lg font-black text-navy">{formatMoney({ amount: total, currency }, locale)}</dd></div></dl>
        <Button asChild className="mt-5 w-full" size="lg"><Link href="/checkout">{labels.checkout}</Link></Button>
        <p className="mt-3 text-center text-[0.6875rem] leading-5 text-muted">{labels.checkoutNote}</p>
        <button type="button" onClick={clear} className="mt-4 w-full text-center text-xs font-bold text-error hover:underline">{labels.clear}</button>
      </aside>
    </div>
  );
}
