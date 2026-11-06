# Feature: Home

## Description

The home page introduces Winterest's portfolio, selected work, engineering interests, and contact options.

## Requirements

- The page is public and presents a personal introduction, social links, and a CV download when a CV is available.
- Education highlights include the university, major, and GPA when provided.
- Featured projects include only projects that are both published and public. The section handles having no featured projects without showing misleading content.
- The Certificates section appears after featured projects only when published certificates exist. It shows up to five newest certificates by issue date in a manual, looping, full-bleed carousel and links to `/certificates`; one certificate appears as a static card.
- The certificate carousel has no autoplay or arrow buttons. It supports touch, pointer dragging, and keyboard navigation, shows passive position indicators, and disables scale transitions for reduced-motion preferences.
- The page presents engineering interests and a moving display of selected technologies.
- A contact call to action leads visitors to the contact page.
- Page content and the CV selection follow the active English or Indonesian locale.
- The layout works across mobile and desktop widths, the technology display does not cause horizontal overflow, and motion respects reduced-motion preferences.
