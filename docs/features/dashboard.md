# Feature: Dashboard

## Description

The dashboard is the private workspace for managing Winterest's portfolio content and reviewing its current status.

## Requirements

- An active signed-in session is required to access the dashboard. Signed-out visitors are sent to sign-in.
- Navigation and direct access reflect the user's role: editors can access the overview, projects, stack, media, social, and account areas; admins also have settings access; only the owner has user-management access.
- Users without permission for a dashboard area are redirected to the overview.
- The overview shows total, published, draft, and featured project counts, plus the five most recently updated projects.
- Selecting a recent project opens its editing workflow. The overview also provides access to create a project, upload media, and edit the technology stack.
- The dashboard provides breadcrumbs, language and theme controls, and an authenticated-user menu.
