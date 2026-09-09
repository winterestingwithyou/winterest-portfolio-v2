# RFC: Media Deletion Synchronization & Anti-Orphan Architecture

- **Feature ID**: `fix-media-deletion-sync`
- **Status**: `Draft`
- **Authors**: Winterest | M. Adam Yudistira
- **Date**: 2026-09-09
- **Target Routes**:
  - `/api/media/$id`
  - `/dashboard/media`
- **Target Modules**:
  - `src/features/media/`
  - `src/features/settings/`
  - `src/features/projects/`
  - `src/features/technologies/`
  - `src/db/`

---

## 1. Overview & Problem Statement

Pada arsitektur sistem saat ini, aset media yang diunggah ke Cloudflare R2 dicatat di tabel Cloudflare D1 `media`. Namun, berbagai entitas dalam sistem (seperti `site_settings`, `projects`, dan `technologies`) menyimpan tautan ke media tersebut sebagai **string teks URL biasa** (misalnya `https://example.com/api/media/file/projects/abc.png` atau path relatif `/api/media/file/projects/abc.png`), tanpa adanya batasan Foreign Key (FK) relasional.

Ketika seorang pengguna menghapus aset melalui dashboard media (`/dashboard/media`), endpoint `DELETE /api/media/$id` di `src/routes/api/media/$id.ts` langsung menghapus objek fisik dari Cloudflare R2 dan menghapus baris terkait di tabel `media`. **Tidak ada proses sinkronisasi, validasi dependensi, ataupun pembersihan referensi** pada entitas yang menggunakan aset tersebut.

### Temuan Investigasi & Verifikasi Masalah

1. **`site_settings` (Terkonfirmasi Kritis)**:
   - Kolom: `faviconUrl`, `ogImageUrl`, `heroVisualUrl`, `cvEnUrl`, `cvIdUrl`.
   - Dampak: Favicon browser menjadi 404, metadata Open Graph di media sosial (WhatsApp, X, LinkedIn, Discord) menampilkan broken image preview, banner visual beranda tidak muncul, dan tombol unduh CV mengarah ke tautan mati.
2. **`projects.coverImage` (Terkonfirmasi Kritis)**:
   - Kolom: `cover_image` pada tabel `projects`.
   - Form proyek (`project-editor-form.tsx`) menggunakan `ImageUploader` dari pustaka media.
   - Dampak: Kartu proyek pada halaman publik `/projects`, beranda `/`, dan banner hero pada halaman detail `/projects/$slug` memuat gambar rusak (broken image).
3. **`technologies.icon` (Terkonfirmasi Sedang)**:
   - Kolom: `icon` pada tabel `technologies` dapat memuat URL kustom aset R2.
   - Dampak: Jika media dihapus, rendering ikon teknologi gagal dimuat dan terpaksa menggunakan icon fallback `Code2`.
4. **`project_translations.description` (Terkonfirmasi Sedang)**:
   - Konten body teks Markdown dapat menyematkan gambar menggunakan sintaks `![alt](url-media)`.
   - Dampak: Rendering Markdown pada detail proyek menampilkan icon gambar rusak.

### Tujuan Arsitektural (Objectives)

Menerapkan **Opsi 1: Strict Guard + Cascade Nullify Policy**:

1. **Pre-Deletion Usage Detection**: Menyediakan endpoint dan query helper untuk mendeteksi secara presisi di mana saja URL media sedang digunakan secara aktif.
2. **Strict Guard (409 Conflict)**: Mencegah penghapusan tidak disengaja dengan menolak request `DELETE` tanpa parameter `cascade=true` jika media sedang memiliki referensi aktif.
3. **Transparent UI Warning**: Menampilkan daftar entitas dan field yang menggunakan media di dalam `MediaDeleteDialog`, memberikan kejelasan dampak kepada admin/editor sebelum menghapus.
4. **Atomic Cascade Nullify**: Saat penghapusan dikonfirmasi dengan `cascade=true`, server secara atomik mengosongkan nilai referensi (`site_settings` menjadi `''`, `projects.coverImage` menjadi `NULL`, `technologies.icon` menjadi `NULL`) sebelum menghapus file dari Cloudflare R2 dan tabel `media`.
5. **Cross-Feature Cache Invalidation**: Menginvalidasi cache TanStack Query untuk media, settings, dan proyek secara bersamaan agar UI langsung tersinkronisasi tanpa perlu refresh manual.

