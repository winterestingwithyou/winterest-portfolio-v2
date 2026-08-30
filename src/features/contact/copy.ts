import { getLocale } from '#/paraglide/runtime'

export const contactCopy = {
  en: {
    page: {
      eyebrow: 'Contact',
      title: "Let's connect.",
      description:
        'Have a project idea, question, or opportunity? Reach out directly via social media or send a message below.',
    },
    direct: {
      title: 'Direct Channels',
      subtitle: 'Social media & public profiles.',
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
      sendSuccessTitle: 'Message sent!',
      sendSuccessSubtitle:
        'Thank you for reaching out! Your message has been delivered to my inbox.',
      sendAnother: 'Send Another Message',
      sendErrorTitle: 'Failed to send message',
    },
  },
  id: {
    page: {
      eyebrow: 'Kontak',
      title: 'Mari terhubung.',
      description:
        'Punya ide proyek, pertanyaan, atau peluang kerja sama? Hubungi saya langsung via media sosial atau kirim pesan di bawah.',
    },
    direct: {
      title: 'Kontak Langsung',
      subtitle: 'Media sosial & profil publik.',
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
      sendSuccessTitle: 'Pesan terkirim!',
      sendSuccessSubtitle:
        'Terima kasih telah menghubungi! Pesan Anda telah berhasil terkirim.',
      sendAnother: 'Kirim Pesan Lain',
      sendErrorTitle: 'Gagal mengirim pesan',
    },
  },
} as const

export function getContactCopy() {
  const locale = getLocale() === 'id' ? 'id' : 'en'
  return contactCopy[locale]
}
