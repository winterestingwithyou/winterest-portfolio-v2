# Codebase Duplication Audit & Refactoring Tracker

Dokumen ini mencatat daftar temuan fungsi, tipe, schema, dan komponen yang terduplikasi di dalam codebase `winterest-portfolio-v2`, hasil analisis **Graphify Knowledge Graph** dan audit AST. File ini berfungsi sebagai catatan memori dan tracker progres modularisasi.

---

## 📊 Summary & Status Tracker

| ID | Kategori | Simbol / Item | Lokasi Terdeteksi | Status | Rencana Solusi |
| :--- | :--- | :--- | :--- | :---: | :--- |
| **DUP-01** | Database CLI | `findLocalD1Database()` | `src/db/seed-cli.ts`<br>`src/db/create-owner-cli.ts` | ✅ Completed | Diekstrak ke `src/db/cli-utils.ts` |
| **DUP-02** | Database CLI | `readEnv()` | `src/db/seed-cli.ts`<br>`src/db/create-owner-cli.ts` | ✅ Completed | Diekstrak ke `src/db/cli-utils.ts` |
| **DUP-03** | Database CLI | `type D1QueryResponse` | `src/db/seed-cli.ts`<br>`src/db/create-owner-cli.ts` | ✅ Completed | Diekstrak ke `src/db/cli-utils.ts` |
| **DUP-04** | Form / Utility | `slugify()` | `src/features/technologies/category-editor-form.tsx`<br>`src/features/technologies/technology-editor-form.tsx` | ✅ Completed | Dipindahkan ke `src/lib/utils.ts` |
| **DUP-05** | Database Check | `isMissingTableError()` | `src/features/dashboard/loaders.ts`<br>`src/features/projects/public-loaders.ts` | ✅ Completed | Diekstrak ke `src/lib/db-utils.ts` |
| **DUP-06** | Formatting | `formatDate()` & `formatBytes()` | `src/routes/dashboard/media.tsx`<br>`src/routes/projects/$slug.tsx` | ✅ Completed | Disatukan di `src/lib/utils.ts` |
| **DUP-07** | API Error Handler | `handleApiError()` | `src/routes/api/projects/index.ts`<br>`src/routes/api/projects/$id.ts`<br>`src/routes/api/account/index.ts`<br>`src/routes/api/users/index.ts` | ✅ Completed | Disatukan di `src/lib/api-response.ts` |
| **DUP-08** | API Response | `json()` helper | `src/routes/api/projects/index.ts`<br>`src/routes/api/projects/$id.ts` | ✅ Completed | Diganti `Response.json` & helper di `src/lib/api-response.ts` |
| **DUP-09** | UI Icon | `TikTokIcon()` | `src/routes/contact.tsx`<br>`src/components/footer.tsx` | ✅ Completed | Diekstrak ke `src/components/ui/icons.tsx` |
| **DUP-10** | Validation Schema | `contactSchema` | `src/routes/contact.tsx`<br>`src/routes/api/contact.ts` | ✅ Completed | Diekstrak ke `src/features/contact/validation.ts` |

---

## 🔍 Rincian Temuan & Solusi Refactor

### 1. Database CLI Helpers (`src/db/`)

#### 📍 Lokasi:
- `src/db/seed-cli.ts`
- `src/db/create-owner-cli.ts`

#### 🧩 Duplikasi:
1. **`findLocalD1Database()`**:
   ```ts
   function findLocalD1Database() {
     const root = '.wrangler/state/v3/d1/miniflare-D1DatabaseObject'
     if (!existsSync(root)) return null

     return readdirSync(root)
       .filter((file) => file.endsWith('.sqlite') && file !== 'metadata.sqlite')
       .map((file) => join(root, file))
       .filter((file) => statSync(file).isFile())
       .sort((a, b) => statSync(b).mtimeMs - statSync(a).mtimeMs)[0]
   }
   ```
