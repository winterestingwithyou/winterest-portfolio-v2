# Feature Specification: Public Contact Form & Bot Protection

| Field                | Value                                                                                                |
| :------------------- | :--------------------------------------------------------------------------------------------------- |
| **Feature ID**       | `feat-contact`                                                                                       |
| **Status**           | `Implemented`                                                                                        |
| **Domain Module**    | [`src/features/contact/`](file:///d:/winterest-project/winterest-portfolio-v2/src/features/contact)  |
| **Public Routes**    | [`/contact`](file:///d:/winterest-project/winterest-portfolio-v2/src/routes/contact.tsx)             |
| **Server Endpoints** | [`POST /api/contact`](file:///d:/winterest-project/winterest-portfolio-v2/src/routes/api/contact.ts) |
| **RBAC Access**      | Public                                                                                               |
| **Last Updated**     | 2026-09-11                                                                                           |

---

## 1. Overview & Capabilities

The Contact feature provides a direct, spam-resilient communication channel between visitors and Winterest. It combines an accessible interactive form with Cloudflare Turnstile bot verification, transactional email dispatch powered by Resend, and prominent direct contact channels including a configurable Dedicated Public Email Card.

### Capabilities

- **Dedicated Public Email Card**: Configurable direct email channel loaded from Site Settings with one-click `mailto:` launcher and animated copy-to-clipboard feedback.
- **Turnstile Bot Verification**: Enforces anti-bot verification via invisible/managed challenges before allowing message dispatch.
- **Transactional Email Dispatch**: Formats and delivers incoming inquiries via Resend API to Winterest's primary inbox.
- **HTML Sanitization**: Strict character escaping (`escapeHtml()`) across name, email, subject, and message fields to prevent HTML injection in email clients.
- **Client-Side Form Experience**: Powered by `@tanstack/react-form` with clear inline field validation, pending states, and success toasts.
- **Direct Social Channel Directory**: Side-by-side display of alternative communication channels (GitHub, LinkedIn, Discord, Telegram, Email).

---

## 2. Server & API Contracts

### Endpoint: `POST /api/contact`

- **Auth**: Public + Mandatory Turnstile.
- **Request Body**:
  ```json
  {
    "name": "Visitor Name",
    "email": "visitor@example.com",
    "subject": "Collaboration Inquiry",
    "message": "Message content (min 10 characters)...",
    "turnstileToken": "0.XXXXX"
  }
  ```
- **Responses**:
  - `200 OK`: `{ "success": true, "id": "resend_email_id" }`
  - `400 Bad Request`: `{ "error": "Validation message" }`
  - `403 Forbidden`: `{ "error": "Security challenge failed." }`
  - `500 Server Error`: `{ "error": "Failed to send email." }`

### Validation ([`src/features/contact/validation.ts`](file:///d:/winterest-project/winterest-portfolio-v2/src/features/contact/validation.ts))

- `name`: String min 1 character.
- `email`: Valid email format.
- `message`: String min 10 characters.
- `turnstileToken`: Required verification token string.

---

## 3. UI & Component Architecture

### Component Hierarchy

```txt
src/routes/contact.tsx -> ContactPage
├── ContactChannels
│   ├── Dedicated Email Card (Optional: rendered only when publicEmail is configured)
│   │   ├── Action: Send Email (mailto: link)
│   │   └── Action: Copy Email (clipboard copy with 2s visual confirmation)
│   ├── Social Channels Card (Directory of public social profiles)
│   └── Status & Location Pill Card
└── ContactForm (TanStack Form)
    ├── Field: Name (Input)
    ├── Field: Email (Input)
    ├── Field: Subject (Input)
    ├── Field: Message (Textarea)
    ├── TurnstileWidget (Cloudflare Turnstile explicit rendering)
    └── SubmitButton (Pending spinner & submit state)
```

---

## 4. Security & Invariants

1. **Mandatory Bot Check**: Requests lacking a valid Turnstile token are rejected before initializing the Resend client, saving API quota and preventing mail bombing.
2. **XSS Protection in Email**: All user inputs are sanitized through `escapeHtml()` prior to embedding in the outbound HTML template.
3. **Turnstile Single-Use Token**: Token resets immediately on submission failure or completion via `turnstileRef.current?.reset()`.
4. **Empty Email Invariant**: If `publicEmail` is null, undefined, empty string, or whitespace-only, the Dedicated Email Card is completely omitted without rendering placeholders, fallback dummy emails, or empty containers.

---

## 5. Acceptance Criteria & DoD Checklist

- [x] Form validates required name, valid email, and minimum message length.
- [x] Turnstile challenge renders and issues token on human verification.
- [x] Submitting valid message dispatches email via Resend and shows success state.
- [x] Submitting invalid token or bypassing Turnstile returns 403 Forbidden.
- [x] Dedicated Email Card displays in `ContactChannels` when `publicEmail` is configured.
- [x] Empty email invariant verified (card is omitted if `publicEmail` is unset or empty).
- [x] "Send Email" launches `mailto:` and "Copy Email" copies to clipboard with 2s confirmation feedback.
- [x] ContactChannels unit tests pass Vitest suite ([`src/features/contact/__tests__/contact-channels.test.tsx`](file:///d:/winterest-project/winterest-portfolio-v2/src/features/contact/__tests__/contact-channels.test.tsx)).
- [x] Contact validation schemas pass Vitest suite ([`src/features/contact/__tests__/validation.test.ts`](file:///d:/winterest-project/winterest-portfolio-v2/src/features/contact/__tests__/validation.test.ts)).
- [x] TypeScript check passes: `bun run typecheck`.
