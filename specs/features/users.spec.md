# Feature Specification: User Management (Owner Only)

| Field                | Value                                                                                                                                                          |
| :------------------- | :------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Feature ID**       | `feat-users`                                                                                                                                                   |
| **Status**           | `Implemented`                                                                                                                                                  |
| **Domain Module**    | [`src/features/users/`](file:///d:/winterest-project/winterest-portfolio-v2/src/features/users)                                                                |
| **Dashboard Routes** | [`/dashboard/users`](file:///d:/winterest-project/winterest-portfolio-v2/src/routes/dashboard/users/index.tsx), `/dashboard/users/new`, `/dashboard/users/$id` |
| **RBAC Permissions** | Owner Only                                                                                                                                                     |
| **Last Updated**     | 2026-09-06                                                                                                                                                     |

---

## 1. Overview & Capabilities

The User Management feature gives the portfolio Owner complete administrative control over system accounts, collaborator roles, and dashboard credentials. Public registration is closed; all accounts are provisioned and managed through this feature.

### Capabilities

- **Collaborator Provisioning**: Owner can create new user accounts with designated roles (`admin` or `editor`).
- **Role Assignment & RBAC Governance**: Elevate or demote accounts between `admin` and `editor`. Enforces the single-owner invariant.
- **Active Session Auditing**: Displays active session counts per user account derived from the `session` table.
- **Administrative Password Reset**: Owner can set new passwords for accounts without knowing existing passwords.
- **Account Revocation**: Delete accounts with automatic cascade cleanup of active sessions and credentials.

---

## 2. Database & Storage Contract

Interacts with core auth tables in D1 ([`src/db/schema.ts`](file:///d:/winterest-project/winterest-portfolio-v2/src/db/schema.ts)):

- `user`: Updates `name`, `email`, `role`.
- `account`: Creates and updates password records hashed via PBKDF2 Web Crypto.
- `session`: Cascade deleted when user is removed.

---

## 3. Server & API Contracts

### Endpoints

| Endpoint                    | Method   | Auth  | Description                               |
| :-------------------------- | :------- | :---- | :---------------------------------------- |
| `/api/users`                | `GET`    | Owner | List all users with active session counts |
| `/api/users`                | `POST`   | Owner | Create new user account and credentials   |
| `/api/users`                | `PUT`    | Owner | Update user profile and role              |
| `/api/users`                | `DELETE` | Owner | Delete user and cascade active sessions   |
| `/api/users/reset-password` | `POST`   | Owner | Reset password with PBKDF2 hashing        |

### Validation ([`src/features/users/validation.ts`](file:///d:/winterest-project/winterest-portfolio-v2/src/features/users/validation.ts))

- `createUserSchema`: Name (min 2), Email (valid & lowercase), Password (min 8), Role (`admin` | `editor`).
- `updateUserSchema`: User ID, Name, Email, Role.
- `resetPasswordSchema`: User ID, New Password (min 8).

---

## 4. UI & State Architecture

### Component Hierarchy

```txt
src/routes/dashboard/users/index.tsx -> DashboardUsersPage
├── DashboardUsersMetrics (Total users, active sessions, admin counts)
└── DashboardUsersTable (TanStack Table, role badges, action dropdowns)

src/routes/dashboard/users/new.tsx -> UserEditorForm (Create mode)
src/routes/dashboard/users/$id.tsx -> UserEditorForm (Edit mode + Reset Password card)
```

### TanStack Query Keys & Hooks

- `userQueryKeys.all`, `userQueryKeys.list()`, `userQueryKeys.detail(id)`, `userQueryKeys.session()`
- `sessionQueryOptions.current()`: Cached active user role for permission gates.
- Mutation hooks in [`src/features/users/hooks.ts`](file:///d:/winterest-project/winterest-portfolio-v2/src/features/users/hooks.ts):
  - `useCreateUser()`, `useUpdateUser()`, `useDeleteUser()`, `useResetUserPassword()`.

---

## 5. Security & Invariants

1. **Strict Owner Gate**: All routes and endpoints invoke `requireOwnerUser()`. Any call from `admin` or `editor` returns 403 Forbidden.
2. **Single-Owner Protection**:
   - The owner cannot be deleted via the API (`authUser.id === targetId` check).
   - Creating a second account with role `owner` is rejected.
   - The owner's role cannot be downgraded.
3. **Automatic Session Termination**: Deleting a user or resetting their password invalidates their sessions in D1 immediately.

---

## 6. Acceptance Criteria & DoD Checklist

- [ ] Non-owner accounts cannot access `/dashboard/users` or call `/api/users/*`.
- [ ] Owner can create a new collaborator with valid password and assigned role.
- [ ] Resetting password applies PBKDF2 hash and allows the user to log in with new password.
- [ ] Owner cannot delete themselves.
- [ ] User management schema passes Vitest suite ([`src/features/users/__tests__/validation.test.ts`](file:///d:/winterest-project/winterest-portfolio-v2/src/features/users/__tests__/validation.test.ts)).
- [ ] TypeScript check passes: `bun run check`.
