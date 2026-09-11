# RFC: Standardize Marquee Tech Card Uniform Height Across Public Pages

- **Feature ID**: `fix-marquee-card-uniform-height`
- **Date**: 2026-09-11
- **Status**: `Implemented`
- **Target Routes**:
  - `/` (Homepage — `TechMarqueeSection`)
  - `/stack` (Tech Stack Page — `UltimateStackSection` & `StackCategoriesSection`)
- **Target Modules**:
  - `src/features/technologies/components/tech-marquee-card.tsx`
  - `src/features/home/components/section/tech-marquee-section.tsx`
  - `src/features/technologies/components/section/ultimate-stack-section.tsx`
  - `src/features/technologies/components/section/stack-categories-section.tsx`

---

## 1. Overview & Problem Statement

Pada deretan animasi kartu teknologi berjalan (_marquee cards_) di Homepage (`/`) dan halaman Stack (`/stack`), item teknologi yang memiliki nama panjang (seperti _"Cloudflare Workers"_) terbungkus menjadi 2 baris (_two-line wrap_), sedangkan item lain (seperti _"Drizzle ORM"_, _"TypeScript"_, _"TanStack Start"_) hanya 1 baris.

### Root Cause Analysis

1. **Unconstrained Dynamic Height**: Elemen kartu saat ini tidak memiliki batasan tinggi seragam (`h-[...]` atau slot teks bertinggi tetap). Ketinggian kartu sepenuhnya bergantung pada konten dinamis (`h-auto`).
2. **Uneven Baseline & Visual Jitter**: Kartu dengan nama 2 baris menjadi ~24px lebih tinggi daripada kartu dengan nama 1 baris. Ketika dipadukan dengan `items-center` pada container Marquee, kartu 2 baris terlihat menonjol keluar di bagian atas dan bawah, merusak estetika _Flat Precision Architecture_ yang rapi.
3. **Code Duplication**: Markup kartu marquee saat ini terduplikasi di 3 file terpisah (`tech-marquee-section.tsx`, `ultimate-stack-section.tsx`, dan `stack-categories-section.tsx`) dengan inkonsistensi styling padding (`p-5` vs `p-6`) dan gap.

### Objectives

1. **Pixel-Perfect Uniform Height**: Menyamakan tinggi seluruh kartu marquee agar memiliki dimensi tinggi identik, terlepas dari apakah nama teknologi terdiri dari 1 baris atau 2 baris.
2. **Reserved Title Slot**: Menyediakan slot flexbox judul dengan `min-height` khusus (mampu menampung hingga 2 baris teks secara vertikal terpusat), sehingga posisi ikon dan baseline teks selalu sejajar antar kartu.
3. **Reusable Component Architecture**: Mengekstrak komponen bersama `TechMarqueeCard` di `src/features/technologies/components/tech-marquee-card.tsx` yang mendukung varian `'default'` dan `'ultimate'`.
4. **Site-wide Consistency**: Menerapkan standarisasi ini di seluruh seksi marquee: `TechMarqueeSection` (Homepage), `UltimateStackSection` (Stack page), dan `StackCategoriesSection` (Stack page).

---

## 2. Database & Storage Contract (D1 & R2)

Perubahan ini murni pada layer UI presentasional komponen React. **Tidak ada perubahan pada skema database D1 maupun penyimpanan R2**.

---

## 3. Server & API Contracts (Zod & ofetch)

Tidak ada penambahan atau perubahan endpoint server API maupun skema validasi Zod.

---

## 4. UI & State Architecture

### 1. New Component: `TechMarqueeCard` (`src/features/technologies/components/tech-marquee-card.tsx`)

Mengekstrak kartu marquee modular dengan varian `'default'` dan `'ultimate'`:

```tsx
interface TechMarqueeCardProps {
  name: string
  icon?: string | null
  color?: string | null
  url?: string | null
  variant?: 'default' | 'ultimate'
}
```