---

## 2. Database & Storage Contract (Cloudflare D1 & R2)

### Karakteristik Skema D1 Saat Ini

Tabel `media` terisolasi dan tidak memiliki direct foreign key dari `site_settings` (key-value EAV) maupun `projects`:

```sql
-- D1 Table: media
CREATE TABLE media (
  id TEXT PRIMARY KEY,
  filename TEXT NOT NULL,
  url TEXT NOT NULL,
  mime_type TEXT NOT NULL,
  size INTEGER NOT NULL DEFAULT 0,
  width INTEGER,
  height INTEGER,
  alt TEXT,
  created_at INTEGER NOT NULL DEFAULT (unixepoch()),
  updated_at INTEGER NOT NULL DEFAULT (unixepoch())
);
```

### Algoritma Pencocokan URL Portabel (Portable URL Matching)

Media URL dapat tersimpan dalam format absolut domain lokal (`http://localhost:3000/api/media/file/...`), absolut domain produksi (`https://winterest.dev/api/media/file/...`), maupun path relatif (`/api/media/file/...`).

Kunci invarian unik media di R2 selalu memiliki pola:
`/api/media/file/${key}`

Pencarian dependensi dan pembersihan dilakukan dengan mencocokkan:

1. Kesamaan URL persis: `field = ?` (dengan nilai `media.url`)
2. Kesamaan akhiran path R2: `field LIKE '%/api/media/file/' || ?` (dengan nilai `key`)

### Transaksi Cascade Nullify di D1

Operasi nullify dan penghapusan record media harus dieksekusi secara terkoordinasi:

```sql
-- 1. Kosongkan nilai di site_settings jika nilainya merujuk ke media ini
UPDATE site_settings
SET value = '', updated_at = unixepoch()
WHERE key IN ('faviconUrl', 'ogImageUrl', 'heroVisualUrl', 'cvEnUrl', 'cvIdUrl')
  AND (value = ? OR value LIKE '%/api/media/file/' || ?);

-- 2. Nullify cover_image pada projects
UPDATE projects
SET cover_image = NULL, updated_at = unixepoch()
WHERE cover_image = ? OR cover_image LIKE '%/api/media/file/' || ?;

-- 3. Nullify icon pada technologies (jika menggunakan custom URL media)
UPDATE technologies
SET icon = NULL, updated_at = unixepoch()
WHERE icon = ? OR icon LIKE '%/api/media/file/' || ?;

-- 4. Hapus record dari tabel media
DELETE FROM media WHERE id = ?;
```

### Cloudflare R2 Storage Contract

- **Bucket**: `MEDIA_BUCKET`
- **Urutan Operasi**:
  1. Bersihkan referensi di D1 (`site_settings`, `projects`, dll.).
  2. Hapus objek fisik di Cloudflare R2: `await env.MEDIA_BUCKET.delete(key)`.
  3. Hapus baris dari tabel `media`.
     _Catatan: Jika penghapusan R2 gagal setelah D1 dinullify, data di web tetap aman dari broken link. Error R2 di-log untuk monitoring._

---

## 3. Server & API Contracts (Zod & ofetch)

### Ringkasan Endpoint

| Endpoint         | Method   | Role      | Purpose                                                        |
| :--------------- | :------- | :-------- | :------------------------------------------------------------- |
| `/api/media/$id` | `GET`    | `editor+` | Mengambil detail media beserta ringkasan penggunaan (`usage`). |
| `/api/media/$id` | `DELETE` | `editor+` | Menghapus media dengan validasi `cascade` guard.               |

---

### 1. Endpoint: `GET /api/media/$id`

