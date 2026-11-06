# Feature: Sign-In

## Description

Sign-in gives authorized users access to the Winterest dashboard through an email and password form.

## Requirements

- The sign-in page is available to signed-out visitors. Users with an active session are sent to the dashboard or another safe, internal destination they requested.
- Users can sign in with a required email address and password. Invalid or missing values receive clear validation feedback in English and Indonesian.
- Bot verification is required before sign-in. A missing or failed challenge blocks submission and allows the user to try again.
- Users can show or hide the password while entering it.
- After successful sign-in, send the user to their safe, requested internal destination, or to the dashboard when no destination was requested.
- Sign-in errors do not reveal whether an account exists or which credential was incorrect. Plain-text passwords are not retained in persistent browser storage.
- The form and its controls are accessible and operable by keyboard.
