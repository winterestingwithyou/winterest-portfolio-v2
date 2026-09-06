# Feature Specification: Media Library & Asset Management

| Field                 | Value                                                                                                                                                                                                                                                                                        |
| :-------------------- | :------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Feature ID**        | `feat-media`                                                                                                                                                                                                                                                                                 |
| **Status**            | `Implemented`                                                                                                                                                                                                                                                                                |
| **Domain Module**     | [`src/features/media/`](file:///d:/winterest-project/winterest-portfolio-v2/src/features/media)                                                                                                                                                                                              |
| **Dashboard Routes**  | [`/dashboard/media`](file:///d:/winterest-project/winterest-portfolio-v2/src/routes/dashboard/media.tsx)                                                                                                                                                                                     |
| **Shared Components** | [`src/components/media/image-uploader.tsx`](file:///d:/winterest-project/winterest-portfolio-v2/src/components/media/image-uploader.tsx), [`src/components/media/media-picker-dialog.tsx`](file:///d:/winterest-project/winterest-portfolio-v2/src/components/media/media-picker-dialog.tsx) |
| **RBAC Permissions**  | Editor/Admin/Owner (Full Management)                                                                                                                                                                                                                                                         |
| **Last Updated**      | 2026-09-06                                                                                                                                                                                                                                                                                   |

---

## 1. Overview & Capabilities

The Media Library feature provides unified asset ingestion and media management across the portfolio. It offers a dedicated dashboard asset gallery, a reusable drag-and-drop image uploader, and an asset picker modal integrated into project and settings forms.

### Capabilities

- **Drag-and-Drop Ingestion**: Interactive dropzone with instant client-side thumbnail preview, file size validation, and upload progress feedback.
- **Media Picker Modal**: Reusable dialog (`MediaPickerDialog`) enabling editors to select from existing uploads or upload new files inline without leaving form workflows.
- **URL Fallback Mode**: Supports direct external image URLs alongside native Cloudflare R2 uploads.
- **Asset Metadata Tracking**: Automatically captures filename, MIME type, file size in bytes, and custom accessibility `alt` text.
- **Search & Filter**: Search media assets by filename or alt text in real-time.
- **One-Click URL Copying**: Copy public asset URLs directly to the clipboard.

---

## 2. Database & Storage Contract

Interacts with Cloudflare R2 (`MEDIA_BUCKET`) and the `media` table in D1 (detailed in [`specs/system/media-storage.spec.md`](file:///d:/winterest-project/winterest-portfolio-v2/specs/system/media-storage.spec.md)):

- `media.id`: Text UUID primary key.
- `media.filename`: Original client file name.
- `media.url`: Public streaming URL (`/api/media/file/{folder}/{key}`).
- `media.mimeType`: Verified content type.
- `media.size`: Integer size in bytes.
- `media.alt`: Optional accessible description.

---

## 3. Server & API Contracts

### Endpoints

- `GET /api/media`: Query params `{ search?, limit? }`. Returns array of `MediaRecord`.
- `POST /api/media`: Multipart form-data with `file` and optional `alt`. Uploads to R2 and writes to D1.
- `DELETE /api/media/:id`: Deletes object from R2 and removes record from D1.

### Client Validation ([`src/features/media/validation.ts`](file:///d:/winterest-project/winterest-portfolio-v2/src/features/media/validation.ts))

- `MAX_FILE_SIZE_BYTES = 10 * 1024 * 1024` (10MB).
- `ALLOWED_MIME_TYPES`: JPG, PNG, WebP, GIF, SVG, AVIF, PDF.

---

## 4. UI & State Architecture

### Component Hierarchy

```txt
src/routes/dashboard/media.tsx -> MediaPage
├── Upload Dropzone Area (Direct file drag or browse)
├── Media Library Filter Bar (Search input, view toggles)
└── Media Grid
    └── MediaCard (Thumbnail, dimensions, size formatting, copy URL, delete button)

Form Integration:
ProjectEditorForm / SettingsEditorForm
└── ImageUploader
    ├── File input dropzone
    ├── Live aspect-ratio preview
    └── MediaPickerDialog (Opens media grid modal for one-click selection)
```

### TanStack Query & Hooks ([`src/features/media/hooks.ts`](file:///d:/winterest-project/winterest-portfolio-v2/src/features/media/hooks.ts))

- `mediaQueryKeys.all`, `mediaQueryKeys.list(search)`
- Query Option: `mediaQueryOptions.list(search)`
- Mutation Hooks:
  - `useUploadMedia()`: Sends `FormData` to `/api/media`, invalidates `mediaQueryKeys.all`.
  - `useDeleteMedia()`: Deletes via `/api/media/:id`, invalidates `mediaQueryKeys.all`.

---

## 5. Security & RBAC Rules

- **Role Requirement**: All upload, delete, and list operations require role `editor`, `admin`, or `owner`.
- **Public Restriction**: Unauthenticated users cannot view media management screens or invoke management APIs (handled by `requireDashboardUser()`).
- **Sanitization**: Uploaded filenames are sanitized and assigned randomized UUID prefixes to prevent overwrites and directory traversal.

---

## 6. Acceptance Criteria & DoD Checklist

- [ ] Drag-and-drop file upload displays progress and updates media grid immediately.
- [ ] Files exceeding 10MB are rejected with clear client-side error notification.
- [ ] MediaPickerDialog allows selecting an existing image and populates form coverImage field.
- [ ] Delete confirmation modal asks for user confirmation before removing asset.
- [ ] Copy URL button copies full public asset streaming link to clipboard.
- [ ] Validation schemas pass Vitest suite ([`src/features/media/__tests__/validation.test.ts`](file:///d:/winterest-project/winterest-portfolio-v2/src/features/media/__tests__/validation.test.ts)).
- [ ] TypeScript check passes: `bun run check`.
