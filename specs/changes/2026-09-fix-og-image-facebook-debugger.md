# RFC: Fix Open Graph Image Resolution & Dimension Metadata for Facebook Sharing Debugger

- **Feature ID**: `fix-og-image-facebook-debugger`
- **Date**: 2026-09-11
- **Status**: `Draft`
- **Target Routes**:
  - `src/routes/__root.tsx`
  - `src/routes/projects/$slug.tsx`
  - All public routes (`/`, `/about`, `/projects`, `/stack`, `/contact`, `/resume`)
- **Target Modules**:
  - `src/lib/metadata.ts`
  - `src/lib/__tests__/metadata.test.ts`
  - `public/og-default.png`

---

## 1. Overview & Problem Statement

Saat tautan portofolio atau halaman proyek dibagikan di Facebook, Facebook Sharing Debugger memunculkan peringatan kritis:

> **Peringatan Yang Harus Diperbaiki (Inferred Property)**:
> _"Properti 'og:image' belum tersedia karena gambar baru diproses secara tidak sinkron. Untuk memastikan berbagi dari URL baru mencakup sebuah gambar, tentukan dimensi menggunakan tanda 'og:image:width' dan 'og:image:height'."_

### Root Cause Analysis

1. **Missing Dimension Meta Tags**: Facebook Crawler memproses gambar Open Graph secara asinkron (_asynchronous processing_) jika dimensi `og:image:width` dan `og:image:height` tidak dideklarasikan secara eksplisit di `<head>`. Akibatnya, pada share atau scrape pertama kali, Facebook tidak menampilkan pratinjau gambar (gambar dianggap belum tersedia).
2. **Relative URLs Incompatibility**: Spesifikasi Open Graph Protocol (`ogp.me`) mewajibkan `og:image` berupa **URL absolut** (`https://...`). Tautan relatif (`/og.png` atau `/headshot.jpg`) gagal atau ditolak oleh crawler sosial media.
3. **Incomplete Open Graph Attributes**: Tag pendukung seperti `og:image:type` (MIME type `image/png` / `image/jpeg` / `image/webp`), `og:image:alt`, `og:image:secure_url`, dan `og:url` (canonical URL) belum diinjeksi secara standar oleh `createRouteMeta()` di `src/lib/metadata.ts` maupun fallback head di `src/routes/__root.tsx`.
4. **Empty Fallback State**: Saat `ogImageUrl` di Site Settings masih kosong dan halaman tidak memiliki cover spesifik, tidak ada aset gambar default berukuran standar (1200x630) yang di-serve sebagai fallback.

### Objectives

1. Menginjeksi tag dimensi standar Open Graph: `og:image:width` (default `1200`), `og:image:height` (default `630`), `og:image:type`, `og:image:alt`, dan `og:image:secure_url`.
2. Menyediakan fungsi normalisasi URL absolut (`toAbsoluteUrl`) berbasis `VITE_PUBLIC_APP_URL` / `PUBLIC_APP_URL` / fallback domain `https://winterest.tech`.
3. Menambahkan static default Open Graph banner (1200x630) bertema brand Winterest (Cloudflare + Bun) di `public/og-default.png`.
4. Melengkapi `createRouteMeta` dengan `canonicalUrl` (`og:url` dan `<link rel="canonical">`) serta `ogType` (`website` / `article`).

---

## 2. Database & Storage Contract (D1 & R2)

### D1 Schema Impact

- **Tidak ada perubahan tabel D1**. Konfigurasi `ogImageUrl` yang telah ada di tabel `siteSettings` tetap digunakan sebagai Single Source of Truth untuk gambar kustom global.
- Nilai fallback gambar statis ditangani pada layer aplikasi (`public/og-default.png`).

### Storage (R2 & Static Public Assets)

- Gambar statis default Open Graph disediakan di: `public/og-default.png` (resolusi 1200x630 pixel, format PNG teroptimasi).
- Gambar yang diunggah ke R2 melalui Media Library (`/api/media/file/...`) akan dinormalisasi secara otomatis menjadi URL absolut berawalan `https://`.

---

## 3. Server & API Contracts (Zod & ofetch)

RFC ini berfokus pada rendering metadata HTML `<head>` di SSR / Client Hydration TanStack Start. Tidak ada penambahan endpoint API baru.

---

## 4. UI & State Architecture

### 1. Enhanced `CreateRouteMetaOptions` (`src/lib/metadata.ts`)

Menambahkan opsi dimensi, tipe MIME, alt text, dan canonical URL:

