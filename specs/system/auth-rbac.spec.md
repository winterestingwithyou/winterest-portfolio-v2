# System Specification: Authentication & Role-Based Access Control (RBAC)

| Field                  | Value                                                                                                                                                                                                                                                                                                                                                                                                                                    |
| :--------------------- | :--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Specification ID**   | `sys-auth-rbac`                                                                                                                                                                                                                                                                                                                                                                                                                          |
| **Status**             | `Implemented`                                                                                                                                                                                                                                                                                                                                                                                                                            |
| **Scope**              | Cross-Cutting System Architecture                                                                                                                                                                                                                                                                                                                                                                                                        |
| **Primary Code Paths** | [`src/lib/auth.ts`](file:///d:/winterest-project/winterest-portfolio-v2/src/lib/auth.ts), [`src/lib/auth/password.ts`](file:///d:/winterest-project/winterest-portfolio-v2/src/lib/auth/password.ts), [`src/features/auth/roles.ts`](file:///d:/winterest-project/winterest-portfolio-v2/src/features/auth/roles.ts), [`src/features/auth/session.ts`](file:///d:/winterest-project/winterest-portfolio-v2/src/features/auth/session.ts) |
| **Database Tables**    | `user`, `session`, `account`, `verification` (in [`src/db/schema.ts`](file:///d:/winterest-project/winterest-portfolio-v2/src/db/schema.ts))                                                                                                                                                                                                                                                                                             |
| **Last Updated**       | 2026-09-06                                                                                                                                                                                                                                                                                                                                                                                                                               |

---

## 1. Overview & Capabilities

The Authentication & RBAC system provides secure, edge-compatible authentication and multi-tier authorization for **Winterest**. The system runs on Cloudflare Workers and is backed by Cloudflare D1 via Drizzle ORM.

### Key Capabilities

- **Edge-Compatible Password Hashing**: CPU-bounded password hashing using Web Crypto PBKDF2 with HMAC SHA-256 to prevent isolate execution timeouts.
- **Cookie Session Management**: Secure HTTP-only cookie sessions handled via Better Auth and TanStack Start cookie plugin. No tokens stored in `localStorage`.
- **Strict 3-Tier RBAC**: Granular permission boundaries supporting `owner`, `admin`, and `editor`.
- **Strict 1-Owner Model**: Only a single owner can exist in the system. The owner cannot be downgraded or deleted.
- **Closed Public Registration**: Public self-registration is permanently disabled at the Better Auth hook level.
- **Interactive CLI Owner Bootstrap**: The initial owner account is provisioned out-of-band via an interactive `@clack/prompts` CLI with Zod validation schemas (`bun run create-owner` [with interactive target selection], `bun run create-owner:local`, or `bun run create-owner:remote`).
- **Turnstile Bot Mitigation**: Sign-in endpoints are guarded by Cloudflare Turnstile token verification before credentials evaluation.

---

## 2. Database & Storage Contract (Cloudflare D1)

Authentication tables are defined in [`src/db/schema.ts`](file:///d:/winterest-project/winterest-portfolio-v2/src/db/schema.ts) and managed via Drizzle ORM:

### 1. `user` Table

```ts
export const user = sqliteTable(
  'user',
  {
    id: text('id').primaryKey(),
    name: text('name').notNull(),
    email: text('email').notNull(),
    emailVerified: integer('email_verified', { mode: 'boolean' })
      .notNull()
      .default(false),
    image: text('image'),
    role: text('role', { enum: ['owner', 'admin', 'editor'] })
      .notNull()
      .default('editor'),
    createdAt: integer('created_at', { mode: 'timestamp' })
      .notNull()
      .default(sql`(unixepoch())`),
    updatedAt: integer('updated_at', { mode: 'timestamp' })
      .notNull()
      .default(sql`(unixepoch())`),
  },
  (table) => [
    uniqueIndex('user_email_unique').on(table.email),
    index('user_role_idx').on(table.role),
  ],
)
```

### 2. `session` Table

```ts
export const session = sqliteTable(
  'session',
  {
    id: text('id').primaryKey(),
    expiresAt: integer('expires_at', { mode: 'timestamp' }).notNull(),
    token: text('token').notNull(),
    ipAddress: text('ip_address'),
    userAgent: text('user_agent'),
    userId: text('user_id')
      .notNull()
      .references(() => user.id, { onDelete: 'cascade' }),
    createdAt: integer('created_at', { mode: 'timestamp' })
      .notNull()
      .default(sql`(unixepoch())`),
    updatedAt: integer('updated_at', { mode: 'timestamp' })
      .notNull()
      .default(sql`(unixepoch())`),
  },
  (table) => [
    uniqueIndex('session_token_unique').on(table.token),
    index('session_user_id_idx').on(table.userId),
  ],
)
```

### 3. `account` Table

Stores credential passwords and provider links. Cascade-deleted when user is removed.

- `password`: Formatted as `pbkdf2-v1$100000$<salt>$<derivedKey>` (base64url).

### 4. `verification` Table

Temporary verification identifiers and values for credential workflows.

---

## 3. Cryptography & Password Hashing Standard

Standard bcrypt or Argon2 binaries cannot run cleanly within Cloudflare Workers edge V8 isolates due to strict CPU runtime quotas and lack of native Node bindings.

### PBKDF2 Web Crypto Spec ([`src/lib/auth/password.ts`](file:///d:/winterest-project/winterest-portfolio-v2/src/lib/auth/password.ts)):

- **Algorithm**: `PBKDF2` with `HMAC-SHA-256`
- **Version Identifier**: `pbkdf2-v1`
- **Salt**: 16 cryptographically random bytes generated via `crypto.getRandomValues()`
- **Derived Key Length**: 32 bytes (256 bits)
- **Iterations**: Exactly `100,000` iterations (hard cap `MAX_PBKDF2_ITERATIONS = 100_000` to prevent denial-of-service via malformed iteration counts)
- **Encoding**: URL-safe base64 (`base64url` with padding stripped)
- **Serialized String Format**:
  ```txt
  pbkdf2-v1$100000$<salt_base64url>$<key_base64url>
  ```
- **Constant-Time Verification**: Uses `timingSafeEqual()` bitwise loop (`diff |= actual[i] ^ expected[i]`) to prevent timing side-channel attacks.

---

## 4. Server & API Contracts

### Endpoints

| Endpoint                  | Method | Auth Required      | Description                                                                                                                                       |
| :------------------------ | :----- | :----------------- | :------------------------------------------------------------------------------------------------------------------------------------------------ |
| `/api/auth/sign-in/email` | `POST` | Public + Turnstile | Authenticates email & password, sets HTTP-only session cookie                                                                                     |
| `/api/auth/sign-out`      | `POST` | Session Cookie     | Terminates active session and invalidates cookie                                                                                                  |
| `/api/auth/get-session`   | `GET`  | Session Cookie     | Returns session payload `{ session, user }`                                                                                                       |
| `/api/auth/*`             | `*`    | Varied             | Handled by Better Auth edge router via [`src/routes/api/auth/$.ts`](file:///d:/winterest-project/winterest-portfolio-v2/src/routes/api/auth/$.ts) |

### Request Interception & Bot Protection

In [`src/routes/api/auth/$.ts`](file:///d:/winterest-project/winterest-portfolio-v2/src/routes/api/auth/$.ts):

1. Any `POST` targeting `/sign-in/email` triggers Turnstile token verification.
2. Token is extracted from `cf-turnstile-response` header or JSON body `turnstileToken`.
3. Validated via `verifyTurnstileToken({ action: 'login', request })`. If invalid or missing, immediately returns `403 Forbidden` without hitting database or Better Auth handler.

### Server Authorization Helpers ([`src/features/auth/session.ts`](file:///d:/winterest-project/winterest-portfolio-v2/src/features/auth/session.ts))

- `getDashboardUserFromRequest(request: Request): Promise<DashboardUser | null>`: Extracts session from Better Auth via headers, validates role.
- `requireDashboardUser(request: Request)`: Returns `DashboardUser` or HTTP `401` / `403`.
- `requireOwnerUser(request: Request)`: Strict owner check; returns HTTP `403` (`"Only owner can manage users."`) if role is not `owner`.
- `requireSettingsUser(request: Request)`: Returns HTTP `403` if role is not `owner` or `admin`.

---

## 5. UI & Route Protection Architecture

```mermaid
graph TD
  A[Request to /dashboard/*] --> B{beforeLoad Guard}
  B -->|No Session Cookie| C[Redirect to /login?redirectTo=...]
  B -->|Valid Session| D[Load Dashboard Shell]
  D --> E{Route Path}
  E -->|/dashboard/users/*| F{Role == owner?}
  F -->|No| G[403 Denied / Filtered in UI]
  F -->|Yes| H[Render User Management]
  E -->|/dashboard/settings| I{Role == owner || admin?}
  I -->|No| J[403 Denied]
  I -->|Yes| K[Render Settings Editor]
  E -->|/dashboard/projects, media, stack| L{Role in owner, admin, editor?}
  L -->|Yes| M[Render Content Editors]
```

### 1. Route Gateway Guard ([`src/routes/dashboard.tsx`](file:///d:/winterest-project/winterest-portfolio-v2/src/routes/dashboard.tsx))

- `beforeLoad` invokes `getDashboardSession()` server function.
- If unauthenticated, throws `redirect({ to: '/login', search: { redirectTo: location.href } })`.
- Sanitizes redirect targets with `getSafeRedirect()` to prevent Open Redirect vulnerabilities.

### 2. Client State & Cache Invalidation ([`src/features/auth/hooks.ts`](file:///d:/winterest-project/winterest-portfolio-v2/src/features/auth/hooks.ts))

- `useSignIn()`: POST to `/api/auth/sign-in/email`, on success invalidates `userQueryKeys.session()`.
- `useSignOut()`: POST to `/api/auth/sign-out`, on success invalidates `userQueryKeys.session()` and navigates to `/login`.

---

## 6. Role-Based Access Control (RBAC) Matrix

| Resource / Action                                            | Public | Editor | Admin | Owner | Enforcement Mechanism                          |
| :----------------------------------------------------------- | :----: | :----: | :---: | :---: | :--------------------------------------------- |
| View Public Portfolio (`/`, `/projects`, `/about`, `/stack`) |   ✅   |   ✅   |  ✅   |  ✅   | Public Routes                                  |
| Access Dashboard Shell (`/dashboard`)                        |   ❌   |   ✅   |  ✅   |  ✅   | `canAccessDashboard()`, route `beforeLoad`     |
| Manage Projects (Create, Edit, Delete)                       |   ❌   |   ✅   |  ✅   |  ✅   | `canManageContent()`, `requireDashboardUser()` |
| Manage Tech Stack & Categories                               |   ❌   |   ✅   |  ✅   |  ✅   | `canManageContent()`, `requireDashboardUser()` |
| Upload & Delete Media Assets (R2)                            |   ❌   |   ✅   |  ✅   |  ✅   | `canManageContent()`, `requireDashboardUser()` |
| Modify Site Settings (General, Social, SEO)                  |   ❌   |   ❌   |  ✅   |  ✅   | `canManageSettings()`, `requireSettingsUser()` |
| View User Accounts List                                      |   ❌   |   ❌   |  ❌   |  ✅   | `canManageUsers()`, `requireOwnerUser()`       |
| Create User / Reset Password / Delete User                   |   ❌   |   ❌   |  ❌   |  ✅   | `canManageUsers()`, `requireOwnerUser()`       |
| Demote or Delete Owner Account                               |   ❌   |   ❌   |  ❌   |  ❌   | **Forbidden** (System invariant)               |

---

## 7. Invariants & Edge Cases

1. **Bootstrap Invariant (Zero-User State)**:
   - When 0 users exist in D1, the web application renders the `Owner Account Required` lock screen (`src/components/system/setup-required.tsx`).
   - The owner account must be created through `src/db/create-owner-cli.ts`.
2. **Strict Single Owner Invariant**:
   - Only exactly 1 `owner` user is permitted.
   - User creation API forbids creating a second `owner`.
   - Update user API forbids changing another user's role to `owner` or demoting the current `owner`.
3. **Public Signup Disabled**:
   - `databaseHooks.user.create.before` returns `false` in Better Auth, guaranteeing that raw API attempts to register directly fail.
4. **PBKDF2 Iteration Limit**:
   - Password verification rejects any hash requesting more than `100,000` iterations to protect against worker CPU timeout exploits.
5. **Open Redirect Mitigation**:
   - `getSafeRedirect()` enforces that `redirectTo` starts with `/`, does not start with `//`, and contains no backslashes (`\`).

### Owner Account Bootstrap CLI Architecture

The initial owner account is provisioned out-of-band via an interactive CLI tool built on `@clack/prompts` and validated with Zod:

- **CLI Entrypoint**: [`src/db/create-owner-cli.ts`](file:///d:/winterest-project/winterest-portfolio-v2/src/db/create-owner-cli.ts)
- **Validation & Helpers**: [`src/db/create-owner-helpers.ts`](file:///d:/winterest-project/winterest-portfolio-v2/src/db/create-owner-helpers.ts)
  - `ownerEmailSchema`: `z.string().trim().min(1).email()`
  - `ownerPasswordSchema`: `z.string().min(8)`
  - `createPasswordMatchSchema(expectedPassword)`: `z.string().min(1).refine(val === expectedPassword)`
  - `validateOwnerEmail`, `validateOwnerPassword`, `validatePasswordMatch`: Wrapper functions executing `.safeParse()` for `@clack/prompts` validation integration
  - `formatOwnerSummary`: Formats account summary display for the review card
- **Unit Tests**: [`src/db/__tests__/create-owner.test.ts`](file:///d:/winterest-project/winterest-portfolio-v2/src/db/__tests__/create-owner.test.ts)
- **CLI Commands**:
  - `bun run create-owner`: Interactive wizard (prompts target database selection via `select()`)
  - `bun run create-owner:local`: Direct provisioning to local Miniflare SQLite D1
  - `bun run create-owner:remote`: Direct provisioning to Cloudflare production D1
- **Workflow & Safeguards**:
  1. _Target Selection_: Respects CLI argument (`local` | `remote`) or falls back to interactive Clack `select()`.
  2. _Owner Invariant Gate_: Queries D1 for existing `role: 'owner'`. If found, displays details via `note()` and aborts with `cancel()`.
  3. _Name Input_: Defaults to `'Winterest'`.
  4. _Email Input_: Validates format with Zod and checks email uniqueness against D1.
  5. _Password Input_: Masked with asterisk `*`, enforces minimum 8 characters via Zod, requires matching confirmation.
  6. _Pre-Execution Review_: Shows summary card via `note()` and requires explicit `confirm()`.
  7. _Storage_: Generates PBKDF2 Web Crypto hash and atomically inserts `user` (role: `owner`) and `account` (provider: `credential`).

---

## 8. Acceptance Criteria & Verification Checklist (Definition of Done)

- [ ] Web Crypto PBKDF2 hash & verify passes Vitest suite ([`src/lib/auth/__tests__/password.test.ts`](file:///d:/winterest-project/winterest-portfolio-v2/src/lib/auth/__tests__/password.test.ts)).
- [ ] RBAC role permissions logic passes Vitest suite ([`src/features/auth/__tests__/roles.test.ts`](file:///d:/winterest-project/winterest-portfolio-v2/src/features/auth/__tests__/roles.test.ts)).
- [ ] Login validation schemas pass Vitest suite ([`src/features/auth/__tests__/validation.test.ts`](file:///d:/winterest-project/winterest-portfolio-v2/src/features/auth/__tests__/validation.test.ts)).
- [ ] Owner bootstrap Zod validation schemas and helpers pass Vitest suite ([`src/db/__tests__/create-owner.test.ts`](file:///d:/winterest-project/winterest-portfolio-v2/src/db/__tests__/create-owner.test.ts)).
- [ ] Turnstile security challenge verification passes Vitest suite ([`src/lib/__tests__/turnstile.test.ts`](file:///d:/winterest-project/winterest-portfolio-v2/src/lib/__tests__/turnstile.test.ts)).
- [ ] TypeScript check passes cleanly: `bun run check`.
- [ ] Production build succeeds without errors: `bun run build`.
- [ ] Session cookies are HTTP-only, secure, and SameSite configured.
