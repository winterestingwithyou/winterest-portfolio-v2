# RFC: Form, Input & Interaction UX Fixes

- **Feature ID**: `fix-form-input-interaction-ux`
- **Date**: 2026-09-09
- **Status**: `Draft`
- **Target Routes**:
  - `/projects/`
  - `/contact`
  - `/login`
  - `/dashboard/projects/new`
  - `/dashboard/projects/$id`
  - `/dashboard/settings`
- **Target Modules**:
  - `src/features/projects/`
  - `src/features/contact/`
  - `src/features/auth/`
  - `src/features/settings/`
  - `src/components/ui/`
  - `src/components/media/`

---

## 1. Overview & Problem Statement

Audit UX menemukan sejumlah cacat interaksi pada penanganan formulir, input pencarian, dan penanganan status asinkron:

1. **Glitch Spasi pada Pencarian Proyek**: `handleSearchChange` di `projects-list-page.tsx` langsung memanggil `val.trim()`, sehingga menekan tombol spasi memotong whitespace dan mencegah pengguna mengetik pencarian multi-kata (misal: `"web app"`).
2. **Silent Failure Upload Media**: `ImageUploader` menangkap error upload hanya dengan `console.error` tanpa memberikan umpan balik visual (alert atau toast), membingungkan pengguna ketika upload gagal.
3. **Pencarian Tanpa Debounce pada Media Picker**: Input pencarian modal `MediaPickerDialog` menembak request API `/api/media?search=...` pada setiap ketikan tombol tanpa jeda debounce, berpotensi memicu _race condition_ dan membebani endpoint edge.
4. **Premature Submit Cloudflare Turnstile**: Tombol submit pada `LoginForm` dan `ContactForm` aktif sebelum `turnstileToken` selesai diisi, memicu error validasi bot saat form dikirim cepat.
5. **Ketiadaan Proteksi Data Hilang (Unsaved Changes)**: Form editor proyek (`project-editor-form.tsx`) dan pengaturan (`settings-editor-form.tsx`) yang panjang tidak memiliki _navigation blocker_ saat form berada dalam kondisi kotor (`isDirty`). Pengguna yang tidak sengaja berpindah halaman akan kehilangan seluruh data ketikan tanpa peringatan.
6. **Hardcoded Pesan Validasi Zod**: Validasi skema Zod pada form kontak di-hardcode dalam Bahasa Indonesia tanpa dukungan bilingual.

### User Personas & Capabilities

- **Visitor / Reader**: Dapat mengetik kata kunci pencarian berspasi dengan nyaman; mengisi form kontak dengan pesan validasi sesuai bahasa aktif; tidak terhalang error Turnstile palsu saat mengetik cepat.
- **Editor / Admin**: Mendapat pesan kegagalan yang jelas saat file gagal diunggah; tidak kehilangan data artikel/proyek akibat navigasi yang tidak disengaja; modal media picker merespons pencarian secara mulus tanpa lag.

---

## 2. Database & Storage Contract (D1 & R2)

Perbaikan ini berfokus pada lapisan UX frontend dan penanganan validasi klien; **tidak ada modifikasi tabel D1 maupun skema storage R2**.

- **D1 Tables**: Tidak ada perubahan.
- **R2 Storage**: Tidak ada perubahan.

---

## 3. Server & API Contracts (Zod & ofetch)

### Zod Validation Schemas

1. **`src/features/contact/validation.ts`**:
   - Refactor `contactSchema` menjadi factory function `getContactSchema(locale: 'en' | 'id')` atau skema dinamis yang membaca copy localized dari `getContactCopy().form.validation`:
     ```ts
     export function createContactSchema(copy: ContactValidationCopy) {
       return z.object({
         name: z.string().trim().min(1, copy.nameRequired),
         email: z.string().trim().email(copy.emailInvalid),
         subject: z.string().trim(),
         message: z.string().trim().min(10, copy.messageMinLength),
         turnstileToken: z.string().min(1, copy.turnstileRequired),
       })
     }
     ```

2. **Error Message Handling**:
   - Standardisasi ekstraksi error pada `ImageUploader` menggunakan `getApiErrorMessage(err, copy.media.uploadError)` dari `#/lib/api-client`.

---

## 4. UI & State Architecture

### 1. Perbaikan Search Input Spasi (`ProjectsListPage`)

