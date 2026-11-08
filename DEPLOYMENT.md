# Deployment

Deploy as a Next.js Node.js server or a verified compatible adapter. Authenticated account, checkout and admin pages require server behavior and should not be served as a fully static export.

Required production settings include HTTPS, secure cookies, CSP, rate limits, upload scanning, secret management, database backups and payment webhooks. Public product assets may use CDN caching; account, order and payment responses must remain private.

Run before release:

```bash
pnpm check
pnpm test:e2e
pnpm build
```
