# Feature: Account & Profile Management

## Description

Account management lets signed-in dashboard users update their own profile, change their password, and review active sessions.

## Requirements

- Only signed-in dashboard users can view or manage their own account information.
- Users can update their display name and email address; the name must contain at least two characters and the email must be valid.
- A password change requires the current password, a new password of at least eight characters, and a matching confirmation. Incorrect current passwords and mismatched values are rejected with clear feedback.
- Users can view their active sessions and associated device information.
- The user's active role is visible but cannot be changed from account management.
