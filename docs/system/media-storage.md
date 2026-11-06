# System: Media Storage and Delivery

## Description

The media system stores and serves images, project screenshots, and PDF documents, with searchable metadata kept separately from the file contents.

## Requirements

- Accept JPEG, PNG, WebP, GIF, SVG, and AVIF images, plus PDF documents. Reject unsupported media types and files larger than 10 MB.
- Only authenticated dashboard users with content-management access may upload or delete media.
- Public media URLs support conditional caching. A matching validator returns an unchanged response, and successful media responses may be cached as immutable for one year.
- SVG delivery must block script execution and framing. Responses must prevent MIME sniffing. PDF documents are displayed inline.
- Validate media keys so malformed paths cannot access unintended objects.
- A successful deletion removes both the stored file and its corresponding metadata record.
