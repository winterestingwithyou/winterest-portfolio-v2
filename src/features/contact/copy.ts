import { getLocale } from '#/paraglide/runtime'

export type ContactValidationCopy = {
  nameRequired: string
  emailInvalid: string
  messageMinLength: string
  turnstileRequired: string
}

export const contactCopy = {
  en: {
    meta: {
      title: 'Contact',
      description:
        'Have a project idea, question, or opportunity? Reach out directly via social channels or send a direct message to Winterest.',
    },
    page: {
      eyebrow: 'Contact',
      title: "Let's connect.",
      description:
        'Have a project idea, question, or opportunity? Reach out directly via social media or send a message below.',
    },
    direct: {
      title: 'Direct Channels',
      subtitle: 'Social media & public profiles.',
      emailTitle: 'Email Address',
      emailSubtitle: 'Official direct correspondence.',
      copyEmail: 'Copy email',
      copiedEmail: 'Copied!',
      sendEmail: 'Send email',
      status: 'Open for new projects & opportunities',
      location: 'Indonesia (UTC+7)',
    },
    form: {
      title: 'Send a Message',
      subtitle: 'Fill out the form to compose a direct message.',
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
      verifyingSecurity: 'Verifying security...',
      sendSuccessTitle: 'Message sent!',
      sendSuccessSubtitle:
        'Thank you for reaching out! Your message has been delivered to my inbox.',
      sendAnother: 'Send Another Message',
      sendErrorTitle: 'Failed to send message',
      validation: {
        nameRequired: 'Name is required.',
        emailInvalid: 'Please enter a valid email address.',
        messageMinLength: 'Message must be at least 10 characters.',
        turnstileRequired: 'Please complete the security check.',
      },
    },
    dashboard: {
      title: 'Content Settings: Contact Page',
      description:
        'Manage header text, direct contact channel labels, and message form titles on /contact.',
      resetConfirm:
        'Reset form to default copywriting? Unsaved changes will be replaced.',
      resetSuccess: 'Form has been reset to default. Click save to apply.',
      saveSuccess: 'Contact page changes saved successfully.',
      saveError: 'Failed to save changes.',
      headerTitle: (lang: string) => `1. Contact Page Header (${lang})`,
      headerDesc:
        'Main introductory text at the very top of the /contact page.',
      eyebrowLabel: (lang: string) => `Eyebrow (${lang})`,
      eyebrowPlaceholder: 'e.g. Contact',
      titleLabel: (lang: string) => `Main Title (${lang}) *`,
      titlePlaceholder: "e.g. Let's connect.",
      descLabel: (lang: string) => `Description (${lang})`,
      descPlaceholder:
        'Have a project idea, question, or opportunity? Contact me directly or leave a message...',
      channelsTitle: (lang: string) => `2. Direct Channels Card (${lang})`,
      channelsDesc:
        'Titles, subtitles, and labels for direct contact channels.',
      channelsCardTitle: (lang: string) => `Card Title (${lang})`,
      channelsCardTitlePlaceholder: 'e.g. Direct Channels',
      channelsCardSubtitle: (lang: string) => `Card Subtitle (${lang})`,
      channelsCardSubtitlePlaceholder: 'e.g. Social media & public profiles.',
      statusPillLabel: (lang: string) => `Status Pill Label (${lang})`,
      statusPillPlaceholder: 'e.g. Open for new projects & opportunities',
      locationLabel: (lang: string) => `Location Label (${lang})`,
      locationPlaceholder: 'e.g. Indonesia (UTC+7)',
      formTitle: (lang: string) => `3. Message Form Section (${lang})`,
      formDesc:
        'Titles, subtitles, and button labels for the contact message form.',
      formHeading: (lang: string) => `Form Heading (${lang})`,
      formHeadingPlaceholder: 'e.g. Send a Message',
      formSubtitle: (lang: string) => `Form Subtitle (${lang})`,
      formSubtitlePlaceholder:
        'e.g. Fill out the form to compose a direct message.',
      sendBtnLabel: (lang: string) => `Submit Button Text (${lang})`,
      showDescription: 'Show Page Description',
      showDescriptionDesc:
        'Display the header description text on the public contact page.',
    },
  },
  id: {
    meta: {
      title: 'Kontak',
      description:
        'Punya ide proyek, pertanyaan, atau peluang kerja sama? Hubungi Winterest langsung via media sosial atau kirim pesan formulir.',
    },
    page: {
      eyebrow: 'Kontak',
      title: 'Mari terhubung.',
      description:
        'Punya ide proyek, pertanyaan, atau peluang kerja sama? Hubungi saya langsung via media sosial atau kirim pesan di bawah.',
    },
    direct: {
      title: 'Kontak Langsung',
      subtitle: 'Media sosial & profil publik.',
      emailTitle: 'Alamat Email',
      emailSubtitle: 'Komunikasi resmi & korespondensi langsung.',
      copyEmail: 'Salin email',
      copiedEmail: 'Tersalin!',
      sendEmail: 'Kirim email',
      status: 'Terbuka untuk kolaborasi & proyek baru',
      location: 'Indonesia (UTC+7)',
    },
    form: {
      title: 'Kirim Pesan',
      subtitle: 'Isi formulir di bawah untuk membuat pesan langsung.',
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
      verifyingSecurity: 'Memverifikasi keamanan...',
      sendSuccessTitle: 'Pesan terkirim!',
      sendSuccessSubtitle:
        'Terima kasih telah menghubungi! Pesan Anda telah berhasil terkirim.',
      sendAnother: 'Kirim Pesan Lain',
      sendErrorTitle: 'Gagal mengirim pesan',
      validation: {
        nameRequired: 'Nama wajib diisi.',
        emailInvalid: 'Format email tidak valid.',
        messageMinLength: 'Pesan minimal 10 karakter.',
        turnstileRequired: 'Verifikasi keamanan wajib diselesaikan.',
      },
    },
    dashboard: {
      title: 'Pengaturan Konten: Halaman Kontak',
      description:
        'Kelola teks header, label kartu kontak langsung, dan judul formulir pesan pada /contact.',
      resetConfirm:
        'Reset form ke default copywriting? Perubahan belum tersimpan akan diganti.',
      resetSuccess:
        'Form telah direset ke default. Klik simpan untuk menerapkan.',
      saveSuccess: 'Perubahan halaman kontak berhasil disimpan.',
      saveError: 'Gagal menyimpan perubahan.',
      headerTitle: (lang: string) => `1. Header Halaman Kontak (${lang})`,
      headerDesc: 'Teks utama di bagian paling atas halaman /contact.',
      eyebrowLabel: (lang: string) => `Eyebrow (${lang})`,
      eyebrowPlaceholder: 'mis. Kontak',
      titleLabel: (lang: string) => `Judul Utama (${lang}) *`,
      titlePlaceholder: 'mis. Mari terhubung.',
      descLabel: (lang: string) => `Deskripsi (${lang})`,
      descPlaceholder:
        'Punya ide proyek, pertanyaan, atau peluang kerja sama? Hubungi saya langsung atau kirim pesan...',
      channelsTitle: (lang: string) => `2. Kartu Kontak Langsung (${lang})`,
      channelsDesc: 'Judul, subjudul, dan label untuk kanal kontak langsung.',
      channelsCardTitle: (lang: string) => `Judul Kartu (${lang})`,
      channelsCardTitlePlaceholder: 'mis. Kontak Langsung',
      channelsCardSubtitle: (lang: string) => `Subjudul Kartu (${lang})`,
      channelsCardSubtitlePlaceholder: 'mis. Media sosial & profil publik.',
      statusPillLabel: (lang: string) => `Label Status Pill (${lang})`,
      statusPillPlaceholder: 'mis. Terbuka untuk kolaborasi & proyek baru',
      locationLabel: (lang: string) => `Label Lokasi (${lang})`,
      locationPlaceholder: 'mis. Indonesia (UTC+7)',
      formTitle: (lang: string) => `3. Seksi Formulir Pesan (${lang})`,
      formDesc: 'Judul, subjudul, dan tombol pada formulir kirim pesan.',
      formHeading: (lang: string) => `Judul Formulir (${lang})`,
      formHeadingPlaceholder: 'mis. Kirim Pesan',
      formSubtitle: (lang: string) => `Subjudul Formulir (${lang})`,
      formSubtitlePlaceholder:
        'mis. Isi formulir di bawah untuk membuat pesan langsung.',
      sendBtnLabel: (lang: string) => `Teks Tombol Kirim (${lang})`,
      showDescription: 'Tampilkan Deskripsi Halaman',
      showDescriptionDesc:
        'Tampilkan teks paragraf deskripsi di bawah judul utama pada halaman kontak publik.',
    },
  },
} as const

export function getContactCopy() {
  const locale = getLocale() === 'id' ? 'id' : 'en'
  return contactCopy[locale]
}
