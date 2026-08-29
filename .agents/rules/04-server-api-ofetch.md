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

## Mandatory TanStack Query & `queryOptions` Standard

React components and page views **MUST NOT** invoke `api()` directly. All HTTP requests, data fetching, and mutations **MUST** be organized using **TanStack Query** (`queryOptions` and `useMutation`).

### 1. Separation of DB Queries vs TanStack Query Options vs Mutation Hooks
- **`src/features/<feature>/queries.ts`**: Reserved strictly for **Server-Side Drizzle ORM Database Queries** (used by server functions and API route handlers). Never put client-side HTTP queries in this file.
- **`src/features/<feature>/query-options.ts`**: Reserved for **TanStack Query `queryOptions` Definitions** (used by TanStack Router loaders via `ensureQueryData` and React components directly via `useSuspenseQuery` / `useQuery`).
- **`src/features/<feature>/hooks.ts`**: Reserved strictly for **Custom Mutation Hooks** (`useMutation`) and UI state hooks. **DO NOT** create `useQuery` or `useSuspenseQuery` wrapper functions here; components must invoke `useSuspenseQuery` or `useQuery` directly with `queryOptions`.

### 2. Standard `queryOptions` Pattern (`query-options.ts`)
Always export query key factories and `queryOptions` objects instead of directly writing rigid `useQuery` hooks. This enables seamless use in TanStack Router route loaders, `useSuspenseQuery`, `usePrefetchQuery`, and standard `useQuery`.

```ts
import { queryOptions } from '@tanstack/react-query'
import { api } from '#/lib/api-client'
import type { ProjectRecord } from './types'

export const projectQueryKeys = {
  all: ['projects'] as const,
  lists: () => [...projectQueryKeys.all, 'list'] as const,
  list: (filter?: { category?: string }) => [...projectQueryKeys.lists(), filter] as const,
  details: () => [...projectQueryKeys.all, 'detail'] as const,
  detail: (id: string) => [...projectQueryKeys.details(), id] as const,
}

export const projectQueryOptions = {
  list: (filter?: { category?: string }) =>
    queryOptions({
      queryKey: projectQueryKeys.list(filter),
      queryFn: async (): Promise<ProjectRecord[]> => {
        const res = await api<{ data?: ProjectRecord[] }>('/api/projects', { query: filter })
        return res.data ?? []
      },
    }),
  detail: (id: string) =>
    queryOptions({
      queryKey: projectQueryKeys.detail(id),
      queryFn: async (): Promise<ProjectRecord> => {
        const res = await api<{ data?: ProjectRecord }>(`/api/projects/${id}`)
        if (!res.data) throw new Error('Project not found')
        return res.data
      },
    }),
}
```

### 3. Route Loader & Component Consumption Pattern
In TanStack Router route definitions, prefetch/ensure data in the route `loader`, and consume via `useSuspenseQuery` in the component:

```tsx
// In src/routes/dashboard/projects/$id.tsx
export const Route = createFileRoute('/dashboard/projects/$id')({
  loader: ({ context: { queryClient }, params }) =>
    queryClient.ensureQueryData(projectQueryOptions.detail(params.id)),
  component: DashboardProjectEditPage,
})

// In component:
export function DashboardProjectEditPage() {
  const { id } = Route.useParams()
  const { data: project } = useSuspenseQuery(projectQueryOptions.detail(id))
  // 'project' is immediately available synchronously without manual loading guards!
}
```

### 4. Custom Mutation Hooks (`hooks.ts`)
Encapsulate all mutations (`POST`, `PUT`, `PATCH`, `DELETE`) within custom mutation hooks and invalidate the corresponding query keys defined in `query-options.ts`:

```ts
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { api } from '#/lib/api-client'
import { projectQueryKeys } from './query-options'

export function useCreateProject() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (payload: CreateProjectInput) =>
      api('/api/projects', { method: 'POST', body: payload }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: projectQueryKeys.all })
    },
  })
}
```

---

## Forms & Mutations with TanStack Form

- Use **TanStack Form** paired with Zod schemas for all client form interactions.
- Provide clear inline error messages next to fields.
- Disable submit buttons during pending state to prevent duplicate submissions.
- Always validate on the server—client validation is for UX only.
- Show optimistic UI only after server behavior is confirmed correct.


