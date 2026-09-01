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
  albumCover: string
  spotifyUrl: string
  biasImage: string
  logoUrl: string
}

export type GenshinChar = {
  name: string
  reason: string
  image: string
}

export const aboutCopy = {
  en: {
    meta: {
      title: 'About',
      description:
        'A deeper look into who I am — personal developer journey, principles, workflow, and technical mindset of Winterest (M. Adam Yudistira).',
    },
    hero: {
      eyebrow: '01 / WHO AM I',
      title: 'A deeper look into who I am.',
      subtitle:
        'Hi, I’m M. Adam Yudistira (Winterest) — a Junior Software Engineer / fresh graduate from Indonesia who loves building applications using TypeScript, Bun, and Cloudflare.',
      badges: ['INTJ / 4w5', 'Fresh Graduate', 'Fullstack & Edge Explorer'],
      mindsetQuote:
        'I believe I am not just someone who writes code. I also analyze problems, evaluate trade-offs, design robust systems, and maintain a future-minded perspective.',
      cardLabel: 'Developer Mindset',
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
        'My growth as a developer is not just a list of tools learned, but a clear evolution in how I think about building reliable software.',
      currentStageTitle: 'Current Stage',
      growthFocusTitle: 'Personal Growth Focus',
      steps: [
        {
          year: '2023',
          title: 'First Contact with Programming',
          tagline: 'The spark of creation',
          description:
            'Encountered programming at the start of university. Explored Python, JavaScript, HTML, CSS, and PHP with the excitement of turning ideas into functional software.',
          highlights: ['Python', 'JavaScript', 'HTML/CSS', 'PHP'],
        },
        {
          year: '2024',
          title: 'Academic Project Foundations',
          tagline: 'Proving complex software is achievable',
          description:
            'In my 2nd semester of university, I tackled academic projects seriously, building fullstack web apps and structured databases without relying on external shortcuts.',
          highlights: [
            'Fullstack Basics',
            'Database Design',
            'System Scaffolding',
          ],
        },
        {
          year: 'Late 2024',
          title: 'Standalone Java Desktop Architecture',
          tagline: 'Building complete systems from scratch',
          description:
            'During my 3rd semester, I engineered a complete Java desktop application with a clean UI and solid business logic from scratch, earning top commendation from course lecturers before AI coding agents became standard.',
          highlights: ['Java', 'Desktop App', 'OOP Architecture', 'UI Design'],
        },
        {
          year: 'Early Jan 2025',
          title: 'The IMPHNEN Community Turning Point',
          tagline: 'Expanding horizons beyond academia',
          description:
            'Joined the IMPHNEN developer community on Facebook in early January 2025. Watching experienced engineers share real-world practices sparked a habit of deep, self-driven learning beyond university curriculum.',
          highlights: [
            'Developer Community',
            'Self-Driven Learning',
            'Engineering Mindset',
          ],
        },
        {
          year: 'Mar - Apr 2025',
          title: 'Advanced Java Desktop System',
          tagline: 'Refining precision and structure',
          description:
            'In my 4th semester, I delivered an advanced desktop Java system with refined UI and structured architecture, solidifying core object-oriented principles and academic recognition.',
          highlights: ['Java Swing/JavaFX', 'Advanced OOP', 'Desktop UX'],
        },
        {
          year: 'May 2025',
          title: 'Modern Web Sprint and First Portfolio',
          tagline: 'Rapid self-taught exploration',
          description:
            'Utilized post-semester break to explore modern frontend frameworks, Tailwind CSS, Laravel backend concepts, and successfully published my first personal portfolio.',
          highlights: [
            'React',
            'Vue',
            'Tailwind CSS',
            'Laravel',
            'First Portfolio',
          ],
        },
        {
          year: 'Jun - Aug 2025',
          title: 'Multi-Tier Telemetry Internship',
          tagline: 'Hands-on enterprise problem solving',
          description:
            'Built a customer satisfaction and network telemetry analytics platform during an engineering internship. Implemented a 2-frontend, 1-backend, 1-database architecture deployed across multi-cloud PaaS with NestJS and React Router v7.',
          highlights: [
            'NestJS',
            'React Router v7',
            'Multi-Service PaaS',
            'Telemetry and Analytics',
            'Clean Code',
          ],
        },
        {
          year: 'Sept - Oct 2025',
          title: 'ECO-RAPID and 3rd Place SINERGI FEST',
          tagline: 'Civic tech and edge deployment',
          description:
            'Co-developed ECO-RAPID, an environmental issue reporting portal. Explored Cloudflare edge deployments, Cloudinary asset storage, and Gmail API integration, winning 3rd place in the SINERGI FEST Web Development Competition organized by BEM KM Fasilkom UNSRI.',
          highlights: [
            'Cloudflare Edge',
            'Gmail API',
            'Cloudinary',
            '3rd Place SINERGI FEST',
          ],
        },
        {
          year: 'Oct - Nov 2025',
          title: 'Team Leadership, E-Commerce and AI Workflows',
          tagline: 'Managing workflows and modern tooling',
          description:
            'Led team development for a Bagisto-based open-source e-commerce platform and collaborative projects. Established Git branch workflows, pull request reviews, CI pipelines, and integrated AI coding agents into daily development.',
          highlights: [
            'Team Lead and Git Flow',
            'GraphQL',
            'Next.js',
            'Bagisto SaaS',
            'AI Agent Workflow',
          ],
        },
        {
          year: 'Nov - Dec 2025',
          title: '1st Place City Innovation Award',
          tagline: 'Iterating toward real-world impact',
          description:
            'Iterated and refined ECO-RAPID for the 2025 Palembang City Innovation Competition, winning 1st Place in the Community Category.',
          highlights: [
            '1st Place Winner',
            'Civic Tech',
            'Production Iteration',
          ],
        },
        {
          year: 'Dec 2025',
          title: 'Gaming Community Tooling and SEO Optimization',
          tagline: 'High organic engagement',
          description:
            'Built specialized web utility tools for the Growtopia gaming community during semester break, optimizing search metadata to achieve a 20% to 25% organic click-through rate.',
          highlights: [
            'SEO Optimization',
            'Community Tooling',
            'High CTR (20-25%)',
          ],
        },
        {
          year: 'Jan - May 2026',
          title: 'Bachelor Thesis: Campus SSO Microservices',
          tagline: 'Centralized authentication architecture',
          description:
            'Engineered a centralized Single Sign-On (SSO) microservice platform for the faculty thesis. Architected a monorepo containing 1 frontend, 2 backends, 2 databases, and 1 docs frontend with RPC communication and automated CI/CD.',
          highlights: [
            'Single Sign-On (SSO)',
            'Microservices and RPC',
            'Monorepo',
            'CI/CD and Agile',
          ],
        },
        {
          year: 'Jun - Jul 2026',
          title: 'Client-Side Campus Administrative Suite',
          tagline: 'Solving student administrative friction',
          description:
            'Addressed graduation administrative friction by engineering four zero-database client-side tools with React Router v7: Pembuat Dokumen Syarat Proposal, Guide Pengajuan Kompre, UNSRI Repository Guide with file maker, and Roadmap Yudisium & Wisuda Fasilkom UNSRI. These solutions helped dozens of graduating peers navigate document submissions smoothly.',
          highlights: [
            'React Router v7',
            'Client-Side Architecture',
            'Campus Administrative Tools',
          ],
        },
        {
          year: 'Aug 2026 - Present',
          title: 'Career Refinement, Project Planning and Flagship Portfolio',
          tagline: 'Long-term engineering direction',
          description:
            'Focusing on personal developer tooling, polishing CV and LinkedIn presence, mapping out architectures for upcoming software projects, and building the flagship Winterest portfolio platform with TanStack Start and Cloudflare Workers.',
          highlights: [
            'Career Polish',
            'Project Planning',
            'TanStack Start',
            'Cloudflare Workers',
          ],
        },
      ],
      currentStage:
        'Post-graduate focus: mastering fullstack edge systems, refining professional presence, and designing deliberate, future-proof software architectures.',
      softSkillsFocus:
        'Balancing deep technical architecture with communication, technical writing, mentoring, and collaborative team leadership.',
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
          iconUrl:
            'https://static.wikia.nocookie.net/mobile-legends/images/f/fb/MLBB_icon.png/revision/latest?cb=20241013132437',
          heroName: 'Hirara',
          heroLabel: 'Currently Favorite',
          heroImage:
            'https://cdn-www.bluestacks.com/bs-images/MobileLegendsBangBang_Guide_HiraraGuide_EN011.png',
          notes:
            'Testing new and revamped heroes (currently enjoying Hirara). Rank play on main server is paused to prioritize real-life goals.',
        },
        growtopia: {
          name: 'Growtopia',
          ign: 'WinterEsCape',
          world: 'UYCRIM',
          iconUrl:
            'https://s3.eu-west-1.amazonaws.com/cdn.growtopiagame.com/website/resources/assets/upload/1_grow_icon_1513191167.jpg',
          notes:
            'Love the game as a unique real-life simulation of grinding, trading, and chasing goals.',
        },
        genshin: {
          name: 'Genshin Impact',
          ign: 'Winter',
          iconUrl:
            'https://static.wikia.nocookie.net/logopedia/images/3/3a/Genshin_Impact_Icon_Version_1.0.png/revision/latest/scale-to-width-down/250?cb=20250902081559',
          notes:
            'Low Spender player. Started around Fontaine, took a 2-year break, and returned before Snezhnaya.',
          favLabel: 'Favorite Characters',
          favorites: [
            {
              name: 'Arlecchino',
              reason: 'Strong "baddie" appeal and sleek combat.',
              image:
                'https://upload-os-bbs.hoyolab.com/upload/2022/07/20/43682162/35c6f8b267f8ef6a75ea8ad3cb9ca96d_2245523228234067124.jpg',
            },
            {
              name: 'Wanderer',
              reason: 'Resonates with my analytical personality.',
              image:
                'https://upload-os-bbs.hoyolab.com/upload/2024/08/09/159056263/cde043660397343b27fc1f6005f8b4f1_1167825517051000668.jpg',
            },
            {
              name: 'Lohen',
              reason: 'Cool twin-like aesthetic to Wanderer.',
              image:
                'https://preview.redd.it/lohen-fanart-art-by-me-v0-nfaet96zft5h1.jpg?width=640&crop=smart&auto=webp&s=6a66582017b3ff95a5031299a2ba033f67ff4548',
            },
            {
              name: 'Tsaritsa',
              reason: 'The ultimate queen of Snezhnaya.',
              image:
                'https://static.wikia.nocookie.net/villains/images/e/e9/TheTsaritsa.webp/revision/latest/thumbnail/width/360/height/450?cb=20260626041211',
            },
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
        charImage:
          'https://i.pinimg.com/564x/86/b2/10/86b21044fa7c743a9816b39ad251582f.jpg',
        reason:
          'Gojo is insanely cool, and JJK has one of the most interesting domain expansion power mechanics.',
      },
      kpop: {
        title: 'K-Pop Fanboy',
        summary:
          'Open multifan enthusiast who loves energetic, polished K-pop girl group music.',
        biasLabel: 'Bias',
        songLabel: 'Fav Track',
        spotifyLabel: 'Open in Spotify',
        groups: [
          {
            name: 'aespa',
            bias: 'Winter',
            song: 'Armageddon',
            albumCover:
              'https://i.scdn.co/image/ab67616d0000b273c60843bafc67821cff6df260',
            spotifyUrl: 'https://open.spotify.com/album/4SboBpuYojDm02qS4iFeJC',
            biasImage:
              'https://static.wikia.nocookie.net/aespa/images/0/04/THE_CULTURE%2C_THE_FUTURE_Teaser_Winter_%282%29.jpg/revision/latest?cb=20250331093258',
            logoUrl:
              'https://images.seeklogo.com/logo-png/40/1/aespa-logo-png_seeklogo-406894.png',
            color: 'from-blue-500/20 via-purple-500/15 to-transparent',
          },
          {
            name: 'BLACKPINK',
            bias: 'Rosé',
            song: 'Ddu-du Ddu-du',
            albumCover:
              'https://i.scdn.co/image/ab67616d0000b27398135e0d2d1675f2b502f01c',
            spotifyUrl:
              'https://open.spotify.com/intl-id/track/2aI2k39nfa3KFsa4JclQzw',
            biasImage:
              'https://img.okezone.com/okz/500/library/images/2024/09/26/rose_blackpink_21875.jpg',
            logoUrl:
              'https://images.seeklogo.com/logo-png/38/1/blackpink-logo-png_seeklogo-384214.png',
            color: 'from-pink-500/20 via-rose-500/15 to-transparent',
          },
          {
            name: 'LE SSERAFIM',
            bias: 'Chaewon',
            song: 'Sour Grape',
            albumCover:
              'https://i.scdn.co/image/ab67616d0000b2739ae8d973353277c7dec2c27d',
            spotifyUrl:
              'https://open.spotify.com/intl-id/track/6wBpO4Xc4YgShnENGSFA1M',
            biasImage:
              'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTbBA2awG_EbxgQoz4KVn6NuUq1LZ7BBFnBXa1zoSNQsj2_x5i7dbTyyAY&s=10',
            logoUrl:
              'https://i.pinimg.com/564x/a1/b9/57/a1b95706564eb26a6959617951f706ac.jpg',
            color: 'from-amber-500/20 via-orange-500/15 to-transparent',
          },
          {
            name: 'IVE',
            bias: 'Wonyoung',
            song: 'Off The Record',
            albumCover:
              'https://i.scdn.co/image/ab67616d0000b273e5cc60bec326c779d17ee76e',
            spotifyUrl:
              'https://open.spotify.com/intl-id/album/7qch1xWGWuU5VxZEYBF5KW',
            biasImage:
              'https://upload.wikimedia.org/wikipedia/commons/0/07/Jang_Won-young_at_the_Bulgari_Eclettica_event_in_Seoul%2C_May_12%2C_2026_%281%29.png?utm_source=en.wikipedia.org&utm_campaign=index&utm_content=original',
            logoUrl:
              'https://i.pinimg.com/564x/a6/7c/f5/a67cf5ee06108c44d716f5969d873ac8.jpg',
            color: 'from-indigo-500/20 via-sky-500/15 to-transparent',
          },
          {
            name: 'Hearts2Hearts',
            bias: 'A-na',
            song: 'The Chase',
            albumCover:
              'https://i.scdn.co/image/ab67616d0000b273d346fc1102eb417305b5358b',
            spotifyUrl:
              'https://open.spotify.com/intl-id/track/68UrZQUuO3O6eUiD226xHg',
            biasImage:
              'https://upload.wikimedia.org/wikipedia/commons/8/82/A-Na_of_Hearts2Hearts%2C_March_29%2C_2025.jpg?utm_source=id.wikipedia.org&utm_campaign=index&utm_content=original',
            logoUrl:
              'https://i.pinimg.com/564x/9f/79/4a/9f794aa34348d15f8a07e99006275b03.jpg',
            color: 'from-emerald-500/20 via-teal-500/15 to-transparent',
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
    meta: {
      title: 'Tentang',
      description:
        'Mengenal lebih dalam tentang diriku — perjalanan developer, prinsip, alur kerja, dan mindset teknis Winterest (M. Adam Yudistira).',
    },
    hero: {
      eyebrow: '01 / SIAPA AKU',
      title: 'Mengenal lebih dalam tentang diriku.',
      subtitle:
        'Perkenalkan aku M. Adam Yudistira (Winterest), seorang Junior Software Engineer / fresh graduate asal Indonesia yang suka membuat aplikasi menggunakan Typescript, Bun, dan Cloudflare.',
      badges: ['INTJ / 4w5', 'Fresh Graduate', 'Fullstack & Edge Explorer'],
      mindsetQuote:
        'Aku yakin bahwa aku bukanlah seoarang yang cuma bisa ngoding. Tapi juga bisa menganalisis masalah, memberi pertimbangan, design sistem yang robust, dan future-minded.',
      cardLabel: 'Mindset Developer',
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
      eyebrow: '04 / PERJALANANKU',
      title: 'Bagaimana cara berpikirku berkembang dari waktu ke waktu.',
      subtitle:
        'Perkembanganku sebagai developer bukan sekadar daftar tools yang dipelajari, tapi transformasi nyata dalam cara berpikir saat membangun perangkat lunak yang andal.',
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
          title: 'Fondasi Project Akademis',
          tagline: 'Menyadari project besar itu sangat bisa dibuat',
          description:
            'Di semester 2 perkuliahan, aku mengerjakan tugas besar dengan serius, membangun aplikasi fullstack dan desain database terstruktur dari nol dengan alur kerja yang jelas.',
          highlights: [
            'Aplikasi Fullstack',
            'Desain Database',
            'Scaffolding Sistem',
          ],
        },
        {
          year: 'Akhir 2024',
          title: 'Aplikasi Desktop Java Mandiri',
          tagline: 'Membangun sistem utuh dari nol',
          description:
            'Pada semester 3, aku membangun aplikasi desktop Java mandiri dengan antarmuka rapi dan logika fungsional lengkap dari nol, meraih apresiasi tinggi dari dosen pengampu di era sebelum AI coding agent.',
          highlights: [
            'Java',
            'Aplikasi Desktop',
            'Arsitektur OOP',
            'Desain UI',
          ],
        },
        {
          year: 'Awal Jan 2025',
          title: 'Titik Balik Komunitas IMPHNEN',
          tagline: 'Membuka wawasan di luar kurikulum kampus',
          description:
            'Bergabung dengan komunitas programmer IMPHNEN di Facebook pada awal Januari 2025. Melihat diskusi para praktisi industri memicu eksplorasi mandiri yang jauh melampaui kurikulum kampus.',
          highlights: [
            'Belajar Komunitas',
            'Eksplorasi Mandiri',
            'Inspirasi Koding',
          ],
        },
        {
          year: 'Mar - Apr 2025',
          title: 'Project Desktop Java Lanjutan',
          tagline: 'Menjaga presisi dan struktur kode',
          description:
            'Pada semester 4, aku menyelesaikan project desktop Java lanjutan dengan ketelitian tinggi pada antarmuka dan alur data, kembali meraih pengakuan akademis terbaik dari dosen.',
          highlights: ['Java Swing/JavaFX', 'OOP Lanjutan', 'UX Desktop'],
        },
        {
          year: 'Mei 2025',
          title: 'Eksplorasi Web Modern & Portofolio Pertama',
          tagline: 'Sprint belajar mandiri pasca-semester',
          description:
            'Memanfaatkan jeda libur semester untuk mendalami ekosistem web modern: React, Vue, Tailwind CSS, konsep backend Laravel, serta merilis portofolio web pertama.',
          highlights: [
            'React',
            'Vue',
            'Tailwind CSS',
            'Laravel',
            'Portofolio Pertama',
          ],
        },
        {
          year: 'Jun - Agu 2025',
          title: 'Magang Telemetri Multi-Tier',
          tagline: 'Menyelesaikan masalah nyata industri',
          description:
            'Membangun platform kuesioner kepuasan pelanggan dan telemetri jaringan saat magang. Merancang arsitektur 2-frontend, 1-backend, 1-database dengan NestJS dan React Router v7 yang dideploy di berbagai platform PaaS.',
          highlights: [
            'NestJS',
            'React Router v7',
            'Multi-Service PaaS',
            'Telemetri & Analitik',
            'Clean Code',
          ],
        },
        {
          year: 'Sep - Okt 2025',
          title: 'ECO-RAPID & Juara 3 SINERGI FEST',
          tagline: 'Civic tech dan deployment edge',
          description:
            'Mengembangkan ECO-RAPID, platform pelaporan masalah lingkungan warga. Mendalami deployment edge Cloudflare, integrasi Cloudinary, dan Gmail API, meraih Juara 3 pada kompetisi web development SINERGI FEST oleh BEM KM Fasilkom UNSRI.',
          highlights: [
            'Cloudflare Edge',
            'Gmail API',
            'Cloudinary',
            'Juara 3 SINERGI FEST',
          ],
        },
        {
          year: 'Okt - Nov 2025',
          title: 'Kepemimpinan Tim, E-Commerce & AI Workflow',
          tagline: 'Manajemen workflow dan kolaborasi modern',
          description:
            'Memimpin tim dalam project e-commerce berbasis open-source Bagisto dan side-project kolaboratif. Menerapkan alur Git branch, review pull request, pipeline CI, serta mulai mengadopsi AI coding agent dalam alur kerja harian.',
          highlights: [
            'Team Lead & Git Flow',
            'GraphQL',
            'Next.js',
            'Bagisto SaaS',
            'AI Agent Workflow',
          ],
        },
        {
          year: 'Nov - Des 2025',
          title: 'Juara 1 Lomba Inovasi Kota Palembang',
          tagline: 'Iterasi menuju dampak nyata',
          description:
            'Melanjutkan pengembangan dan menyempurnakan ECO-RAPID untuk Lomba Inovasi Kota Palembang 2025, berhasil meraih Juara 1 Kategori Masyarakat.',
          highlights: ['Juara 1 Inovasi', 'Civic Tech', 'Iterasi Produksi'],
        },
        {
          year: 'Des 2025',
          title: 'Utility Komunitas Game & Optimasi SEO',
          tagline: 'Trafik organik dan CTR tinggi',
          description:
            'Membangun web utility untuk komunitas pemain game Growtopia di masa libur semester, mengoptimasi SEO hingga mencapai Click-Through Rate (CTR) organik 20% sampai 25%.',
          highlights: [
            'Optimasi SEO',
            'Tooling Komunitas',
            'CTR Tinggi (20-25%)',
          ],
        },
        {
          year: 'Jan - Mei 2026',
          title: 'Tugas Akhir: Microservice SSO Kampus',
          tagline: 'Arsitektur autentikasi terpusat',
          description:
            'Mengerjakan Tugas Akhir dengan merancang sistem Single Sign-On (SSO) terpusat untuk kampus. Membangun arsitektur microservice monorepo (1 FE, 2 BE, 2 DB, 1 FE dokumentasi) dengan protokol RPC dan pipeline CI/CD mandiri.',
          highlights: [
            'Single Sign-On (SSO)',
            'Microservices & RPC',
            'Monorepo',
            'CI/CD & Agile',
          ],
        },
        {
          year: 'Jun - Jul 2026',
          title: 'Rangkaian Utility Administrasi Kampus',
          tagline: 'Menyelesaikan hambatan birokrasi mahasiswa',
          description:
            'Mengatasi kendala birokrasi pasca-sidang dengan membangun empat web tools client-side tanpa database berbasis React Router v7: Pembuat Dokumen Syarat Proposal, Guide Pengajuan Kompre, UNSRI Repository Guide with file maker, dan Roadmap Yudisium & Wisuda Fasilkom UNSRI. Rangkaian tools ini membantu puluhan rekan mahasiswa menyelesaikan berkas kelulusan.',
          highlights: [
            'React Router v7',
            'Arsitektur Client-Side',
            'Tooling Administrasi Kampus',
          ],
        },
        {
          year: 'Agu 2026 - Sekarang',
          title: 'Pematangan Karir, Rencana Project & Portofolio Utama',
          tagline: 'Arah rekayasa jangka panjang',
          description:
            'Fokus membangun tooling produktivitas mandiri, menyempurnakan CV dan profil LinkedIn, merancang arsitektur project masa depan, serta mengembangkan platform portofolio Winterest dengan TanStack Start dan Cloudflare Workers.',
          highlights: [
            'Pematangan Karir',
            'Perencanaan Project',
            'TanStack Start',
            'Cloudflare Workers',
          ],
        },
      ],
      currentStage:
        'Fase pasca-kelulusan: mendalami sistem fullstack edge, menyempurnakan reputasi profesional, dan merancang arsitektur perangkat lunak yang berjangka panjang.',
      softSkillsFocus:
        'Menyeimbangkan kedalaman arsitektur teknis dengan komunikasi, penulisan teknis, mentoring, dan kepemimpinan tim kolaboratif.',
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
          iconUrl:
            'https://static.wikia.nocookie.net/mobile-legends/images/f/fb/MLBB_icon.png/revision/latest?cb=20241013132437',
          heroName: 'Hirara',
          heroLabel: 'Hero Favorit Saat Ini',
          heroImage:
            'https://cdn-www.bluestacks.com/bs-images/MobileLegendsBangBang_Guide_HiraraGuide_EN011.png',
          notes:
            'Suka nyobain hero baru / revamp (sekarang lagi suka Hirara). Rehat push rank di server utama demi prioritas dunia nyata.',
        },
        growtopia: {
          name: 'Growtopia',
          ign: 'WinterEsCape',
          world: 'UYCRIM',
          iconUrl:
            'https://s3.eu-west-1.amazonaws.com/cdn.growtopiagame.com/website/resources/assets/upload/1_grow_icon_1513191167.jpg',
          notes:
            'Suka banget sama game ini karena kerasa kayak simulasi kehidupan nyata tentang grinding, trading, dan mengejar impian.',
        },
        genshin: {
          name: 'Genshin Impact',
          ign: 'Winter',
          iconUrl:
            'https://static.wikia.nocookie.net/logopedia/images/3/3a/Genshin_Impact_Icon_Version_1.0.png/revision/latest/scale-to-width-down/250?cb=20250902081559',
          notes:
            'Pemain Low Spender. Mulai di era Fontaine, sempat rehat ~2 tahun, dan balik lagi sebelum Snezhnaya rilis.',
          favLabel: 'Karakter Favorit',
          favorites: [
            {
              name: 'Arlecchino',
              reason: 'Suka karena aura "baddie"-nya yang keren parah.',
              image:
                'https://static.wikia.nocookie.net/gensin-impact/images/6/69/Arlecchino_Birthday_2024.jpg/revision/latest/scale-to-width-down/1200?cb=20240822040458',
            },
            {
              name: 'Wanderer',
              reason: 'Ngerasa personalitasnya mirip sama aku.',
              image:
                'https://upload-os-bbs.hoyolab.com/upload/2024/08/09/159056263/cde043660397343b27fc1f6005f8b4f1_1167825517051000668.jpg',
            },
            {
              name: 'Lohen',
              reason: 'Punya visual dan aura kembar mirip Wanderer.',
              image:
                'https://preview.redd.it/lohen-fanart-art-by-me-v0-nfaet96zft5h1.jpg?width=640&crop=smart&auto=webp&s=6a66582017b3ff95a5031299a2ba033f67ff4548',
            },
            {
              name: 'Tsaritsa',
              reason: 'Ratu sejati dari Snezhnaya.',
              image:
                'https://static.wikia.nocookie.net/gensin-impact/images/f/f5/Tsaritsa_Illustration.png/revision/latest?cb=20260627014155',
            },
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
        charImage:
          'https://i.pinimg.com/564x/86/b2/10/86b21044fa7c743a9816b39ad251582f.jpg',
        reason:
          'Gojo itu keren banget, dan JJK punya salah satu sistem kekuatan domain expansion yang paling menarik.',
      },
      kpop: {
        title: 'K-Pop Fanboy',
        summary:
          'Terang-terangan seorang multifan yang suka musik girl group K-pop energik.',
        biasLabel: 'Bias',
        songLabel: 'Lagu Favorit',
        spotifyLabel: 'Buka di Spotify',
        groups: [
          {
            name: 'aespa',
            bias: 'Winter',
            song: 'Armageddon',
            albumCover:
              'https://i.scdn.co/image/ab67616d0000b273c60843bafc67821cff6df260',
            spotifyUrl: 'https://open.spotify.com/album/4SboBpuYojDm02qS4iFeJC',
            biasImage:
              'https://static.wikia.nocookie.net/aespa/images/0/04/THE_CULTURE%2C_THE_FUTURE_Teaser_Winter_%282%29.jpg/revision/latest?cb=20250331093258',
            logoUrl:
              'https://images.seeklogo.com/logo-png/40/1/aespa-logo-png_seeklogo-406894.png',
            color: 'from-blue-500/20 via-purple-500/15 to-transparent',
          },
          {
            name: 'BLACKPINK',
            bias: 'Rosé',
            song: 'Ddu-du Ddu-du',
            albumCover:
              'https://i.scdn.co/image/ab67616d0000b27398135e0d2d1675f2b502f01c',
            spotifyUrl:
              'https://open.spotify.com/intl-id/track/2aI2k39nfa3KFsa4JclQzw',
            biasImage:
              'https://img.okezone.com/okz/500/library/images/2024/09/26/rose_blackpink_21875.jpg',
            logoUrl:
              'https://images.seeklogo.com/logo-png/38/1/blackpink-logo-png_seeklogo-384214.png',
            color: 'from-pink-500/20 via-rose-500/15 to-transparent',
          },
          {
            name: 'LE SSERAFIM',
            bias: 'Chaewon',
            song: 'Sour Grape',
            albumCover:
              'https://i.scdn.co/image/ab67616d0000b2739ae8d973353277c7dec2c27d',
            spotifyUrl:
              'https://open.spotify.com/intl-id/track/6wBpO4Xc4YgShnENGSFA1M',
            biasImage:
              'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTbBA2awG_EbxgQoz4KVn6NuUq1LZ7BBFnBXa1zoSNQsj2_x5i7dbTyyAY&s=10',
            logoUrl:
              'https://i.pinimg.com/564x/a1/b9/57/a1b95706564eb26a6959617951f706ac.jpg',
            color: 'from-amber-500/20 via-orange-500/15 to-transparent',
          },
          {
            name: 'IVE',
            bias: 'Wonyoung',
            song: 'Off The Record',
            albumCover:
              'https://i.scdn.co/image/ab67616d0000b273e5cc60bec326c779d17ee76e',
            spotifyUrl:
              'https://open.spotify.com/intl-id/album/7qch1xWGWuU5VxZEYBF5KW',
            biasImage:
              'https://upload.wikimedia.org/wikipedia/commons/0/07/Jang_Won-young_at_the_Bulgari_Eclettica_event_in_Seoul%2C_May_12%2C_2026_%281%29.png?utm_source=en.wikipedia.org&utm_campaign=index&utm_content=original',
            logoUrl:
              'https://i.pinimg.com/564x/a6/7c/f5/a67cf5ee06108c44d716f5969d873ac8.jpg',
            color: 'from-indigo-500/20 via-sky-500/15 to-transparent',
          },
          {
            name: 'Hearts2Hearts',
            bias: 'A-na',
            song: 'The Chase',
            albumCover:
              'https://i.scdn.co/image/ab67616d0000b273d346fc1102eb417305b5358b',
            spotifyUrl:
              'https://open.spotify.com/intl-id/track/68UrZQUuO3O6eUiD226xHg',
            biasImage:
              'https://upload.wikimedia.org/wikipedia/commons/8/82/A-Na_of_Hearts2Hearts%2C_March_29%2C_2025.jpg?utm_source=id.wikipedia.org&utm_campaign=index&utm_content=original',
            logoUrl:
              'https://i.pinimg.com/564x/9f/79/4a/9f794aa34348d15f8a07e99006275b03.jpg',
            color: 'from-emerald-500/20 via-teal-500/15 to-transparent',
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

export function getAboutCopy() {
  const locale = getLocale()
  return aboutCopy[locale === 'id' ? 'id' : 'en']
}

export const aboutData = aboutCopy
export const getAboutData = getAboutCopy
