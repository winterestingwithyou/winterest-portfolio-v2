import { getLocale } from '#/paraglide/runtime'

export const portfolioCopy = {
  en: {
    nav: {
      home: 'Home',
      about: 'About',
      projects: 'Projects',
      stack: 'Stack',
      contact: 'Contact',
    },
    footer: {
      eyebrow: 'Winterest Portfolio',
      description:
        'Personal portfolio platform for Winterest (M. Adam Yudistira). Built with a warm Cloudflare + Bun inspired visual language.',
      rights: 'All rights reserved.',
      email: 'Email Winterest',
    },
    notFound: {
      eyebrow: 'Not found',
      title: 'This Winterest page does not exist yet.',
      description:
        'The link may be old, mistyped, or still waiting to become a real route.',
      home: 'Back home',
    },
    resume: {
      meta: {
        title: 'Resume',
        description:
          'Printable, clean professional resume of M. Adam Yudistira (Winterest) — Education, skills, projects, and background.',
      },
      eyebrow: 'Resume',
      description:
        'Fullstack web developer focused on practical web systems, calm interfaces, and maintainable fullstack workflows.',
      longIntro:
        'I work around modern web architecture, edge-friendly apps, and developer tooling. Winterest is my public home for web systems, developer tools, and the projects I keep improving over time.',
      selectedWork: 'Selected Work',
      direction: 'Current Direction',
      stack: 'Stack',
    },
    timeline: [
      {
        period: 'Now',
        title: 'Personal portfolio foundation',
        description:
          'Shaping the site around who I am, what I build, and how people can explore my projects, developer tools, and technical work.',
      },
      {
        period: 'Next',
        title: 'Content workflow and dashboard',
        description:
          'Turning portfolio content into an owner-managed workflow with drafts, published entries, and cleaner editing screens.',
      },
      {
        period: 'Later',
        title: 'Richer media and visual identity',
        description:
          'Improving media handling, language support, and lightweight character visuals without making the site feel heavy.',
      },
    ],
  },
  id: {
    nav: {
      home: 'Beranda',
      about: 'Tentang',
      projects: 'Project',
      stack: 'Stack',
      contact: 'Kontak',
    },
    footer: {
      eyebrow: 'Winterest Portfolio',
      description:
        'Platform portfolio personal milik Winterest (M. Adam Yudistira). Dibangun dengan bahasa visual hangat yang terinspirasi Cloudflare + Bun.',
      rights: 'Semua hak dilindungi.',
      email: 'Email Winterest',
    },
    notFound: {
      eyebrow: 'Tidak ditemukan',
      title: 'Halaman Winterest ini belum ada.',
      description:
        'Link ini mungkin lama, salah ketik, atau masih menunggu menjadi route sungguhan.',
      home: 'Kembali ke beranda',
    },
    resume: {
      meta: {
        title: 'Resume',
        description:
          'Resume profesional M. Adam Yudistira (Winterest) — Pendidikan, keahlian, proyek, dan latar belakang teknis.',
      },
      eyebrow: 'Resume',
      description:
        'Fullstack web developer yang fokus pada sistem web praktis, interface yang tenang, dan workflow fullstack yang mudah dirawat.',
      longIntro:
        'Aku bekerja di sekitar arsitektur web modern, aplikasi edge-friendly, dan developer tooling. Winterest adalah rumah publikku untuk sistem web, developer tools, dan project yang terus kuperbaiki dari waktu ke waktu.',
      selectedWork: 'Karya Pilihan',
      direction: 'Arah Saat Ini',
      stack: 'Stack',
    },
    timeline: [
      {
        period: 'Sekarang',
        title: 'Fondasi portfolio personal',
        description:
          'Membentuk situs di sekitar siapa Winterest, apa yang dibangun, dan bagaimana orang bisa menjelajahi project, developer tools, dan karya teknisnya.',
      },
      {
        period: 'Berikutnya',
        title: 'Workflow konten dan dashboard',
        description:
          'Mengubah konten portfolio menjadi workflow owner-managed dengan draft, published entry, dan layar editing yang lebih bersih.',
      },
      {
        period: 'Nanti',
        title: 'Media dan visual identity yang lebih kaya',
        description:
          'Memperbaiki media handling, dukungan bahasa, dan visual karakter ringan tanpa membuat situs terasa berat.',
      },
    ],
  },
} as const

export function getPortfolioCopy() {
  const locale = getLocale() === 'id' ? 'id' : 'en'
  return portfolioCopy[locale]
}
