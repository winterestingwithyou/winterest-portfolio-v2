# RFC: Fix Mobile Header Responsive Overflow on Authenticated State

- **Feature ID**: `fix-mobile-header-dashboard-responsive`
- **Date**: 2026-09-11
- **Status**: `Draft`
- **Target Routes**:
  - Global Header (`src/components/header.tsx`) across all public pages
- **Target Modules**:
  - `src/components/header.tsx`
  - `src/features/portfolio/copy.ts`

---

## 1. Overview & Problem Statement

Pada tampilan layar mobile (viewport smartphone < 640px hingga tablet < 768px), ketika pengguna dalam keadaan **sudah login (authenticated session)**, topbar header mengalami masalah kepadatan berlebih (_crowded / width overflow_).

### Root Cause Analysis

1. **Topbar Element Density**: Pada kondisi normal (belum login), topbar mobile hanya memuat 4 cluster: Brand Pill (`Winterest`), `ParaglideLocaleSwitcher`, `ThemeToggle`, dan Hamburger Menu button.
2. **Unconstrained Dashboard Icon on Mobile**: Komponen `DashboardLink` saat ini tidak memiliki batasan breakpoint (`className={iconLinkClasses}` tanpa `hidden md:inline-grid`). Akibatnya, saat sesi login aktif, ikon ke-5 (Dashboard) dipaksa muncul di topbar.
3. **Viewport Width Pressure**: Pada layar dengan lebar 360px - 390px, kombinasi Brand Logo (~135px) + Dashboard Icon (36px) + Locale Dropdown (~68px) + Theme Toggle (~44px) + Hamburger (38px) beserta gap dan padding menghasilkan total lebar ~345px+, yang melebihi atau menekan batas horizontal layar sehingga header tampak terlalu lebar atau meluber.

### Objectives & Core Principles

1. **Clean Mobile Topbar**: Sembunyikan `DashboardLink` dari topbar pada seluruh viewport mobile dan tablet yang menggunakan hamburger menu (`hidden md:inline-grid`), sehingga topbar kembali ramping dan konsisten.
2. **Prominent Mobile Drawer Card**: Saat pengguna telah login dan membuka hamburger menu drawer (`mobileNavOpen`), tampilkan kartu/banner akses Dashboard khusus di bagian paling atas drawer sebelum list tautan navigasi publik.
3. **Strict Zero-Login-Button Policy**: Jika pengguna **belum login**, **JANGAN PERNAH** menampilkan tombol, ikon, atau tautan apapun yang mengarah ke `/login`. Halaman login tetap hanya bisa diakses secara privat dengan mengetikkan URL secara manual di browser.
4. **Bilingual Copywriting**: Sediakan token teks terlokalisasi di `src/features/portfolio/copy.ts` untuk judul dan deskripsi kartu dashboard di mobile drawer.

---

## 2. Database & Storage Contract (D1 & R2)

Perubahan ini sepenuhnya berada pada layer UI presentasional dan routing client. **Tidak ada perubahan pada skema D1 maupun bucket R2**.

---

## 3. Server & API Contracts (Zod & ofetch)

Tidak ada perubahan atau penambahan endpoint server API. Pengecekan sesi tetap memanfaatkan modul klien Better Auth:

- `authClient.getSession()` / `authClient.useSession()` dari `#/lib/auth-client`.

---

## 4. UI & State Architecture

### 1. Header Topbar Modification (`src/components/header.tsx`)

Ubah `DashboardLink` di cluster kontrol topbar agar hanya muncul pada desktop breakpoint (`md` ke atas):

```tsx
function DashboardLink({ hasSession }: { hasSession: boolean }) {
  if (!hasSession) {
    return null
  }

  return (
    <Link
      to="/dashboard"
      className={cn(iconLinkClasses, 'hidden md:inline-grid')}
    >
      <span className="sr-only">Dashboard</span>
      <LayoutDashboard aria-hidden="true" className="size-4" />
    </Link>
  )
}
```

### 2. Mobile Drawer Dashboard Card (`MobileDashboardCard`)

Di dalam drawer navigasi mobile (`id="mobile-navigation"`), saat `hasSession === true`, render kartu akses khusus di posisi paling atas:

