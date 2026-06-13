import { getLocale } from '#/paraglide/runtime'

export const siteProfile = {
  name: 'Winterest',
  handle: 'winterest',
  domain: 'winterest.tech',
  role: 'Fullstack web developer',
  location: 'Indonesia',
  intro:
    'I build practical fullstack web systems, thoughtful interfaces, and small experiments around modern developer workflows.',
  longIntro:
    'I work around modern web architecture, edge-friendly apps, and developer tooling. Winterest is my public home for case studies, notes, experiments, and the systems I keep improving over time.',
  githubUrl: 'https://github.com/winterest',
  repoUrl: 'https://github.com/winterest/winterest-portfolio-v2',
  contactEmail: 'hello@winterest.tech',
}

export const portfolioStats = [
  { label: 'Focus', value: 'Fullstack web' },
  { label: 'Style', value: 'Practical + polished' },
  { label: 'Base', value: 'Indonesia' },
]

export const principles = [
  {
    title: 'Build useful systems',
    description:
      'I like web work that solves real problems first: clear flows, readable code, and features that are easy to maintain after the first release.',
  },
  {
    title: 'Keep the interface calm',
    description:
      'A good interface should feel focused and fast. Visual polish matters, but it should support the content instead of stealing the room.',
  },
  {
    title: 'Stay curious in public',
    description:
      'This site is also a place to document experiments, decisions, and lessons while I keep learning across the modern web stack.',
  },
]

export const stackGroups = [
  {
    title: 'Runtime and Edge',
    description:
      'Tools I use to keep local iteration fast while keeping deployment close to the edge.',
    items: ['Bun', 'Cloudflare Workers', 'Wrangler', 'Vite'],
  },
  {
    title: 'Fullstack UI',
    description:
      'A practical React stack for routing, server state, forms, tables, and shared UI state.',
    items: [
      'TanStack Start',
      'TanStack Router',
      'TanStack Query',
      'TanStack Form',
      'TanStack Table',
      'TanStack Store',
    ],
  },
  {
    title: 'Data and Auth',
    description:
      'The boring-but-important layer for content, sessions, validation, and secure dashboard work.',
    items: ['Drizzle ORM', 'Cloudflare D1', 'Better Auth', 'Zod', 'T3Env'],
  },
  {
    title: 'Design System',
    description:
      'Composable UI primitives shaped into a warm orange, dark-mode-friendly Winterest visual language.',
    items: ['Tailwind CSS v4', 'Radix UI', 'shadcn/ui style', 'lucide-react'],
  },
] as const

export const timeline = [
  {
    period: 'Now',
    title: 'Personal portfolio foundation',
    description:
      'Shaping the site around who I am, what I build, and how people can explore my projects, notes, and experiments.',
  },
  {
    period: 'Next',
    title: 'Content workflow and dashboard',
    description:
      'Turning project, writing, and lab content into an owner-managed workflow with drafts, published entries, and cleaner editing screens.',
  },
  {
    period: 'Later',
    title: 'Richer writing, media, and visual identity',
    description:
      'Improving long-form content, media handling, language support, and lightweight character visuals without making the site feel heavy.',
  },
] as const

const idPortfolioStats = [
  { label: 'Fokus', value: 'Web fullstack' },
  { label: 'Gaya', value: 'Praktis + rapi' },
  { label: 'Basis', value: 'Indonesia' },
] as const

const idPrinciples = [
  {
    title: 'Bangun sistem yang berguna',
    description:
      'Aku suka pekerjaan web yang menyelesaikan masalah nyata dulu: alur yang jelas, kode yang mudah dibaca, dan fitur yang tetap enak dirawat setelah rilis pertama.',
  },
  {
    title: 'Jaga interface tetap tenang',
    description:
      'Interface yang baik harus terasa fokus dan cepat. Visual polish tetap penting, tapi tugasnya mendukung konten, bukan mengambil semua perhatian.',
  },
  {
    title: 'Tetap penasaran secara terbuka',
    description:
      'Situs ini juga menjadi tempat untuk mencatat eksperimen, keputusan, dan pelajaran selama aku terus belajar di stack web modern.',
  },
] as const

