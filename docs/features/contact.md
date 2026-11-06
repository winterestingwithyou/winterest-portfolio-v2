# Feature: Contact

## Description

Contact gives visitors a public way to send Winterest a message or use an available direct contact channel.

## Requirements

- Visitors can submit their name, email address, subject, and message. The name is required, the email must be valid, and the message must contain at least ten characters.
- Successful submissions are delivered to Winterest's primary inbox. The form shows validation feedback and a clear pending, success, or failure state.
- Bot verification is required before a message is sent. Missing or invalid verification blocks delivery.
- The page provides configured GitHub, LinkedIn, Discord, and Telegram contact links.
- A direct email option appears only when a public email address is configured. Visitors can open an email to that address or copy it, with visible confirmation after copying.
- User-provided content is handled safely when included in email, and the form is accessible to visitors.