Mengembalikan record media beserta informasi tempat di mana media sedang digunakan.

#### Response Contract: `200 OK`

```json
{
  "data": {
    "id": "med_abc123",
    "filename": "hero-illustration.webp",
    "url": "https://winterest.dev/api/media/file/projects/hero-illustration.webp",
    "mimeType": "image/webp",
    "size": 245100,
    "width": 1920,
    "height": 1080,
    "alt": "Hero Visual",
    "createdAt": "2026-09-01T10:00:00.000Z",
    "updatedAt": "2026-09-01T10:00:00.000Z",
    "usage": {
      "inUse": true,
      "totalReferences": 2,
      "references": [
        {
          "entityType": "site_settings",
          "field": "heroVisualUrl",
          "id": "heroVisualUrl",
          "label": "Site Settings (Hero Visual)",
          "details": "Digunakan sebagai visual utama beranda"
        },
        {
          "entityType": "project",
          "field": "coverImage",
          "id": "proj_xyz789",
          "label": "Project: Winterest Platform",
          "details": "Cover Image proyek"
        }
      ]
    }
  }
}
```

#### TypeScript Types & Zod Schema (`src/features/media/validation.ts`)

```ts
export const mediaReferenceTypeSchema = z.enum([
  'site_settings',
  'project_cover',
  'project_content',
  'technology_icon',
])

export const mediaReferenceItemSchema = z.object({
  entityType: mediaReferenceTypeSchema,
  field: z.string(),
  id: z.string(),
  label: z.string(),
  details: z.string().optional(),
})

export const mediaUsageSummarySchema = z.object({
  inUse: z.boolean(),
  totalReferences: z.number().int().min(0),
  references: z.array(mediaReferenceItemSchema),
})

export type MediaReferenceItem = z.infer<typeof mediaReferenceItemSchema>
export type MediaUsageSummary = z.infer<typeof mediaUsageSummarySchema>
```

---

### 2. Endpoint: `DELETE /api/media/$id`

#### Query Parameters Schema (`mediaDeleteQuerySchema`)

```ts
export const mediaDeleteQuerySchema = z.object({
  cascade: z
    .enum(['true', 'false'])
    .optional()
    .transform((val) => val === 'true'),
})
```

#### Kasus A: Media Sedang Dipakai & `cascade=false` (Default Safe Guard)

- **HTTP Status**: `409 Conflict`
- **Response Body**:

```json
{
  "error": "Media is currently in use. Deleting it without cascade will create broken links.",
  "code": "MEDIA_IN_USE",
  "usage": {
    "inUse": true,
    "totalReferences": 1,
    "references": [
      {
        "entityType": "site_settings",
        "field": "heroVisualUrl",
        "id": "heroVisualUrl",
        "label": "Site Settings (Hero Visual)"
      }
    ]
  }
}
```

#### Kasus B: `cascade=true` ATAU Media Tidak Sedang Digunakan

- **HTTP Status**: `200 OK`
- **Response Body**:

```json
{
  "success": true,
  "clearedReferences": 2
}
```

---

## 4. UI & State Architecture

### 1. Query Options & Mutation Hooks

#### Query Options (`src/features/media/query-options.ts`)

```ts
export const mediaQueryKeys = {
  all: ['media'] as const,
  lists: () => [...mediaQueryKeys.all, 'list'] as const,
  list: (params?: Record<string, unknown>) =>
    [...mediaQueryKeys.lists(), params] as const,
  details: () => [...mediaQueryKeys.all, 'detail'] as const,
  detail: (id: string) => [...mediaQueryKeys.details(), id] as const,
}

export const mediaQueryOptions = {
  // ... existing list query ...
  detail: (id: string) =>
    queryOptions({
      queryKey: mediaQueryKeys.detail(id),
      queryFn: async () => {
        const res = await api<{ data: MediaRecordWithUsage }>(
          `/api/media/${id}`,
        )
        return res.data
      },
    }),
}
```

#### Custom Mutation Hook (`src/features/media/hooks.ts`)

