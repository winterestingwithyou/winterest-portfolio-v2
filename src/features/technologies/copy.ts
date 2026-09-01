import { getLocale } from '#/paraglide/runtime'

export const technologiesCopy = {
  en: {
    meta: {
      title: 'Tech Stack',
      description:
        'Catalog of tools, runtimes, frameworks, and databases powering Winterest applications.',
    },
    page: {
      eyebrow: 'Stack',
      title: 'Tech Stack that I use',
      description: 'List of Tech and Tools that I use to build my projects.',
    },
    ultimate: {
      ultimateEyebrow: 'Ultimate Tech Stack',
      ultimateTitle: 'Core Architecture & Preferred Stack',
      ultimateDescription:
        'The primary frameworks, runtimes, and databases powering my flagship production web platforms.',
      stackNode: 'Stack node',
    },
  },
  id: {
    meta: {
      title: 'Tech Stack',
      description:
        'Katalog alat, runtime, framework, dan database yang menopang aplikasi web produksi Winterest.',
    },
    page: {
      eyebrow: 'Stack',
      title: 'Tech Stack yang kupakai',
      description:
        'Daftar Tech dan Tools yang kugunakan untuk membuat project andalanku.',
    },
    ultimate: {
      ultimateEyebrow: 'Ultimate Tech Stack',
      ultimateTitle: 'Arsitektur Utama & Stack Pilihan',
      ultimateDescription:
        'Framework, runtime, dan database utama yang menopang aplikasi web produksi milikku.',
      stackNode: 'Node stack',
    },
  },
} as const

export function getTechnologiesCopy() {
  const locale = getLocale() === 'id' ? 'id' : 'en'
  return technologiesCopy[locale]
}
