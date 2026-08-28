---
trigger: always_on
---

# Database, D1 & Cloudflare Runtime Rules

## Deployment Target

The app is built as a **Cloudflare-first TanStack Start** application deployed to Cloudflare Workers via Wrangler.

Key Cloudflare bindings:

- **D1**: Primary relational database
- **R2**: Object storage for media assets
- **KV / Hyperdrive**: Caching / edge session storage if needed

---

## Cloudflare Runtime Constraints

Cloudflare Workers runs in an edge V8 isolate with CPU-time limits:

- Avoid long CPU-bound operations and heavy synchronous crypto.
- Avoid Node-specific APIs unless polyfilled or supported under Cloudflare compatibility flags.
- Prefer standard Web APIs (e.g. `Web Crypto`, `fetch`, `Streams`, `Response`).
- Keep database queries simple and efficient; avoid tight loops with round-trip database calls.
- Keep server bundle sizes minimal.

---

## Database Rules (Drizzle ORM & Cloudflare D1)

- **Explicit Schema**: Maintain all table schemas and relations in `src/db/schema.ts`.
- **Migrations**: Use Drizzle migrations for schema modifications.
- **Runtime Safety**: Do **NOT** use `better-sqlite3` in Cloudflare runtime paths.
- **Indexes**: Add indexes for frequently queried columns (`slug`, `status`, `userId`, etc.).
- **Avoid N+1**: Join related tables or fetch in batches.

---

## Mandatory `reset.sql` Maintenance

Whenever adding, renaming, or modifying tables in `src/db/schema.ts` or creating new migrations, you **MUST** update `drizzle/scripts/reset.sql` to include `DROP TABLE IF EXISTS <table_name>;` for every table.

> [!CAUTION]
> Failing to update `reset.sql` causes `bun run db:fresh:local` and `bun run db:fresh:remote` to leave orphaned tables behind and break migration replays.