```ts
export function useDeleteMedia() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async ({
      id,
      cascade = false,
    }: {
      id: string
      cascade?: boolean
    }) => {
      return await api<{ success: boolean; clearedReferences: number }>(
        `/api/media/${id}`,
        {
          method: 'DELETE',
          query: cascade ? { cascade: 'true' } : undefined,
        },
      )
    },
    onSuccess: () => {
      // Invalidate semua query yang berpotensi terpengaruh cascade nullify
      void queryClient.invalidateQueries({ queryKey: mediaQueryKeys.all })
      void queryClient.invalidateQueries({ queryKey: settingsQueryKeys.all })
      void queryClient.invalidateQueries({ queryKey: projectQueryKeys.all })
      void queryClient.invalidateQueries({ queryKey: techQueryKeys.all })
    },
  })
}
```

---

### 2. Dialog Interaksi UI: `MediaDeleteDialog`

Komponen [src/features/media/components/media-delete-dialog.tsx](file:///d:/winterest-project/winterest-portfolio-v2/src/features/media/components/media-delete-dialog.tsx) diperkaya dengan 2 mode tampilan:

```txt
+-------------------------------------------------------------+
| [!] Hapus Media                                             |
|                                                             |
| [Thumbnail] hero-illustration.webp                          |
|             image/webp - 240 KB                             |
|                                                             |
| +---------------------------------------------------------+ |
| | (i) Aset ini sedang aktif digunakan pada 2 lokasi:      | |
| |                                                         | |
| | - [Site Settings] Hero Visual                           | |
| | - [Proyek] Winterest Platform (Cover Image)             | |
| |                                                         | |
| | Menghapus media ini akan mengosongkan referensi di      | |
| | atas secara otomatis agar tidak terjadi broken link.    | |
| +---------------------------------------------------------+ |
|                                                             |
| [ Batal ]                       [ Hapus & Kosongkan (2) ]  |
+-------------------------------------------------------------+
```

1. **Loading State**: Saat modal dibuka untuk media tertentu, muat data `usage` via `useQuery(mediaQueryOptions.detail(id))`.
2. **Zero References State**:
   - Jika `usage.inUse === false`: Tampilkan teks konfirmasi standar ("Apakah Anda yakin ingin menghapus media ini?").
   - Tombol utama: "Hapus" (mengirim `{ id, cascade: false }`).
3. **In-Use Warning State**:
   - Jika `usage.inUse === true`: Tampilkan panel peringatan amber (`border-amber-500/30 bg-amber-500/10`).
   - Tampilkan list badge atau pill dengan icon yang jelas (misal: `Globe` untuk Site Settings, `Briefcase` untuk Projects).
   - Tampilkan teks disclaimer yang menenangkan: _"Referensi pada entitas di atas akan dikosongkan secara otomatis (Cascade Nullify) sehingga situs web Anda tidak akan mengalami broken link/gambar rusak."_
   - Tombol utama: **"Hapus & Kosongkan Referensi"** (merah/destructive, mengirim `{ id, cascade: true }`).

---

### 3. Copywriting & Lokalisasi (`src/features/dashboard/copy.ts`)

Menambahkan token teks bilingual (`en` dan `id`):

```ts
// id
media: {
  // ... existing tokens ...
  usageWarningTitle: 'Aset Ini Sedang Digunakan',
  usageWarningDesc: 'Aset ini terpasang secara aktif pada komponen situs berikut:',
  usageAutoCleanNotice: 'Menghapus aset ini akan secara otomatis mengosongkan referensinya agar halaman web terbebas dari gambar rusak (broken link).',
  confirmDeleteAndClean: (count: number) => `Hapus & Bersihkan (${count})`,
  siteSettingsLabel: 'Site Settings',
  projectCoverLabel: 'Cover Proyek',
  techIconLabel: 'Icon Teknologi',
}

// en
media: {
  // ... existing tokens ...
  usageWarningTitle: 'Asset Is Currently In Use',
  usageWarningDesc: 'This asset is actively referenced by the following site components:',
  usageAutoCleanNotice: 'Deleting this asset will automatically clear its references to prevent broken links or missing images on your live site.',
  confirmDeleteAndClean: (count: number) => `Delete & Clear References (${count})`,
  siteSettingsLabel: 'Site Settings',
  projectCoverLabel: 'Project Cover',
  techIconLabel: 'Technology Icon',
}
```

---

## 5. Security & RBAC Rules

1. **Authentication Required**: Setiap request ke `GET /api/media/$id` dan `DELETE /api/media/$id` wajib memvalidasi cookie sesi menggunakan `requireDashboardUser(request)`.
2. **Role Authorization**:
   - `owner`: Full Access (Bisa memeriksa penggunaan dan menghapus media dengan cascade).
   - `admin`: Full Access (Bisa memeriksa penggunaan dan menghapus media dengan cascade).
   - `editor`: Full Access untuk manajemen konten media.
   - `public`: Akses Ditolak (`401 Unauthorized` / `403 Forbidden`).
3. **Sanitization**: Parameter `id` dan query parameter `cascade` divalidasi menggunakan Zod untuk mencegah SQL/Script Injection.

---

## 6. Edge Cases & Invariants

1. **Lingkungan Berbeda (Localhost vs Production)**:
   - Nilai URL yang tersimpan di DB mungkin dibuat saat testing di `http://localhost:3000`, lalu database direplikasi ke produksi `https://winterest.dev`.
   - **Solusi**: Pencarian referensi tidak hanya mencocokkan `media.url` secara literal, tetapi juga mencocokkan pola akhiran path R2 `%/api/media/file/${key}`.
2. **Penghapusan File R2 Gagal (Partial Failure)**:
   - Jika Cloudflare R2 bucket mengalami transient error saat `.delete(key)`:
   - Handler menangani exception dan tetap menyelesaikan pembersihan D1 agar broken link di website utama segera teratasi, sembari mencatat log error pada Cloudflare Workers dashboard.
3. **Gambar Tertanam dalam Markdown (`project_translations.description`)**:
   - Mengubah teks Markdown secara otomatis via regex berisiko merusak struktur kalimat atau format penulisan pengguna.
   - **Keputusan**: Gambar dalam Markdown dicantumkan dalam daftar deteksi `usage` sebagai peringatan (`project_content`), namun teks Markdown tidak diubah otomatis. Pengguna diberikan informasi agar dapat menyunting dokumen jika diperlukan.
4. **Media Bukan dari R2 (External URL)**:
   - Jika media memiliki URL eksternal (tidak memuat `/api/media/file/`), proses penghapusan objek R2 dilewati secara aman.

---

## 7. Acceptance Criteria & Verification Checklist

### Kriteria Keberhasilan (Definition of Done)

- [ ] Endpoint `GET /api/media/$id` berhasil mengembalikan ringkasan `usage` jika media digunakan di `site_settings.heroVisualUrl` atau `projects.coverImage`.
- [ ] Endpoint `DELETE /api/media/$id` tanpa `cascade=true` mengembalikan status `409 Conflict` dengan kode `MEDIA_IN_USE` saat media sedang dipakai.
- [ ] Endpoint `DELETE /api/media/$id?cascade=true` berhasil menghapus record media, menghapus file di R2, dan mengosongkan nilai di `site_settings` serta `projects.coverImage`.
- [ ] Komponen `MediaDeleteDialog` menampilkan rincian penggunaan dan tombol "Hapus & Kosongkan Referensi" saat mendeteksi dependensi aktif.
- [ ] Cache TanStack Query untuk `media`, `site_settings`, dan `projects` ter-refresh otomatis setelah mutasi delete sukses.
- [ ] Unit tests di `src/features/media/__tests__/sync.test.ts` memvalidasi logika `getMediaUsage` dan `cascadeNullifyMediaReferences`.
- [ ] Semua pengecekan statis lulus: `bun run check`, `bun run lint`, dan `bun run test`.
