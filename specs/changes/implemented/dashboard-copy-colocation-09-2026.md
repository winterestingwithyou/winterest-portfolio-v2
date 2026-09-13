# RFC: Refactor Monolithic Dashboard Copywriting via Feature Colocation

- **Feature ID**: `arch-dashboard-copy-colocation`
- **Date**: 2026-09-11
- **Status**: `Implemented`
- **Target Routes**:
  - All Dashboard Routes (`/dashboard/*`)
- **Target Modules**:
  - `src/features/dashboard/copy.ts` (Trimmed down to shell, overview, common)
  - `src/features/projects/copy.ts` (Colocated dashboard projects copy)
  - `src/features/technologies/copy.ts` (Colocated dashboard stack & category copy)
  - `src/features/media/copy.ts` (NEW: Colocated media library & uploader copy)
  - `src/features/settings/copy.ts` (NEW: Colocated site settings copy)
  - `src/features/account/copy.ts` (NEW: Colocated profile & password copy)
  - `src/features/users/copy.ts` (NEW: Colocated user management copy)
  - `src/features/social/copy.ts` (NEW: Colocated social links management copy)
  - `.agents/rules/09-copywriting-data-standards.md` (Codify dashboard copy colocation contract)
  - `.agents/rules/01-identity-branding-copy.md` (Update copy colocation rule)

---

## 1. Overview & Problem Statement

Saat ini, berkas `src/features/dashboard/copy.ts` berukuran lebih dari **1.400 baris** (_monolithic copy file_). Berkas raksasa ini menampung seluruh teks antarmuka dari berbagai modul domain yang sebenarnya independen (Projects, Tech Stack, Media, Social, Users, Site Settings, dan Account).

### Root Cause & Violations

1. **Violation of Rule 1 & Rule 9**: Aturan repositori secara tegas menyatakan: _"Every feature stores its localized copywriting (en and id) in `src/features/<feature>/copy.ts`"_ dan _"Avoid monolithic data files storing copy for unrelated pages"_. Terjadinya file 1.400 baris ini melanggar prinsip anti-monolit.
2. **Poor Maintainability & Developer Friction**: Setiap penambahan label input atau perubahan teks pada fitur spesifik (misal Settings atau Users) memaksa pengembang menyunting berkas dashboard sentral yang sangat panjang, memicu potensi konflik git merge.
3. **Incomplete Feature Autonomy**: Sebagian domain feature (`settings`, `account`, `users`, `media`, `social`) bahkan belum memiliki berkas `copy.ts` di dalam direktori modulnya sendiri.

### Objectives

1. **Deconstruct Monolithic Copy**: Memecah `src/features/dashboard/copy.ts` dari ~1.400 baris menjadi berkas ramping berukuran **~150 baris**, khusus hanya melayani:
   - `shell`: Sidebar navigasi, header, breadcrumbs, dan logout.
   - `overview`: Metrik analitik, grafik, dan ringkasan aktivitas halaman overview dashboard.
   - `common`: Primitif aksi bersama (dialog unsaved changes, status badge, tombol simpan/batal, filter).
2. **Colocate to Domain Features**:
   - Memindahkan teks dashboard projects ke `src/features/projects/copy.ts` di bawah namespace `dashboard`.
   - Memindahkan teks dashboard stack ke `src/features/technologies/copy.ts` di bawah namespace `dashboard`.
   - Membuat `copy.ts` mandiri untuk fitur: `settings/copy.ts`, `account/copy.ts`, `users/copy.ts`, `media/copy.ts`, dan `social/copy.ts`.
3. **Update Living Rules**: Memperbarui aturan di `.agents/rules/09-copywriting-data-standards.md` dan `.agents/rules/01-identity-branding-copy.md` agar secara eksplisit mendokumentasikan batas kepemilikan teks dashboard vs teks fitur domain.

---

## 2. Database & Storage Contract (D1 & R2)

Perubahan ini murni arsitektural di layer kode TypeScript (i18n / UI copy). **Tidak ada perubahan pada skema database D1 maupun penyimpanan R2**.

---

## 3. Server & API Contracts (Zod & ofetch)

Tidak ada perubahan maupun penambahan endpoint server API.

---

## 4. UI & State Architecture

### 1. Target Copy Structure Across Modules

| Berkas Tujuan                         | Cakupan Konten Copywriting                                                                     | Helper Fungsi           |
| :------------------------------------ | :--------------------------------------------------------------------------------------------- | :---------------------- |
| `src/features/dashboard/copy.ts`      | `shell` (nav, breadcrumb), `overview` (metrics, charts), `common` (dialogs, filter, status)    | `getDashboardCopy()`    |
| `src/features/projects/copy.ts`       | Publik (`meta`, `list`, `detail`) + Dashboard (`dashboard`: table, forms, delete dialog)       | `getProjectsCopy()`     |
| `src/features/technologies/copy.ts`   | Publik (`meta`, `page`, `ultimate`) + Dashboard (`dashboard`: tech & category tables, dialogs) | `getTechnologiesCopy()` |
| `src/features/settings/copy.ts` (NEW) | Site settings tabs, general, SEO, visual, CV management, maintenance mode                      | `getSettingsCopy()`     |
| `src/features/account/copy.ts` (NEW)  | Account profile details, password change form, security badges                                 | `getAccountCopy()`      |
| `src/features/users/copy.ts` (NEW)    | User list table, roles (owner/admin/editor), invite/edit form, metrics                         | `getUsersCopy()`        |
| `src/features/media/copy.ts` (NEW)    | Media library table/gallery, uploader, picker modal, delete confirmation                       | `getMediaCopy()`        |
| `src/features/social/copy.ts` (NEW)   | Social links table, editor dialog, platform metadata copy                                      | `getSocialCopy()`       |

