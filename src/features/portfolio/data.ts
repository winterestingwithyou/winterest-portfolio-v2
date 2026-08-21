import { getLocale } from '#/paraglide/runtime'

export const siteProfile = {
  name: 'Winterest',
  fullName: 'M. Adam Yudistira',
  handle: 'winterest',
  domain: 'winterest.tech',
  role: 'CS Student & Fullstack Developer',
  university: 'Universitas Sriwijaya',
  location: 'Indonesia',
  intro:
    "I'm Adam — a CS student from Sriwijaya who builds web apps, open source tools, and occasional side projects. Online, I go by Winterest.",
  longIntro:
    'I study Computer Science at Universitas Sriwijaya and spend most of my free time building things for the web. This site is my public home for projects, experiments, devlogs, and the work I want people to actually see.',
  githubUrl: 'https://github.com/winterestingwithyou',
  githubDisplayName: 'Winterest | M. Adam Yudistira',
  facebookUrl: 'https://www.facebook.com/adam.yudistira.14203',
  facebookName: 'Adam Winter',
  instagramUrl: 'https://instagram.com/adamyyy___',
  instagramName: 'Adam Y',
  repoUrl: 'https://github.com/winterestingwithyou/winterest-portfolio-v2',
  contactEmail: 'hello@winterest.tech',
}

export const portfolioStats = [
  { label: 'University', value: 'Universitas Sriwijaya' },
  { label: 'Currently building', value: 'Finance app + this site' },
  { label: 'Also into', value: 'Open source · Design · Games' },
]

export const principles = [
  {
    title: 'Ship working things first',
    description:
      "I'd rather have something live and imperfect than perfect and sitting in a branch. You learn more from real usage than from planning.",
  },
  {
    title: 'Design is part of the work',
    description:
      'I care about how things look and feel — not just aesthetics, but clarity. A good UI communicates without needing a manual.',
  },
  {
    title: 'Learn and document in the open',
    description:
      "This site is partly a learning log. I write about what I build, what breaks, and what I'd do differently — mostly for future me.",
  },
]

export const enthusiasms = [
  {
    title: 'Software Engineer',
    iconName: 'Terminal',
    description:
      'Applying clean code principles, data structures, and systematic problem solving in modern software engineering.',
  },
  {
    title: 'Frontend Dev',
    iconName: 'Layout',
    description:
      'Crafting responsive, accessible, micro-animation rich user interfaces with intuitive UX.',
  },
  {
    title: 'Backend Dev',
    iconName: 'Server',
    description:
      'Building fast REST/GraphQL APIs, robust server architectures, and high-performance database flows.',
  },
  {
    title: 'Fullstack Dev',
    iconName: 'Layers',
    description:
      'Seamlessly connecting frontend user experiences with edge-ready server logic using modern web stacks.',
  },
  {
    title: 'DevOps',
    iconName: 'Workflow',
    description:
      'Automating CI/CD pipelines, streamlined deployments, and continuous integration workflows.',
  },
  {
    title: 'Cloud Computing',
    iconName: 'Cloud',
    description:
      'Leveraging edge runtime platforms, serverless infrastructure, and Cloudflare-native solutions.',
  },
  {
    title: 'System Design',
    iconName: 'Network',
    description:
      'Architecting scalable, fault-tolerant, and well-structured distributed web systems.',
  },
  {
    title: 'QA Engineering',
    iconName: 'ShieldCheck',
    description:
      'Ensuring software quality and reliability through automated testing, linting, and strict type safety.',
  },
  {
    title: 'Mobile Dev',
    iconName: 'Smartphone',
    description:
      'Developing responsive, performant, and user-friendly mobile application experiences.',
  },
] as const

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
  { label: 'Universitas', value: 'Universitas Sriwijaya' },
  { label: 'Lagi dibangun', value: 'Finance app + situs ini' },
  { label: 'Juga suka', value: 'Open source · Desain · Game' },
] as const

const idPrinciples = [
  {
    title: 'Ship yang jalan dulu',
    description:
      'Lebih baik sesuatu yang live dan belum sempurna daripada sempurna tapi stuck di branch. Dari pemakaian nyata, belajar lebih banyak.',
  },
  {
    title: 'Desain adalah bagian dari pekerjaan',
    description:
      'Aku peduli tampilan dan cara kerja sesuatu — bukan sekadar estetika, tapi kejelasan. UI yang bagus tidak butuh manual.',
  },
  {
    title: 'Belajar dan catat secara terbuka',
    description:
      'Situs ini sebagian adalah learning log. Aku tulis apa yang kubangun, apa yang rusak, dan apa yang bakal kulakukan lebih baik — mostly buat aku sendiri di masa depan.',
  },
] as const

