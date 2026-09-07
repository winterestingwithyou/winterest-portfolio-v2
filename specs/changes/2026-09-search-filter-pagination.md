# RFC: Search, Filter & Pagination Architecture (Public & Dashboard)

- **Feature ID**: `feat-search-filter-pagination`
- **Status**: `Draft`
- **Authors**: Winterest Engineering
- **Target Routes**:
  - `/projects`
  - `/dashboard/projects`
  - `/dashboard/stack`
  - `/dashboard/media`
  - `/api/media`
- **Target Code**:
  - `src/components/ui/pagination.tsx`
  - `src/components/ui/data-pagination.tsx`
  - `src/components/ui/search-input.tsx`
  - `src/features/projects/`
  - `src/features/technologies/`
  - `src/features/media/`
- **Date**: 2026-09-07

---

## 1. Overview & Problem Statement

Seiring bertambahnya jumlah entitas konten (proyek, teknologi, kategori, dan aset media), pengguna dashboard dan pengunjung portofolio publik mengalami kesulitan dalam menemukan item tertentu dan menjelajahi katalog yang panjang.

### Objectives
1. **Public Portfolio (`/projects`)**: Menyediakan pengalaman eksplorasi proyek yang mulus dengan bilah pencarian responsif (debounced via `use-debounce`), tombol/tab filter kategori, dan penomoran halaman 9 proyek per halaman menggunakan komponen Shadcn `Pagination`.
2. **Dashboard Data Tables (`/dashboard/projects`, `/dashboard/stack`)**: Memperkaya tabel TanStack Table dengan client-side search, status/category filter, dan pagination 10 baris per halaman lengkap dengan row counter.
3. **Media Library (`/dashboard/media`)**: Menerapkan arsitektur pagination server-side (12 item per halaman) dengan penghitungan total aset di Cloudflare D1, filter tipe aset ('all', 'image', 'document'), dan debounced search.
4. **Deep Linking & State Preservation**: Menyinkronkan nomor halaman dan query pencarian ke URL search params browser di semua rute terkait via TanStack Router.

---

## 2. Architecture: Hybrid Approach

| Fitur / Halaman | Tipe Pagination | Debounced Search | Filter Tambahan | Alasan Arsitektur |
| :--- | :--- | :--- | :--- | :--- |
| **Public Projects (`/projects`)** | Client-side (9 / page) | Ya (`use-debounce`) | Kategori (Pill tabs) | Dataset dimuat di awal oleh server fn; pencarian dan filter client instan tanpa network latency |
| **Dashboard Projects** | Client-side (10 / page) | Ya (`use-debounce`) | Status (`published`/`in_progress`/`draft`) | TanStack Table `getPaginationRowModel` & `getFilteredRowModel` |
| **Dashboard Stack (Tech & Cat)** | Client-side (10 / page) | Ya (`use-debounce`) | Kategori (untuk Tech) | Dataset ringan, operasi CRUD langsung sinkron |
| **Dashboard Media (`/dashboard/media`)** | Server-side (12 / page) | Ya (`use-debounce`) | Tipe Aset (`all`/`image`/`document`) | Aset media dapat bertambah besar; SQL `LIMIT/OFFSET` + `COUNT(*)` mencegah beban memori di edge |

---

## 3. Database & Storage Contract (Cloudflare D1 & R2)

### D1 Tables Touched
- `media`: Dilakukan query pagination dengan `count()` dan `.limit(limit).offset((page - 1) * limit)`.
- `projects`, `technologies`, `categories`: Tetap mempertahankan query D1 dasar; pagination dilakukan di layer TanStack Table client-side.

### SQL Pagination Helper Signature (Media)
```sql
-- Count total records matching filter
SELECT COUNT(*) as total FROM media 
WHERE (filename LIKE ? OR alt LIKE ?) AND (mime_type LIKE ?);

-- Paginated slice
SELECT * FROM media 
WHERE (filename LIKE ? OR alt LIKE ?) AND (mime_type LIKE ?)
ORDER BY created_at DESC 
LIMIT ? OFFSET ?;
```

---

## 4. Server & API Contracts (Zod & ofetch)

### Media API Endpoint: `GET /api/media`

#### Zod Query Schema (`mediaQuerySchema`)
```ts
export const mediaQuerySchema = z.object({
  search: z.string().trim().optional(),
  type: z.enum(['all', 'image', 'document']).default('all'),
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(12),
})
```

