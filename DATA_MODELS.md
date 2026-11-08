# Data Models

## Product

SKU, MPN, manufacturer, localized content, category, stock, MOQ, increment, packaging, lead time, public price, volume tiers, attributes, documents and lifecycle status.

## Customer

Identity, name, email, status and delivery address. A customer owns only their cart and order history.

## Cart

Customer-owned collection of product, quantity and unit-price snapshots. Browser persistence is a frontend convenience; the backend cart becomes authoritative after integration.

## Order

Customer-owned record with order number, total, status and creation time. Production APIs should add immutable line, address, payment and shipment snapshots.

## Price rule

Public base, volume or promotion rule. There are no seller-specific storefronts or account-specific contract prices.

## Import

Product rows include SKU, MPN, localized names, manufacturer, category, price, stock, purchasing rules, packaging, imagery, attributes and status.
