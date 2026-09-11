# RFC: Multi-Row (3-Row) Ultimate Tech Marquee for Homepage

- **Feature ID**: `feat-home-three-row-marquee`
- **Date**: 2026-09-11
- **Status**: `Draft`
- **Target Routes**:
  - `/` (Homepage — `TechMarqueeSection`)
- **Target Modules**:
  - `src/features/home/components/section/tech-marquee-section.tsx`

---

## 1. Overview & Problem Statement

Seksi _Ultimate Tech Stack_ di Homepage (`/`) saat ini hanya menampilkan **1 baris marquee**.

### Background & Needs

1. **Visual Density & Polish**: Tampilan satu baris terasa sepi dan kurang memberikan kesan dinamis untuk sebuah portofolio berorientasi _technical platform_.
2. **Parallax Motion**: Mengembangkan marquee menjadi **3 baris horizontal** dengan arah pergerakan bolak-balik (_alternating reverse_) dan variasi kecepatan menciptakan kedalaman visual (_layered parallax_) yang modern dan hidup.
3. **Smart Data Partitioning**: Item teknologi yang ada harus didistribusikan secara proporsional ke 3 baris tersebut agar tidak terlihat monoton atau repetitif.

### Objectives

1. Mengembangkan seksi marquee di Homepage dari 1 baris menjadi **3 baris bertingkat** (_stacked 3-row layout_).
2. Menerapkan arah gerakan bolak-balik:
   - **Baris 1**: Arah normal (kanan ke kiri, `reverse={false}`), durasi kecepatan `32s`.
   - **Baris 2**: Arah berlawanan (kiri ke kanan, `reverse={true}`), durasi kecepatan `42s` (lebih tenang).
   - **Baris 3**: Arah normal (kanan ke kiri, `reverse={false}`), durasi kecepatan `36s`.
3. Menerapkan algoritma **Smart Partitioning**:
   - Jika jumlah teknologi `ultimateTechs >= 6`: bagi rata menjadi 3 grup terpisah (_balanced 3-way split_).
   - Jika `ultimateTechs < 6`: setiap baris memuat seluruh item namun dirotasi posisi awalnya (_circular index offset_), sehingga tidak ada baris yang kosong.
4. Mempertahankan overlay gradient fade kiri/kanan dan interaktivitas `pauseOnHover` di seluruh baris.

---

## 2. Database & Storage Contract (D1 & R2)

Perubahan ini murni pada layer UI presentasional komponen React. **Tidak ada perubahan pada skema database D1 maupun penyimpanan R2**.

Data tetap diambil dari query yang sudah ada: `getPublicUltimateStack()`.

---

## 3. Server & API Contracts (Zod & ofetch)

Tidak ada endpoint server API baru maupun modifikasi skema Zod.

---

## 4. UI & State Architecture

### 1. Smart Partitioning Helper

Fungsi utilitas murni untuk mendistribusikan item teknologi ke dalam 3 baris:

```ts
export function partitionMarqueeItems<T>(items: T[]): [T[], T[], T[]] {
  if (items.length === 0) {
    return [[], [], []]
  }

  // Jika item cukup banyak (>= 6), bagi rata menjadi 3 kumpulan
  if (items.length >= 6) {
    const chunkSize = Math.ceil(items.length / 3)
    const row1 = items.slice(0, chunkSize)
    const row2 = items.slice(chunkSize, chunkSize * 2)
    const row3 = items.slice(chunkSize * 2)

    // Pastikan row 3 tidak kosong jika pembagian ganjil
    if (row3.length === 0) {
      return [row1, row2, items]
    }
    return [row1, row2, row3]
  }

  // Jika item < 6, lakukan circular rotation agar tiap baris punya variasi urutan
  const row1 = [...items]
  const row2 = [...items.slice(1), ...items.slice(0, 1)]
  const row3 = [...items.slice(2), ...items.slice(0, 2)]
  return [row1, row2, row3]
}
```

