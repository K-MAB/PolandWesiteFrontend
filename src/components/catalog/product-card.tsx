import { ArrowRight, PackageCheck } from "lucide-react";
import Image from "next/image";

import type { Product } from "@/core/domain/models";
import { formatMoney } from "@/core/services/commerce";
import { AddToCartButton } from "@/features/cart/add-to-cart-button";
import { Link } from "@/i18n/navigation";
import type { AppLocale } from "@/i18n/routing";
import { cn, localizedText } from "@/lib/utils";

export interface ProductCardLabels {
  stock: string;
  moq: string;
  unit: string;
  details: string;
}

export function ProductCard({ product, locale, labels, eager }: { product: Product; locale: AppLocale; labels: ProductCardLabels; eager?: boolean }) {
  const name = localizedText(product.name, locale);
  const numberLocale = locale === "pl" ? "pl-PL" : locale === "tr" ? "tr-TR" : "en-GB";

  return (
    <article className="group flex min-w-0 flex-col overflow-hidden rounded-xl border border-border bg-white shadow-sm transition duration-200 hover:-translate-y-0.5 hover:border-blue/25 hover:shadow-card">
      <Link href={`/products/${product.id}`} className="relative block aspect-[1.18/1] overflow-hidden bg-gradient-to-b from-slate-50 to-white p-5">
        <span className="absolute left-3 top-3 z-10 rounded-full bg-white px-2.5 py-1 text-[0.625rem] font-bold uppercase tracking-[0.08em] text-success shadow-sm ring-1 ring-border">
          {labels.stock}
        </span>
        <Image
          src={product.imageUrl}
          alt={name}
          fill
          priority={eager}
          sizes="(max-width: 640px) 70vw, (max-width: 1024px) 33vw, 22vw"
          className="object-contain p-5 transition duration-300 group-hover:scale-[1.04]"
        />
      </Link>
      <div className="flex flex-1 flex-col p-4">
        <p className="truncate text-[0.6875rem] font-bold uppercase tracking-[0.08em] text-blue">{product.manufacturer}</p>
        <Link href={`/products/${product.id}`} className="mt-2 line-clamp-2 min-h-11 text-sm font-bold leading-[1.35] text-navy hover:text-blue">
          {name}
        </Link>
        <p className="mt-2 truncate font-mono text-[0.6875rem] text-muted">{product.mpn}</p>
        <div className="mt-3 flex items-center gap-1.5 text-xs font-semibold text-success">
          <PackageCheck className="size-3.5" aria-hidden="true" />
          {product.stock.toLocaleString(numberLocale)} pcs
          <span className="font-normal text-muted">· {labels.moq} {product.moq}</span>
        </div>
        <div className="mt-auto flex items-end justify-between gap-3 border-t border-border pt-4">
          <div>
            <p className="text-lg font-extrabold tracking-tight text-navy">{formatMoney(product.basePrice, locale)}</p>
            <p className="text-[0.625rem] text-muted">{labels.unit} / pcs</p>
          </div>
          <AddToCartButton
            productId={product.id}
            sku={product.sku}
            name={name}
            moq={product.moq}
            increment={product.quantityIncrement}
            unitPrice={product.basePrice}
            imageUrl={product.imageUrl}
          />
        </div>
        <Link href={`/products/${product.id}`} className="mt-3 flex items-center justify-center gap-1.5 text-xs font-bold text-blue hover:underline">
          {labels.details}<ArrowRight className="size-3" aria-hidden="true" />
        </Link>
      </div>
    </article>
  );
}

export function ProductGrid({ products, locale, labels, className, priorityFirst = false }: { products: readonly Product[]; locale: AppLocale; labels: ProductCardLabels; className?: string; priorityFirst?: boolean }) {
  return (
    <div className={cn("grid grid-cols-1 gap-4 min-[480px]:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4", className)}>
      {products.map((product, index) => <ProductCard key={product.id} product={product} locale={locale} labels={labels} eager={priorityFirst && index === 0} />)}
    </div>
  );
}