const idStackGroups = [
  {
    ...stackGroups[0],
    title: 'Runtime dan Edge',
    description:
      'Tools yang kupakai untuk menjaga iterasi lokal tetap cepat sambil menjaga deployment dekat dengan edge.',
  },
  {
    ...stackGroups[1],
    title: 'UI Fullstack',
    description:
      'Stack React praktis untuk routing, server state, forms, tables, dan shared UI state.',
  },
  {
    ...stackGroups[2],
    title: 'Data dan Auth',
    description:
      'Layer yang tidak selalu glamor tapi penting untuk konten, session, validasi, dan kerja dashboard yang aman.',
  },
  {
    ...stackGroups[3],
    title: 'Design System',
    description:
      'Primitive UI yang dibentuk menjadi bahasa visual Winterest yang hangat, orange, dan ramah dark mode.',
  },
] as const

const idTimeline = [
  {
    period: 'Sekarang',
    title: 'Fondasi portfolio personal',
    description:
      'Membentuk situs di sekitar siapa Winterest, apa yang dibangun, dan bagaimana orang bisa menjelajahi project, catatan, dan eksperimen.',
  },
  {
    period: 'Berikutnya',
    title: 'Workflow konten dan dashboard',
    description:
      'Mengubah konten project, writing, dan lab menjadi workflow owner-managed dengan draft, published entry, dan layar editing yang lebih bersih.',
  },
  {
    period: 'Nanti',
    title: 'Writing, media, dan visual identity yang lebih kaya',
    description:
      'Memperbaiki konten panjang, media handling, dukungan bahasa, dan visual karakter ringan tanpa membuat situs terasa berat.',
  },
] as const

