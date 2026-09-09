# RFC: Mobile Layout, Accessibility (A11y) & Color Contrast Standards

- **Feature ID**: `fix-mobile-layout-a11y-contrast`
- **Date**: 2026-09-09
- **Status**: `Draft`
- **Target Routes**:
  - `/` (Beranda)
  - `/about`
  - `/stack`
  - `/resume`
- **Target Modules**:
  - `src/features/home/`
  - `src/features/about/`
  - `src/features/technologies/`
  - `src/features/portfolio/`
  - `src/components/visual/`
  - `src/components/ui/`
  - `src/components/react-bits/`
  - `src/styles.css`

---

## 1. Overview & Problem Statement

Audit visual mendalam dengan panduan `antislop-human` dan `antislop-layoutmobile` mengungkapkan beberapa masalah aksesibilitas, ergonomi visual, dan layout mobile:

1. **Hero Visual Mobile Menelan Layar (544px)**: Di ponsel (`< lg`), kontainer visual diletakkan paling atas (`order-1`) dengan tinggi minimal 544px (`max-sm:min-h-136`), mendorong teks nama, peran developer, dan tombol CTA ke bawah lipatan layar.
2. **Kontras Warna Rendah Tombol Oranye**: Teks putih di atas background oranye Cloudflare (`#f48120`) hanya memiliki rasio kontras **2.62:1**, gagal memenuhi standar WCAG AA (minimal **4.5:1** untuk teks reguler).
3. **Link Eksternal Hanya Muncul saat Hover**: Tautan pada kartu teknologi di halaman `/stack` dan beranda disembunyikan dengan `opacity-0 group-hover:opacity-100`. Pada layar sentuh (mobile/tablet), pengguna tidak dapat mengakses atau melihat tautan ini.
4. **Perangkap Tab Keyboard pada Marquee Berulang**: Komponen `Marquee` menggandakan elemen 6 kali (`repeat={6}`). Duplikat elemen yang berstatus `aria-hidden="true"` tetap menerima fokus Tab keyboard, memaksa pengguna keyboard menekan tombol Tab puluhan kali melalui link duplikat tak kasat mata.
5. **Ketiadaan Dukungan `prefers-reduced-motion`**: Komponen animasi partikel `GooeyNav` dan pergerakan looping tanpa henti pada `Marquee` tidak mengecek preferensi pengurangan gerak pengguna (_vestibular safety_).
6. **Kehilangan Semantik ARIA Tab**: Navigasi sub-tab pada _Beyond the Code_ (Gaming, Anime, K-Pop) hanya berupa tombol biasa tanpa atribut `role="tablist"`, `role="tab"`, `aria-selected`, dan `role="tabpanel"`.
7. **Inversi Hierarki Heading pada Resume**: Halaman resume merender tag `<h2>` pada `SectionHeader` sebelum merender `<h1>` di dalam kartu data, melanggar hierarki semantik dokumen.

### User Personas & Capabilities

- **Casey (Mobile Visitor)**: Membuka portfolio di ponsel dan langsung dapat membaca profil developer, peran, serta tombol kontak tanpa harus scroll melewati ilustrasi 500px terlebih dahulu; dapat mengetuk link teknologi langsung.
- **Sam (Accessibility-Dependent User)**: Menavigasi situs menggunakan keyboard/screen reader secara efisien tanpa terjebak di puluhan link marquee tersembunyi; membaca tombol dengan kontras teks yang jelas; merasakan transisi nyaman jika mengaktifkan opsi _Reduce Motion_ di sistem operasi.

---

## 2. Database & Storage Contract (D1 & R2)

- **D1 Tables**: Tidak ada perubahan.
- **R2 Storage**: Tidak ada perubahan.

---

## 3. Server & API Contracts (Zod & ofetch)

- **API & Validation**: Tidak ada perubahan kontrak API.

---

## 4. UI & State Architecture

### 1. Perbaikan Layout Hero Mobile (`HomeHero` & `HeroVisual`)

- **Files**:
  - `src/features/home/components/section/home-hero.tsx`
  - `src/components/visual/hero-visual.tsx`
- **Tindakan**:
  - Di mobile (`< lg`), atur teks intro sebagai prioritas pertama (`order-1` untuk teks, `order-2` untuk visual), atau pertahankan visual di atas tetapi kurangi tingginya secara signifikan (misal: `max-sm:min-h-64` atau `max-sm:aspect-video`, bukan `min-h-136`).
  - Pastikan judul utama dan tombol _"About Me"_ & _"Contact"_ langsung terlihat di viewport pertama tanpa perlu scroll pada resolusi ponsel standar (390px × 844px).

### 2. Standardisasi Kontras Warna Tombol Oranye (WCAG AA 4.5:1)

- **Files**:
  - `src/styles.css`
  - Komponen tombol CTA di seluruh modul (`src/components/ui/button.tsx`, dll.)
