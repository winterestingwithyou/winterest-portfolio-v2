# RFC: Flat Precision Architecture & Visual Noise Reduction (Cloudflare + Bun Redesign)

- **Feature ID**: `arch-flat-precision-redesign`
- **Status**: `Draft`
- **Authors**: Winterest | M. Adam Yudistira
- **Date**: 2026-09-09
- **Target Routes**:
  - `/` (Beranda)
  - `/about` (Tentang)
  - `/projects` (Galeri Proyek)
  - `/projects/$slug` (Detail Proyek)
  - `/stack` (Katalog Tech Stack)
  - `/contact` (Kontak)
  - `/resume` (Resume)
- **Target Modules**:
  - `src/styles.css`
  - `src/components/header.tsx`
  - `src/components/footer.tsx`
  - `src/components/portfolio/project-card.tsx`
  - `src/components/visual/hero-visual.tsx`
  - `src/features/home/components/section/`
  - `src/features/about/components/section/`
  - `src/features/projects/components/section/`
  - `src/features/technologies/components/section/`
  - `src/features/contact/components/`

---

## 1. Overview & Problem Statement

Portofolio Winterest saat ini mengalami **"over-decoration" visual** berupa penggunaan bayangan buram berwarna oranye yang berlebihan (`shadow-[0_18px_48px_var(--brand-glow)]`, `shadow-[0_10px_25px_-5px_var(--brand-orange-soft)]`), bola blur dekoratif di latar kartu (`blur-2xl`), serta gradasi multi-stop diagonal di berbagai komponen kartu (`bg-linear-to-br from-... via-... to-...`).

Efek-efek visual ini menjauhkan portofolio dari identitas aslinya (**Cloudflare + Bun**) dan melanggar prinsip desain profesional developer-grade:

1. **Ketidaksesuaian dengan Bun (`bun.sh`)**: Bun mengusung estetika _minimalist brutalist-clean_: bidang datar (_flat solid_), kontras hitam-putih tajam, tipografi rapi, dan garis pembatas tegas tanpa bayangan warna-warni mengambang.
2. **Ketidaksesuaian dengan Cloudflare (`cloudflare.com` & Dashboard)**: Cloudflare adalah infrastruktur jaringan presisi tinggi. Kedalaman (_depth_) dibangun melalui **hairline 1px border**, grid teknis, dan elevasi bidang datar, bukan lampu neon oranye buram.
3. **Pelanggaran Standar `/impeccable`**:
   - `craft-floor.md`: _"A zero-offset colored halo is decoration."_ (Bayangan oranye tanpa offset adalah ornamen semata).
   - `quieter.md`: _"Operate + Read / Developer aesthetic: 'quieter' means reducing visual noise. Flatter cards, less color, less motion. Clean up effects: Reduce or remove blur effects, glows, multiple shadows."_

### Tujuan Redesign (Objectives)

Mentransformasi portofolio menuju **Flat Precision Architecture**:

1. **Eliminasi Glow Halos & Blur Orbs**: Menghapus seluruh bayangan berpendar oranye tebal dan bola blur dekoratif yang tidak fungsional.
2. **Transisi ke Flat Solid Surfaces**: Mengganti gradasi diagonal pada kartu dengan warna bidang solid (`bg-card`, `bg-surface-strong`) untuk memaksimalkan keterbacaan teks dan kode.
3. **Hairline Border-Driven Depth**: Menjadikan garis pembatas 1px (`border border-(--brand-line)`) sebagai instrumen pemisah visual utama.
4. **Single-Accent Orange**: Menggunakan warna signature Cloudflare (`#f48120`) murni sebagai aksen fungsional yang tajam (active state, primary CTA, hover highlight, status badge).
5. **Performa & Konsumsi Daya Lebih Ringan**: Mengurangi beban composite rendering browser di mobile/low-end device dengan mengeliminasi heavy box-shadows dan CSS blur filters.