#### JSON Response Contract
```json
{
  "data": [
    {
      "id": "med_123",
      "filename": "hero-cover.webp",
      "url": "/api/media/file/med_123.webp",
      "mimeType": "image/webp",
      "size": 1048576,
      "width": 1920,
      "height": 1080,
      "alt": "Hero Cover",
      "createdAt": "2026-09-07T12:00:00.000Z",
      "updatedAt": "2026-09-07T12:00:00.000Z"
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 12,
    "total": 45,
    "totalPages": 4
  }
}
```

---

## 5. UI & State Architecture

### Component Hierarchy
```txt
src/
├── components/ui/
│   ├── pagination.tsx        # Shadcn raw primitives (fixed cn import)
│   ├── data-pagination.tsx   # Reusable helper with smart ellipsis & aria labels
│   └── search-input.tsx      # Debounced search bar with clear button
├── features/
│   ├── projects/
│   │   ├── pages/projects-list-page.tsx       # Category pills, debounced search, 9 items/page
│   │   └── components/table/dashboard-projects-table.tsx # TanStack Table pagination + status filter
│   ├── technologies/
│   │   ├── components/table/dashboard-tech-table.tsx     # TanStack Table pagination + category filter
│   │   └── components/table/dashboard-categories-table.tsx # TanStack Table pagination
│   └── media/
│       ├── components/section/media-gallery-section.tsx  # Server-side pagination controls & tabs
│       └── pages/media-page.tsx                          # URL sync for media search/page/type
```

### URL Search Parameter Contracts (TanStack Router)

1. **Public Projects (`/projects`)**:
   `?q=<search_term>&category=<category_slug>&page=<page_number>`
2. **Dashboard Projects (`/dashboard/projects`)**:
   `?q=<search_term>&status=<status_enum>&page=<page_number>`
3. **Dashboard Stack (`/dashboard/stack`)**:
   `?tab=<technologies|categories>&q=<search_term>&category=<cat_id>&page=<page_number>`
4. **Dashboard Media (`/dashboard/media`)**:
   `?q=<search_term>&type=<all|image|document>&page=<page_number>`

---

## 6. Security & RBAC Rules

- `/projects` (Public): Hanya menampilkan project dengan status `published` atau `in_progress` serta visibility `public`.
- `/dashboard/*` dan `/api/media`: Memerlukan cookie session aktif (`owner`, `admin`, atau `editor`). Unauthorized requests mengembalikan 401 / diarahkan ke `/login`.
- Input validation: Seluruh query parameter URL divalidasi via Zod untuk mencegah SQL injection atau memory exhaustion (limit dicap maksimal 100).

---

## 7. Edge Cases & Invariants

1. **Empty Search Results**: Jika pencarian tidak menemukan item, tampilkan Empty State ramah pengguna dengan tombol "Reset Filter" yang mengembalikan state pencarian ke awal.
2. **Out of Range Page Number**: Jika user memasukkan `?page=999` pada URL, UI secara otomatis mengoreksi tampilan ke halaman terakhir yang valid.
3. **Debounce Race Conditions**: Pemanfaatan `use-debounce` (delay 300ms - 400ms) memastikan request tidak ditembakkan pada setiap ketukan tuts keyboard.
4. **Single-Page Datasets**: Jika total item lebih kecil atau sama dengan ukuran per halaman (`total <= pageSize`), navigasi pagination disembunyikan secara visual namun status total item tetap ditampilkan.

---

## 8. Acceptance Criteria & Verification Checklist

- [ ] `src/components/ui/pagination.tsx` diimpor dengan `cn` dari `#/lib/utils` tanpa error.
- [ ] `DataPagination` merender nomor halaman, ellipsis saat halaman banyak (`1 ... 4 5 6 ... 10`), dan tombol Next/Previous ter-disable di halaman ujung.
- [ ] `/projects` menampilkan 9 project per halaman, pencarian debounced bekerja, dan pill filter kategori menyaring kartu proyek dengan benar.
- [ ] `/dashboard/projects` menampilkan 10 baris per halaman, filter status berfungsi, dan pencarian instan bekerja.
- [ ] `/dashboard/stack` mempaginasi tabel teknologi dan kategori masing-masing 10 baris per halaman.
- [ ] `/dashboard/media` memproses query limit/offset dan count di server D1 dengan 12 item per halaman.
- [ ] Semua rute target menyinkronkan state ke URL search params.
- [ ] `bun run typecheck`, `bun run lint`, dan `bun run test` lolos 100% tanpa error.
