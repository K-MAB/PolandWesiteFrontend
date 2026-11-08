import type { Cart, Customer, CustomerContext, ImportRow, ImportValidationResult, InventoryAvailability, Order, PriceQuote, PriceRule, Product } from "@/core/domain/models";

export interface ProductSearch { query?: string; categoryId?: string; manufacturer?: string; inStockOnly?: boolean; page?: number; pageSize?: number; sort?: "relevance" | "price-asc" | "price-desc" | "stock-desc" | "name-asc" }
export interface ProductSearchResult { items: readonly Product[]; total: number; page: number; pageSize: number }
export interface ProductRepository { search(criteria: ProductSearch): Promise<ProductSearchResult>; findById(id: string): Promise<Product | null>; findBySkuOrMpn(value: string): Promise<Product | null> }
export interface CustomerRepository { list(): Promise<readonly Customer[]>; findById(id: string): Promise<Customer | null> }
export interface PricingRepository { quote(product: Product, quantity: number): Promise<PriceQuote>; listRules(productId: string): Promise<readonly PriceRule[]> }
export interface InventoryRepository { getAvailability(productId: string): Promise<InventoryAvailability> }
export interface CartRepository { get(context: CustomerContext): Promise<Cart>; save(context: CustomerContext, cart: Cart): Promise<Cart> }
export interface OrderRepository { list(context: CustomerContext): Promise<readonly Order[]>; findById(context: CustomerContext, orderId: string): Promise<Order | null> }
export interface PaymentRepository { createMockCheckout(context: CustomerContext, cart: Cart): Promise<{ checkoutId: string; status: "requires-action" }> }
export interface ImportRepository { validate(rows: readonly ImportRow[]): Promise<ImportValidationResult>; startMockImport(rows: readonly ImportRow[]): Promise<{ jobId: string; status: "queued"; totalRows: number }> }
export interface Repositories { products: ProductRepository; customers: CustomerRepository; pricing: PricingRepository; inventory: InventoryRepository; carts: CartRepository; orders: OrderRepository; payments: PaymentRepository; imports: ImportRepository }
