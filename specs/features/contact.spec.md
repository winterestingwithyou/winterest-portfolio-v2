# Feature Specification: Public Contact Form & Bot Protection

| Field                | Value                                                                                                |
| :------------------- | :--------------------------------------------------------------------------------------------------- |
| **Feature ID**       | `feat-contact`                                                                                       |
| **Status**           | `Implemented`                                                                                        |
| **Domain Module**    | [`src/features/contact/`](file:///d:/winterest-project/winterest-portfolio-v2/src/features/contact)  |
| **Public Routes**    | [`/contact`](file:///d:/winterest-project/winterest-portfolio-v2/src/routes/contact.tsx)             |
| **Server Endpoints** | [`POST /api/contact`](file:///d:/winterest-project/winterest-portfolio-v2/src/routes/api/contact.ts) |
| **RBAC Access**      | Public                                                                                               |
| **Last Updated**     | 2026-09-06                                                                                           |

---

## 1. Overview & Capabilities

The Contact feature provides a direct, spam-resilient communication channel between visitors and Winterest. It combines an accessible interactive form with Cloudflare Turnstile bot verification and transactional email dispatch powered by Resend.

### Capabilities

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
├── DirectChannelsPanel (Direct email, social links, location indicator)
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

---

## 5. Acceptance Criteria & DoD Checklist

- [ ] Form validates required name, valid email, and minimum message length.
- [ ] Turnstile challenge renders and issues token on human verification.
- [ ] Submitting valid message dispatches email via Resend and shows success state.
- [ ] Submitting invalid token or bypassing Turnstile returns 403 Forbidden.
- [ ] Contact validation schemas pass Vitest suite ([`src/features/contact/__tests__/validation.test.ts`](file:///d:/winterest-project/winterest-portfolio-v2/src/features/contact/__tests__/validation.test.ts)).
- [ ] TypeScript check passes: `bun run check`.
