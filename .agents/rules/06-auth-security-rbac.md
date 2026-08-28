# Authentication, RBAC & Security Standards

## Better Auth Architecture

Use **Better Auth** as the authentication foundation integrated with Drizzle ORM and Cloudflare D1.

- **Cookie Sessions**: Sessions backed by secure HTTP-only cookies.
- **No `localStorage`**: Never store authentication tokens or session data in `localStorage`.
- **Server Route Protection**: Protect dashboard routes server-side using session validation loaders.
- **Module Separation**: Keep auth configuration in a dedicated module (`src/lib/auth/`), separating server-side helpers from client-side helpers.

---

## Edge-Friendly Password Hashing

Cloudflare Workers has strict CPU execution limits. Standard CPU-heavy hashing (e.g. heavy bcrypt) can cause worker timeouts.

- Use a custom password hashing implementation with **Web Crypto PBKDF2** (or equivalent edge-friendly algorithm).
- Store salt and algorithm/version metadata.
- Do **NOT** store plain-text passwords or use weak unsalted SHA-256.

---

## RBAC Model

The application uses three roles:

```txt
owner   - full access (user management, roles, security settings, all content & media)
admin   - dashboard, site settings, content & media management
editor  - create, edit, and update content & media
```

### Authorization Rules:
- Only `owner` can manage users and assign roles.
- Only `owner` or `admin` can modify site settings.
- `editor` can manage content (create/update projects, media) but cannot change security or user settings.
- Public routes must only show published content; draft/private content requires dashboard authorization.

### First-User Bootstrap:
- Initial registration is open only when zero users exist in the database.
- The first registered user is automatically assigned the `owner` role.
- Once an owner exists, open registration is disabled.

---

## Security & Secrets Management

- **Zero Secret Exposure**: Never commit secrets or `.env` files to git. Never expose auth secrets, database tokens, or private keys to client bundles.
- **Environment Variables**: Validate environment variables at startup using **T3Env** (`src/env.ts`). Maintain `.env.example` when adding required variables.
- **Markdown & HTML Sanitization**: Always sanitize rich text/markdown content before rendering to prevent XSS vulnerabilities. Never use `dangerouslySetInnerHTML` without sanitization.
- **Least Privilege**: Apply the principle of least privilege for roles and API endpoints.
- **Error Privacy**: Avoid leaking whether an email exists during login or password reset flows.
