# Feature: Media Library

## Description

The media library lets authorized dashboard users upload and manage images and documents, then reuse images in portfolio content. Users can also provide an external image URL instead of uploading a file.

## Requirements

- Editors, admins, and owners can browse, upload, and delete media; unauthenticated users cannot access media management.
- Accept JPG, PNG, WebP, GIF, SVG, AVIF, and PDF files up to 10 MB. Reject larger or unsupported files with a clear message.
- Show upload progress and a preview, and let users select an existing image while editing content.
- Let users search by filename or alternative text, filter by image or document, browse paginated results, and copy a public media URL.
- Allow users to add alternative text to images.
- Warn users when an asset is in use. Do not leave broken content references when deleting it; require confirmation before removing those references.
- Treat project Cover Images and Project Gallery Images as media references. Normal deletion is blocked while an asset is referenced; confirmed cascade deletion removes every matching project reference before deleting the asset.
