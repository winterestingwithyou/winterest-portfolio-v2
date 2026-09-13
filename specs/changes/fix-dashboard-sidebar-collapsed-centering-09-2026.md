# RFC: Fix Dashboard Sidebar Collapsed Items Center Alignment

- **Feature ID**: `fix-sidebar-collapsed-centering`
- **Date**: `2026-09-13`
- **Status**: `Draft`
- **Target Routes**:
  - Dashboard Shell: `/dashboard/*`
- **Target Modules**:
  - `src/components/dashboard/dashboard-sidebar.tsx`

---

## 1. Overview & Problem Statement

Pada saat sidebar CMS dalam kondisi collapsed (`collapsible="icon"`, lebar 48px / `3rem`), seluruh item menu navigasi (Overview, Pages, Projects, Stack, Media, Social, Users, Settings, Account, Back to Site, hingga Avatar) mengalami pergeseran posisi (off-center) yang condong menempel ke tepi kanan (hugging the right border) dengan jarak kosong berlebih di sisi kiri (16px di kiri vs 0px di kanan).

### Root Cause Analysis

1. **Double Padding Horizontal di `SidebarContent`**:
   - `SidebarContent` di `dashboard-sidebar.tsx` memiliki kelas `className="px-2 py-1 no-scrollbar"`, yang memberikan `padding-left: 8px` dan `padding-right: 8px`.
   - Di dalamnya, setiap `<SidebarGroup>` dari `sidebar.tsx` telah memiliki styling bawaan `p-2` (`padding: 8px`).
   - Akibatnya, total horizontal padding menjadi kumulatif: `8px + 8px = 16px` di sisi kiri dan kanan.
2. **Kalkulasi Lebar Elemen saat Collapsed**:
   - Lebar container sidebar saat collapsed adalah 48px (`--sidebar-width-icon: 3rem`).
   - Tombol menu (`SidebarMenuButton`) memiliki styling bawaan `group-data-[collapsible=icon]:size-8!` (lebar fixed 32px).
   - Dengan padding kiri `16px`, posisi awal tombol dimulai pada `x = 16px`. Karena lebarnya 32px, batas kanan tombol berada persis di `16px + 32px = 48px` (menabrak border kanan sidebar), menghasilkan jarak 16px di kiri dan 0px di kanan.
3. **SidebarHeader Logo Over-padding & Size**:
   - `SidebarHeader` menggunakan `p-3` (12px), dan kotak logo berukuran `size-9` (36px). Hal ini menyebabkan logo juga terdorong ke kanan saat collapsed (12px + 36px = 48px).
4. **Collapsible Chevron Icon Leak**:
   - Ikon `<ChevronDown />` pada item menu grup collapsible (Pages) tidak disembunyikan saat collapsed (`group-data-[collapsible=icon]:hidden`), sehingga berpotensi merusak kalkulasi flex di dalam tombol berukuran 32px.

### Constraint

> [!IMPORTANT]
> Sesuai arahan teknis, file dasar UI primitif `src/components/ui/sidebar.tsx` **TIDAK BOLEH DISENTUH/DIUBAH**. Seluruh perbaikan dilakukan melalui penyesuaian kelas utilitas Tailwind pada `src/components/dashboard/dashboard-sidebar.tsx`.

---

## 2. Database & Storage Contract (D1 & R2)

Perbaikan ini merupakan perbaikan visual antarmuka (UI Bugfix) dan tidak memerlukan perubahan skema database maupun penyimpanan aset.

- **New Tables**: Tidak ada
- **Modified Tables**: Tidak ada
- **Indexes & Constraints**: Tidak ada
- **R2 Storage**: Tidak ada

---

## 3. Server & API Contracts (Zod & ofetch)

Tidak ada endpoint atau kontrak server yang terdampak.

| Endpoint | Method | Role | Turnstile | Purpose |
| :------- | :----- | :--- | :-------- | :------ |
| N/A      | N/A    | N/A  | N/A       | N/A     |

---

## 4. UI & State Architecture

