# Feature Specification: Auth Portal & Login

| Field             | Value                                                                                              |
| :---------------- | :------------------------------------------------------------------------------------------------- |
| **Feature ID**    | `feat-auth`                                                                                        |
| **Status**        | `Implemented`                                                                                      |
| **Domain Module** | [`src/features/auth/`](file:///d:/winterest-project/winterest-portfolio-v2/src/features/auth)      |
| **Route Gateway** | [`src/routes/login.tsx`](file:///d:/winterest-project/winterest-portfolio-v2/src/routes/login.tsx) |
| **RBAC Access**   | Public (Unauthenticated only; authenticated users redirected to `/dashboard`)                      |
| **Last Updated**  | 2026-09-06                                                                                         |

---

## 1. Overview & Capabilities

The Auth feature encapsulates the user-facing sign-in portal for dashboard access. It provides an aesthetic, branded authentication screen with Cloudflare Turnstile bot verification, localized validation feedback, accessible form controls, and safe redirection handling.

### Capabilities

- **Bilingual UI**: Complete localization (`en` and `id`) for titles, subtitles, placeholders, button labels, and validation error messages via Paraglide runtime.
- **Bot Mitigation**: Embedded Cloudflare Turnstile explicit widget with automatic light/dark theme synchronization and single-use token lifecycle.
- **Client-Side Form State**: Powered by `@tanstack/react-form` and `zod` for real-time validation without unnecessary re-renders.
- **Password Visibility Toggle**: Interactive show/hide toggle for password input.
- **Safe Post-Login Redirection**: Evaluates and sanitizes `?redirectTo=/path` query parameters to prevent open redirect vulnerabilities.
- **Active Session Bypass**: Authenticated users navigating to `/login` are automatically redirected to `/dashboard` before page rendering.

---

## 2. Database & Storage Contract

This feature does not directly define database schemas; it interfaces with the core authentication tables defined in [`src/db/schema.ts`](file:///d:/winterest-project/winterest-portfolio-v2/src/db/schema.ts) through Better Auth:

- Reads credentials from `account` (matching `password` hash).
- Validates active records in `user` (ensures valid `role`).
- Inserts new record into `session` on successful credential verification.

---

## 3. Server & API Contracts

### Endpoints

| Endpoint                  | Method | Payload / Headers                                                                                                 | Response                                                               |
| :------------------------ | :----- | :---------------------------------------------------------------------------------------------------------------- | :--------------------------------------------------------------------- |
| `/api/auth/sign-in/email` | `POST` | Header `cf-turnstile-response` or Body `turnstileToken`<br>Body: `{ email, password, callbackURL?, rememberMe? }` | Set-Cookie session token<br>`{ user, session }` or `{ error: string }` |
| `/api/auth/sign-out`      | `POST` | Active session cookie                                                                                             | Deletes cookie, invalidates session record                             |

### Validation Schemas ([`src/features/auth/validation.ts`](file:///d:/winterest-project/winterest-portfolio-v2/src/features/auth/validation.ts))

- **`loginSchema`**: Base Zod schema:
  - `email`: `z.string().min(1).email()`
  - `password`: `z.string().min(1)`
- **`createLoginSchema(validationCopy)`**: Factory returning a Zod schema populated with localized error messages from `src/features/auth/copy.ts`.

---

## 4. UI & State Architecture

### Component Hierarchy

```txt
src/routes/login.tsx (Thin Route Gateway)
└── src/features/auth/pages/login-page.tsx
    ├── src/features/auth/components/section/login-hero-panel.tsx (Branded left hero)
    └── src/features/auth/components/form/login-form.tsx (Interactive form)
        ├── src/components/ui/field.tsx (Field, FieldLabel, FieldError)
        ├── src/components/ui/input.tsx (Email & Password input)
        ├── src/components/ui/turnstile.tsx (TurnstileWidget)
        └── src/components/ui/button.tsx (Submit button with pending state)
```

### State Management & Form Handling

- **Form State**: Managed via `useForm` from `@tanstack/react-form`.
- **Validation Execution**: Evaluated on blur and on submit using `createLoginSchema(copy.validation)`.
- **Turnstile Single-Use Token Lifecycle**:
  - `turnstileRef.current?.reset()` is imperatively called upon:
    1. Successful submission.
    2. Failed submission (HTTP error or invalid credentials).
    3. Token expiration callback.
- **Mutation Hook ([`src/features/auth/hooks.ts`](file:///d:/winterest-project/winterest-portfolio-v2/src/features/auth/hooks.ts))**:
  - `useSignIn()`: Handles API submission and triggers query invalidation for `userQueryKeys.session()`.

### Localized Copy Tokens ([`src/features/auth/copy.ts`](file:///d:/winterest-project/winterest-portfolio-v2/src/features/auth/copy.ts))

Accessible via `getAuthCopy()`:

- `metaTitle`: `"Sign In"` / `"Masuk"`
- `brandName`: `"Winterest"`
- `eyebrow`: `"Dashboard Access"` / `"Akses Dashboard"`
- `fields`: `email`, `password`
- `validation`: `emailRequired`, `emailInvalid`, `passwordRequired`
- `submit`: `signin`, `pending`

---

## 5. Security & RBAC Rules

- **Access Level**: Public.
- **Guard Behavior**:
  - In [`src/routes/login.tsx`](file:///d:/winterest-project/winterest-portfolio-v2/src/routes/login.tsx), `beforeLoad` invokes `getDashboardSession()`.
  - If a valid session exists, it executes `throw redirect({ to: getSafeRedirect(search.redirectTo) })`.
- **Credential Protection**:
  - Passwords are submitted directly over HTTPS POST.
  - Form does not retain plain-text passwords in persistent storage.
  - Specific credential existence (e.g. "Email not found" vs "Wrong password") is masked into general error messages (`copy.errors.signin`) to prevent user enumeration attacks.

---

## 6. Edge Cases & Invariants

1. **Turnstile Failure**:
   - If the Turnstile challenge fails, times out, or the token is missing, the submission is blocked client-side with a localized alert, and the widget resets.
2. **Open Redirect Vulnerability**:
   - Query parameter `?redirectTo=` is filtered through `getSafeRedirect(url)`. Any URL starting with `//`, containing `\`, or pointing to an external domain is normalized to `/dashboard`.
3. **Double Submission Prevention**:
   - The submit button enters a disabled state (`isSubmitting || isPending`) to prevent duplicate HTTP requests.
4. **Session Cookie Mismatch**:
   - If a stale session cookie exists for a deleted user account, `getDashboardSession()` returns `null`, and the login form renders normally.

---

## 7. Acceptance Criteria & Verification Checklist (Definition of Done)

- [ ] Form validates empty email, malformed email, and empty password with localized error messages.
- [ ] Password visibility toggle successfully toggles between masked (`type="password"`) and visible (`type="text"`).
- [ ] Turnstile widget renders correctly in light and dark mode and resets upon failed attempts.
- [ ] Successful login sets secure HTTP-only cookie and redirects to `/dashboard` (or sanitized `?redirectTo=`).
- [ ] Already logged-in users visiting `/login` are automatically redirected to `/dashboard`.
- [ ] Unit tests pass in [`src/features/auth/__tests__/validation.test.ts`](file:///d:/winterest-project/winterest-portfolio-v2/src/features/auth/__tests__/validation.test.ts).
- [ ] TypeScript check passes: `bun run check`.