const idEnthusiasms = [
  {
    title: 'Software Engineer',
    iconName: 'Terminal',
    description:
      'Menerapkan prinsip clean code, struktur data, dan pemecahan masalah sistematis dalam rekayasa perangkat lunak modern.',
  },
  {
    title: 'Frontend Dev',
    iconName: 'Layout',
    description:
      'Membangun antarmuka web interaktif yang responsif, estetis, dan kaya akan micro-animation dengan UX intuitif.',
  },
  {
    title: 'Backend Dev',
    iconName: 'Server',
    description:
      'Merancang API cepat, arsitektur server yang andal, dan pengelolaan basis data berkinerja tinggi.',
  },
  {
    title: 'Fullstack Dev',
    iconName: 'Layers',
    description:
      'Mengintegrasikan pengalaman antarmuka pengguna dengan logic server edge-ready secara terpadu.',
  },
  {
    title: 'DevOps',
    iconName: 'Workflow',
    description:
      'Mengelola otomatisasi CI/CD, alur deployment cepat, dan pipeline integrasi berkelanjutan.',
  },
  {
    title: 'Cloud Computing',
    iconName: 'Cloud',
    description:
      'Memanfaatkan teknologi edge network, infrastruktur serverless, serta ekosistem Cloudflare modern.',
  },
  {
    title: 'System Design',
    iconName: 'Network',
    description:
      'Merancang arsitektur terdistribusi yang terukur (scalable), aman, dan bermutasi rendah.',
  },
  {
    title: 'QA Engineering',
    iconName: 'ShieldCheck',
    description:
      'Memastikan keandalan perangkat lunak melalui otomatisasi pengujian, linting, dan type safety ketat.',
  },
  {
    title: 'Mobile Dev',
    iconName: 'Smartphone',
    description:
      'Mengembangkan aplikasi seluler yang cepat, responsif, dan memberikan pengalaman pengguna yang mulus.',
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
      stack: 'Stack',
      contact: 'Contact',
    },
    meta: {
      title: 'Winterest | Fullstack Web Developer',
      description:
        'Personal portfolio platform for Winterest (M. Adam Yudistira).',
      ogDescription:
        'Projects, experiments, and practical fullstack web work from Indonesia.',
    },
    home: {
      eyebrow: 'M. Adam Yudistira — Winterest',
      title: 'Computer Science student at Universitas Sriwijaya.',
      intro:
        "I'm Adam. I build web apps, open source tools, and side projects. Into design and gaming too.",
      introSuffix: 'Projects, experiments, and notes — all on this site.',
      viewProjects: 'See my other works',
      featuredEyebrow: 'FEATURED PROJECTS',
      featuredTitle: 'My Favorite Projects',
      featuredDescription:
        'A curated selection of high-performance web systems, developer tools, and edge platforms engineered for speed, clean architecture, and real-world reliability.',
      readCaseStudy: 'Read writeup',
      principlesEyebrow: 'How I work',
      principlesTitle: 'A few things that shape how I build.',
      enthusiasmsEyebrow: 'PASSION & FOCUS AREAS',
      enthusiasmsTitle: "What I'm Enthusiastic About",
      enthusiasmsDescription:
        'Core software engineering disciplines and technologies I am passionate about exploring and mastering.',
      stackTitle: 'Tools I actually use.',
      stackDescription:
        'My current go-to stack — chosen because they are fast to iterate with, pleasant to maintain, and edge-friendly enough for serious deployment.',
      ctaTitle:
        'Open to collaborations, side projects, and good conversations about coding stuff.',
      contact: 'Say hi',
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
      title: 'Projects',
      description:
        'A collection of projects built to solve real problems, academic tasks, and technical explorations.',
      open: 'Open',
      emptyTitle: 'No published projects yet.',
      emptyDescription:
        'I am still preparing the project stories for this page. Check back soon for more detailed work notes.',
      remote: 'git remote',
      sourceTitle:
        'Follow the source behind Winterest and the experiments around it.',
      repository: 'Repository',
    },
    stack: {
      eyebrow: 'Stack',
      title: 'Tech Stack that I use',
      description: 'List of Tech and Tools that I use to build my projects.',
      ultimateEyebrow: 'Ultimate Tech Stack',
      ultimateTitle: 'Core Architecture & Preferred Stack',
      ultimateDescription:
        'The primary frameworks, runtimes, and databases powering my flagship production web platforms.',
      stackNode: 'Stack node',
    },
    contact: {
      eyebrow: 'Contact',
      title: "Let's connect.",
      description:
        'Have a project idea, question, or opportunity? Reach out directly via social media or send a message below.',
      directTitle: 'Direct Channels',
      directSubtitle: 'Social media & public profiles.',
      copyEmail: 'Copy email',
      copiedEmail: 'Copied!',
      sendEmail: 'Send email',
      status: 'Open for new projects & opportunities',
      location: 'Indonesia (UTC+7)',
      formTitle: 'Send a Message',
      formSubtitle: 'Fill out the form to compose a direct message.',
      name: 'Your Name',
      namePlaceholder: 'e.g. Alex Smith',
      email: 'Your Email',
      emailPlaceholder: 'alex@example.com',
      subject: 'Subject',
      subjectPlaceholder: 'Project Inquiry / Hello',
      message: 'Message',
      messagePlaceholder: 'Write your message here...',
      send: 'Send Message',
      sending: 'Sending...',
      sendNotice: 'Your message will be sent directly to my inbox via Resend.',
      sendSuccessTitle: 'Message sent!',
      sendSuccessSubtitle:
        'Thank you for reaching out! Your message has been delivered to my inbox.',
      sendAnother: 'Send Another Message',
      sendErrorTitle: 'Failed to send message',
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
      stack: 'Stack',
      contact: 'Kontak',
    },
    meta: {
      title: 'Winterest | Fullstack Web Developer',
      description:
        'Platform portfolio personal milik Winterest (M. Adam Yudistira).',
      ogDescription:
        'Project, eksperimen, dan karya web fullstack praktis dari Indonesia.',
    },
    home: {
      eyebrow: 'M. Adam Yudistira — Winterest',
      title: 'Mahasiswa Ilmu Komputer Universitas Sriwijaya.',
      intro:
        'Halo, aku Adam. Bangun web app, tools open source, dan side project. Suka desain sama gaming juga.',
      introSuffix: 'Project, eksperimen, dan catatan — semuanya ada di sini.',
      viewProjects: 'Lihat Projekku lainnya',
      featuredEyebrow: 'PROJECT PILIHAN',
      featuredTitle: 'Project andalanku',
      featuredDescription:
        'Deretan sistem web, developer tools, dan platform edge pilihan yang dirancang dengan performa tinggi, arsitektur bersih, dan solusi nyata.',
      readCaseStudy: 'Baca tulisannya',
      principlesEyebrow: 'Cara kerjaku',
      principlesTitle: 'Beberapa hal yang membentuk cara aku membangun.',
      enthusiasmsEyebrow: 'BIDANG MINAT & ANTUSIASME',
      enthusiasmsTitle: 'Hal yang yang Saya Antusias',
      enthusiasmsDescription:
        'Bidang-bidang Software Engineeryang selalu saya eksplorasi dan pelajari.',
      stackTitle: 'Teknologi yang paling suka kupakai',
      stackDescription:
        'Stack Utama, Prefer tech stack ini saat membuat project baru',
      ctaTitle:
        'Terbuka untuk kolaborasi, side project, dan ngobrol tentang ngoding.',
      contact: 'Sapa aku',
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
      title: 'Daftar Project',
      description:
        'Project yang dibuat berdasarkan masalah, tugas, dan eksplorasi teknologi yang pernah kutemui.',
      open: 'Buka',
      emptyTitle: 'Belum ada project yang dipublish.',
      emptyDescription:
        'Aku masih menyiapkan cerita project untuk halaman ini. Nanti akan ada catatan kerja yang lebih lengkap di sini.',
      remote: 'git remote',
      sourceTitle:
        'Ikuti source di balik Winterest dan eksperimen di sekitarnya.',
      repository: 'Repository',
    },
    stack: {
      eyebrow: 'Stack',
      title: 'Tech Stack yang kupakai',
      description:
        'Daftar Tech dan Tools yang kugunakan untuk membuat project andalanku.',
      ultimateEyebrow: 'Ultimate Tech Stack',
      ultimateTitle: 'Arsitektur Utama & Stack Pilihan',
      ultimateDescription:
        'Framework, runtime, dan database utama yang menopang aplikasi web produksi milikku.',
      stackNode: 'Node stack',
    },
    contact: {
      eyebrow: 'Kontak',
      title: 'Mari terhubung.',
      description:
        'Punya ide proyek, pertanyaan, atau peluang kerja sama? Hubungi saya langsung via media sosial atau kirim pesan di bawah.',
      directTitle: 'Kontak Langsung',
      directSubtitle: 'Media sosial & profil publik.',
      copyEmail: 'Salin email',
      copiedEmail: 'Tersalin!',
      sendEmail: 'Kirim email',
      status: 'Terbuka untuk kolaborasi & proyek baru',
      location: 'Indonesia (UTC+7)',
      formTitle: 'Kirim Pesan',
      formSubtitle: 'Isi formulir di bawah untuk membuat pesan langsung.',
      name: 'Nama Anda',
      namePlaceholder: 'contoh: Budi Santoso',
      email: 'Email Anda',
      emailPlaceholder: 'budi@example.com',
      subject: 'Subjek',
      subjectPlaceholder: 'Diskusi Proyek / Sapaan',
      message: 'Pesan',
      messagePlaceholder: 'Tuliskan pesan Anda di sini...',
      send: 'Kirim Pesan',
      sending: 'Mengirim...',
      sendNotice:
        'Pesan Anda akan dikirim langsung ke email saya melalui Resend.',
      sendSuccessTitle: 'Pesan terkirim!',
      sendSuccessSubtitle:
        'Terima kasih telah menghubungi! Pesan Anda telah berhasil terkirim.',
      sendAnother: 'Kirim Pesan Lain',
      sendErrorTitle: 'Gagal mengirim pesan',
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
      enthusiasms: idEnthusiasms,
      stackGroups: idStackGroups,
      timeline: idTimeline,
    }
  }

  return {
    portfolioStats,
    principles,
    enthusiasms,
    stackGroups,
    timeline,
  }
}
