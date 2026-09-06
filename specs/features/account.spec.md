# Feature Specification: Account & Profile Management

| Field                | Value                                                                                                              |
| :------------------- | :----------------------------------------------------------------------------------------------------------------- |
| **Feature ID**       | `feat-account`                                                                                                     |
| **Status**           | `Implemented`                                                                                                      |
| **Domain Module**    | [`src/features/account/`](file:///d:/winterest-project/winterest-portfolio-v2/src/features/account)                |
| **Dashboard Routes** | [`/dashboard/account`](file:///d:/winterest-project/winterest-portfolio-v2/src/routes/dashboard/account/index.tsx) |
| **RBAC Permissions** | Authenticated Dashboard Users (`owner`, `admin`, `editor`)                                                         |
| **Last Updated**     | 2026-09-06                                                                                                         |

---

## 1. Overview & Capabilities

The Account feature provides authenticated dashboard users with self-service profile and credential controls. It allows users to update their personal details, review active sessions, and change their password with mandatory verification of their current password.

### Capabilities

- **Self Profile Updates**: Update display name and email address.
- **Secure Password Change**: Self-service password rotation requiring current password verification before updating the PBKDF2 hash.
- **Session Introspection**: View active browser sessions and device information associated with the account.
- **Role Transparency**: Displays the user's active RBAC role (`owner`, `admin`, or `editor`) as an immutable badge.

---

## 2. Database & Storage Contract

Interacts with core user and credential tables in D1:

- `user`: Updates `name`, `email`, and `updatedAt`.
- `account`: Re-hashes and stores updated password using Web Crypto PBKDF2.
- `session`: Reads user's active session metadata.

---

## 3. Server & API Contracts

### Endpoints

| Endpoint                | Method | Auth           | Description                                     |
| :---------------------- | :----- | :------------- | :---------------------------------------------- |
| `/api/account`          | `GET`  | Dashboard User | Get active user profile and session records     |
| `/api/account`          | `PUT`  | Dashboard User | Update current user name and email              |
| `/api/account/password` | `POST` | Dashboard User | Verify old password and apply new password hash |

### Validation ([`src/features/account/validation.ts`](file:///d:/winterest-project/winterest-portfolio-v2/src/features/account/validation.ts))

- `updateProfileSchema`:
  - `name`: String min 2 characters.
  - `email`: Valid lowercase email address.
- `changePasswordSchema`:
  - `currentPassword`: String min 1 character.
  - `newPassword`: String min 8 characters.
  - `confirmPassword`: Must match `newPassword`.

---

## 4. UI & State Architecture

### Component Hierarchy

```txt
src/routes/dashboard/account/index.tsx -> AccountPage
└── AccountEditorForm
    ├── Profile Information Card (Name, email, role badge)
    ├── Password Security Card (Current password, new password, confirmation)
    └── Active Sessions Card (User-agent, IP, last active timestamp)
```

### TanStack Query Keys & Hooks

- `accountQueryKeys.all`, `accountQueryKeys.profile()`, `accountQueryKeys.sessions()`
- Mutation Hooks:
  - `useUpdateProfile()`: PUT to `/api/account`, invalidates account queries.
  - `useChangePassword()`: POST to `/api/account/password`.

---

## 5. Security & Invariants

1. **Self-Service Scope**: Users can only modify their own profile; `authUser.id` is derived from the verified session cookie, never client-supplied ID parameters.
2. **Current Password Verification**: Updating password strictly verifies the existing PBKDF2 password hash using constant-time comparison before writing new credentials.
3. **Immutability of Role**: Users cannot alter their own RBAC role; role elevation is restricted exclusively to the Owner via the User Management feature.

---

## 6. Acceptance Criteria & DoD Checklist

- [ ] Updating profile name and email saves correctly and refreshes topbar user display.
- [ ] Attempting password change with incorrect current password is rejected with 400 Bad Request.
- [ ] Submitting mismatched new password and confirmation triggers client validation error.
- [ ] Successful password change enables logging in with the new password on subsequent sessions.
- [ ] Account validation schemas pass Vitest suite ([`src/features/account/__tests__/validation.test.ts`](file:///d:/winterest-project/winterest-portfolio-v2/src/features/account/__tests__/validation.test.ts)).
- [ ] TypeScript check passes: `bun run check`.