- **File**: `src/features/projects/pages/projects-list-page.tsx`
- **Tindakan**:
  - Ubah `handleSearchChange`: Jangan lakukan `val.trim()` saat memperbarui URL search param `q`. Simpan nilai apa adanya atau sinkronkan hanya saat debounce selesai.
  - Alternatif terbaik: Izinkan spasi trailing di state URL atau pertahankan nilai lokal di `SearchInput` agar `localValue` tidak ditimpa oleh `useEffect` jika perbedaannya hanya berupa trailing whitespace.

### 2. Feedback Error Upload Media (`ImageUploader`)

- **File**: `src/components/media/image-uploader.tsx`
- **Tindakan**:
  - Tambahkan state lokal `uploadError: string | null`.
  - Pada blok `catch`, set `uploadError` dengan pesan dari `getApiErrorMessage(err, copy.media.uploadError)`.
  - Tampilkan banner alert kesalahan yang jelas dengan icon `AlertCircle` di bawah area dropzone.

### 3. Debounce Pencarian Modal Media Picker (`MediaPickerDialog`)

- **File**: `src/components/media/media-picker-dialog.tsx`
- **Tindakan**:
  - Pisahkan `searchTerm` internal dengan `debouncedSearch` menggunakan `useDebouncedCallback` (350ms) atau ganti dengan komponen `SearchInput`.
  - Eksekusi query TanStack Query `mediaQueryOptions.list()` hanya dengan nilai yang sudah ter-debounce.

### 4. Gate Turnstile pada Tombol Submit Form (`LoginForm` & `ContactForm`)

- **Files**:
  - `src/features/auth/components/form/login-form.tsx`
  - `src/features/contact/components/form/contact-form.tsx`
- **Tindakan**:
  - Evaluasi ketersediaan `turnstileToken`:
    ```tsx
    const isReadyToSubmit = canSubmit && Boolean(turnstileToken) && !isPending
    ```
  - Pada tombol submit: tambahkan kondisi disable `!turnstileToken` atau berikan indikator status _"Memverifikasi keamanan..."_ ketika form sudah valid namun token Turnstile belum terisi.

### 5. Unsaved Changes Guard (`ProjectEditorForm` & `SettingsEditorForm`)

- **Files**:
  - `src/features/projects/components/form/project-editor-form.tsx`
  - `src/features/settings/components/form/settings-editor-form.tsx`
- **Tindakan**:
  - Pasang TanStack Router `useBlocker`:
    ```tsx
    const isDirty = form.state.isDirty
    useBlocker({
      shouldBlockFn: () => isDirty && !isSubmittingSuccess,
      withResolver: true,
    })
    ```
  - Pasang listener `window.addEventListener('beforeunload', handleBeforeUnload)` saat `isDirty === true`.
  - Tampilkan modal konfirmasi standar (`AlertDialog`) ketika pengguna berusaha berpindah rute sebelum menyimpan perubahan.

---

## 5. Security & RBAC Rules

- **Turnstile Verification**: Tetap diwajibkan pada level server (`/api/contact` dan `/api/auth/sign-in/email`).
- **Data Protection**: Mencegah kebocoran data terhapus atau kehilangan data akibat klik navigasi tidak sengaja.

---

## 6. Edge Cases & Invariants

- **Turnstile Error/Offline**: Jika widget Turnstile gagal termuat (misalnya diblokir adblocker ketat), tampilkan pesan ramah: _"Gagal memuat verifikasi keamanan. Silakan nonaktifkan adblocker atau muat ulang halaman."_
- **Paste Teks Panjang**: Memastikan form dirty guard tidak terpicu saat initial hydration data proyek.

---

## 7. Acceptance Criteria & Verification Checklist

- [ ] Mengetik kata dengan spasi (misal `"fullstack web developer"`) pada galeri proyek berjalan mulus tanpa terpotong.
- [ ] Upload gambar yang gagal (misal file melebihi 10MB) menampilkan pesan error yang jelas dan terbaca.
- [ ] Mengetik cepat pada modal media picker hanya mengirim 1 request HTTP setelah pengguna berhenti mengetik selama 350ms.
- [ ] Tombol submit pada login dan form kontak tidak dapat diklik sebelum token Turnstile terisi.
- [ ] Mengubah teks pada form edit proyek lalu mengklik link menu sidebar memunculkan dialog konfirmasi pembatalan.
- [ ] Validasi form kontak menampilkan teks Bahasa Inggris ketika bahasa yang aktif adalah English (`en`).
- [ ] Seluruh unit test terkait form & validasi lulus (`bun run test`).
- [ ] Typecheck lulus (`bun run check`).
