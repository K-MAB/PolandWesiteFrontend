# Route Map

All user routes start with `/pl`, `/en` or `/tr`.

| Route | Purpose |
| --- | --- |
| `/[locale]` | storefront home |
| `/[locale]/catalog` | product listing and filters |
| `/[locale]/catalog/[category]` | category listing |
| `/[locale]/products/[id]` | product detail |
| `/[locale]/compare` | product comparison |
| `/[locale]/cart` | shopping cart |
| `/[locale]/checkout` | delivery, payment choice and order confirmation |
| `/[locale]/login` | customer/admin demo sign-in |
| `/[locale]/register` | customer registration |
| `/[locale]/account` | customer overview |
| `/[locale]/account/orders/[id]` | customer-owned order detail |
| `/[locale]/account/favorites` | saved products |
| `/[locale]/account/addresses` | delivery addresses |
| `/[locale]/account/profile` | personal profile |
| `/[locale]/admin` | single-store dashboard |
| `/[locale]/admin/[section]` | customers, catalog, orders, prices, inventory, imports, content, staff, audit and settings |

Account, checkout and admin routes are excluded from indexing and are ready for authoritative backend route guards.
