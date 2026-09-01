import { getLocale } from '#/paraglide/runtime'

export const projectsCopy = {
  en: {
    meta: {
      title: 'Projects',
      description:
        'A collection of projects built to solve real problems, academic tasks, and technical explorations by Winterest.',
    },
    list: {
      eyebrow: 'Projects',
      title: 'Projects',
      description:
        'A collection of projects built to solve real problems, academic tasks, and technical explorations.',
      open: 'Open',
      emptyTitle: 'No published projects yet.',
      emptyDescription:
        'I am still preparing the project stories for this page. Check back soon for more detailed work notes.',
      remote: 'git remote',
      sourceTitle: 'Follow the source code and development behind Winterest.',
      repository: 'Repository',
    },
    detail: {
      notFound: 'Project not found',
      notFoundTitle: 'This project does not exist yet.',
      back: 'Back to projects',
      projects: 'Projects',
      status: 'Status',
      category: 'Category',
      year: 'Year',
      scope: 'Scope',
      problem: 'Problem',
      goal: 'Goal',
      role: 'Role',
      architecture: 'Architecture',
      highlights: 'Highlights',
      decisions: 'Key Decisions',
      nextSteps: 'Next Steps',
      result: 'Result',
    },
  },
  id: {
    meta: {
      title: 'Project',
      description:
        'Koleksi proyek yang dibuat berdasarkan masalah nyata, tugas akademik, dan eksplorasi teknis oleh Winterest.',
    },
    list: {
      eyebrow: 'Project',
      title: 'Daftar Project',
      description:
        'Project yang dibuat berdasarkan masalah, tugas, dan eksplorasi teknologi yang pernah kutemui.',
      open: 'Buka',
      emptyTitle: 'Belum ada project yang dipublish.',
      emptyDescription:
        'Aku masih menyiapkan cerita project untuk halaman ini. Nanti akan ada catatan kerja yang lebih lengkap di sini.',
      remote: 'git remote',
      sourceTitle: 'Ikuti source code dan perkembangan di balik Winterest.',
      repository: 'Repository',
    },
    detail: {
      notFound: 'Project tidak ditemukan',
      notFoundTitle: 'Project ini belum ada.',
      back: 'Kembali ke project',
      projects: 'Project',
      status: 'Status',
      category: 'Kategori',
      year: 'Tahun',
      scope: 'Scope',
      problem: 'Masalah',
      goal: 'Tujuan',
      role: 'Peran',
      architecture: 'Arsitektur',
      highlights: 'Highlight',
      decisions: 'Keputusan Kunci',
      nextSteps: 'Langkah Berikutnya',
      result: 'Hasil',
    },
  },
} as const

export function getProjectsCopy() {
  const locale = getLocale() === 'id' ? 'id' : 'en'
  return projectsCopy[locale]
}