export const publicCopy = {
  en: {
    nav: {
      about: 'About',
      projects: 'Projects',
      lab: 'Lab',
      writing: 'Writing',
      stack: 'Stack',
      contact: 'Contact',
    },
    meta: {
      title: 'Winterest | Fullstack Web Developer',
      description:
        'Personal portfolio, writing space, and developer lab for Winterest.',
      ogDescription:
        'Projects, notes, experiments, and practical fullstack web work from Indonesia.',
    },
    home: {
      eyebrow: 'Winterest / fullstack web developer',
      title:
        'Fullstack web work, project notes, and experiments from Indonesia.',
      intro:
        'I build practical fullstack web systems, thoughtful interfaces, and small experiments around modern developer workflows. This is my personal space for showing what I build, what I am learning, and how I think through web systems.',
      introSuffix:
        'This is my personal space for showing what I build, what I am learning, and how I think through web systems.',
      viewProjects: 'View projects',
      featuredEyebrow: 'Featured projects',
      featuredTitle: 'Selected work, written as small case studies.',
      featuredDescription:
        'Projects here focus on the problem, the decisions, the stack, and what I want to improve next.',
      readCaseStudy: 'Read case study',
      labEyebrow: 'Developer lab',
      labTitle: 'A place for experiments that are too useful to hide.',
      labDescription:
        'The lab collects prototypes, technical notes, and small ideas while they are still being shaped.',
      principlesEyebrow: 'Principles',
      principlesTitle: 'How I like to approach web work.',
      stackTitle:
        'Tools I reach for when the project needs to stay fast and maintainable.',
      stackDescription:
        'The stack leans modern, typed, and edge-friendly, but the goal is still practical delivery over tool collecting.',
      ctaTitle:
        'Open to practical web systems, thoughtful interfaces, and useful experiments.',
      contact: 'Contact',
    },
    about: {
      eyebrow: 'About',
      title: 'A closer look at Winterest, the developer behind this space.',
      intro:
        'I build online as Winterest. I enjoy turning ideas into practical web systems: interfaces that feel calm, backend flows that stay understandable, and tools that make future work easier.',
      body: 'Winterest is my public home for that process. It gathers project case studies, technical notes, experiments, and a little visual personality so the site can show both the finished work and the thinking behind it.',
      journeyEyebrow: 'Journey',
      journeyTitle: 'What this space is becoming.',
      principlesTitle: 'The values I want this work to carry.',
    },
    projects: {
      eyebrow: 'Projects',
      title: 'Projects with context, not just screenshots.',
      description:
        'This page collects the work I want people to understand: the problem, the decisions, the stack, and the tradeoffs behind each build.',
      open: 'Open',
      emptyTitle: 'No published projects yet.',
      emptyDescription:
        'I am still preparing the project stories for this page. Check back soon for more detailed work notes.',
      remote: 'git remote',
      sourceTitle:
        'Follow the source behind Winterest and the experiments around it.',
      repository: 'Repository',
    },
    lab: {
      eyebrow: 'Lab',
      title: 'Small experiments, rough notes, and useful sparks.',
      description:
        'The lab is where I keep prototypes and learning notes before they are polished enough to become full projects or articles.',
      experiment: 'Experiment',
      emptyTitle: 'No published lab entries yet.',
      emptyDescription:
        'The lab is still being prepared. Soon it will collect small experiments, rough notes, and useful prototypes.',
      back: 'Back to lab',
      notFound: 'Lab entry not found',
      notFoundTitle: 'This experiment is not published yet.',
    },
    writing: {
      eyebrow: 'Writing',
      title: 'Notes on what I build, learn, and decide.',
      description:
        'Writing is the slower side of Winterest: architecture notes, devlogs, retrospectives, and practical lessons from the work.',
      devlog: 'Devlog',
      emptyTitle: 'No published writing yet.',
      emptyDescription:
        'I am still shaping the first notes for this section. Articles and devlogs will appear here when they are ready to read.',
      back: 'Back to writing',
      notFound: 'Writing not found',
      notFoundTitle: 'This article is not published yet.',
    },
    stack: {
      eyebrow: 'Stack',
      title: 'The tools I use to build Winterest and related work.',
      description:
        'This page is not a trophy shelf. It is a map of the tools I trust for fast iteration, maintainable interfaces, content workflows, and edge-friendly deployment.',
      stackNode: 'Stack node',
    },
    contact: {
      eyebrow: 'Contact',
      title: 'Want to talk about web systems, projects, or experiments?',
      description:
        'GitHub is the best public channel for now. Email is available for direct messages, project conversations, or anything that needs a little more context.',
      signalTitle:
        'Best fit: fullstack web projects, Cloudflare workflows, portfolio systems, and useful developer experiments.',
      async: 'Async friendly',
      channels: 'Direct channels',
      name: 'Name',
      email: 'Email',
      message: 'Message',
      draft: 'Draft email',
    },
    resume: {
      eyebrow: 'Resume',
      description:
        'Fullstack web developer focused on practical web systems, calm interfaces, and maintainable fullstack workflows.',
      longIntro:
        'I work around modern web architecture, edge-friendly apps, and developer tooling. Winterest is my public home for case studies, notes, experiments, and the systems I keep improving over time.',
      selectedWork: 'Selected Work',
      direction: 'Current Direction',
      stack: 'Stack',
    },
    footer: {
      eyebrow: 'Winterest Portfolio v2',
      description:
        'Personal portfolio, writing space, and developer lab for Winterest. Built with a warm Cloudflare + Bun inspired visual language.',
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
    projectDetail: {
      notFound: 'Project not found',
      notFoundTitle: 'This case study does not exist yet.',
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
    character: {
      eyebrow: 'Character layer',
      title: 'A mascot accent, not a performance tax.',
      description:
        'The visual layer gives Winterest a recognizable presence while keeping the portfolio readable, fast, and useful. It starts as a static illustration and can later grow into a small progressive 3D scene.',
      notes: [
        {
          title: 'Static first',
          description:
            'The mascot is a lightweight visual accent that does not block core portfolio content.',
        },
        {
          title: 'Progressive motion',
          description:
            'Subtle CSS motion is allowed, with reduced-motion users getting a still experience.',
        },
        {
          title: '3D later',
          description:
            'A small GLB scene can arrive after the CMS, auth, and publishing flows are stable.',
        },
      ],
    },
  },
  id: {
    nav: {
      about: 'Tentang',
      projects: 'Project',
      lab: 'Lab',
      writing: 'Tulisan',
      stack: 'Stack',
      contact: 'Kontak',
    },
    meta: {
      title: 'Winterest | Fullstack Web Developer',
      description:
        'Portfolio personal, ruang tulisan, dan developer lab milik Winterest.',
      ogDescription:
        'Project, catatan, eksperimen, dan karya web fullstack praktis dari Indonesia.',
    },
    home: {
      eyebrow: 'Winterest / fullstack web developer',
      title:
        'Karya web fullstack, catatan project, dan eksperimen dari Indonesia.',
      intro:
        'Aku membangun sistem web fullstack yang praktis, interface yang thoughtful, dan eksperimen kecil di sekitar workflow developer modern. Ini ruang personalku untuk menunjukkan apa yang kubangun, apa yang sedang kupelajari, dan bagaimana aku memikirkan sistem web.',
      introSuffix:
        'Ini ruang personalku untuk menunjukkan apa yang kubangun, apa yang sedang kupelajari, dan bagaimana aku memikirkan sistem web.',
      viewProjects: 'Lihat project',
      featuredEyebrow: 'Project pilihan',
      featuredTitle: 'Karya terpilih yang ditulis seperti case study kecil.',
      featuredDescription:
        'Project di sini fokus pada masalah, keputusan, stack, dan hal yang ingin kuperbaiki berikutnya.',
      readCaseStudy: 'Baca case study',
      labEyebrow: 'Developer lab',
      labTitle:
        'Tempat untuk eksperimen yang terlalu berguna untuk disembunyikan.',
      labDescription:
        'Lab mengumpulkan prototype, catatan teknis, dan ide kecil saat bentuknya masih berkembang.',
      principlesEyebrow: 'Prinsip',
      principlesTitle: 'Cara Winterest mendekati pekerjaan web.',
      stackTitle:
        'Tools yang kupakai saat project perlu tetap cepat dan mudah dirawat.',
      stackDescription:
        'Stack ini modern, typed, dan edge-friendly, tapi tujuannya tetap delivery yang praktis, bukan sekadar mengoleksi tools.',
      ctaTitle:
        'Terbuka untuk sistem web praktis, interface yang thoughtful, dan eksperimen yang berguna.',
      contact: 'Kontak',
    },
    about: {
      eyebrow: 'Tentang',
      title: 'Mengenal Winterest, developer di balik ruang ini.',
      intro:
        'Aku membangun online sebagai Winterest. Aku suka mengubah ide menjadi sistem web praktis: interface yang terasa tenang, alur backend yang tetap mudah dipahami, dan tools yang membuat pekerjaan berikutnya lebih mudah.',
      body: 'Winterest adalah rumah publik untuk proses itu. Isinya case study project, catatan teknis, eksperimen, dan sedikit visual personality agar situs ini bisa menunjukkan hasil akhir sekaligus cara berpikir di baliknya.',
      journeyEyebrow: 'Perjalanan',
      journeyTitle: 'Arah berkembangnya ruang ini.',
      principlesTitle: 'Nilai yang ingin kubawa ke pekerjaan ini.',
    },
    projects: {
      eyebrow: 'Project',
      title: 'Project dengan konteks, bukan cuma screenshot.',
      description:
        'Halaman ini mengumpulkan karya yang ingin kupahami bersama orang lain: masalah, keputusan, stack, dan tradeoff di balik tiap build.',
      open: 'Buka',
      emptyTitle: 'Belum ada project yang dipublish.',
      emptyDescription:
        'Aku masih menyiapkan cerita project untuk halaman ini. Nanti akan ada catatan kerja yang lebih lengkap di sini.',
      remote: 'git remote',
      sourceTitle:
        'Ikuti source di balik Winterest dan eksperimen di sekitarnya.',
      repository: 'Repository',
    },
    lab: {
      eyebrow: 'Lab',
      title: 'Eksperimen kecil, catatan kasar, dan percikan ide berguna.',
      description:
        'Lab adalah tempatku menyimpan prototype dan catatan belajar sebelum cukup rapi untuk menjadi project penuh atau artikel.',
      experiment: 'Eksperimen',
      emptyTitle: 'Belum ada entry lab yang dipublish.',
      emptyDescription:
        'Lab-nya sedang disiapkan. Nanti bagian ini akan berisi eksperimen kecil, catatan kasar, dan prototype yang berguna.',
      back: 'Kembali ke lab',
      notFound: 'Lab entry tidak ditemukan',
      notFoundTitle: 'Eksperimen ini belum dipublish.',
    },
    writing: {
      eyebrow: 'Tulisan',
      title: 'Catatan tentang apa yang kubangun, kupelajari, dan kuputuskan.',
      description:
        'Writing adalah sisi Winterest yang lebih pelan: catatan arsitektur, devlog, retrospektif, dan pelajaran praktis dari pekerjaan.',
      devlog: 'Devlog',
      emptyTitle: 'Belum ada tulisan yang dipublish.',
      emptyDescription:
        'Aku masih merapikan catatan pertama untuk bagian ini. Artikel dan devlog akan muncul saat sudah enak dibaca.',
      back: 'Kembali ke tulisan',
      notFound: 'Tulisan tidak ditemukan',
      notFoundTitle: 'Artikel ini belum dipublish.',
    },
    stack: {
      eyebrow: 'Stack',
      title: 'Tools yang kupakai untuk membangun Winterest dan karya terkait.',
      description:
        'Halaman ini bukan rak piala. Ini peta tools yang kupercaya untuk iterasi cepat, interface yang mudah dirawat, workflow konten, dan deployment edge-friendly.',
      stackNode: 'Node stack',
    },
    contact: {
      eyebrow: 'Kontak',
      title: 'Mau ngobrol tentang sistem web, project, atau eksperimen?',
      description:
        'GitHub adalah channel publik terbaik untuk sekarang. Email tersedia untuk pesan langsung, obrolan project, atau hal yang butuh konteks lebih panjang.',
      signalTitle:
        'Paling cocok: project web fullstack, workflow Cloudflare, sistem portfolio, dan eksperimen developer yang berguna.',
      async: 'Ramah async',
      channels: 'Channel langsung',
      name: 'Nama',
      email: 'Email',
      message: 'Pesan',
      draft: 'Buat draft email',
    },
    resume: {
      eyebrow: 'Resume',
      description:
        'Fullstack web developer yang fokus pada sistem web praktis, interface yang tenang, dan workflow fullstack yang mudah dirawat.',
      longIntro:
        'Aku bekerja di sekitar arsitektur web modern, aplikasi edge-friendly, dan developer tooling. Winterest adalah rumah publikku untuk case study, catatan, eksperimen, dan sistem yang terus kuperbaiki dari waktu ke waktu.',
      selectedWork: 'Karya Pilihan',
      direction: 'Arah Saat Ini',
      stack: 'Stack',
    },
    footer: {
      eyebrow: 'Winterest Portfolio v2',
      description:
        'Portfolio personal, ruang tulisan, dan developer lab milik Winterest. Dibangun dengan bahasa visual hangat yang terinspirasi Cloudflare + Bun.',
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
    projectDetail: {
      notFound: 'Project tidak ditemukan',
      notFoundTitle: 'Case study ini belum ada.',
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
    character: {
      eyebrow: 'Layer karakter',
      title: 'Aksen maskot, bukan beban performa.',
      description:
        'Layer visual memberi Winterest identitas yang mudah dikenali sambil menjaga portfolio tetap terbaca, cepat, dan berguna. Dimulai sebagai ilustrasi statis, lalu bisa tumbuh menjadi scene 3D kecil secara progresif.',
      notes: [
        {
          title: 'Statis dulu',
          description:
            'Maskot adalah aksen visual ringan yang tidak menghalangi konten utama portfolio.',
        },
        {
          title: 'Motion progresif',
          description:
            'Motion CSS yang halus boleh dipakai, dengan pengalaman statis untuk pengguna reduced-motion.',
        },
        {
          title: '3D nanti',
          description:
            'Scene GLB kecil bisa hadir setelah CMS, auth, dan publishing flow stabil.',
        },
      ],
    },
  },
} as const

function isIndonesianLocale() {
  return getLocale() === 'id'
}

export function getPublicCopy() {
  return publicCopy[isIndonesianLocale() ? 'id' : 'en']
}

export function getPortfolioContent() {
  if (isIndonesianLocale()) {
    return {
      portfolioStats: idPortfolioStats,
      principles: idPrinciples,
      stackGroups: idStackGroups,
      timeline: idTimeline,
    }
  }

  return {
    portfolioStats,
    principles,
    stackGroups,
    timeline,
  }
}