```ts
export interface CreateRouteMetaOptions {
  matches?: Array<AnyRouteMatch>
  title?: string | null
  description?: string | null
  ogImage?: string | null
  ogImageWidth?: number
  ogImageHeight?: number
  ogImageType?: string
  ogImageAlt?: string
  canonicalUrl?: string | null
  ogType?: 'website' | 'article' | 'profile'
  isHome?: boolean
  locale?: 'en' | 'id'
}
```

### 2. URL Normalization Helper (`toAbsoluteUrl`)

```ts
export function toAbsoluteUrl(pathOrUrl?: string | null): string {
  if (!pathOrUrl || !pathOrUrl.trim()) return ''
  const trimmed = pathOrUrl.trim()
  if (/^https?:\/\//i.test(trimmed)) return trimmed

  const baseUrl = (
    process.env.VITE_PUBLIC_APP_URL ||
    process.env.PUBLIC_APP_URL ||
    'https://winterest.tech'
  ).replace(/\/+$/, '')

  const cleanPath = trimmed.startsWith('/') ? trimmed : `/${trimmed}`
  return `${baseUrl}${cleanPath}`
}
```

### 3. Generated Meta Tag Checklist in `createRouteMeta`

Ketika gambar teresolusi (baik dari `ogImage`, `siteSettings.ogImageUrl`, atau `DEFAULT_OG_IMAGE_PATH`):

1. `property: 'og:image'` -> URL Absolut (`https://winterest.tech/...`)
2. `property: 'og:image:secure_url'` -> URL Absolut HTTPS
3. `property: 'og:image:width'` -> `'1200'` (string)
4. `property: 'og:image:height'` -> `'630'` (string)
5. `property: 'og:image:type'` -> Inferred dari ekstensi (`image/png`, `image/jpeg`, `image/webp`)
6. `property: 'og:image:alt'` -> Judul halaman atau fallback alt yang deskriptif
7. `property: 'og:type'` -> `ogType ?? 'website'`
8. `property: 'og:url'` -> Canonical URL absolut (jika disediakan atau diinfer dari rute)
9. `name: 'twitter:image'` -> URL Absolut
10. `name: 'twitter:card'` -> `'summary_large_image'`

### 4. Root Fallback in `src/routes/__root.tsx`

Menyelaraskan head deklarasi di `__root.tsx` agar menyertakan `og:image:width`, `og:image:height`, `og:image:secure_url`, dan URL absolut yang konsisten.

---

## 5. Security & RBAC Rules

- **Public Access**: Semua tag Open Graph dan favicon bersifat publik tanpa batasan role.
- **No Secret Leaks**: Base URL yang diekspos ke client hanya menggunakan variable ber-prefix publik (`VITE_PUBLIC_APP_URL` / domain publik terdaftar `winterest.tech`).

---

## 6. Edge Cases & Invariants

1. **Relative Image URLs**: Gambar dari public static assets (misal `/og-default.png`) atau R2 stream endpoints (`/api/media/file/xxx`) harus selalu dikonversi menjadi URL absolut valid sebelum dirender ke meta tag.
2. **Missing `ogImageUrl`**: Jika `ogImageUrl` bernilai string kosong `""`, gunakan default fallback `/og-default.png` yang dinormalisasi menjadi `https://winterest.tech/og-default.png`.
3. **Custom Aspect Ratio**: Jika halaman detail proyek menyertakan cover image dengan rasio berbeda, caller dapat meng-override `ogImageWidth` dan `ogImageHeight`. Default fallback tetap `1200` dan `630`.
4. **MIME Type Inference**: Fungsi inferensi tipe MIME mengekstrak ekstensi file (`.png` -> `image/png`, `.jpg`/`.jpeg` -> `image/jpeg`, `.webp` -> `image/webp`, default `image/png`).

---

## 7. Acceptance Criteria & Verification Checklist

- [ ] File `public/og-default.png` dibuat dengan rasio standar 1200x630 dan estetika brand Cloudflare + Bun.
- [ ] `toAbsoluteUrl()` helper diuji menangani URL relatif, URL absolut, protocol https, dan domain fallback.
- [ ] `createRouteMeta()` menginjeksi `og:image:width: 1200`, `og:image:height: 630`, `og:image:secure_url`, `og:image:type`, `og:image:alt`, serta `og:type` dan `og:url`.
- [ ] Unit tests di `src/lib/__tests__/metadata.test.ts` diperbarui dan seluruhnya lulus (`bun test src/lib/__tests__/metadata.test.ts`).
- [ ] Typecheck lulus tanpa error (`bun run check`).
- [ ] Linter & formatter bersih (`bun run lint`, `bun run format`).
- [ ] Production build berhasil (`bun run build`).
- [ ] Knowledge graph diperbarui (`graphify update .`).
