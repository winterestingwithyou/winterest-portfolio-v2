import { getLocale } from '#/paraglide/runtime'

export type PriorityItem = {
  rank: number
  title: string
  key: string
  summary: string
  detail: string
}

export type JourneyStep = {
  year: string
  title: string
  tagline: string
  description: string
  highlights?: string[]
}

export type WorkflowStep = {
  step: string
  title: string
  description: string
}

export type KpopGroup = {
  name: string
  bias: string
  song: string
  color: string
}

export type GenshinChar = {
  name: string
  reason: string
}

export const aboutData = {
  en: {
    hero: {
      eyebrow: '01 / WHO AM I',
      title: 'A deeper look into who I am.',
      subtitle:
        'Hi, I’m M. Adam Yudistira (Winterest) — a Junior Software Engineer / fresh graduate from Indonesia who loves building applications using TypeScript, Bun, and Cloudflare.',
      badges: ['INTJ / 4w5', 'Fresh Graduate', 'Fullstack & Edge Explorer'],
      mindsetQuote:
        'I believe I am not just someone who writes code. I also analyze problems, evaluate trade-offs, design robust systems, and maintain a future-minded perspective.',
      cardLabel: 'Engineering Mindset',
    },
    drives: {
      eyebrow: '02 / WHAT DRIVES ME',
      title: 'Curiosity, continuous growth, and sustainable engineering.',
      subtitle:
        'Why I started programming, what keeps me hooked every day, and how I approach complex technical challenges.',
      originTitle: 'Origin of Interest',
      originQuote: 'Programming lets me create applications.',
      originDetail:
        'The ability to turn an abstract idea into something tangible and usable is what initially attracted me to software engineering.',
      curiosityTitle: 'What Keeps Me Interested',
      curiosityQuote: 'Everything new comes every day.',
      curiosityDetail:
        'Software engineering constantly evolves. There is always something new to learn, satisfying my natural curiosity and drive to explore without the field ever feeling stagnant or boring.',
      mindsetLabel: 'Approach to Difficulty',
      mindsetQuote: 'Difficult does not mean impossible.',
      mindsetDetail:
        'I am willing to work through complex, friction-heavy technical problems rather than treating them as dead ends.',
      refactoringTitle: 'Continuous Improvement',
      refactoringDetail:
        'I enjoy refining existing solutions toward better practices and smoother system workflows. I care about making things better, not merely making them work once.',
      forecastingTitle: 'Long-Term Vision & Forecasting',
      forecastingQuote:
        'Not only solving today’s problem, but anticipating what problems today’s solution could create tomorrow.',
      forecastingDetail:
        'I care about building software that remains useful for a long time through sustainable problem solving and proactive forecasting.',
      hierarchyTitle: 'Hierarchy of Satisfaction',
      hierarchySubtitle:
        'Ordered by what brings me the deepest sense of engineering accomplishment:',
      hierarchyNote:
        '"It works" is just the baseline — understanding, efficiency, and elegant solutions bring true satisfaction.',
      satisfactionHierarchy: [
        {
          rank: 1,
          title: 'Understanding how something works',
        },
        {
          rank: 2,
          title: 'Making something more efficient',
        },
        {
          rank: 3,
          title: 'Seeing people use what I built',
        },
        {
          rank: 4,
          title: 'Finding an elegant solution',
        },
        {
          rank: 5,
          title: 'Successfully making something work',
        },
      ],
    },
    workflow: {
      eyebrow: '03 / HOW I BUILD',
      title: 'A deliberate 7-step engineering workflow.',
      subtitle:
        'Building software is not about blindly writing code until something runs. It requires a clear, deliberate methodology from problem discovery to continuous post-deployment polish.',
      philosophyLabel: 'Technology & Complexity Philosophy',
      ruleLabel: 'Core Rule',
      steps: [
        {
          step: '01',
          title: 'Understand the Problem',
          description:
            'Identify what is wrong, who is affected, and why a solution needs to exist before making architectural commitments.',
        },
        {
          step: '02',
          title: 'Define the Goal',
          description:
            'Translate problem statements into concrete, realistic project objectives that guide all engineering decisions.',
        },
        {
          step: '03',
          title: 'Research & Design',
          description:
            'Explore existing approaches, evaluate trade-offs, and design system architecture before typing line one.',
        },
        {
          step: '04',
          title: 'Build Minimum Deployable Solution',
          description:
            'Deliver the leanest meaningful solution first, leaving room to iterate based on real feedback.',
        },
        {
          step: '05',
          title: 'Test & Root-Cause Analysis',
          description:
            'Rigorously test system boundaries and trace logs to resolve root causes rather than patching symptoms.',
        },
        {
          step: '06',
          title: 'Deploy to Edge / Production',
          description:
            'Expose software to real-world environments where true operational constraints and latency reveal themselves.',
        },
        {
          step: '07',
          title: 'Gather Feedback & Improve',
          description:
            'Continuously gather insights, refine implementations, and evolve the codebase through iterative loops.',
        },
      ],
      techSelection:
        'Technology must follow the problem. I rely heavily on TypeScript for budget accessibility and exceptional DX. Simple problems get simple solutions; complex problems get robust architecture.',
      goldenRule: 'Code for the future.',
    },
    journey: {
      eyebrow: '04 / MY JOURNEY',
      title: 'How my engineering mindset developed over time.',
      subtitle:
        'My growth as a developer is not just a list of languages learned, but a transformation in how I think about building software.',
      currentStageTitle: 'Current Stage',
      growthFocusTitle: 'Personal Growth Focus',
      steps: [
        {
          year: '2023',
          title: 'First Contact with Programming',
          tagline: 'The spark of creation',
          description:
            'Encountered programming at the start of university. Explored Python, JavaScript, HTML, CSS, and PHP with the simple excitement: "Programming lets me build apps!"',
          highlights: ['Python', 'JavaScript', 'HTML/CSS', 'PHP'],
        },
        {
          year: '2024',
          title: 'Semester 2 "Tugas Besar" Projects',
          tagline: 'Realizing projects are achievable',
          description:
            'Tackled substantial university projects seriously. Discovered that building complex software from scratch is not impossible when approached with a structured process.',
          highlights: [
            'Fullstack Apps',
            'Database Design',
            'System Scaffolding',
          ],
        },
        {
          year: 'Early 2025',
          title: 'The IMPHNEN Turning Point',
          tagline: 'Expanding horizons beyond academia',
          description:
            'Joined the Facebook developer community "IMPHNEN" (Ingin Menjadi Programmer handal Namun Enggan NGoding). Seeing skilled engineers share real-world practices inspired me to go far beyond university curriculum.',
          highlights: [
            'Community Learning',
            'Self-Driven Deep Dives',
            'Motivation Boost',
          ],
        },
        {
          year: '2025 - Present',
          title: 'Going Deeper into Architecture & Infra',
          tagline: 'Exploring the full software lifecycle',
          description:
            'Expanded focus to backend systems, Cloudflare edge runtimes, infrastructure, CI/CD pipelines, database optimization, and software architecture.',
          highlights: [
            'Cloud Runtimes',
            'Edge Architecture',
            'DevOps & CI/CD',
            'Quality & Testing',
          ],
        },
      ],
      currentStage:
        'Currently in a deeper-learning stage: mastering how production software is analyzed, designed, tested, deployed, and improved.',
      softSkillsFocus:
        'Beside technical growth, I am actively working on improving communication, social skills, and leadership.',
    },
    values: {
      eyebrow: '05 / ENGINEERING VALUES',
      title: 'Things I care about & context-aware trade-offs.',
      subtitle:
        'No engineering rule is absolute. Every decision must weigh context, scope, risk, deadline, and available resources.',
      contextNote:
        'Avoid both unnecessary complexity and oversimplification. The right choice depends on the problem at hand.',
      items: [
        {
          rank: 1,
          title: 'UX (User Experience)',
          key: 'ux',
          summary: 'If the interface feels uncomfortable, users leave.',
          detail:
            'A technically impressive app is useless if users dislike using it. Good UX guides users intuitively without needing a manual.',
        },
        {
          rank: 2,
          title: 'Performance',
          key: 'performance',
          summary: 'Responsive systems over heavy visual bloat.',
          detail:
            'Shaped by my own experience using low-end hardware. I strongly dislike bloated, lagging UIs masquerading as modern design.',
        },
        {
          rank: 3,
          title: 'Security',
          key: 'security',
          summary: 'Handling user data creates sacred responsibility.',
          detail:
            'Ignoring security harms real people. Data protection and safe auth flows must be baked into system design from day one.',
        },
        {
          rank: 4,
          title: 'Type Safety',
          key: 'type-safety',
          summary: 'Clarity in data flow and fewer runtime surprises.',
          detail:
            'Strict type checking documents data contracts across boundaries and catches bugs long before code reaches production.',
        },
        {
          rank: 5,
          title: 'Automation',
          key: 'automation',
          summary: 'Let software eliminate repetitive manual tasks.',
          detail:
            'One of the core purposes of software engineering is replacing tedious, patterned labor with reliable automated flows.',
        },
        {
          rank: 6,
          title: 'Efficiency',
          key: 'efficiency',
          summary: 'Removing friction and unnecessary hurdles.',
          detail:
            'Good software should streamline workflows for both end-users and developers, minimizing wasted time and resource expenditure.',
        },
        {
          rank: 7,
          title: 'Long-term Usefulness',
          key: 'long-term-usefulness',
          summary: 'Building software that provides lasting value.',
          detail:
            'I care about projects remaining useful over time, while acknowledging that single-use or temporary tools have their place.',
        },
        {
          rank: 8,
          title: 'Maintainability',
          key: 'maintainability',
          summary: 'Making code clear for future maintainers.',
          detail:
            'Software evolves continuously. Clean structure ensures future developers (including future me) can modify it without fear.',
        },
        {
          rank: 9,
          title: 'Good Architecture',
          key: 'good-architecture',
          summary: 'Architecture should evolve with actual scale.',
          detail:
            'Start with clean fullstack monoliths; transition to multi-tier or microservices only when concrete system requirements justify it.',
        },
        {
          rank: 10,
          title: 'Scalability',
          key: 'scalability',
          summary: 'Match scalability investment to system scope.',
          detail:
            'Critical for high-traffic persistent services, but unnecessary over-engineering for simple static websites or one-off tools.',
        },
        {
          rank: 11,
          title: 'Documentation',
          key: 'documentation',
          summary: 'Self-communicating code complemented by concise docs.',
          detail:
            'Write clean, expressive code first. Reserve detailed documentation for complex business logic and architectural decisions.',
        },
        {
          rank: 12,
          title: 'Developer Experience (DX)',
          key: 'dx',
          summary: 'Great DX accelerates iteration, but UX comes first.',
          detail:
            'I value great tooling and DX, but will accept DX friction if it delivers a strictly superior experience for end users.',
        },
        {
          rank: 13,
          title: 'Reliability',
          key: 'reliability',
          summary: 'Dependable execution for targeted use cases.',
          detail:
            'Focus on handling core edge cases solidly rather than obsessively over-engineering against every hypothetical scenario.',
        },
        {
          rank: 14,
          title: 'Simplicity',
          key: 'simplicity',
          summary: 'Appropriate complexity over minimal complexity.',
          detail:
            'Simple code is easier to maintain, but robust software often requires thoughtful internal complexity to present a seamless experience.',
        },
        {
          rank: 15,
          title: 'Accessibility',
          key: 'accessibility',
          summary: 'Software built for diverse human capabilities.',
          detail:
            'Never assume every user navigates software identically. Maintain keyboard accessibility, focus indicators, and screen reader support.',
        },
        {
          rank: 16,
          title: 'Privacy',
          key: 'privacy',
          summary: 'Respecting user data confidentiality with integrity.',
          detail:
            'Collect only what is necessary, store it securely, and respect user privacy with transparent practices.',
        },
      ],
    },
    beyond: {
      eyebrow: '06 / BEYOND CODE',
      title: 'Games, anime world-building, and K-pop girl groups.',
      subtitle:
        'When I step away from the terminal, I enjoy immersive games, tactical anime, and upbeat K-pop music.',
      gaming: {
        title: 'Gaming Hub',
        mlbb: {
          name: 'Mobile Legends',
          ign: 'Escapee',
          server: 'Advance Server',
          notes:
            'Testing new and revamped heroes (currently enjoying Hirara). Rank play on main server is paused to prioritize real-life goals.',
        },
        growtopia: {
          name: 'Growtopia',
          ign: 'WinterEsCape',
          world: 'UYCRIM',
          notes:
            'Love the game as a unique real-life simulation of grinding, trading, and chasing goals.',
        },
        genshin: {
          name: 'Genshin Impact',
          ign: 'Winter',
          notes:
            'Low Spender player. Started around Fontaine, took a 2-year break, and returned before Snezhnaya.',
          favLabel: 'Favorites:',
          favorites: [
            {
              name: 'Arlecchino',
              reason: 'Strong "baddie" appeal and sleek combat.',
            },
            {
              name: 'Wanderer',
              reason: 'Resonates with my analytical personality.',
            },
            { name: 'Lohen', reason: 'Cool twin-like aesthetic to Wanderer.' },
            { name: 'Tsaritsa', reason: 'The ultimate queen of Snezhnaya.' },
          ],
        },
      },
      anime: {
        title: 'Anime Corner',
        summary:
          'I follow current popular titles, especially fantasy anime featuring intricate power systems, strategic battles, and rich world-building.',
        seriesLabel: 'Favorite Series',
        charLabel: 'Favorite Character',
        favorite: 'Jujutsu Kaisen (JJK)',
        favChar: 'Gojo Satoru',
        reason:
          'Gojo is insanely cool, and JJK has one of the most interesting domain expansion power mechanics.',
      },
      kpop: {
        title: 'K-Pop Fanboy',
        summary:
          'Open multifan enthusiast who loves energetic, polished K-pop girl group music.',
        biasLabel: 'Bias:',
        songLabel: 'Fav Song:',
        groups: [
          {
            name: 'aespa',
            bias: 'Winter',
            song: 'Armageddon',
            color: 'from-blue-500/20 to-purple-500/20',
          },
          {
            name: 'BLACKPINK',
            bias: 'Rosé',
            song: 'Ddu-du Ddu-du',
            color: 'from-pink-500/20 to-rose-500/20',
          },
          {
            name: 'LE SSERAFIM',
            bias: 'Chaewon',
            song: 'Sour Grape',
            color: 'from-amber-500/20 to-orange-500/20',
          },
          {
            name: 'IVE',
            bias: 'Wonyoung',
            song: 'Off The Record',
            color: 'from-indigo-500/20 to-blue-500/20',
          },
          {
            name: 'Hearts2Hearts',
            bias: 'A-na',
            song: 'The Chase',
            color: 'from-emerald-500/20 to-teal-500/20',
          },
        ],
      },
    },
    exploring: {
      eyebrow: '07 / CURRENTLY EXPLORING',
      title: 'Active learning, future projects, and career horizon.',
      subtitle:
        'Engineering is a dynamic journey. Here is what is currently on my radar, on my workbench, and on my roadmap.',
      items: [
        {
          category: 'Active Tech Focus',
          title: 'TanStack Ecosystem & PWAs',
          description:
            'Mastering TanStack Start/Router/Query/Form and building fast Progressive Web Applications (PWA) with offline capabilities.',
        },
        {
          category: 'AI Engineering Interest',
          title: 'AI + Software Engineering & RAG',
          description:
            'Exploring AI Engineering integrated into software architecture. Interested in Retrieval-Augmented Generation (RAG) for real-world justified use cases.',
        },
        {
          category: 'Framework Curiosity',
          title: 'SvelteKit Awareness',
          description:
            'Curious about SvelteKit as a lean React alternative, while remaining focused on deepening my React & TanStack mastery for now.',
        },
        {
          category: 'Long-term Horizon',
          title: 'Cloud Computing & Networking',
          description:
            'Deepening knowledge of cloud infrastructure, serverless edge compute, and networking fundamentals essential for distributed systems.',
        },
        {
          category: 'Next Project',
          title: 'Finance Tracker PWA',
          description:
            'Building a PWA to manage personal finances — tracking cash, bank accounts, e-wallets, income, expenses, and inter-account transfers.',
        },
        {
          category: 'Personal Development',
          title: 'Soft Skills & Leadership',
          description:
            'Actively refining communication, social skills, and team leadership alongside technical capability.',
        },
      ],
      ambitionTitle: 'Long-Term Career Direction',
      ambitionText:
        'My goal is to grow toward becoming a Senior Software Engineer — capable of architecting scalable systems, evaluating deep trade-offs, and mentoring others.',
    },
  },
  id: {
    hero: {
      eyebrow: '01 / SIAPA AKU',
      title: 'Mengenal lebih dalam tentang diriku.',
      subtitle:
        'Perkenalkan aku M. Adam Yudistira (Winterest), seorang Junior Software Engineer / fresh graduate asal Indonesia yang suka membuat aplikasi menggunakan Typescript, Bun, dan Cloudflare.',
      badges: ['INTJ / 4w5', 'Fresh Graduate', 'Fullstack & Edge Explorer'],
      mindsetQuote:
        'Aku yakin bahwa aku bukanlah seoarang yang cuma bisa nulis ngoding. Tapi juga bisa menganalisis masalah, memberi pertimbangan, design sistem yang robust, dan future-minded.',
      cardLabel: 'Mindset Rekayasa',
    },
    drives: {
      eyebrow: '02 / APA YANG MENDORONGKU',
      title:
        'Rasa ingin tahu, pertumbuhan berkelanjutan, dan rekayasa yang tahan lama.',
      subtitle:
        'Alasan awal aku mulai ngoding, apa yang bikin aku terus penasaran setiap hari, dan caraku menghadapi tantangan teknikal.',
      originTitle: 'Awal Ketertarikan',
      originQuote: 'Programming bikin aku bisa nyiptain aplikasi.',
      originDetail:
        'Kemampuan mengubah ide abstrak menjadi aplikasi nyata yang benar-benar bisa dipakai adalah hal utama yang pertama kali membuatku tertarik pada dunia rekayasa perangkat lunak.',
      curiosityTitle: 'Yang Bikin Selalu Penasaran',
      curiosityQuote: 'Selalu ada hal baru setiap hari.',
      curiosityDetail:
        'Dunia software engineering terus berkembang. Selalu ada hal baru untuk dipelajari yang memuaskan rasa ingin tahu dan dorongan eksplorasiku, sehingga bidang ini tidak pernah terasa membosankan.',
      mindsetLabel: 'Cara Menghadapi Kesulitan',
      mindsetQuote: 'Ini hanya susah, bukan mustahil.',
      mindsetDetail:
        'Aku selalu bersedia mengulik dan menyelesaikan masalah teknikal yang rumit ketimbang menganggapnya sebagai jalan buntu.',
      refactoringTitle: 'Peningkatan Berkelanjutan',
      refactoringDetail:
        'Aku suka merapikan solusi yang ada agar sesuai praktik terbaik dan meningkatkan alur kerja sistem. Aku tertarik bikin sesuatu jadi lebih baik, bukan cuma sekadar asal jalan sekali.',
      forecastingTitle: 'Visi Jangka Panjang & Perkiraan Dampak',
      forecastingQuote:
        'Bukan cuma menyelesaikan masalah hari ini, tapi memperkirakan masalah apa yang bisa dipicu oleh solusi hari ini di masa depan.',
      forecastingDetail:
        'Aku peduli agar software yang kubangun tetap bermanfaat dalam jangka panjang lewat pemecahan masalah yang berkelanjutan dan prediksi dampak yang matang.',
      hierarchyTitle: 'Hirarki Kepuasan Koding',
      hierarchySubtitle:
        'Diurutkan berdasarkan apa yang memberikan rasa pencapaian terdalam saat ngoding:',
      hierarchyNote:
        '"Bisa jalan" barulah titik awal — pemahaman mendalam, efisiensi, dan solusi yang elegan adalah sumber kepuasan sejati.',
      satisfactionHierarchy: [
        {
          rank: 1,
          title: 'Memahami cara kerja sesuatu',
        },
        {
          rank: 2,
          title: 'Bikin sesuatu jadi lebih efisien',
        },
        {
          rank: 3,
          title: 'Melihat orang lain memakai buatan sendiri',
        },
        {
          rank: 4,
          title: 'Nemu solusi yang elegan',
        },
        {
          rank: 5,
          title: 'Berhasil bikin sesuatu jalan',
        },
      ],
    },
    workflow: {
      eyebrow: '03 / CARA AKU MEMBANGUN',
      title: 'Alur kerja rekayasa terencana dalam 7 langkah.',
      subtitle:
        'Membangun software bukan soal nulis kode secara asal sampai aplikasi bisa jalan. Butuh metodologi yang jelas dan terencana dari penemuan masalah hingga penyempurnaan pasca-deploy.',
      philosophyLabel: 'Filosofi Teknologi & Kompleksitas',
      ruleLabel: 'Prinsip Utama',
      steps: [
        {
          step: '01',
          title: 'Pahami Masalahnya',
          description:
            'Cari tahu apa yang salah, siapa yang terdampak, dan kenapa solusi perlu dibuat sebelum menentukan arsitektur.',
        },
        {
          step: '02',
          title: 'Tentukan Tujuan',
          description:
            'Terjemahkan masalah menjadi tujuan project yang konkret dan terukur untuk memandu semua keputusan teknik.',
        },
        {
          step: '03',
          title: 'Riset & Desain Sistem',
          description:
            'Pelajari pendekatan yang ada, pertimbangkan kompromi, dan rancang arsitektur sistem sebelum nulis baris kode pertama.',
        },
        {
          step: '04',
          title: 'Bangun Solusi Minimum Siap Deploy',
          description:
            'Hadirkan nilai paling esensial terlebih dahulu, menyisakan ruang untuk iterasi berbasis umpan balik nyata.',
        },
        {
          step: '05',
          title: 'Pengujian & Analisis Akar Masalah',
          description:
            'Uji batas sistem dan telusuri log untuk menyelesaikan akar masalah daripada sekadar menambal gejala.',
        },
        {
          step: '06',
          title: 'Deploy ke Edge / Produksi',
          description:
            'Bawa aplikasi ke lingkungan nyata tempat batasan operasional dan latensi yang sebenarnya terlihat.',
        },
        {
          step: '07',
          title: 'Kumpulkan Feedback & Tingkatkan',
          description:
            'Kumpulkan masukan secara berkelanjutan, perbaiki implementasi, dan kembangkan kode lewat siklus iterasi.',
        },
      ],
      techSelection:
        'Teknologi harus mengikuti masalah. Aku sangat mengandalkan TypeScript karena hemat dan DX-nya luar biasa. Masalah simpel pakai solusi simpel; masalah kompleks butuh arsitektur yang kokoh.',
      goldenRule: 'Tulis kode untuk masa depan.',
    },
    journey: {
      eyebrow: '04 / PERJALANAN REKAYASA',
      title: 'Bagaimana cara berpikirku berkembang dari waktu ke waktu.',
      subtitle:
        'Perkembanganku sebagai developer bukan sekadar daftar bahasa yang dipelajari, tapi transformasi dalam cara berpikir saat membangun software.',
      currentStageTitle: 'Fase Saat Ini',
      growthFocusTitle: 'Fokus Pengembangan Diri',
      steps: [
        {
          year: '2023',
          title: 'Pertemuan Pertama dengan Pemrograman',
          tagline: 'Sensasi awal menciptakan aplikasi',
          description:
            'Mulai serius belajar pemrograman di awal kuliah. Mengeksplorasi Python, JavaScript, HTML, CSS, dan PHP dengan motivasi simpel: "Koding bikin aku bisa nyiptain aplikasi!"',
          highlights: ['Python', 'JavaScript', 'HTML/CSS', 'PHP'],
        },
        {
          year: '2024',
          title: 'Tugas Besar Kuliah Semester 2+',
          tagline: 'Menyadari project besar itu sangat bisa dibuat',
          description:
            'Mengerjakan tugas besar perkuliahan dengan serius. Menyadarai bahwa membangun aplikasi kompleks dari nol itu tidak mustahil jika dikerjakan dengan alur yang jelas.',
          highlights: [
            'Aplikasi Fullstack',
            'Desain Database',
            'Scaffolding Sistem',
          ],
        },
        {
          year: 'Awal 2025',
          title: 'Titik Balik Komunitas IMPHNEN',
          tagline: 'Membuka wawasan di luar kurikulum kampus',
          description:
            'Bergabung dengan komunitas Facebook "IMPHNEN" (Ingin Menjadi Programmer handal Namun Enggan NGoding). Melihat praktisi dan programmer jago berbagi ilmu mendorongku untuk eksplorasi mandiri secara lebih mendalam.',
          highlights: [
            'Belajar Komunitas',
            'Eksplorasi Mandiri',
            'Inspirasi Koding',
          ],
        },
        {
          year: '2025 - Sekarang',
          title: 'Pendalaman Arsitektur & Infrastruktur',
          tagline: 'Mengeksplorasi seluruh siklus hidup software',
          description:
            'Memperluas fokus ke sistem backend, edge runtime Cloudflare, infrastruktur, pipeline CI/CD, optimasi database, dan arsitektur perangkat lunak.',
          highlights: [
            'Cloud Runtimes',
            'Arsitektur Edge',
            'DevOps & CI/CD',
            'Quality & Testing',
          ],
        },
      ],
      currentStage:
        'Saat ini berada di fase belajar mendalam: mendalami bagaimana software serius dianalisis, dirancang, diuji, dideploy, dan ditingkatkan.',
      softSkillsFocus:
        'Di luar keterampilan teknis, aku juga aktif mengasah kemampuan komunikasi, relasi sosial, dan kepemimpinan.',
    },
    values: {
      eyebrow: '05 / HAL-HAL YANG KU-PEDULIKAN',
      title: 'Kompromi rekayasa yang diurutkan sesuai konteks.',
      subtitle:
        'Tidak ada aturan teknik yang mutlak. Setiap keputusan harus mempertimbangkan konteks, scope, risiko, tenggat waktu, dan sumber daya.',
      contextNote:
        'Hindari kompleksitas berlebih maupun penyederhanaan yang dipaksakan. Pilihan yang tepat selalu tergantung pada masalahnya.',
      items: [
        {
          rank: 1,
          title: 'UX (User Experience)',
          key: 'ux',
          summary: 'Kalau tampilannya bikin gak nyaman, pengguna bakal pergi.',
          detail:
            'Aplikasi hebat secara teknis bakal sia-sia kalau penggunanya gak nyaman. UX yang bagus mengarahkan pengguna secara intuitif tanpa butuh manual.',
        },
        {
          rank: 2,
          title: 'Performa',
          key: 'performance',
          summary: 'Sistem responsif lebih utama daripada visual yang berat.',
          detail:
            'Lahir dari pengalamanku sendiri yang memakai laptop spesifikasi rendah. Aku paling tidak suka aplikasi berat dan nge-lag hanya demi estetika.',
        },
        {
          rank: 3,
          title: 'Keamanan',
          key: 'security',
          summary: 'Mengelola data pengguna adalah tanggung jawab besar.',
          detail:
            'Mengabaikan keamanan bisa merugikan orang lain secara nyata. Perlindungan data dan alur auth yang aman wajib dirancang sejak awal.',
        },
        {
          rank: 4,
          title: 'Type Safety',
          key: 'type-safety',
          summary: 'Alur data lebih jelas dan minim kejutan saat runtime.',
          detail:
            'Pengecekan tipe data yang ketat mendokumentasikan kontrak data dan menangkap bug jauh sebelum kode masuk ke produksi.',
        },
        {
          rank: 5,
          title: 'Otomatisasi',
          key: 'automation',
          summary: 'Biarkan software menggantikan tugas manual berulang.',
          detail:
            'Salah satu tujuan utama rekayasa software adalah menggantikan pekerjaan rutin yang berpola dengan alur otomatis yang andal.',
        },
        {
          rank: 6,
          title: 'Efisiensi',
          key: 'efficiency',
          summary: 'Memangkas hambatan dan langkah tidak perlu.',
          detail:
            'Software yang baik harus mempermudah alur kerja pengguna maupun developer, meminimalkan waktu dan sumber daya yang terbuang.',
        },
        {
          rank: 7,
          title: 'Kegunaan Jangka Panjang',
          key: 'long-term-usefulness',
          summary: 'Membangun aplikasi yang memberi manfaat bernilai lama.',
          detail:
            'Aku peduli aplikasi tetap berguna dalam jangka panjang, sambil tetap menghargai tools sekali pakai yang memang dibuat untuk masalah sementara.',
        },
        {
          rank: 8,
          title: 'Kemudahan Perawatan (Maintainability)',
          key: 'maintainability',
          summary: 'Menyusun kode agar mudah dikembangkan developer lain.',
          detail:
            'Software bakal terus berkembang. Struktur yang bersih memastikan developer lain (termasuk diriku di masa depan) bisa mengubahnya tanpa rasa cemas.',
        },
        {
          rank: 9,
          title: 'Arsitektur yang Baik',
          key: 'good-architecture',
          summary: 'Arsitektur harus berkembang sesuai skala nyata.',
          detail:
            'Mulai dari fullstack monolith yang bersih; baru pindah ke multi-tier atau microservices saat kebutuhan sistem memang menuntutnya.',
        },
        {
          rank: 10,
          title: 'Skalabilitas',
          key: 'scalability',
          summary: 'Sesuaikan investasi skalabilitas dengan cakupan sistem.',
          detail:
            'Sangat penting untuk layanan persisten bertrafik tinggi, tapi bisa jadi berlebihan untuk situs statis simpel atau tools sekali pakai.',
        },
        {
          rank: 11,
          title: 'Dokumentasi',
          key: 'documentation',
          summary:
            'Kode yang menjelaskan dirinya sendiri + dokumentasi ringkas.',
          detail:
            'Utamakan menulis kode yang bersih dan ekspresif. Dokumentasi detail disimpan untuk logika bisnis yang kompleks dan keputusan arsitektur.',
        },
        {
          rank: 12,
          title: 'Developer Experience (DX)',
          key: 'dx',
          summary:
            'DX yang bagus mempercepat iterasi, tapi UX tetap nomor satu.',
          detail:
            'Aku menghargai tooling yang nyaman, tapi rela menghadapi sedikit ketidaknyamanan DX jika hasilnya memberikan UX yang jauh lebih baik untuk pengguna.',
        },
        {
          rank: 13,
          title: 'Keandalan (Reliability)',
          key: 'reliability',
          summary: 'Eksekusi andal untuk skenario yang ditargetkan.',
          detail:
            'Fokus menangani edge case utama secara solid daripada berlebihan mengantisipasi setiap skenario hipotetis yang belum tentu terjadi.',
        },
        {
          rank: 14,
          title: 'Kesederhanaan (Simplicity)',
          key: 'simplicity',
          summary: 'Kompromi kompleksitas yang sesuai konteks.',
          detail:
            'Kode simpel lebih mudah dirawat, tapi software yang tangguh kadang butuh kompleksitas internal agar bisa menyajikan pengalaman simpel bagi pengguna.',
        },
        {
          rank: 15,
          title: 'Aksesibilitas',
          key: 'accessibility',
          summary: 'Software yang dirancang untuk berbagai kemampuan pengguna.',
          detail:
            'Jangan pernah menganggap semua orang memakai aplikasi dengan cara yang sama. Jaga aksesibilitas keyboard, fokus visual, dan pembaca layar.',
        },
        {
          rank: 16,
          title: 'Privasi',
          key: 'privacy',
          summary: 'Menghormati kerahasiaan data pengguna dengan integritas.',
          detail:
            'Ambil data yang diperlukan saja, simpan dengan aman, dan hormati privasi pengguna lewat praktik yang transparan.',
        },
      ],
    },
    beyond: {
      eyebrow: '06 / DI LUAR BARIS KODE',
      title: 'Game, anime dunia fantasy, dan K-pop girl groups.',
      subtitle:
        'Saat istirahat dari terminal, aku suka main game interaktif, nonton anime taktis, dan dengerin musik K-pop yang penuh energi.',
      gaming: {
        title: 'Area Gaming',
        mlbb: {
          name: 'Mobile Legends',
          ign: 'Escapee',
          server: 'Advance Server',
          notes:
            'Suka nyobain hero baru / revamp (sekarang lagi suka Hirara). Rehat push rank di server utama demi prioritas dunia nyata.',
        },
        growtopia: {
          name: 'Growtopia',
          ign: 'WinterEsCape',
          world: 'UYCRIM',
          notes:
            'Suka banget sama game ini karena kerasa kayak simulasi kehidupan nyata tentang grinding, trading, dan mengejar impian.',
        },
        genshin: {
          name: 'Genshin Impact',
          ign: 'Winter',
          notes:
            'Pemain Low Spender. Mulai di era Fontaine, sempat rehat ~2 tahun, dan balik lagi sebelum Snezhnaya rilis.',
          favLabel: 'Favorit:',
          favorites: [
            {
              name: 'Arlecchino',
              reason: 'Suka karena aura "baddie"-nya yang keren parah.',
            },
            {
              name: 'Wanderer',
              reason: 'Ngerasa personalitasnya mirip sama aku.',
            },
            {
              name: 'Lohen',
              reason: 'Punya visual dan aura kembar mirip Wanderer.',
            },
            { name: 'Tsaritsa', reason: 'Ratu sejati dari Snezhnaya.' },
          ],
        },
      },
      anime: {
        title: 'Sudut Anime',
        summary:
          'Aku mengikuti anime populer yang sedang hangat, terutama genre fantasy dengan sistem kekuatan yang kompleks dan world-building yang mendalam.',
        seriesLabel: 'Serial Favorit',
        charLabel: 'Karakter Favorit',
        favorite: 'Jujutsu Kaisen (JJK)',
        favChar: 'Gojo Satoru',
        reason:
          'Gojo itu keren banget, dan JJK punya salah satu sistem kekuatan domain expansion yang paling menarik.',
      },
      kpop: {
        title: 'K-Pop Fanboy',
        summary:
          'Terang-terangan seorang multifan yang suka musik girl group K-pop energik.',
        biasLabel: 'Bias:',
        songLabel: 'Lagu Favorit:',
        groups: [
          {
            name: 'aespa',
            bias: 'Winter',
            song: 'Armageddon',
            color: 'from-blue-500/20 to-purple-500/20',
          },
          {
            name: 'BLACKPINK',
            bias: 'Rosé',
            song: 'Ddu-du Ddu-du',
            color: 'from-pink-500/20 to-rose-500/20',
          },
          {
            name: 'LE SSERAFIM',
            bias: 'Chaewon',
            song: 'Sour Grape',
            color: 'from-amber-500/20 to-orange-500/20',
          },
          {
            name: 'IVE',
            bias: 'Wonyoung',
            song: 'Off The Record',
            color: 'from-indigo-500/20 to-blue-500/20',
          },
          {
            name: 'Hearts2Hearts',
            bias: 'A-na',
            song: 'The Chase',
            color: 'from-emerald-500/20 to-teal-500/20',
          },
        ],
      },
    },
    exploring: {
      eyebrow: '07 / EKSPLORASI SAAT INI',
      title: 'Fokus belajar, project mendatang, dan arah karir.',
      subtitle:
        'Rekayasa perangkat lunak adalah perjalanan dinamis. Ini hal-hal yang sedang kupelajari, kubangun, dan kutuju.',
      items: [
        {
          category: 'Fokus Teknologi Aktif',
          title: 'Ekosistem TanStack & PWA',
          description:
            'Mendalami TanStack Start/Router/Query/Form serta membangun Progressive Web Apps (PWA) yang cepat dan siap dipakai offline.',
        },
        {
          category: 'Minat AI Engineering',
          title: 'AI + Software Engineering & RAG',
          description:
            'Mengeksplorasi integrasi AI ke dalam arsitektur software. Tertarik mendalami Retrieval-Augmented Generation (RAG) untuk masalah nyata yang terjustifikasi.',
        },
        {
          category: 'Ketertarikan Framework',
          title: 'Pengenalan SvelteKit',
          description:
            'Penasaran dengan SvelteKit sebagai alternatif React yang ringan, namun tetap fokus memperdalam React & TanStack untuk saat ini.',
        },
        {
          category: 'Cakrawala Jangka Panjang',
          title: 'Cloud Computing & Jaringan',
          description:
            'Memperdalam pemahaman infrastruktur cloud, serverless edge compute, dan dasar-dasar jaringan untuk sistem terdistribusi.',
        },
        {
          category: 'Project Berikutnya',
          title: 'Aplikasi Finance PWA',
          description:
            'Membangun aplikasi PWA pencatatan keuangan — mengelola kas, rekening bank, e-wallet, pemasukan, pengeluaran, dan transfer antar akun.',
        },
        {
          category: 'Pengembangan Diri',
          title: 'Soft Skills & Kepemimpinan',
          description:
            'Aktif mengasah kemampuan komunikasi, relasi sosial, dan kepemimpinan tim di samping kemampuan teknis.',
        },
      ],
      ambitionTitle: 'Arah Karir Jangka Panjang',
      ambitionText:
        'Tujuanku adalah berkembang menjadi seorang Senior Software Engineer — yang mampu merancang sistem terukur, memikirkan kompromi mendalam, dan membimbing tim.',
    },
  },
} as const

export function getAboutData() {
  const locale = getLocale()
  return aboutData[locale === 'id' ? 'id' : 'en']
}
