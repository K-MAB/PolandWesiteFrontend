export type Currency = "PLN" | "EUR";
export type ProductStatus = "active" | "draft" | "archived" | "discontinued";

export interface Money { amount: number; currency: Currency }
export interface LocalizedContent { pl: string; en: string; tr?: string }
export interface TechnicalAttribute { code: string; label: LocalizedContent; value: string; unit?: string; filterable: boolean }
export interface VolumePrice { minQuantity: number; unitPrice: Money }

export interface Product {
  id: string; sku: string; mpn: string; manufacturer: string; categoryId: string;
  categoryName: LocalizedContent; name: LocalizedContent; description: LocalizedContent;
  imageUrl: string; stock: number; moq: number; quantityIncrement: number;
  packagingType: "reel" | "tray" | "tube" | "bulk" | "box"; leadTimeDays: number;
  unitOfMeasure: "pcs"; basePrice: Money; volumePrices: readonly VolumePrice[];
  attributes: readonly TechnicalAttribute[]; datasheetUrl?: string; status: ProductStatus;
}

export interface Address { id: string; label: string; street: string; city: string; postalCode: string; countryCode: "PL" | "DE" | "CZ" | "SK" }
export interface Customer { id: string; name: string; email: string; status: "active" | "disabled"; createdAt: string; address: Address }
export interface CustomerContext { customerId: string }
export interface CartLine { productId: string; sku: string; name: string; quantity: number; unitPrice: Money }
export interface Cart { id: string; customerId: string; lines: readonly CartLine[]; updatedAt: string }
export interface Order { id: string; customerId: string; customerName: string; orderNumber: string; status: "confirmed" | "processing" | "shipped" | "delivered"; total: Money; createdAt: string }

export type PriceRuleType = "base" | "volume" | "promotion";
export interface PriceRule { id: string; productId: string; type: PriceRuleType; unitPrice: Money; minQuantity?: number; validFrom?: string; validUntil?: string }
export interface PriceQuote { productId: string; quantity: number; unitPrice: Money; source: PriceRuleType; ruleId: string }
export interface InventoryAvailability { productId: string; available: number; reserved: number; leadTimeDays: number }
export interface ImportRow { rowNumber: number; sku?: string; mpn?: string; namePl?: string; price?: number; stock?: number }
export interface ImportValidationIssue { rowNumber: number; field: string; code: string; message: string }
export interface ImportValidationResult { totalRows: number; validRows: number; issues: readonly ImportValidationIssue[] }
