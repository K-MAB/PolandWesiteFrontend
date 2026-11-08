# Backend Integration

Production adapters should implement the repository contracts without changing feature components.

- derive `customerId` and admin permissions from the verified session;
- apply customer ownership filters to carts, profiles, addresses and orders;
- recalculate prices, stock and totals on the server;
- use a hosted payment provider and never collect raw card data in this frontend;
- validate and scan imported files before processing;
- keep private responses `private, no-store` until a reviewed cache design exists;
- log structured events without secrets or payment data.

Integration tests must attempt to access another real customer's order ID, not only random missing IDs.