2. **`readEnv(name: string)`**:
   ```ts
   function readEnv(name: string, purpose = 'execution') {
     const value = process.env[name]
     if (!value) throw new Error(`${name} is required for remote D1 ${purpose}.`)
     return value
   }
   ```
3. **`type D1QueryResponse`**:
   ```ts
   export type D1QueryResponse = {
     success: boolean
     result?: Array<{ results?: Array<Record<string, unknown>> }>
     errors?: Array<{ message: string }>
   }
   ```

#### 🎯 Target Solusi:
Buat file `src/db/cli-utils.ts` yang mengekspor fungsi-fungsi di atas, lalu import di kedua file CLI.

---

### 2. Utility & Helper Functions

#### A. `slugify(text: string)`
- **Lokasi**:
  - `src/features/technologies/category-editor-form.tsx` (L19)
  - `src/features/technologies/technology-editor-form.tsx` (L25)
- **Implementasi**:
  ```ts
  export function slugify(text: string): string {
    return text
      .toLowerCase()
      .trim()
      .replace(/[^\w\s-]/g, '')
      .replace(/[\s_-]+/g, '-')
      .replace(/^-+|-+$/g, '')
  }
  ```
- **Target Solusi**: Pindahkan ke `src/lib/utils.ts`.

#### B. `isMissingTableError(error: unknown)`
- **Lokasi**:
  - `src/features/dashboard/loaders.ts` (L78)
  - `src/features/projects/public-loaders.ts` (L47)
- **Implementasi**:
  ```ts
  export function isMissingTableError(error: unknown): boolean {
    return error instanceof Error && error.message.includes('no such table')
  }
  ```
- **Target Solusi**: Satukan di `src/lib/db/utils.ts` atau `src/db/index.ts`.

#### C. `formatDate(date)`
- **Lokasi**:
  - `src/routes/dashboard/media.tsx` (L44)
  - `src/routes/projects/$slug.tsx` (L232)
- **Target Solusi**: Buat helper format tanggal yang konsisten dan configurable di `src/lib/utils.ts`.

---

### 3. API Error Handling (`handleApiError`) & Respon API

#### 📍 Lokasi:
- `src/routes/api/projects/index.ts` (L55)
- `src/routes/api/projects/$id.ts` (L87)
- `src/routes/api/account/index.ts` (L46)
- `src/routes/api/users/index.ts` (L107)

#### 🧩 Masalah:
Setiap endpoint mengimplementasikan try-catch boilerplate dan response formatting ZodError / database error secara manual dan terpisah.

#### 🎯 Target Solusi:
Buat centralized API error helper `handleApiError(error: unknown, fallbackMessage?: string)` di `src/lib/api-response.ts` atau `src/lib/server-utils.ts`.

---

### 4. UI Components & Validation Schemas

#### A. `TikTokIcon`
- **Lokasi**:
  - `src/routes/contact.tsx` (L48)
  - `src/components/footer.tsx` (L8)
- **Target Solusi**: Ekstrak ke `src/components/ui/icons.tsx` agar reusable di seluruh halaman marketing.

#### B. `contactSchema`
- **Lokasi**:
  - `src/routes/contact.tsx` (L61)
  - `src/routes/api/contact.ts` (L8)
- **Target Solusi**: Buat `src/features/contact/validation.ts` sesuai arsitektur feature-based repository ini, lalu gunakan bersama di client form & server route handler.

---

## 📌 Catatan Standar Arsitektur (Rule Reference)
1. **Kebab-Case File Naming**: Semua nama file utilitas baru harus memakai format kebab-case (contoh: `cli-utils.ts`, `api-response.ts`).
2. **Feature-Based Co-location**: Schema validasi dan query logic feature harus berada di folder `src/features/<feature>/`.
3. **Graphify Sync**: Setiap kali menyelesaikan refaktor grup di atas, jalankan `graphify update .` untuk memvalidasi dan memperbarui graph dependencies.