#### Spesifikasi Dimensi & Layout:

- **Variant `'default'`**:
  - Dimensi kontainer: `w-44 sm:w-52 h-[160px] sm:h-[176px]`
  - Ikon: `size-12 sm:size-14`
  - Slot Judul: `min-h-[2.5rem] sm:min-h-[2.75rem] flex items-center justify-center`
  - Font: `text-sm sm:text-base font-bold text-(--brand-ink)`
  - Border: `border border-(--brand-line) hover:border-(--brand-orange)`
- **Variant `'ultimate'`**:
  - Dimensi kontainer: `w-52 sm:w-60 h-[190px] sm:h-[208px]`
  - Ikon: `size-14 sm:size-18`
  - Badge: Ikon `Zap` di pojok kanan atas dengan latar orange
  - Slot Judul: `min-h-[2.75rem] sm:min-h-[3rem] flex items-center justify-center`
  - Font: `text-base sm:text-lg font-extrabold text-(--brand-ink)`
  - Border: `border border-(--brand-orange)/40 hover:border-(--brand-orange)`

### 2. Implementation in Sections

#### `TechMarqueeSection` (`src/features/home/components/section/tech-marquee-section.tsx`):

Mengganti inline JSX kartu dengan:

```tsx
<TechMarqueeCard
  key={tech.id}
  name={tech.name}
  icon={tech.icon}
  color={tech.color}
  url={tech.url}
  variant="default"
/>
```

#### `UltimateStackSection` (`src/features/technologies/components/section/ultimate-stack-section.tsx`):

```tsx
<TechMarqueeCard
  key={tech.id}
  name={tech.name}
  icon={tech.icon}
  color={tech.color}
  url={tech.url}
  variant="ultimate"
/>
```

#### `StackCategoriesSection` (`src/features/technologies/components/section/stack-categories-section.tsx`):

```tsx
<TechMarqueeCard
  key={tech.id}
  name={tech.name}
  icon={tech.icon}
  color={tech.color}
  url={tech.url}
  variant="default"
/>
```

---

## 5. Security & RBAC Rules

Komponen bersifat murni presentasional publik tanpa melibatkan data sensitif, sesi, atau proteksi role khusus.

---

## 6. Edge Cases & Invariants

1. **Very Long Tech Names (3+ words)**: Teks diizinkan wrap hingga 2 baris tanpa overflow. Slot `min-h` memastikan kartu dengan 1 baris tidak menjadi lebih pendek.
2. **Missing External URL**: Ikon tautan eksternal bersifat kondisional. Ketika tidak ada URL, tata letak teks judul tetap terpusat sempurna secara horizontal dan vertikal.
3. **Hover Transform**: Animasi `hover:-translate-y-0.5` dan `hover:border-(--brand-orange)` tetap mulus tanpa menyebabkan kartu memotong batas overflow container marquee.

---

## 7. Acceptance Criteria & Verification Checklist

- [x] Komponen baru `TechMarqueeCard` dibuat di `src/features/technologies/components/tech-marquee-card.tsx` dengan varian `default` dan `ultimate`.
- [x] Tinggi seluruh kartu marquee di Homepage seragam sempurna (tinggi kartu "Cloudflare Workers" setara dengan "Drizzle ORM", "TypeScript", dll.).
- [x] Slot judul memiliki ketinggian yang konsisten dengan teks 1 baris maupun 2 baris terpusat secara vertikal.
- [x] Komponen kartu di `TechMarqueeSection`, `UltimateStackSection`, dan `StackCategoriesSection` berhasil direfaktor menggunakan `TechMarqueeCard`.
- [x] Typecheck lulus tanpa error (`bun run check`).
- [x] Linter & formatter bersih (`bun run lint`, `bun run format`).
- [x] Production build berhasil (`bun run build`).
- [x] Knowledge graph diperbarui (`graphify update .`).
