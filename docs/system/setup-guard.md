# System: Setup Readiness Guard

## Description

The setup guard keeps the application locked until its database is ready and an owner account exists, then allows normal public and dashboard access.

## Requirements

- If required database tables are missing, show a migration-required screen and keep normal application routes locked.
- If the database is ready but no owner exists, show an owner-required screen and keep normal application routes locked.
- Create the initial owner only through trusted out-of-band provisioning. Public self-registration must remain disabled.
- If the system cannot verify database readiness, fail closed into a locked state without exposing an unhandled runtime error.
- Do not run normal site or dashboard data queries while setup is locked.
- Once an owner exists, allow the normal public site and dashboard to load.
- Setup guidance is available in English and Indonesian and distinguishes local from remote setup. Users can copy the displayed command and reload to check readiness again.
- The setup screen must not reveal connection strings, database identifiers, or internal filesystem paths.
