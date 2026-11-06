# System: Authentication and Role-Based Access Control

## Description

Authentication protects dashboard access, while role-based permissions control who can manage content, site settings, and user accounts.

## Requirements

- Sign-in requires valid credentials and a valid Cloudflare Turnstile challenge.
- Sessions use secure, HTTP-only cookies. Authentication tokens and session data must not be stored in browser local storage.
- Passwords must never be stored in plain text or as weak, unsalted hashes. Store salted, versioned PBKDF2 hashes, limit verification work to at most 100,000 iterations, and compare hashes in a timing-resistant way.
- Public self-registration is disabled. The initial owner account is provisioned out of band rather than through public registration.
- Exactly one owner may exist. The owner cannot be demoted or deleted.
- Only the owner may view or manage user accounts and assign roles.
- Owners and admins may change site settings. Owners, admins, and editors may manage projects, technologies, and media.
- Dashboard access requires a valid session and is checked on the server. Redirect destinations after sign-in must not allow external or protocol-relative URLs.
