# API Contracts

Suggested production endpoints for the single-seller store:

| Method | Route | Purpose |
| --- | --- | --- |
| GET | `/catalog/products` | search and filter public products |
| GET | `/catalog/products/{id}` | product detail |
| GET/PUT | `/me/cart` | authenticated customer cart |
| POST | `/checkout/session` | hosted payment handoff |
| GET | `/me/orders` | customer order history |
| GET | `/me/orders/{id}` | customer-owned order detail |
| GET/PATCH | `/me/profile` | customer profile and addresses |
| GET | `/admin/customers` | customer administration |
| GET/PATCH | `/admin/orders/{id}` | fulfillment management |
| GET/POST/PATCH | `/admin/products` | catalog administration |
| POST | `/admin/imports` | product import job |

The backend recalculates price, stock and order totals. Customer identity comes from the authenticated session, never a caller-supplied owner ID. Payment card data stays with the hosted payment provider.
