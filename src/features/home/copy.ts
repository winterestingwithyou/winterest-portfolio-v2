import { getLocale } from '#/paraglide/runtime'

export const homeCopy = {
  en: {
    hero: {
      eyebrow: 'M. Adam Yudistira — Winterest',
      title: 'Fresh Graduate of Computer Science at Universitas Sriwijaya.',
      intro:
        "Hello, I'm Adam. Also known as Winterest. I'm a Junior Developer who loves building systems with Bun, TypeScript, and Cloudflare.",
      introSuffix: 'Everything about me is here!',
      downloadCv: 'Download CV',
      cvNotAvailable: 'CV is not available at the moment.',
      aboutMe: 'About Me',
      viewProjects: 'See my other works',
    },
    featured: {
      eyebrow: 'FEATURED PROJECTS',
      title: 'My Favorite Projects',
      description:
        'A curated selection of high-performance web systems, developer tools, and edge platforms engineered for speed, clean architecture, and real-world reliability.',
      readCaseStudy: 'Read writeup',
      emptyTitle: 'No published projects yet.',
      emptyDescription:
        'I am still preparing the project stories for this page. Check back soon for more detailed work notes.',
      viewProjects: 'See my other works',
    },
    enthusiasms: {
      eyebrow: 'PASSION & FOCUS AREAS',
      title: "What I'm Enthusiastic About",
      description:
        'Core software engineering disciplines and technologies I am passionate about exploring and mastering.',
      items: [
        {
          title: 'Software Engineer',
          iconName: 'Terminal' as const,
          description:
            'Applying clean code principles, data structures, and systematic problem solving in modern software engineering.',
        },
        {
          title: 'Frontend Dev',
          iconName: 'Layout' as const,
          description:
            'Crafting responsive, accessible, micro-animation rich user interfaces with intuitive UX.',
        },
        {
          title: 'Backend Dev',
          iconName: 'Server' as const,
          description:
            'Building fast REST/GraphQL APIs, robust server architectures, and high-performance database flows.',
        },
        {
          title: 'Fullstack Dev',
          iconName: 'Layers' as const,
          description:
            'Seamlessly connecting frontend user experiences with edge-ready server logic using modern web stacks.',
        },
        {
          title: 'DevOps',
          iconName: 'Workflow' as const,
          description:
            'Automating CI/CD pipelines, streamlined deployments, and continuous integration workflows.',
        },
        {
          title: 'Cloud Computing',
          iconName: 'Cloud' as const,
          description:
            'Leveraging edge runtime platforms, serverless infrastructure, and Cloudflare-native solutions.',
        },
        {
          title: 'System Design',
          iconName: 'Network' as const,
          description:
            'Architecting scalable, fault-tolerant, and well-structured distributed web systems.',
        },
        {
          title: 'QA Engineering',
          iconName: 'ShieldCheck' as const,
          description:
            'Ensuring software quality and reliability through automated testing, linting, and strict type safety.',
        },
        {
          title: 'Mobile Dev',
          iconName: 'Smartphone' as const,
          description:
            'Developing responsive, performant, and user-friendly mobile application experiences.',
        },
      ],
    },
    marquee: {
      eyebrow: 'Ultimate Tech Stack',
      title: 'Tools I actually use.',
      description:
        'My current go-to stack — chosen because they are fast to iterate with, pleasant to maintain, and edge-friendly enough for serious deployment.',
      emptyUltimateTitle: 'Ultimate tech stack coming soon!',
      emptyUltimateDescription:
        'Core tech stack entries are currently being curated and will be published shortly.',
    },
    cta: {
      title:
        'Open to collaborations, side projects, and good conversations about coding stuff.',
      contact: 'Contact me',
    },
  },
  id: {
    hero: {
      eyebrow: 'M. Adam Yudistira — Winterest',
      title: 'Fresh Graduate Ilmu Komputer Universitas Sriwijaya.',
      intro:
        'Halo, aku Adam. Juga biasa dipanggil Winterest. Aku Junior Developer yang suka bangun Sistem dengan stack Bun, Typescript, dan Cloudflare',
      introSuffix: 'Semua tentangku ada disini!',
      downloadCv: 'Unduh CV',
      cvNotAvailable: 'CV belum tersedia untuk saat ini.',
      aboutMe: 'Tentang Saya',
      viewProjects: 'Lihat Projekku lainnya',
    },
    featured: {
      eyebrow: 'PROJECT PILIHAN',
      title: 'Project andalanku',
      description:
        'Deretan sistem web, developer tools, dan platform edge pilihan yang dirancang dengan performa tinggi, arsitektur bersih, dan solusi nyata.',
      readCaseStudy: 'Baca tulisannya',
      emptyTitle: 'Belum ada project yang dipublish.',
      emptyDescription:
        'Aku masih menyiapkan cerita project untuk halaman ini. Nanti akan ada catatan kerja yang lebih lengkap di sini.',
      viewProjects: 'Lihat Projekku lainnya',
    },
    enthusiasms: {
      eyebrow: 'BIDANG MINAT & ANTUSIASME',
      title: 'Hal yang yang Saya Antusias',
      description:
        'Bidang-bidang Software Engineeryang selalu saya eksplorasi dan pelajari.',
      items: [
        {
          title: 'Software Engineer',
          iconName: 'Terminal' as const,
          description:
            'Menerapkan prinsip clean code, struktur data, dan pemecahan masalah sistematis dalam rekayasa perangkat lunak modern.',
        },
        {
          title: 'Frontend Dev',
          iconName: 'Layout' as const,
          description:
            'Membangun antarmuka web interaktif yang responsif, estetis, dan kaya akan micro-animation dengan UX intuitif.',
        },
        {
          title: 'Backend Dev',
          iconName: 'Server' as const,
          description:
            'Merancang API cepat, arsitektur server yang andal, dan pengelolaan basis data berkinerja tinggi.',
        },
        {
          title: 'Fullstack Dev',
          iconName: 'Layers' as const,
          description:
            'Mengintegrasikan pengalaman antarmuka pengguna dengan logic server edge-ready secara terpadu.',
        },
        {
          title: 'DevOps',
          iconName: 'Workflow' as const,
          description:
            'Mengelola otomatisasi CI/CD, alur deployment cepat, dan pipeline integrasi berkelanjutan.',
        },
        {
          title: 'Cloud Computing',
          iconName: 'Cloud' as const,
          description:
            'Memanfaatkan teknologi edge network, infrastruktur serverless, serta ekosistem Cloudflare modern.',
        },
        {
          title: 'System Design',
          iconName: 'Network' as const,
          description:
            'Merancang arsitektur terdistribusi yang terukur (scalable), aman, dan bermutasi rendah.',
        },
        {
          title: 'QA Engineering',
          iconName: 'ShieldCheck' as const,
          description:
            'Memastikan keandalan perangkat lunak melalui otomatisasi pengujian, linting, dan type safety ketat.',
        },
        {
          title: 'Mobile Dev',
          iconName: 'Smartphone' as const,
          description:
            'Mengembangkan aplikasi seluler yang cepat, responsif, dan memberikan pengalaman pengguna yang mulus.',
        },
      ],
    },
    marquee: {
      eyebrow: 'Ultimate Tech Stack',
      title: 'Teknologi yang paling suka kupakai',
      description:
        'Stack Utama, Prefer tech stack ini saat membuat project baru',
      emptyUltimateTitle: 'Tech stack utama akan segera hadir!',
      emptyUltimateDescription:
        'Daftar teknologi andalan sedang disiapkan dan akan segera ditampilkan di sini.',
    },
    cta: {
      title:
        'Terbuka untuk kolaborasi, side project, dan ngobrol tentang ngoding.',
      contact: 'Hubungi saya',
    },
  },
} as const

export function getHomeCopy() {
  const locale = getLocale() === 'id' ? 'id' : 'en'
  return homeCopy[locale]
}
