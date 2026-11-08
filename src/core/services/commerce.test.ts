import { describe, expect, it } from "vitest";

import { mockProducts } from "@/infrastructure/mock/fixtures";

import { formatMoney, resolvePrice, validateOrderQuantity } from "./commerce";

describe("commerce rules", () => {
  it("validates MOQ and quantity increments", () => {
    expect(validateOrderQuantity(4, 5, 5)).toEqual({ valid: false, reason: "below-moq", suggested: 5 });
    expect(validateOrderQuantity(7, 5, 5)).toEqual({ valid: false, reason: "invalid-increment", suggested: 10 });
    expect(validateOrderQuantity(15, 5, 5)).toEqual({ valid: true });
  });

  it("uses deterministic rule precedence", () => {
    const product = mockProducts[0]!;
    const quote = resolvePrice(product, 100, [
      { id: "volume", productId: product.id, type: "volume", minQuantity: 100, unitPrice: { amount: 30, currency: "PLN" } },
      { id: "promotion", productId: product.id, type: "promotion", unitPrice: { amount: 35, currency: "PLN" } },
    ]);

    expect(quote.source).toBe("promotion");
    expect(quote.unitPrice.amount).toBe(35);
  });

  it("formats Polish zloty with Polish conventions", () => {
    const formatted = formatMoney({ amount: 1299.99, currency: "PLN" }, "pl");
    expect(formatted).toContain("1");
    expect(formatted).toContain("299,99");
    expect(formatted).toContain("zł");
  });
});
