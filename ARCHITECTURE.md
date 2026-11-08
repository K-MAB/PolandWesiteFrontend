# Architecture

The application is a single-seller storefront with three surfaces:

- public catalog, product, cart, comparison and checkout pages;
- private customer account pages;
- private store administration pages.

Pages depend on repository interfaces in `src/core/repositories`. Local adapters in `src/infrastructure/mock` provide deterministic fixtures and are replaceable with HTTP adapters.

Public catalog data may be cached and tagged by product/category version. Customer profile, cart, addresses, orders and checkout data use private, non-shared caching. The backend derives customer identity from the authenticated session and verifies ownership for every private record.

The server is authoritative for price, stock, order creation and payment verification. Browser persistence only improves the local demo experience.
