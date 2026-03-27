# Workspace

## Overview

pnpm workspace monorepo using TypeScript. Each package manages its own dependencies.

## Stack

- **Monorepo tool**: pnpm workspaces
- **Node.js version**: 24
- **Package manager**: pnpm
- **TypeScript version**: 5.9
- **API framework**: Express 5
- **Database**: PostgreSQL + Drizzle ORM
- **Validation**: Zod (`zod/v4`), `drizzle-zod`
- **API codegen**: Orval (from OpenAPI spec)
- **Build**: esbuild (CJS bundle)
- **Frontend**: React + Vite + TailwindCSS + shadcn/ui + React Query + zustand + react-hook-form + framer-motion

## Project: PageTurn Books

Used books marketplace for India. Customers can browse, filter, add to cart, and place orders. Orders are saved to Notion. Admin panel (hidden from customers) allows managing books and categories.

### Key features
- Public storefront: Home, Shop (with category filters & search), Book detail, Cart, Checkout, Order success
- Admin panel at /admin/login + /admin (NOT linked in nav — only accessible by URL)
- Orders submitted to Notion via Notion API
- Categories and books managed via REST API with admin password protection
- Cart persisted in localStorage

### Environment Variables Required (in Vercel)
- `NOTION_API_KEY` — Notion integration token
- `NOTION_ORDERS_DB_ID` — Notion database ID for orders
- `ADMIN_PASSWORD` — Password for admin panel
- `DATABASE_URL` — PostgreSQL connection string

### Notion Database Setup
The Notion orders database must have these properties:
- Order ID (Title)
- Customer Name (Rich Text)
- Email (Email)
- Phone (Phone Number)
- Delivery Address (Rich Text)
- Total Amount (Number)
- Books Ordered (Rich Text)
- Notes (Rich Text)
- Status (Select with option "New")

## Structure

```text
artifacts-monorepo/
├── artifacts/              # Deployable applications
│   ├── api-server/         # Express API server
│   └── bookstore/          # React + Vite frontend (PageTurn Books)
├── lib/                    # Shared libraries
│   ├── api-spec/           # OpenAPI spec + Orval codegen config
│   ├── api-client-react/   # Generated React Query hooks
│   ├── api-zod/            # Generated Zod schemas from OpenAPI
│   └── db/                 # Drizzle ORM schema + DB connection
├── scripts/                # Utility scripts
├── pnpm-workspace.yaml
├── tsconfig.base.json
├── tsconfig.json
└── package.json
```

## TypeScript & Composite Projects

Every package extends `tsconfig.base.json` which sets `composite: true`. The root `tsconfig.json` lists all packages as project references.

- **Always typecheck from the root** — run `pnpm run typecheck`
- **`emitDeclarationOnly`** — we only emit `.d.ts` files during typecheck
- **Project references** — when package A depends on package B, A's `tsconfig.json` must list B in its `references` array

## Root Scripts

- `pnpm run build` — runs `typecheck` first, then recursively runs `build` in all packages
- `pnpm run typecheck` — runs `tsc --build --emitDeclarationOnly` using project references

## Packages

### `artifacts/bookstore` (`@workspace/bookstore`)

React + Vite frontend. Pages: Home, Shop, BookDetail, Cart, Checkout, OrderSuccess, AdminLogin, AdminDashboard. Uses @workspace/api-client-react for API hooks.

### `artifacts/api-server` (`@workspace/api-server`)

Express 5 API server. Routes: /api/categories, /api/books, /api/orders, /api/admin/login.

- Categories: GET (public), POST + DELETE (admin password required)
- Books: GET/GET:id (public), POST + PATCH + DELETE (admin password required)
- Orders: POST (public) — saves to Notion
- Admin login: POST — validates against ADMIN_PASSWORD env var

### `lib/db` (`@workspace/db`)

Tables: `categories` (id, name, slug, created_at), `books` (id, title, author, description, price, original_price, condition, image_url, category_id, in_stock, created_at)

- `pnpm --filter @workspace/db run push` — sync schema
- `pnpm --filter @workspace/db run push-force` — force sync

### `lib/api-spec` (`@workspace/api-spec`)

OpenAPI 3.1 spec at `openapi.yaml`. Run codegen: `pnpm --filter @workspace/api-spec run codegen`

### `lib/api-zod` (`@workspace/api-zod`)
### `lib/api-client-react` (`@workspace/api-client-react`)
### `scripts` (`@workspace/scripts`)