### 2. Layout Structure in `TechMarqueeSection` (`src/features/home/components/section/tech-marquee-section.tsx`)

Struktur 3 baris vertikal dengan jarak proporsional dan gradient fade kiri/kanan yang menaungi seluruh seksi:

```tsx
const [row1, row2, row3] = partitionMarqueeItems(ultimateTechs)

return (
  <div className="relative mt-8 w-full overflow-hidden py-2">
    {/* Ambient Gradient Overlays */}
    <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-16 bg-linear-to-r from-(--brand-bg) to-transparent sm:w-28" />
    <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-16 bg-linear-to-l from-(--brand-bg) to-transparent sm:w-28" />

    <div className="flex flex-col gap-3 sm:gap-4">
      {/* Row 1: Forward (32s) */}
      <Marquee pauseOnHover className="py-1 [--duration:32s]" repeat={5}>
        {row1.map((tech) => (
          <TechMarqueeCard key={`row1-${tech.id}`} {...tech} />
        ))}
      </Marquee>

      {/* Row 2: Reverse (42s) */}
      <Marquee
        pauseOnHover
        reverse
        className="py-1 [--duration:42s]"
        repeat={5}
      >
        {row2.map((tech) => (
          <TechMarqueeCard key={`row2-${tech.id}`} {...tech} />
        ))}
      </Marquee>

      {/* Row 3: Forward (36s) */}
      <Marquee pauseOnHover className="py-1 [--duration:36s]" repeat={5}>
        {row3.map((tech) => (
          <TechMarqueeCard key={`row3-${tech.id}`} {...tech} />
        ))}
      </Marquee>
    </div>
  </div>
)
```

---

## 5. Security & RBAC Rules

Komponen bersifat murni presentasional publik tanpa melibatkan data sensitif, sesi pengguna, maupun otorisasi role khusus.

---

## 6. Edge Cases & Invariants

1. **Empty Data (`ultimateTechs.length === 0`)**: Tetap menampilkan empty state yang sudah ada (`emptyUltimateTitle` / `emptyUltimateDescription`).
2. **Small Dataset (1 - 5 items)**: Circular rotation memastikan ketiga baris tetap bergerak mulus tanpa baris kosong. Nilai `repeat={5}` menjamin tidak ada celah kosong pada layar lebar (ultrawide / 4K).
3. **Motion Sensitivity (`prefers-reduced-motion`)**: Tetap dihormati oleh Framer Motion / Motion One secara otomatis.
4. **Card Height Uniformity**: Mengintegrasikan `TechMarqueeCard` dari spesifikasi `2026-09-fix-marquee-card-uniform-height.md` sehingga ketiga baris memiliki ketinggian kartu yang presisi dan rapi.

---

## 7. Acceptance Criteria & Verification Checklist

- [ ] Seksi `TechMarqueeSection` di Homepage menampilkan 3 baris marquee secara bertingkat.
- [ ] Baris 1 bergerak ke arah normal, Baris 2 bergerak ke arah sebaliknya (`reverse`), dan Baris 3 bergerak ke arah normal.
- [ ] Ketiga baris memiliki durasi kecepatan yang sedikit berbeda untuk efek parallax (32s, 42s, 36s).
- [ ] Algoritma `partitionMarqueeItems` membagi item dengan seimbang dan menangani kondisi dataset kecil (< 6 item) dengan aman.
- [ ] Hover pada masing-masing baris menghentikan animasi (_pause on hover_) secara independen.
- [ ] Tampilan responsif di mobile dan desktop dengan vertical gap yang proporsional (`gap-3 sm:gap-4`).
- [ ] Typecheck lulus tanpa error (`bun run check`).
- [ ] Linter & formatter bersih (`bun run lint`, `bun run format`).
- [ ] Production build berhasil (`bun run build`).
- [ ] Knowledge graph diperbarui (`graphify update .`).