---

### 2. Dual-Scope Pattern for Hybrid Features (`projects` & `technologies`)

Untuk fitur yang melayani halaman publik sekaligus dasbor, strukturnya diorganisir rapi di bawah namespace `dashboard`:

```ts
// src/features/projects/copy.ts
export const projectsCopy = {
  en: {
    meta: { ... },
    list: { ... },
    detail: { ... },
    dashboard: {
      title: 'Projects',
      new: 'New project',
      table: { ... },
      form: { ... },
      delete: { ... },
    },
  },
  id: {
    meta: { ... },
    list: { ... },
    detail: { ... },
    dashboard: {
      title: 'Proyek',
      new: 'Proyek baru',
      table: { ... },
      form: { ... },
      delete: { ... },
    },
  },
} as const

export function getProjectsCopy() {
  const locale = getLocale() === 'id' ? 'id' : 'en'
  return projectsCopy[locale]
}
```

Komponen dashboard projects mengaksesnya secara intuitif:

```tsx
const copy = getProjectsCopy().dashboard
```

---

### 3. Pure Dashboard Feature Pattern (`settings`, `account`, `users`, `media`, `social`)

Untuk fitur yang murni berada di dashboard:

```ts
// src/features/settings/copy.ts
export const settingsCopy = {
  en: {
    title: 'Site Settings',
    description: 'Manage global identity...',
    tabs: { ... },
    form: { ... },
  },
  id: {
    title: 'Pengaturan Situs',
    description: 'Kelola identitas global...',
    tabs: { ... },
    form: { ... },
  },
} as const

export function getSettingsCopy() {
  const locale = getLocale() === 'id' ? 'id' : 'en'
  return settingsCopy[locale]
}
```

---

### 4. Codifying Project Rules (`.agents/rules/09-copywriting-data-standards.md`)

Menambahkan pasal eksplisit mengenai pemisahan copy dasbor:

> **Dashboard Copywriting Scope**:
>
> - `src/features/dashboard/copy.ts` hanya diperuntukkan bagi kerangka shell dashboard (`nav`, `breadcrumbs`, `logout`), halaman `overview`, dan primitif `common` bersama.
> - Seluruh teks fitur spesifik (Projects, Stack, Media, Social, Settings, Users, Account) **WAJIB** berada di dalam `copy.ts` fitur terkait masing-masing.

---

## 5. Security & RBAC Rules

Perubahan ini murni berupa refaktor teks statis dan tidak mengubah logika validasi otorisasi peran (_owner_, _admin_, _editor_) pada level backend maupun client routing.

---

## 6. Edge Cases & Invariants

1. **Zero Runtime Regressions**: Refaktor harus sepenuhnya type-safe. Pengecekan TypeScript (`bun run check`) wajib memvalidasi bahwa tidak ada komponen dashboard yang kehilangan referensi string copy.
2. **Paraglide Locale Compatibility**: Seluruh fungsi `get<Feature>Copy()` tetap menggunakan runtime `getLocale()` dari Paraglide sehingga pergantian bahasa Inggris/Indonesia berlangsung reaktif dan mulus.
3. **No Stale Re-exports**: Hindari pola re-export bundel raksasa di `dashboard/copy.ts` untuk mencegah kembalinya dependency graph melingkar (_circular dependency_).

---

## 7. Acceptance Criteria & Verification Checklist

- [x] `src/features/dashboard/copy.ts` berhasil dipangkas hingga hanya memuat `shell`, `overview`, dan `common` (~150 baris).
- [x] Teks dashboard dipindahkan ke fitur domain masing-masing:
  - `src/features/projects/copy.ts`
  - `src/features/technologies/copy.ts`
  - `src/features/settings/copy.ts`
  - `src/features/account/copy.ts`
  - `src/features/users/copy.ts`
  - `src/features/media/copy.ts`
  - `src/features/social/copy.ts`
- [x] Seluruh komponen dashboard terkait berhasil diperbarui impor copy-nya ke modul fiturnya sendiri.
- [x] Aturan proyek di `.agents/rules/09-copywriting-data-standards.md` dan `.agents/rules/01-identity-branding-copy.md` diperbarui.
- [x] Typecheck lulus 100% tanpa error (`bun run check`).
- [x] Seluruh pengujian unit berjalan sukses (`bun run test`).
- [x] Linter & formatter bersih (`bun run lint`, `bun run format`).
- [x] Production build berhasil (`bun run build`).
- [x] Knowledge graph diperbarui (`graphify update .`).
