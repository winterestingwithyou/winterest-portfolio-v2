import { getLocale } from '#/paraglide/runtime'

export const systemSetupCopy = {
  en: {
    migration: {
      badge: 'Database Migration Required',
      title: 'Database Migrations Required',
      description:
        'The portfolio database schema has not been applied yet. Run the D1 database migration to initialize all required tables before creating the owner account.',
      cardTitle: 'Run Migration via Terminal',
      cardSubtitle:
        'Execute the migration command in your terminal to initialize all database tables:',
      tabLocal: 'Local D1 SQLite',
      tabRemote: 'Remote Cloudflare D1',
      commandLocal: 'bun run db:migrate:local',
      commandRemote: 'bun run db:migrate:remote',
      stepsTitle: 'Migration Instructions',
      steps: [
        'Open your terminal in the project root directory.',
        'Run the migration command above to apply all D1 schema tables.',
        'Once migration completes, click Refresh below to proceed to Owner account setup.',
      ],
      refreshButton: 'Refresh Page',
      refreshingButton: 'Checking Database...',
      copyCommand: 'Copy command',
      copiedCommand: 'Copied!',
      freshTip: 'Tip: You can also run bun run db:fresh:local to reset and apply all migrations cleanly.',
    },
    owner: {
      badge: 'Setup Required',
      title: 'Owner Account Required',
      description:
        'This personal developer platform requires a primary owner account before the web application and dashboard can be accessed.',
      cardTitle: 'Create Owner via Terminal',
      cardSubtitle:
        'For security and single-owner integrity, run the interactive CLI command in your terminal:',
      tabLocal: 'Local D1 SQLite',
      tabRemote: 'Remote Cloudflare D1',
      commandLocal: 'bun run create-owner:local',
      commandRemote: 'bun run create-owner:remote',
      stepsTitle: 'Setup Instructions',
      steps: [
        'Open your terminal in the project root directory.',
        'Run the command above and follow the interactive prompts (Name, Email, Password).',
        'Once created, click the button below to reload and unlock the platform.',
      ],
      refreshButton: 'Refresh Page',
      refreshingButton: 'Checking Database...',
      copyCommand: 'Copy command',
      copiedCommand: 'Copied!',
      freshTip: undefined,
    },
  },
  id: {
    migration: {
      badge: 'Migrasi Database Diperlukan',
      title: 'Migrasi Database Diperlukan',
      description:
        'Skema database portfolio belum diterapkan. Jalankan migrasi database D1 terlebih dahulu untuk membuat semua tabel yang dibutuhkan sebelum membuat akun owner.',
      cardTitle: 'Jalankan Migrasi via Terminal',
      cardSubtitle:
        'Jalankan perintah migrasi di terminal untuk membuat seluruh tabel database:',
      tabLocal: 'D1 SQLite Lokal',
      tabRemote: 'Cloudflare D1 Remote',
      commandLocal: 'bun run db:migrate:local',
      commandRemote: 'bun run db:migrate:remote',
      stepsTitle: 'Petunjuk Migrasi',
      steps: [
        'Buka terminal di direktori utama (root) proyek ini.',
        'Jalankan perintah migrasi di atas untuk menerapkan seluruh tabel D1.',
        'Setelah migrasi selesai, klik Muat Ulang di bawah untuk lanjut ke langkah pembuatan Akun Owner.',
      ],
      refreshButton: 'Muat Ulang Halaman',
      refreshingButton: 'Memeriksa Database...',
      copyCommand: 'Salin perintah',
      copiedCommand: 'Tersalin!',
      freshTip: 'Tips: Anda juga dapat menjalankan bun run db:fresh:local untuk reset dan migrasi bersih.',
    },
    owner: {
      badge: 'Perlu Tindakan',
      title: 'Akun Owner Belum Dibuat',
      description:
        'Platform developer personal ini memerlukan satu akun owner utama sebelum aplikasi web dan dashboard dapat diakses.',
      cardTitle: 'Buat Akun Owner via Terminal',
      cardSubtitle:
        'Demi keamanan dan integritas aturan 1 owner, jalankan perintah CLI interaktif di terminal Anda:',
      tabLocal: 'D1 SQLite Lokal',
      tabRemote: 'Cloudflare D1 Remote',
      commandLocal: 'bun run create-owner:local',
      commandRemote: 'bun run create-owner:remote',
      stepsTitle: 'Petunjuk Langkah',
      steps: [
        'Buka terminal di direktori utama (root) proyek ini.',
        'Jalankan perintah di atas dan isi input interaktif (Nama, Email, Password).',
        'Setelah selesai dibuat, klik tombol di bawah untuk memuat ulang dan membuka aplikasi.',
      ],
      refreshButton: 'Muat Ulang Halaman',
      refreshingButton: 'Memeriksa Database...',
      copyCommand: 'Salin perintah',
      copiedCommand: 'Tersalin!',
      freshTip: undefined,
    },
  },
} as const

export function getSystemSetupCopy(type: 'migration' | 'owner') {
  const locale = getLocale() === 'id' ? 'id' : 'en'
  return systemSetupCopy[locale][type]
}
