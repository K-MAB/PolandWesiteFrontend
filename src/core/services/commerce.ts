import type { Money, PriceQuote, PriceRule, Product } from "@/core/domain/models";

const pricePriority: Record<PriceRule["type"], number> = {
  base: 0,
  volume: 10,
  promotion: 20,
};

export function roundMoney(value: number): number {
  return Math.round((value + Number.EPSILON) * 100) / 100;
}

export function resolvePrice(
  product: Product,
  quantity: number,
  rules: readonly PriceRule[],
  at = new Date(),
): PriceQuote {
  const applicable = rules.filter((rule) => {
    if (rule.productId !== product.id) return false;
    if ((rule.minQuantity ?? 1) > quantity) return false;
    if (rule.validFrom && new Date(rule.validFrom) > at) return false;
    if (rule.validUntil && new Date(rule.validUntil) < at) return false;
    return true;
  });

  const baseRule: PriceRule = {
    id: `base-${product.id}`,
    productId: product.id,
    type: "base",
    unitPrice: product.basePrice,
  };

  const selected = [...applicable, baseRule].sort((left, right) => {
    const priorityDifference = pricePriority[right.type] - pricePriority[left.type];
    if (priorityDifference !== 0) return priorityDifference;
    return left.unitPrice.amount - right.unitPrice.amount;
  })[0]!;

  return {
    productId: product.id,
    quantity,
    unitPrice: selected.unitPrice,
    source: selected.type,
    ruleId: selected.id,
  };
}

export type QuantityValidation =
  | { valid: true }
  | { valid: false; reason: "below-moq" | "invalid-increment"; suggested: number };

export function validateOrderQuantity(
  quantity: number,
  moq: number,
  increment: number,
): QuantityValidation {
  if (quantity < moq) {
    return { valid: false, reason: "below-moq", suggested: moq };
  }

  if ((quantity - moq) % increment !== 0) {
    const steps = Math.ceil((quantity - moq) / increment);
    return {
      valid: false,
      reason: "invalid-increment",
      suggested: moq + steps * increment,
    };
  }

  return { valid: true };
}

export function formatMoney(money: Money, locale: "pl" | "en" | "tr"): string {
  const localeMap = { pl: "pl-PL", en: "en-GB", tr: "tr-TR" } as const;
  return new Intl.NumberFormat(localeMap[locale], {
    style: "currency",
    currency: money.currency,
    minimumFractionDigits: 2,
  }).format(money.amount);
}
