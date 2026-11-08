# Testing

## Unit and component tests

Vitest covers price precedence, currency formatting, MOQ/increments, import validation and reusable components.

## Repository tests

Mock adapters verify catalog search, sorting, customer-owned order isolation and rejection of another customer's cart write.

## Browser tests

Playwright covers locale routing, catalog search/filtering, product-to-cart behavior, customer/admin sign-in, customer registration and checkout completion.

## Release checks

```bash
pnpm check
pnpm test:e2e
pnpm build
```