- **Tindakan**:
  - Terapkan salah satu dari dua solusi teruji:
    - **Opsi A (Rekomendasi - Teks Gelap pada Oranye)**: Berikan warna teks gelap pekat pada elemen dengan background `bg-(--brand-orange)`: `text-zinc-950 font-black` (Rasio: **7.20:1**, lolos kriteria AAA).
    - **Opsi B (Oranye Gelap untuk Teks Putih)**: Gunakan `--brand-orange-deep` (`#b54600` / `#a84000`) sebagai background tombol aksi utama yang bertuliskan teks putih (Rasio: **4.7:1**, lolos AA).

### 3. Tautan Teknologi yang Ramah Touchscreen & Keyboard

- **Files**:
  - `src/features/technologies/components/section/stack-categories-section.tsx`
  - `src/features/home/components/section/tech-marquee-section.tsx`
- **Tindakan**:
  - Hapus aturan `opacity-0` murni. Buat icon link eksternal selalu terlihat subtle (`opacity-60 hover:opacity-100 focus-visible:opacity-100`) atau bungkus nama teknologi dengan tag link langsung (`<a>`) dengan touch target minimal 44px.
  - Tambahkan label yang dapat dibaca screen reader (`sr-only` atau `aria-label="Kunjungi situs resmi [Tech] (buka di tab baru)"`).

### 4. Pencegahan Keyboard Trap pada Marquee

- **File**: `src/components/ui/marquee.tsx`
- **Tindakan**:
  - Pada iterasi duplikasi (`i > 0`), nonaktifkan seluruh interaktivitas keyboard:
    ```tsx
    <motion.div
      key={i}
      aria-hidden={i > 0}
      inert={i > 0 ? true : undefined}
      className={cn(...)}
    >
      {children}
    </motion.div>
    ```
  - Penggunaan atribut HTML5 `inert` secara otomatis mencegah tabbing keyboard dan screen reader menyentuh duplikasi ke-2 hingga ke-6.

### 5. Dukungan `prefers-reduced-motion`

- **Files**:
  - `src/components/react-bits/gooey-nav/gooey-nav.tsx`
  - `src/components/ui/marquee.tsx`
- **Tindakan**:
  - Gunakan hook `useReducedMotion()` dari `motion/react`:
    ```tsx
    const shouldReduceMotion = useReducedMotion()
    ```
  - Jika `shouldReduceMotion` aktif:
    - `Marquee`: Hentikan looping animasi atau gunakan horizontal scroll manual yang rapi.
    - `GooeyNav`: Nonaktifkan burst partikel; gunakan transisi fade sederhana tanpa pergeseran pegas (_spring physics_).

### 6. Semantik ARIA Tab pada "Beyond the Code"

- **File**: `src/features/about/components/section/beyond-the-code-section.tsx`
- **Tindakan**:
  - Tambahkan `role="tablist"` pada kontainer tombol navigasi sub-tab.
  - Tambahkan `role="tab"`, `id={`tab-${id}`}`, `aria-controls={`panel-${id}`}`, dan `aria-selected={activeBeyondTab === id}` pada masing-masing tombol.
  - Tambahkan `role="tabpanel"` dan `aria-labelledby={`tab-${activeBeyondTab}`}` pada kontainer konten tab aktif.

### 7. Perbaikan Hierarki Heading pada Resume

- **File**: `src/features/portfolio/pages/resume-page.tsx`
- **Tindakan**:
  - Ubah `SectionHeader` di halaman resume agar tidak memunculkan `<h2>` di atas `<h1>`, atau gunakan judul halaman tunggal `<h1>Resume — M. Adam Yudistira</h1>` di bagian atas dokumen dan gunakan `<h2>` untuk bagian-bagian berikutnya.

---

## 5. Security & RBAC Rules

- Tidak ada modifikasi aturan keamanan; perbaikan difokuskan pada standar Web Accessibility (WCAG 2.1 AA) dan Mobile UX.

---

## 6. Edge Cases & Invariants

- **Browser Tanpa Dukungan `inert`**: Tambahkan fallback CSS `pointer-events-none` dan pastikan link di dalam elemen `i > 0` memiliki `tabIndex={-1}`.
- **Dukungan Dark Mode**: Seluruh penyesuaian kontras warna harus divalidasi pada Light Mode (`#ffffff`) maupun Dark Mode (`#0f0f10`).

---

## 7. Acceptance Criteria & Verification Checklist

- [ ] Pada viewport mobile (lebar 375px–414px), judul utama dan tombol aksi terlihat tanpa terhalang ilustrasi raksasa.
- [ ] Rasio kontras teks pada tombol aksi oranye utama terukur ≥ 4.5:1 menggunakan kalkulator kontras.
- [ ] Pengguna touch screen dapat melihat dan mengetuk tautan eksternal pada kartu teknologi tanpa perlu simulasi hover.
- [ ] Menekan tombol Tab pada halaman beranda dan `/stack` tidak melewati link duplikat marquee berkali-kali.
- [ ] Saat simulasi `prefers-reduced-motion: reduce` aktif, marquee berhenti berputar dan animasi partikel gooey tidak meletup.
- [ ] Screen reader mengumumkan navigasi tab dan status aktif pada section _Beyond the Code_.
- [ ] Halaman `/resume` memiliki hierarki heading yang valid (`h1` tunggal diikuti `h2`).
- [ ] Lolos pengujian lint dan typecheck (`bun run check`).
