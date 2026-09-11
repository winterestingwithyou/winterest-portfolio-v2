# RFC: Display Configurable Public Email Card on Contact Page

- **Feature ID**: `feat-contact-public-email-card`
- **Date**: 2026-09-11
- **Status**: `Draft`
- **Target Routes**:
  - `/contact` (`src/routes/contact.tsx`)
- **Target Modules**:
  - `src/features/contact/components/section/contact-channels.tsx`
  - `src/features/contact/pages/contact-page.tsx`
  - `src/features/contact/copy.ts`
  - `src/routes/contact.tsx`

---

## 1. Overview & Problem Statement

Saat ini, alamat email kontak pengelola situs (`publicEmail`) hanya ditampilkan di footer bawah, yang sering terlewat oleh pengunjung dan rekruter. Meskipun pada dashboard _Site Settings_ tersedia field `publicEmail`, nilai email tersebut belum dimunculkan di halaman utama `/contact`.

### Background & Needs

1. **Direct Communication Channel**: Pengunjung yang ingin menghubungi langsung via aplikasi email klien (seperti Gmail, Apple Mail, Outlook) membutuhkan akses cepat ke alamat email tanpa harus mengisi formulir pesan panjang.
2. **Prominent & Dedicated Presentation**: Email harus ditampilkan sebagai kartu khusus (_Dedicated Email Card_) yang menonjol dan elegan di kolom `ContactChannels` sebelum daftar tautan media sosial.
3. **Interactive Actions**: Menyediakan tombol sekali klik untuk membuka email client (`mailto:`) dan tombol salin ke clipboard (_copy to clipboard_) dengan umpan balik visual langsung (_inline feedback_).
4. **Strict No-Fallback Policy**: Jika `publicEmail` di _Site Settings_ belum diisi (bernilai string kosong atau null), kartu email **TIDAK BOLEH** ditampilkan sama sekali (silent omission tanpa fallback statis dan tanpa placeholder).

---

## 2. Database & Storage Contract (D1 & R2)

Perubahan ini memanfaatkan data yang telah ada pada skema database D1. **Tidak ada migrasi skema D1 maupun penambahan tabel/kolom baru**.

- Nilai email diambil dari tabel `siteSettings` dengan key: `'publicEmail'`.

---

## 3. Server & API Contracts (Zod & ofetch)

Data pengaturan situs dimuat menggunakan kontrak TanStack Query yang sudah tersedia:

- `settingsQueryOptions.get()` dari `#/features/settings/query-options`.
- Endpoint yang melayani: `GET /api/settings`.

---

## 4. UI & State Architecture

### 1. Route Loader Prefetching (`src/routes/contact.tsx`)

Sesuai aturan Rule 4 (_Mandatory TanStack Query & `queryOptions` Standard_), route gateway melakukan `ensureQueryData` di dalam loader:

```tsx
export const Route = createFileRoute('/contact')({
  loader: ({ context: { queryClient } }) =>
    Promise.all([
      queryClient.ensureQueryData(settingsQueryOptions.get()),
      queryClient.ensureQueryData(socialQueryOptions.publicList()),
    ]),
  // ...
})
```

### 2. Dedicated Email Card in `ContactChannels` (`src/features/contact/components/section/contact-channels.tsx`)

Komponen menerima atau mengambil data pengaturan via TanStack Query:

```tsx
const { data: settings } = useQuery(settingsQueryOptions.get())
const publicEmail = settings?.publicEmail?.trim()
```

#### Aturan Kondisional Render:

```tsx
// STRICT: Jika publicEmail kosong, jangan render kartu email sama sekali
if (!publicEmail) {
  return null
}
```

#### Struktur & Visual Card:

- **Card Container**: `surface-card w-full min-w-0 p-4 sm:p-6 md:p-7 border border-(--brand-line)` dengan hover subtle border orange.
- **Header Badge**: Ikon `Mail` di dalam wadah aksen Cloudflare orange soft (`bg-(--brand-orange-soft) text-(--brand-orange-deep)`).
- **Email Typography**: Alamat email ditampilkan dengan jelas menggunakan font mono/sans tebal yang mudah dibaca (`text-sm sm:text-base font-bold text-(--brand-ink)`).
- **Interactive Action Buttons**:
  1. **Tombol "Kirim Email" (`sendEmail`)**:
     - `href={`mailto:${publicEmail}`}`
     - Ikon `ExternalLink` atau `Mail`
  2. **Tombol "Salin Email" (`copyEmail`)**:
     - Memanfaatkan `navigator.clipboard.writeText(publicEmail)`
     - State `copied`: saat diklik, ikon berganti menjadi `Check` dan teks menjadi `'Tersalin!'` / `'Copied!'` selama 2000ms sebelum kembali ke normal.

### 3. Copywriting Additions (`src/features/contact/copy.ts`)

Menambahkan token pendukung pada object `contactCopy.direct`:

- **English (`en.direct`)**:
  - `emailTitle`: `'Email Address'`
  - `emailSubtitle`: `'Official direct correspondence.'`
  - _(Telah ada)_ `copyEmail`: `'Copy email'`
  - _(Telah ada)_ `copiedEmail`: `'Copied!'`
  - _(Telah ada)_ `sendEmail`: `'Send email'`

- **Indonesian (`id.direct`)**:
  - `emailTitle`: `'Alamat Email'`
  - `emailSubtitle`: `'Komunikasi resmi & korespondensi langsung.'`
  - _(Telah ada)_ `copyEmail`: `'Salin email'`
  - _(Telah ada)_ `copiedEmail`: `'Tersalin!'`
  - _(Telah ada)_ `sendEmail`: `'Kirim email'`

---

## 5. Security & RBAC Rules

1. **Public Availability**: Data `publicEmail` yang telah dikonfigurasi di dashboard bersifat publik untuk tujuan korespondensi.
2. **Clipboard Security**: Penanganan salin clipboard menggunakan API standar Web `navigator.clipboard` dengan pengecekan ketersediaan API (_graceful fallback_) untuk mencegah crash di lingkungan non-secure / iframe.

---

## 6. Edge Cases & Invariants

1. **Empty Email Invariant**: Jika `publicEmail` adalah `""`, `null`, atau hanya spasi, kartu email **TIDAK DI-RENDER**. Tidak ada teks "Belum diatur", tidak ada placeholder, dan tidak ada fallback ke email dummy.
2. **Overflow on Long Emails**: Alamat email yang sangat panjang di-handle dengan `break-all` atau `truncate` pada mobile agar tidak memecahkan batas card container.
3. **Clipboard Feedback Timeout**: Timeout reset `copied` di-clear saat unmount untuk mencegah memory leak atau update state pada komponen yang sudah tidak aktif.

---

## 7. Acceptance Criteria & Verification Checklist

- [ ] Route loader di `src/routes/contact.tsx` melakukan prefetch `settingsQueryOptions.get()`.
- [ ] Komponen Dedicated Email Card tampil di `ContactChannels` ketika `publicEmail` memiliki nilai valid.
- [ ] Tombol "Kirim Email" membuka link `mailto:` dengan alamat email yang sesuai.
- [ ] Tombol "Salin Email" berhasil menyalin alamat email ke clipboard dan menampilkan umpan balik visual "Tersalin!" / "Copied!" selama 2 detik.
- [ ] **Strict Invariant**: Ketika `publicEmail` kosong di Site Settings, tidak ada elemen kartu email yang muncul di halaman kontak.
- [ ] Copywriting bilingual di `src/features/contact/copy.ts` terisi lengkap dan akurat.
- [ ] Typecheck lulus tanpa error (`bun run check`).
- [ ] Linter & formatter bersih (`bun run lint`, `bun run format`).
- [ ] Production build berhasil (`bun run build`).
- [ ] Knowledge graph diperbarui (`graphify update .`).
