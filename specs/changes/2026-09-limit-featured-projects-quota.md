# RFC: Enforce Strict Limit of 4 Featured Projects Across System

- **Feature ID**: `feat-limit-featured-projects-quota`
- **Date**: 2026-09-11
- **Status**: `Draft`
- **Target Routes**:
  - `/dashboard/projects`
  - `/dashboard/projects/new`
  - `/dashboard/projects/$id`
  - `/api/projects`
  - `/api/projects/$id`
  - `/` (Homepage — `FeaturedProjectsSection`)
- **Target Modules**:
  - `src/features/projects/queries.ts`
  - `src/features/projects/components/form/project-editor-form.tsx`
  - `src/features/projects/components/table/dashboard-projects-table.tsx`
  - `src/features/projects/copy.ts`

---

## 1. Overview & Problem Statement

Halaman utama (Homepage) portofolio dirancang untuk menampilkan maksimal **4 Featured Projects** pada seksi unggulan (`FeaturedProjectsSection`). Namun saat ini di dasbor CMS, editor dapat menandai status `featured: true` pada proyek dalam jumlah tak terbatas.

### Root Cause & User Confusion

1. **Unbounded Dashboard Flagging**: Tidak ada validasi di backend maupun frontend yang membatasi jumlah proyek dengan status `featured = true`.
2. **Silent Homepage Truncation**: Komponen `FeaturedProjectsSection` hanya mengambil 4 item pertama (`featuredOnly.slice(0, 4)`). Akibatnya, proyek ke-5, ke-6, dan seterusnya yang ditandai sebagai _featured_ tidak pernah muncul di homepage, membingungkan pengguna yang merasa pengaturannya tidak bekerja.
3. **No Visual Quota Indication**: Editor tidak memiliki visibilitas mengenai berapa banyak slot unggulan yang telah terpakai dari kapasitas maksimal 4 slot.

### Objectives

1. **Strict Server-Side Enforcement (Limit 4)**: Menolak mutasi pembuatan (`POST /api/projects`) atau pembaruan (`PUT /api/projects/:id`) dengan HTTP 400 Bad Request jika proyek hendak ditandai `featured = true` sementara kuota 4 proyek unggulan telah penuh.
2. **Proactive Form UI Guard**: Pada formulir editor proyek (`project-editor-form.tsx`), jika kuota 4/4 telah tercapai dan proyek yang sedang diedit belum berstatus _featured_, nonaktifkan checkbox toggle (`disabled={true}`) disertai badge status kuota (`4/4 Penuh`) dan panduan cara mengosongkan slot.
3. **Table Quota Badge**: Menampilkan indikator kuota terpakai (misal `Unggulan (3/4)` atau `Unggulan (4/4 Penuh)`) pada filter tab dan header tabel proyek dasbor.
4. **Bilingual Copywriting**: Menyediakan pesan kesalahan validasi dan teks panduan kuota dalam bahasa Inggris dan Indonesia di `src/features/projects/copy.ts`.

---

## 2. Database & Storage Contract (D1 & R2)

Perubahan ini memanfaatkan kolom boolean `featured` yang sudah ada pada tabel `projects`. **Tidak ada perubahan skema D1 maupun migrasi tabel baru**.

### Helper SQL Query (Featured Count)

```sql
-- Pengecekan saat membuat proyek baru
SELECT COUNT(*) as total FROM projects WHERE featured = 1;

-- Pengecekan saat mengupdate proyek yang ada (kecualikan ID sendiri)
SELECT COUNT(*) as total FROM projects WHERE featured = 1 AND id != ?;
```

---

## 3. Server & API Contracts (Zod & ofetch)

### 1. Endpoint Validations

| Endpoint            | Method | Role    | Payload Constraint | Error Response (Jika Kuota Penuh)                                                              |
| :------------------ | :----- | :------ | :----------------- | :--------------------------------------------------------------------------------------------- |
| `/api/projects`     | `POST` | Editor+ | `featured: true`   | `HTTP 400` — "Maximum of 4 featured projects allowed. Please unfeature another project first." |
| `/api/projects/:id` | `PUT`  | Editor+ | `featured: true`   | `HTTP 400` — "Maximum of 4 featured projects allowed. Please unfeature another project first." |

### 2. Error Shape

```json
{
  "success": false,
  "error": "Maximum of 4 featured projects allowed. Please unfeature another project first."
}
```

---

## 4. UI & State Architecture

### 1. Server Query Logic (`src/features/projects/queries.ts`)

Menambahkan helper fungsi penghitungan dan validasi batas sebelum operasi insert/update dijalankan:

