# Feature: Certificates

## Description

Certificates records credentials owned by Winterest and presents them to public visitors with links to view the document or verify it with its issuer.

## Requirements

- Editors, admins, and owners can create, edit, and delete certificate records in the dashboard.
- Certificates have draft and published states. Only published certificates are public; there is no separate public/private setting.
- A certificate requires its title, issuer, and issue date. Preserve the certificate's original title and issuer wording.
- A credential ID, English and Indonesian descriptions, and expiration date are optional. When set, expiration must be later than the issue date.
- A cover image, a PDF certificate document, and an issuer verification URL are optional, but each certificate must have either a PDF document or a verification URL. In the editor, the PDF and verification URL fields share a two-tab group with a helper explaining the requirement and a filled indicator on each tab. New certificates open on PDF; edits open the populated tab, preferring PDF when both are set. Submission focuses the tab with a field error.
- Covers and PDFs are selected from the Media Library. The editor presents them in bordered media rows with an image thumbnail or document mark and grouped choose, open, and remove actions; raw media URLs are not shown as field text. PDFs open directly in the browser. Media file type and size limits follow the Media Library requirements.
- Media assets referenced by certificates cannot be deleted through normal deletion. Confirmed cascade deletion removes their certificate references before deleting the assets.
- The public `/certificates` page lists published certificates in descending issue-date order, with a stable tie-breaker. Search matches certificate title, issuer, and English or Indonesian description; URL search parameters preserve the query (`q`) and page (`page`). It shows ten rows per page and has no per-certificate detail route.
- The dashboard certificate list searches title, issuer, credential ID, and both localized descriptions. It can be filtered by draft/published status and issuer; active filters combine, are reflected in URL parameters (`q`, `status`, `issuer`, `page`), and reset pagination to the first page when changed. Search uses the shared 350 ms debounced input. The list shows ten rows per page and distinguishes an empty collection from no filter matches.
- The Certificates page CMS manages separate localized eyebrow, title, and description content for the `/certificates` page header and homepage Certificates section. Each description can be hidden independently; page heading content is also used for page metadata.
- On `/certificates`, each published certificate appears in its own solid, border-led panel within a vertical list. On wide screens, an optional cover sits left of the details and available actions occupy a right column; on narrow screens, the cover, details, and actions stack within the item. Certificates without covers do not receive substitute artwork.
- The public list preserves issuer, issue and expiration dates, credential ID, localized description, expired status, and applicable actions. Opening the PDF is the primary outlined action; issuer verification is secondary. External links open in a new tab.
- Expired certificates remain visible with an expired status; expiration does not remove them from the public list or homepage selection.
- Public navigation labels are localized as `Certificates` / `Sertifikat`. Register the static `/certificates` page in the sitemap.
- Interface copy is available in English and Indonesian. Optional descriptions are localized; certificate title and issuer retain their original wording.

## Homepage section

- Place a Certificates section after the featured projects section, with a link to `/certificates`.
- Show at most five published certificates, ordered by issue date descending with a stable tie-breaker. Do not add a manual featured flag.
- Hide the section when there are no published certificates. Show one certificate as a static card without carousel controls.
- With multiple items, use a manually navigated, looping carousel with no autoplay and no arrow buttons. Support touch/swipe, pointer dragging, and keyboard arrow navigation while the carousel is focused. Show passive position indicators.
- The carousel rail spans the viewport while its heading and section link align to the site content container. The active card is larger than neighboring cards; neighboring cards may peek into view.
- Use the existing Embla-based carousel as the implementation foundation and Magic UI's carousel as a visual reference only. Keep the treatment within Flat Precision: no 3D rotation, solid surfaces, and restrained scale transitions.
- Disable scale transitions when `prefers-reduced-motion: reduce` is active.
