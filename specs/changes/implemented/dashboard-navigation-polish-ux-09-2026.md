# RFC: Dashboard Navigation, Information Architecture & Visual Polish

- **Feature ID**: `fix-dashboard-navigation-polish-ux`
- **Date**: 2026-09-09
- **Status**: `Implemented`
- **Target Routes**:
  - `/dashboard/*`
  - `/projects/$slug`
  - `/resume`
- **Target Modules**:
  - `src/components/dashboard/`
  - `src/features/dashboard/`
  - `src/features/projects/`
  - `src/features/portfolio/`
  - `src/components/media/`
  - `src/components/ui/`

---

## 1. Overview & Problem Statement

Audit UX terhadap dashboard admin CMS dan navigasi mendalam menemukan beberapa ketidaksesuaian alur kerja serta tanda visual template:

1. **Kebocoran Tautan RBAC pada Sidebar**: Menu navigasi `Users` (`/dashboard/users`) ditampilkan kepada semua pengguna termasuk role `editor`. Ketika editor mengklik menu tersebut, sistem melempar error HTTP 403 Forbidden di tingkat loader yang memicu error boundary mentah.
2. **Hilangnya State Filter saat Navigasi Kembali dari Detail Proyek**: Tombol _"Projects"_ pada halaman detail proyek (`/projects/$slug`) menggunakan tautan statis `<Link to="/projects">`, menghapus query pencarian, filter kategori, dan posisi pagination yang sebelumnya dipilih pengunjung.
3. **Dead Empty State pada Tabel Proyek**: Saat database proyek kosong, halaman menampilkan kotak statis _"Belum ada proyek"_ tanpa tombol Call-to-Action (CTA) langsung untuk membuat proyek pertama, memaksa pengguna mencari tombol kecil di sudut header.
4. **Tacky Bounce Easing**: Icon unggah pada `image-uploader.tsx` dan `media-upload-dropzone.tsx` menggunakan `animate-bounce` Tailwind yang membal secara tidak natural dan terdeteksi sebagai slop visual.
5. **AI-Slop Side-Tab Borders (`border-l-4`)**: Garis aksen tebal 4px di sisi kiri kartu terjemahan proyek dan kartu kutipan melanggar aturan arsitektur Flat Precision (Cloudflare + Bun) yang mewajibkan hairline 1px borders.
6. **Ketiadaan Tombol Cetak Langsung pada Resume**: Halaman resume memiliki format stylesheet ramah cetak (`@media print`), namun tidak menyediakan tombol visual _"Print Resume"_ / _"Save as PDF"_ (`window.print()`), menyulitkan HR/recruiter yang tidak terbiasa dengan shortcut keyboard.

### User Personas & Capabilities

- **Editor**: Menavigasi dashboard CMS secara bersih hanya melihat menu yang diizinkan; tidak menemui halaman error 403 akibat salah klik menu otorisasi owner.
- **Visitor / Recruiter**: Meneliti detail proyek dan dapat kembali ke galeri dengan filter pencarian yang tetap utuh; dapat mencetak resume dengan sekali klik tombol.

---

## 2. Database & Storage Contract (D1 & R2)

- **D1 Tables**: Tidak ada perubahan.
- **R2 Storage**: Tidak ada perubahan.

---

## 3. Server & API Contracts (Zod & ofetch)

- **API & Validation**: Tidak ada perubahan kontrak API.

---

## 4. UI & State Architecture

### 1. Filter RBAC pada Sidebar Navigasi (`DashboardSidebar`)

- **File**: `src/components/dashboard/dashboard-sidebar.tsx`
- **Tindakan**:
  - Periksa peran user (`user?.role`):
    ```tsx
    const isOwner = user?.role === 'owner'
    ```
  - Sembunyikan item navigasi `Users` jika bukan `owner`:
    ```tsx
    const filteredSystemNav = systemNav.filter((item) => {
      if (item.to === '/dashboard/users' && !isOwner) return false
      return true
    })
    ```
  - Terjemahkan label grup `"Sistem"` menjadi localized token `copy.shell.systemGroup` agar tidak hardcoded dalam satu bahasa.

### 2. Preservasi State Filter pada Tombol Kembali Detail Proyek

- **File**: `src/features/projects/pages/project-detail-page.tsx`
- **Tindakan**:
  - Ganti link statis `<Link to="/projects">` dengan pemanggilan navigasi riwayat browser:
    ```tsx
    <button
      type="button"
      onClick={() => window.history.back()}
      className="inline-flex items-center gap-2 text-sm font-bold text-(--brand-orange-deep) hover:-translate-x-1 transition"
    >
      <ArrowLeft className="size-4" />
      <span>{copy.detail.backToProjects}</span>
    </button>
    ```
  - Jika navigasi dibuka langsung via URL eksternal (riwayat kosong), sediakan fallback `<Link to="/projects">`.

