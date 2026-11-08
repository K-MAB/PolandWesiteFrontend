import type { Cart, CustomerContext, ImportRow, ImportValidationIssue, InventoryAvailability, Order, Product } from "@/core/domain/models";
import type { CartRepository, CustomerRepository, ImportRepository, InventoryRepository, OrderRepository, PaymentRepository, PricingRepository, ProductRepository, ProductSearch, Repositories } from "@/core/repositories/contracts";
import { resolvePrice } from "@/core/services/commerce";

import { mockCustomers, mockOrders, mockPriceRules, mockProducts } from "./fixtures";

function normalize(value: string) { return value.trim().toLocaleLowerCase("en-US"); }

export class MockProductRepository implements ProductRepository {
  async search(criteria: ProductSearch) {
    const page = Math.max(1, criteria.page ?? 1);
    const pageSize = Math.min(100, Math.max(1, criteria.pageSize ?? 20));
    const query = criteria.query ? normalize(criteria.query) : "";
    const exactMatches = query ? mockProducts.filter((product) => normalize(product.sku) === query || normalize(product.mpn) === query) : [];
    const candidates = exactMatches.length > 0 ? exactMatches : mockProducts;
    const filtered = candidates.filter((product) => {
      if (criteria.categoryId && product.categoryId !== criteria.categoryId) return false;
      if (criteria.manufacturer && product.manufacturer !== criteria.manufacturer) return false;
      if (criteria.inStockOnly && product.stock <= 0) return false;
      if (!query) return true;
      return [product.sku, product.mpn, product.manufacturer, product.name.pl, product.name.en, product.name.tr ?? "", ...product.attributes.map((attribute) => attribute.value)].some((value) => normalize(value).includes(query));
    });
    const sorted = [...filtered].sort((left, right) => {
      switch (criteria.sort) {
        case "price-asc": return left.basePrice.amount - right.basePrice.amount;
        case "price-desc": return right.basePrice.amount - left.basePrice.amount;
        case "stock-desc": return right.stock - left.stock;
        case "name-asc": return left.name.en.localeCompare(right.name.en);
        default: return 0;
      }
    });
    const start = (page - 1) * pageSize;
    return { items: sorted.slice(start, start + pageSize), total: sorted.length, page, pageSize };
  }
  async findById(id: string): Promise<Product | null> { return mockProducts.find((product) => product.id === id) ?? null; }
  async findBySkuOrMpn(value: string): Promise<Product | null> { const needle = normalize(value); return mockProducts.find((product) => normalize(product.sku) === needle || normalize(product.mpn) === needle) ?? null; }
}

export class MockCustomerRepository implements CustomerRepository {
  async list() { return mockCustomers; }
  async findById(id: string) { return mockCustomers.find((customer) => customer.id === id) ?? null; }
}
export class MockPricingRepository implements PricingRepository {
  async quote(product: Product, quantity: number) { return resolvePrice(product, quantity, mockPriceRules); }
  async listRules(productId: string) { return mockPriceRules.filter((rule) => rule.productId === productId); }
}
export class MockInventoryRepository implements InventoryRepository {
  async getAvailability(productId: string): Promise<InventoryAvailability> { const product = mockProducts.find((item) => item.id === productId); if (!product) throw new Error(`Product ${productId} was not found`); return { productId, available: product.stock, reserved: Math.min(120, Math.floor(product.stock * .03)), leadTimeDays: product.leadTimeDays }; }
}
export class MockCartRepository implements CartRepository {
  private carts = new Map<string, Cart>();
  async get(context: CustomerContext) { return this.carts.get(context.customerId) ?? { id: `cart-${context.customerId}`, customerId: context.customerId, lines: [], updatedAt: new Date().toISOString() }; }
  async save(context: CustomerContext, cart: Cart) { if (cart.customerId !== context.customerId) throw new Error("Another customer's cart cannot be changed"); this.carts.set(context.customerId, cart); return cart; }
}
export class MockOrderRepository implements OrderRepository {
  async list(context: CustomerContext): Promise<readonly Order[]> { return mockOrders.filter((order) => order.customerId === context.customerId); }
  async findById(context: CustomerContext, orderId: string) { return mockOrders.find((order) => order.customerId === context.customerId && order.id === orderId) ?? null; }
}
export class MockPaymentRepository implements PaymentRepository {
  async createMockCheckout(context: CustomerContext, cart: Cart) { if (cart.customerId !== context.customerId) throw new Error("Another customer's checkout cannot be created"); return { checkoutId: `mock-checkout-${crypto.randomUUID()}`, status: "requires-action" as const }; }
}
export class MockImportRepository implements ImportRepository {
  async validate(rows: readonly ImportRow[]) { const issues: ImportValidationIssue[] = []; const seen = new Set<string>(); for (const row of rows) { if (!row.sku?.trim()) issues.push({ rowNumber: row.rowNumber, field: "sku", code: "required", message: "SKU is required" }); if (!row.mpn?.trim()) issues.push({ rowNumber: row.rowNumber, field: "mpn", code: "required", message: "MPN is required" }); if (!row.namePl?.trim()) issues.push({ rowNumber: row.rowNumber, field: "namePl", code: "required", message: "Polish name is required" }); if (row.price === undefined || row.price < 0) issues.push({ rowNumber: row.rowNumber, field: "price", code: "invalid", message: "Price must be zero or greater" }); if (row.stock === undefined || !Number.isInteger(row.stock) || row.stock < 0) issues.push({ rowNumber: row.rowNumber, field: "stock", code: "invalid", message: "Stock must be a non-negative integer" }); if (row.sku) { if (seen.has(row.sku)) issues.push({ rowNumber: row.rowNumber, field: "sku", code: "duplicate", message: "Duplicate SKU in file" }); seen.add(row.sku); } } const invalid = new Set(issues.map((issue) => issue.rowNumber)); return { totalRows: rows.length, validRows: rows.length - invalid.size, issues }; }
  async startMockImport(rows: readonly ImportRow[]) { const validation = await this.validate(rows); if (validation.issues.length) throw new Error("Import contains invalid rows"); return { jobId: `mock-import-${crypto.randomUUID()}`, status: "queued" as const, totalRows: rows.length }; }
}
export function createMockRepositories(): Repositories { return { products: new MockProductRepository(), customers: new MockCustomerRepository(), pricing: new MockPricingRepository(), inventory: new MockInventoryRepository(), carts: new MockCartRepository(), orders: new MockOrderRepository(), payments: new MockPaymentRepository(), imports: new MockImportRepository() }; }