---

## 2. Database & Storage Contract (Cloudflare D1 & R2)

- **Perubahan Skema**: Tidak ada (`None`).
- **Penyimpanan R2**: Tidak ada perubahan.
- **Keterangan**: Redesign ini berfokus 100% pada layer presentasi visual (CSS tokens, Tailwind utility classes, dan struktur komponen React). Semua data statis maupun dinamis tetap terjaga utuh.

---

## 3. Server & API Contracts (Zod & ofetch)

- **Endpoint API**: Tidak ada modifikasi pada endpoint backend.
- **Data Fetching**: Tetap menggunakan query options TanStack Query yang sudah ada.

---

## 4. UI & Design System Architecture

### A. Rekayasa Token & CSS (`src/styles.css`)

1. **Deprekasi `--brand-glow` untuk Kartu**:
   - Nilai `--brand-glow` tidak lagi digunakan untuk `box-shadow` pada kartu atau kontainer.
   - Glow hanya diizinkan dalam intensitas mikro untuk focus-visible ring pada keyboard navigation.
2. **Elevasi Datar Bersih (Clean Elevation)**:
   - Ganti shadow kustom bertumpuk dengan utilitas standar minimalis: `shadow-none`, `shadow-2xs`, atau `shadow-xs`.
   - Kedalaman permukaan dibangun melalui hierarki warna latar:
     - `body`: Background grid teknis 36px
     - `surface-card`: Latar kartu solid 1 tingkat lebih terang/pekat dari background
     - `surface-strong`: Komponen aktif/input/dropdown

---

### B. Pembersihan Komponen Spesifik (Component Refactoring Matrix)

| Komponen & Lokasi File                                                                       | Kondisi Saat Ini (Overdecorated)                                                                                                                                                                | Kondisi Baru (Flat Precision)                                                                                                                                                                                                                        |
| :------------------------------------------------------------------------------------------- | :---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | :--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Primary CTA Button**<br>`src/features/home/components/section/home-hero.tsx`               | `shadow-[0_18px_48px_var(--brand-glow)]`<br>hover glow meluas                                                                                                                                   | **Flat Solid Orange** (`bg-(--brand-orange)`), teks putih tegas, tanpa colored shadow. Hover: transisi brightness halus (`hover:brightness-105`) atau ring fokus rapi.                                                                               |
| **Project Card**<br>`src/components/portfolio/project-card.tsx`                              | - `bg-linear-to-br ...`<br>- `shadow-[0_10px_25px_-5px_var(--brand-orange-soft)]`<br>- `<div className="absolute -right-10 -top-10 size-40 rounded-full bg-(--brand-orange)/10 blur-2xl ... />` | - **Flat Solid Surface** (`bg-(--surface-card)`).<br>- **Hapus 100% bola blur `blur-2xl`**.<br>- **Hapus colored shadow**.<br>- Garis hairline 1px (`border-(--brand-line)`) yang menyala oranye tegas saat hover (`hover:border-(--brand-orange)`). |
| **Header & Brand Lockup**<br>`src/components/header.tsx`                                     | - `shadow-[0_14px_34px_...]`<br>- `hover:shadow-[0_16px_44px_var(--brand-glow)]`<br>- `radial-gradient` + `linear-gradient` bertumpuk pada brand mark.                                          | - Latar header semi-transparan bersih dengan border-b 1px.<br>- Brand mark flat dengan kontras tinggi.<br>- Hilangkan multi-layer gradient washes pada nav container.                                                                                |
| **Hero Visual Frame**<br>`src/components/visual/hero-visual.tsx`                             | - `bg-linear-to-br from-(--surface-strong)/82 to-(--brand-orange-soft)/56`<br>- `shadow-2xl` tebal.                                                                                             | - Frame teknis datar (`border border-(--brand-line) bg-surface`).<br>- Hapus `shadow-2xl`.<br>- Badge tech stack tetap ada namun dengan border tajam tanpa shadow mengembang.                                                                        |
| **Direct Channel Cards**<br>`src/features/contact/components/section/contact-channels.tsx`   | Kartu channel kontak memiliki background gradasi dan glow saat hover.                                                                                                                           | Kartu solid flat dengan border 1px yang bereaksi secara presisi saat di-hover.                                                                                                                                                                       |
| **Feature Grid & Stats**<br>`src/features/home/components/section/passion-focus-section.tsx` | Multi-layered background cards dengan bayangan lembut.                                                                                                                                          | Clean structural cards dengan border pembatas konsisten.                                                                                                                                                                                             |

