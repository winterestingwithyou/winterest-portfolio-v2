---
trigger: always_on
---

# Server, API & Mandatory ofetch Standard

## Server & API Rules

- **Input Validation**: Validate all request inputs and mutation payloads using **Zod**.
- **Sanitization**: Sanitize user-generated content and markdown before storage/rendering.
- **Authorization Checks**: Validate authentication and role permissions on the server before processing privileged mutations.
- **Consistent Responses**: Return consistent JSON response shapes. Avoid leaking internal runtime errors or stack traces to clients.
- **Transactions**: Use database transactions when performing related multi-table updates.
- **Secrets Isolation**: Keep server-only secrets and database credentials out of client bundles.

---

## Mandatory `ofetch` Standard for HTTP Requests

All HTTP client requests across the codebase **MUST** use `ofetch` instead of native `fetch`.

### 1. No Native `fetch`

- Do **NOT** use browser native `window.fetch()` or `fetch()` in React components, TanStack Query hooks, TanStack Form handlers, or route loaders.

### 2. Centralized Client

- Always import and use `api` from `#/lib/api-client` (or `@/lib/api-client`), configured via `$fetch.create({ retry: 0 })`.

### 3. Automatic Serialization & Query Parameters

- **JSON Body**: Pass plain objects directly in `body: payload`. Do **NOT** manually call `JSON.stringify()` or manually set `Content-Type: application/json`.
- **Query Parameters**: Pass query parameters using `query: { key: value }`. Do **NOT** manually construct query strings via template literals.
- **Multipart / File Uploads**: Pass `FormData` directly in `body: formData` (`ofetch` configures multipart boundary headers automatically).

### 4. Standardized Error Handling

- Use `getApiErrorMessage(error, fallback)` from `#/lib/api-client` to safely extract server error messages from `FetchError.data?.error` or `FetchError.data?.message`.

### 5. CLI & Backend Scripts

- In backend/CLI scripts (e.g. `src/db/seed-cli.ts`, `src/db/create-owner-cli.ts`), import and use `ofetch` from `'ofetch'` directly.

---

## Mandatory TanStack Query Hooks Standard (No Direct `api` in Components)

React components and page views **MUST NOT** invoke `api()` directly. All HTTP requests, server data fetching, and mutations **MUST** be encapsulated within custom hooks built with **TanStack Query** (`useQuery`, `useMutation`).

### 1. No Direct `api` Calls in Components
- Never call `api('/api/...')` directly inside React components, page views, section views, form components, or component event handlers.
- All server communication must go through feature-level TanStack Query custom hooks located in `src/features/<feature>/hooks.ts` (or `src/features/<feature>/hooks/`).

### 2. Standard Hook Structure
- **Queries**: Wrap GET requests with `useQuery({ queryKey: [...], queryFn: ... })`.
- **Mutations**: Wrap POST / PUT / PATCH / DELETE mutations with `useMutation({ mutationFn: ..., onSuccess: () => { queryClient.invalidateQueries(...) } })`.
- Co-locate hooks within the relevant feature folder (e.g. `src/features/projects/hooks.ts`, `src/features/technologies/hooks.ts`, `src/features/users/hooks.ts`, `src/features/settings/hooks.ts`, `src/features/social/hooks.ts`, `src/features/account/hooks.ts`, `src/features/media/hooks.ts`).

---

## Forms & Mutations with TanStack Form

- Use **TanStack Form** paired with Zod schemas for all client form interactions.
- Provide clear inline error messages next to fields.
- Disable submit buttons during pending state to prevent duplicate submissions.
- Always validate on the server—client validation is for UX only.
- Show optimistic UI only after server behavior is confirmed correct.

