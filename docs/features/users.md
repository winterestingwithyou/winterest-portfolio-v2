# Feature: User Management

## Description

User management lets the portfolio owner create and manage dashboard accounts for collaborators. Public registration is closed; the owner provisions all accounts.

## Requirements

- Only the owner can view or manage user accounts. Admins and editors cannot access this feature.
- The owner can create collaborator accounts with either the admin or editor role, update their account details and role, view active session counts, reset passwords, and delete accounts.
- New accounts require a valid email address and a password of at least eight characters.
- The system must have a single owner. The owner cannot create another owner account, downgrade their own role, or delete their own account.
- Deleting an account or resetting its password ends that account’s active sessions.