```tsx
{
  hasSession && (
    <Link
      to="/dashboard"
      onClick={() => setMobileNavOpen(false)}
      className={cn(
        'group mb-2 flex items-center justify-between gap-3 rounded-xl',
        'border border-[color-mix(in_srgb,var(--brand-orange)_40%,var(--brand-line))]',
        'bg-[color-mix(in_srgb,var(--brand-orange-soft)_22%,var(--surface-strong))] p-3.5',
        'transition-all duration-180 hover:border-(--brand-orange) hover:bg-[color-mix(in_srgb,var(--brand-orange-soft)_36%,var(--surface-strong))]',
      )}
    >
      <div className="flex items-center gap-3">
        <div className="grid size-9 shrink-0 place-items-center rounded-lg bg-(--brand-orange) text-white shadow-xs">
          <LayoutDashboard aria-hidden="true" className="size-4.5" />
        </div>
        <div>
          <div className="text-sm font-bold text-(--brand-ink) group-hover:text-(--brand-orange-deep)">
            {copy.nav.dashboard}
          </div>
          <div className="text-xs text-(--brand-muted)">
            {copy.nav.dashboardDesc}
          </div>
        </div>
      </div>
      <ChevronRight
        aria-hidden="true"
        className="size-4 text-(--brand-muted) transition-transform group-hover:translate-x-0.5 group-hover:text-(--brand-orange)"
      />
    </Link>
  )
}
```

### 3. Shared Session State in Header

Untuk mencegah pemanggilan berulang `authClient.getSession()` pada topbar dan drawer, lakukan pengecekan sesi terpusat di level `Header()` component atau gunakan state yang di-share.

### 4. Bilingual Copywriting Tokens (`src/features/portfolio/copy.ts`)

Tambahkan token berikut di `portfolioCopy`:

- **English (`en.nav`)**:
  - `dashboard`: `'Dashboard CMS'`
  - `dashboardDesc`: `'Access content management panel'`
- **Indonesian (`id.nav`)**:
  - `dashboard`: `'Dashboard CMS'`
  - `dashboardDesc`: `'Akses panel manajemen konten'`

---

## 5. Security & RBAC Rules

1. **Zero Login Discovery**: Saat tidak ada sesi pengguna aktif (`!hasSession`), komponen tidak merender kartu drawer maupun ikon topbar. Tidak ada indikasi keberadaan portal `/login` di UI publik.
2. **Client Route Guard**: Klik pada tautan `/dashboard` akan melalui route guard server & client di `src/routes/dashboard/route.tsx`, memastikan sesi valid sebelum data dashboard dirender.

---

## 6. Edge Cases & Invariants

1. **Ultra Small Screens (≤ 360px)**: Dengan disembunyikannya ikon dashboard dari topbar mobile, total lebar kontrol kanan berkurang 40px+, memberikan ruang yang cukup bagi Brand Pill tanpa resiko horizontal overflow.
2. **Session Logout**: Jika pengguna melakukan logout dari tab lain atau dashboard, state sesi di header diperbarui secara aman tanpa meninggalkan elemen antarmuka yang rusak.
3. **Drawer Auto-Close**: Saat pengguna menekan kartu dashboard pada mobile drawer, drawer otomatis menutup (`setMobileNavOpen(false)`) sebelum transisi rute.

---

## 7. Acceptance Criteria & Verification Checklist

- [ ] Ikon `DashboardLink` di topbar header tersembunyi pada viewport mobile dan tablet (`hidden md:inline-grid`).
- [ ] Pada viewport desktop (`>= 768px`), ikon `DashboardLink` tetap tampil normal di samping switcher bahasa dan tema ketika sesi aktif.
- [ ] Di dalam mobile drawer (`mobileNavOpen`), kartu `Dashboard CMS` tampil di posisi paling atas dengan gaya visual Cloudflare orange saat sesi aktif.
- [ ] Ketika belum login (`hasSession === false`), TIDAK ADA tombol login atau link ke `/login` baik di topbar maupun di dalam drawer.
- [ ] Copywriting bilingual di `src/features/portfolio/copy.ts` terdaftar dengan benar untuk `en` dan `id`.
- [ ] Verifikasi responsivitas pada viewport smartphone (360px, 390px, 412px) memastikan header tidak mengalami horizontal scroll / overflow.
- [ ] Typecheck lulus tanpa error (`bun run check`).
- [ ] Linter & formatter bersih (`bun run lint`, `bun run format`).
- [ ] Production build berhasil (`bun run build`).
- [ ] Knowledge graph diperbarui (`graphify update .`).