---

### C. Ilustrasi Perbandingan Visual (Before vs After)

```txt
[ SEBELUMNYA: Overdecorated ]
+-------------------------------------------------------------+
|  [Card] (Gradasi oranye diagonal)                          |
|         (Bola blur oranye di kanan atas)                   |
|         (Bayangan oranye tebal menjalar ke bawah)          |
|  ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~  |
|  * Terlalu banyak noise visual, teks kurang kontras        |
+-------------------------------------------------------------+

[ SESUDAH: Flat Precision (Cloudflare + Bun) ]
+-------------------------------------------------------------+
|  [Card] Surface solid flat (bg-card / surface-strong)       |
|         Border hairline 1px (border-line)                   |
|         Zero blur orbs, zero colored shadow                 |
|         Hover: Border 1px berubah ke Cloudflare Orange      |
|  ---------------------------------------------------------  |
|  * Sangat tajam, tenang (quiet), tipografi kontras tinggi  |
+-------------------------------------------------------------+
```

---

## 5. Security & RBAC Rules

- Tidak ada implikasi keamanan atau perubahan otorisasi role. Semua rute publik tetap dapat diakses publik, dan rute dashboard tetap diproteksi cookie Better Auth.

---

## 6. Edge Cases & Invariants

1. **Rasio Kontras Mode Gelap (WCAG AA/AAA)**:
   - Menghapus gradasi memastikan warna latar kartu bersifat homogen (konsisten), sehingga rasio kontras teks primer (`--brand-ink`) dan teks sekunder (`--brand-muted`) terhadap latar kartu dapat dijamin ≥ 4.5:1 tanpa ada area yang terlalu terang/gelap secara lokal.
2. **Performa Rendering Mobile**:
   - Menghapus filter `blur-2xl` dan `box-shadow` dengan radius besar menghilangkan beban GPU repainting saat pengguna melakukan scroll cepat pada perangkat mobile.
3. **Konsistensi Visual Antar-Halaman**:
   - Perubahan ini mencakup seluruh 7 halaman publik secara seragam, mencegah adanya halaman yang bergaya flat sementara halaman lain masih bergaya gradasi/glow.

---

## 7. Acceptance Criteria & Verification Checklist

### Kriteria Selesai (Definition of Done)

- [ ] Aturan resmi di `.agents/rules/07-design-system-ui-3d.md` dan `AGENTS.md` telah disinkronkan dengan standar Flat Precision.
- [ ] Tidak ada lagi elemen kartu publik yang menggunakan `shadow-[...var(--brand-glow)]` atau `shadow-[...var(--brand-orange-soft)]`.
- [ ] Seluruh bola blur dekoratif (`blur-2xl` / `blur-3xl`) pada kartu proyek dan komponen publik telah dihapus.
- [ ] Tombol CTA utama (Hero, Contact) menggunakan warna oranye solid tanpa bayangan glow yang mengembang.
- [ ] Kartu proyek pada `/projects` dan beranda menggunakan flat surface dengan border 1px hover highlight.
- [ ] Mode terang (light) dan mode gelap (dark) diuji secara visual dan memiliki kontras yang tajam.
- [ ] Pengecekan statis lulus tanpa error: `bun run check`, `bun run lint`, dan `bun run test`.