```ts
export const MAX_FEATURED_PROJECTS = 4

export async function countFeaturedProjects(
  db: Database,
  excludeProjectId?: string,
): Promise<number> {
  const query = excludeProjectId
    ? db
        .select({ count: count() })
        .from(projects)
        .where(
          and(eq(projects.featured, true), ne(projects.id, excludeProjectId)),
        )
    : db
        .select({ count: count() })
        .from(projects)
        .where(eq(projects.featured, true))

  const result = await query.get()
  return result?.count ?? 0
}
```

Di dalam `createProject`:

```ts
if (input.featured) {
  const currentCount = await countFeaturedProjects(db)
  if (currentCount >= MAX_FEATURED_PROJECTS) {
    throw new Error(
      'Maximum of 4 featured projects allowed. Please unfeature another project first.',
    )
  }
}
```

Di dalam `updateProject`:

```ts
if (input.featured && !existing.featured) {
  const currentCount = await countFeaturedProjects(db, existing.id)
  if (currentCount >= MAX_FEATURED_PROJECTS) {
    throw new Error(
      'Maximum of 4 featured projects allowed. Please unfeature another project first.',
    )
  }
}
```

### 2. Project Editor Form (`src/features/projects/components/form/project-editor-form.tsx`)

- Komponen membaca total proyek featured dari daftar proyek yang di-cache di TanStack Query (`projectQueryOptions.list()`).
- Hitung:
  ```ts
  const featuredCount = projectsList.filter(
    (p) => p.featured && p.id !== currentProjectId,
  ).length
  const isQuotaFull = featuredCount >= 4
  const canFeature = field.state.value || !isQuotaFull
  ```
- Jika `isQuotaFull` dan proyek belum featured:
  - Checkbox diberi atribut `disabled={true}`.
  - Tampilkan badge peringatan berlatar oranye/kuning lembut: _"Batas 4 proyek unggulan tercapai (4/4). Nonaktifkan status unggulan pada proyek lain untuk mengaktifkannya di sini."_

### 3. Dashboard Projects Table (`src/features/projects/components/table/dashboard-projects-table.tsx`)

- Pada tab status / filter pill, label "Featured" diperkaya dengan counter dinamis:
  - Misal: `Unggulan (3/4)` dengan badge netral.
  - Misal: `Unggulan (4/4 Penuh)` dengan badge aksen oranye penanda kuota terisi penuh.

---

## 5. Security & RBAC Rules

1. **Authorized Mutators Only**: Hanya user dengan role `editor`, `admin`, atau `owner` yang dapat melakukan mutasi data proyek.
2. **Server-Side Integrity**: Pengecekan kuota wajib dieksekusi di server D1 isolate, bukan hanya mengandalkan proteksi client-side form.

---

## 6. Edge Cases & Invariants

1. **Unfeaturing Always Allowed**: Menonaktifkan proyek (`featured: false`) selalu diizinkan kapan saja tanpa batasan kuota karena mengurangi penggunaan slot.
2. **Editing Existing Featured Project**: Mengedit detail lain (seperti judul, deskripsi, tautan) dari proyek yang _sudah_ berstatus featured tidak akan terblokir oleh validasi kuota (karena `id != existing.id` mengabaikan proyek itu sendiri).
3. **Concurrent Mutation**: Jika dua admin mencoba menandai proyek featured ke-4 secara bersamaan, database query transactional menjamin hanya 1 request yang berhasil dan request kedua ditolak dengan HTTP 400.

---

## 7. Acceptance Criteria & Verification Checklist

- [ ] Backend API (`POST /api/projects` & `PUT /api/projects/:id`) mengembalikan HTTP 400 jika mencoba mengaktifkan `featured = true` saat kuota 4/4 penuh.
- [ ] Formulir `project-editor-form.tsx` men-disable checkbox `featured` ketika kuota 4/4 telah terisi oleh proyek lain.
- [ ] Pesan informatif dan badge kuota `(X/4)` tampil di form editor proyek dan filter tabel dasbor.
- [ ] Proyek yang sudah featured tetap bisa disimpan saat mengedit atribut lainnya tanpa terkena error kuota.
- [ ] Menghilangkan status featured dari proyek berhasil membebaskan slot kuota kembali menjadi `< 4`.
- [ ] Unit tests di `src/features/projects/__tests__/` ditambahkan untuk memvalidasi batasan kuota 4.
- [ ] Typecheck lulus tanpa error (`bun run check`).
- [ ] Linter & formatter bersih (`bun run lint`, `bun run format`).
- [ ] Production build berhasil (`bun run build`).
- [ ] Knowledge graph diperbarui (`graphify update .`).
