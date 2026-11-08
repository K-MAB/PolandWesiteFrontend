import { describe, expect, it } from "vitest";

import { mockProducts } from "./fixtures";
import { createMockRepositories } from "./repositories";

const customerContext = (customerId: string) => ({ customerId });

describe("mock repositories", () => {
  it("provides at least fifty searchable products", async () => {
    const repositories = createMockRepositories();
    const result = await repositories.products.search({ pageSize: 100 });
    expect(result.total).toBeGreaterThanOrEqual(50);
  });

  it("matches exact MPN and technical search terms", async () => {
    const repositories = createMockRepositories();
    const exact = await repositories.products.findBySkuOrMpn(mockProducts[0]!.mpn);
    const technical = await repositories.products.search({ query: "LQFP-100" });
    expect(exact?.id).toBe(mockProducts[0]!.id);
    expect(technical.items.some((product) => product.id === mockProducts[0]!.id)).toBe(true);
  });

  it("filters and sorts the storefront catalog", async () => {
    const repositories = createMockRepositories();
    const result = await repositories.products.search({ categoryId: "automation", sort: "price-desc", pageSize: 50 });
    expect(result.total).toBe(10);
    expect(result.items.every((product) => product.categoryId === "automation")).toBe(true);
    expect(result.items[0]!.basePrice.amount).toBeGreaterThanOrEqual(result.items.at(-1)!.basePrice.amount);
  });

  it("keeps customer order history private", async () => {
    const repositories = createMockRepositories();
    const annaOrders = await repositories.orders.list(customerContext("customer-anna"));
    const otherOrderId = (await repositories.orders.list(customerContext("customer-piotr")))[0]!.id;
    const leaked = await repositories.orders.findById(customerContext("customer-anna"), otherOrderId);
    expect(annaOrders).toHaveLength(3);
    expect(annaOrders.every((order) => order.customerId === "customer-anna")).toBe(true);
    expect(leaked).toBeNull();
  });

  it("rejects another customer's cart write", async () => {
    const repositories = createMockRepositories();
    await expect(repositories.carts.save(customerContext("customer-anna"), {
      id: "cart-customer-piotr",
      customerId: "customer-piotr",
      lines: [],
      updatedAt: new Date().toISOString(),
    })).rejects.toThrow("Another customer");
  });
});