### 3. Tombol Call-to-Action pada Empty State Proyek

- **File**: `src/features/projects/pages/dashboard-projects-page.tsx`
- **Tindakan**:
  - Pada blok `projects.length === 0`, tambahkan tombol Call-to-Action yang jelas:
    ```tsx
    <div className="p-8 text-center flex flex-col items-center justify-center">
      <h2 className="text-xl font-bold text-(--brand-ink)">
        {copy.projects.emptyTitle}
      </h2>
      <p className="mt-2 max-w-md text-sm text-(--brand-muted)">
        {copy.projects.emptyDescription}
      </p>
      <Button
        asChild
        className="mt-6 rounded-full bg-(--brand-orange) text-white font-bold"
      >
        <Link to="/dashboard/projects/new">
          <Plus className="size-4 mr-2" />
          {copy.projects.createFirst}
        </Link>
      </Button>
    </div>
    ```

### 4. Penggantian Animasi Membal (`animate-bounce` → Smooth Motion)

- **Files**:
  - `src/components/media/image-uploader.tsx`
  - `src/features/media/components/section/media-upload-dropzone.tsx`
- **Tindakan**:
  - Ganti class `animate-bounce` dengan transisi scale atau subtle float:
    ```tsx
    // Ganti animate-bounce dengan motion scale
    <motion.div
      animate={isDragging ? { scale: 1.1, y: -4 } : { scale: 1, y: 0 }}
      transition={{ duration: 0.2, ease: 'easeOut' }}
    >
      <UploadCloud className="size-7" />
    </motion.div>
    ```

### 5. Pembersihan AI-Slop `border-l-4` Side-Tabs

- **Files**:
  - `src/features/projects/components/form/project-editor-form.tsx:L738`
  - `src/features/about/components/section/about-hero.tsx:L71`
  - `src/features/about/components/section/beyond-the-code-section.tsx:L384`
- **Tindakan**:
  - Hapus class `border-l-4 border-l-(--brand-orange)`.
  - Gunakan hairline 1px border dengan subtle surface contrast (`border border-(--brand-line) bg-card`). Indikator bahasa/kategori cukup ditandai dengan badge atau flag emoji yang sudah ada di header kartu.

### 6. Tombol Cetak / Simpan PDF Langsung pada Halaman Resume

- **File**: `src/features/portfolio/pages/resume-page.tsx`
- **Tindakan**:
  - Tambahkan tombol aksi _"Print / Save PDF"_ di dekat header resume (dengan class `print:hidden`):
    ```tsx
    <Button
      type="button"
      variant="outline"
      onClick={() => window.print()}
      className="gap-2 rounded-full border-(--brand-line) font-bold text-sm text-(--brand-ink) hover:border-(--brand-orange) print:hidden"
    >
      <Printer className="size-4 text-(--brand-orange)" />
      <span>{copy.resume.printButton}</span>
    </Button>
    ```

---

## 5. Security & RBAC Rules

- **Otorisasi Menu**: User dengan role selain `owner` tidak lagi disajikan tautan ke `/dashboard/users`.
- **Rute Server Guard**: Menambahkan `beforeLoad` role check pada `src/routes/dashboard/users/index.tsx` yang melempar redirect aman ke `/dashboard` jika bukan owner, menggantikan unhandled 403 API crash.

---

## 6. Edge Cases & Invariants

- **Browser Window Print**: Memastikan seluruh kartu tertutup (_collapsible_ jika ada) terbuka sebelum dialog cetak aktif.
- **Riwayat Navigasi Kosong**: Deteksi apakah `window.history.length > 1` sebelum memanggil `history.back()`.

---

## 7. Acceptance Criteria & Verification Checklist

- [x] User dengan role `editor` tidak melihat menu `Users` di sidebar dashboard.
- [x] Mengakses langsung `/dashboard/users` sebagai `editor` dialihkan secara mulus ke `/dashboard` tanpa error boundary crash.
- [x] Membuka proyek dari hasil filter lalu menekan tombol kembali mempertahankan filter kategori dan kata kunci pencarian.
- [x] Tabel proyek kosong memiliki tombol CTA _"Buat Proyek Pertama"_.
- [x] Efek drag-and-drop file menggunakan transisi smooth tanpa icon membal (_bounce_).
- [x] Tidak ada lagi class `border-l-4` pada kartu terjemahan dan about.
- [x] Tombol cetak di halaman resume membuka dialog cetak native browser dan tersembunyi pada lembar hasil cetak.
- [x] Typecheck dan linting lulus (`bun run check`).