### Target File: `src/components/dashboard/dashboard-sidebar.tsx`

1. **`SidebarHeader` Alignment & Logo Size**:
   - Tambahkan `group-data-[collapsible=icon]:p-2 group-data-[collapsible=icon]:items-center` pada `<SidebarHeader className="p-3">`.
   - Ubah ukuran kotak logo menjadi `size-9 group-data-[collapsible=icon]:size-8` agar saat collapsed dimensinya persis 32px (sejajar dengan seluruh icon menu 32px).
2. **`SidebarContent` Double Padding Elimination**:
   - Ubah `className="px-2 py-1 no-scrollbar"` menjadi `className="px-2 group-data-[collapsible=icon]:px-0 py-1 no-scrollbar"`.
   - Saat collapsed, `px-0` menghilangkan padding ekstra sehingga hanya tersisa `p-2` (8px) dari `SidebarGroup`.
   - Kalkulasi presisi: `48px (lebar) - 8px (kiri) - 32px (tombol) - 8px (kanan) = 0px`. Tombol otomatis berjarak tepat 8px dari kiri dan 8px dari kanan (Centered).
3. **`SidebarMenu` & `SidebarMenuItem` Centering Guarantee**:
   - Tambahkan `group-data-[collapsible=icon]:items-center` pada setiap `<SidebarMenu>`.
   - Tambahkan `group-data-[collapsible=icon]:flex group-data-[collapsible=icon]:justify-center` pada `<SidebarMenuItem>` untuk menjamin posisi tombol selalu terkunci di sumbu tengah horizontal.
4. **Collapsible Chevron Hiding**:
   - Tambahkan `group-data-[collapsible=icon]:hidden` pada ikon `<ChevronDown>` di menu Pages agar tidak memicu overflow saat tombol mengecil menjadi 32px.

---

## 5. Security & RBAC Rules

- Tidak ada perubahan otorisasi atau aturan keamanan.
- Aksesibilitas tooltip navigasi tetap aktif saat sidebar dalam kondisi collapsed (`TooltipContent side="right"`).

---

## 6. Edge Cases & Invariants

1. **Expanded State Unchanged**:
   - Saat sidebar di-expand kembali (`state === 'expanded'`), padding dan ukuran kembali normal (`px-2` pada konten, `p-3` pada header, logo `size-9`, dan label teks terlihat) tanpa regresi layout.
2. **Double Border Protection**:
   - Sidebar tetap memiliki garis hairline 1px di kanan (`border-r border-sidebar-border`) tanpa mengalami clipping atau overlap konten.
3. **Submenu Persistence**:
   - Ketika collapsed, menu sub-halaman Pages tetap tersembunyi berkat `SidebarMenuSub` default (`group-data-[collapsible=icon]:hidden`), dan tooltip tetap informatif saat icon di-hover.

---

## 7. Acceptance Criteria & Verification Checklist

- [ ] File `src/components/ui/sidebar.tsx` **tidak dimodifikasi sama sekali** (`git diff src/components/ui/sidebar.tsx` bersih).
- [ ] Tombol menu di dalam `SidebarContent` (Overview, Pages, Projects, Stack, Media, Social, Users, Settings, Account, Back to Site) berada persis di tengah secara simetris saat sidebar dalam keadaan collapsed (jarak 8px dari sisi kiri dan 8px dari sisi kanan).
- [ ] Kotak logo `Sparkles` di `SidebarHeader` mengecil rapi ke 32px (`size-8`) saat collapsed dan berada di sumbu tengah yang sama dengan icon menu di bawahnya.
- [ ] Ikon dropdown chevron pada item Pages tidak tampak atau mengganggu saat collapsed.
- [ ] Tampilan saat expanded tetap konsisten dengan padding yang proporsional dan tidak ada teks/icon yang terpotong.
- [ ] TypeScript check lolos tanpa error (`bun run typecheck`).
- [ ] Linting bersih (`bun run lint`).
- [ ] Knowledge graph disinkronkan (`graphify update .`).
