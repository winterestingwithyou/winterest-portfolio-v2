import { getLocale } from '#/paraglide/runtime'

export const settingsCopy = {
  en: {
    title: 'Settings',
    description:
      'Manage site identity, contact email, SEO defaults, and system preferences.',
    accessDeniedTitle: 'Owner or Admin access only',
    accessDeniedDescription:
      'System settings are restricted to accounts with Owner or Admin roles.',
    tabs: {
      general: 'General',
      visual: 'Branding & Visual',
      contact: 'Contact',
      seo: 'SEO & Meta',
      system: 'System',
    },
    socialNotice:
      'Social media links are now managed independently in the Social Links menu.',
    goToSocial: 'Manage Social Links',
    form: {
      siteName: 'Site name',
      siteNameDesc: 'Public brand name (default: Winterest).',
      siteTagline: 'Tagline',
      siteTaglineDesc: 'Short headline for branding and hero meta.',
      siteDescription: 'Site summary / bio',
      siteDescriptionDesc: 'Personal intro summary used on public pages.',
      defaultLocale: 'Default language',
      heroVisualUrl: 'Hero Visual / Mascot Image',
      heroVisualDesc:
        'Custom hero image or mascot for the homepage. Leave empty to use the default mascot.',
      cvHeading: 'Curriculum Vitae (CV)',
      cvHeadingDesc:
        'Upload your latest CV in PDF format. Visitors can view and download this file directly from the homepage and resume.',
      cvEnLabel: 'English Version',
      cvEnDesc:
        'Shown to international visitors, and used as the default if the Indonesian version is not added.',
      cvIdLabel: 'Indonesian Version',
      cvIdDesc:
        'Shown when visitors browse in Indonesian. If left empty, your English CV is used automatically.',
      cvFallbackActive:
        'Not uploaded yet. Visitors will see your English CV automatically.',
      cvStatusActive: 'Active',
      cvStatusEmpty: 'Not uploaded',
      cvStatusUsingEn: 'Using English CV',
      selectCvPdf: 'Choose PDF File',
      changeCvPdf: 'Change File',
      preview: 'Preview',
      removeCvPdf: 'Remove',
      noCvUploaded: 'No PDF file selected yet.',
      publicEmail: 'Public contact email',
      publicEmailDesc:
        'Primary email address displayed for direct inquiries and contact channels.',
      homepageSeoHeading: 'Homepage SEO (Landing Page)',
      homepageSeoDesc:
        'Configure the browser tab title and description specifically for the homepage (/).',
      metaLanguageEn: 'English (EN)',
      metaLanguageId: 'Indonesian (ID)',
      metaTitleEn: 'Homepage Meta Title (English)',
      metaTitleId: 'Homepage Meta Title (Indonesian)',
      metaTitleDesc:
        'Browser tab title and search snippet title specifically for the Homepage.',
      metaDescriptionEn: 'Homepage SEO description (English)',
      metaDescriptionId: 'Homepage SEO description (Indonesian)',
      metaDescriptionDesc: 'Summary shown in search engine snippet results.',
      ogDescriptionEn: 'OpenGraph description (English)',
      ogDescriptionId: 'OpenGraph description (Indonesian)',
      ogDescriptionDesc:
        'Social share description for Twitter/X, LinkedIn, Discord, and WhatsApp.',
      subpageSeoHeading: 'Sub-page Title Template',
      subpageSeoDesc:
        'Configure how titles for all sub-pages (e.g. /about, /projects, /contact, /dashboard) are formatted.',
      metaTitleTemplate: 'Title template for sub-pages',
      metaTitleTemplateDesc:
        'Template for browser tab title where %s represents the page name (e.g. %s | Winterest).',
      templatePreviewLabel: 'Live title preview:',
      templatePreviewExample: 'About | Winterest',
      faviconUrl: 'Favicon / Browser Icon',
      faviconDesc:
        'Small icon displayed in browser tabs and bookmarks (PNG, SVG, or ICO).',
      ogImageUrl: 'OpenGraph Share Image',
      ogImageDesc:
        'Banner image (1200x630px recommended) displayed when sharing website links on social platforms.',
      socialPreviewTitle: 'Social Share Card Preview',
      maintenanceMode: 'Maintenance mode',
      maintenanceModeDesc: 'Show maintenance screen for public visitors.',
      saveChanges: 'Save settings',
      saving: 'Saving settings...',
    },
    feedback: {
      updated: 'Settings saved successfully.',
      saveError: 'Failed to save settings.',
      loadError: 'Failed to load settings.',
    },
  },
  id: {
    title: 'Pengaturan',
    description:
      'Kelola identitas situs, email kontak, preferensi SEO, dan pengaturan sistem.',
    accessDeniedTitle: 'Akses Khusus Owner atau Admin',
    accessDeniedDescription:
      'Pengaturan sistem hanya dapat diakses oleh akun dengan role Owner atau Admin.',
    tabs: {
      general: 'Umum',
      visual: 'Branding & Visual',
      contact: 'Kontak',
      seo: 'SEO & Meta',
      system: 'Sistem',
    },
    socialNotice:
      'Tautan media sosial kini dikelola secara mandiri di menu Media Sosial.',
    goToSocial: 'Kelola Media Sosial',
    form: {
      siteName: 'Nama situs',
      siteNameDesc: 'Nama brand publik (bawaan: Winterest).',
      siteTagline: 'Tagline',
      siteTaglineDesc: 'Slogan singkat untuk branding dan meta hero.',
      siteDescription: 'Ringkasan / bio situs',
      siteDescriptionDesc: 'Perkenalan singkat untuk halaman publik.',
      defaultLocale: 'Bahasa bawaan',
      heroVisualUrl: 'Gambar Hero Visual / Maskot',
      heroVisualDesc:
        'Gambar hero atau maskot custom untuk homepage. Kosongkan untuk menggunakan maskot bawaan.',
      cvHeading: 'Curriculum Vitae (CV)',
      cvHeadingDesc:
        'Unggah berkas CV terbaru dalam format PDF. Berkas ini yang akan diunduh pengunjung dari tombol di halaman utama dan resume.',
      cvEnLabel: 'Versi Bahasa Inggris',
      cvEnDesc:
        'Ditampilkan untuk pengunjung internasional, sekaligus jadi pilihan bawaan jika versi Indonesia belum diunggah.',
      cvIdLabel: 'Versi Bahasa Indonesia',
      cvIdDesc:
        'Ditampilkan saat pengunjung membuka situs dalam Bahasa Indonesia. Jika kosong, situs otomatis memakai versi Inggris.',
      cvFallbackActive:
        'Belum diunggah. Pengunjung akan otomatis diarahkan ke versi Inggris.',
      cvStatusActive: 'Aktif',
      cvStatusEmpty: 'Belum ada',
      cvStatusUsingEn: 'Memakai versi Inggris',
      selectCvPdf: 'Pilih Berkas PDF',
      changeCvPdf: 'Ganti Berkas',
      preview: 'Pratinjau',
      removeCvPdf: 'Hapus',
      noCvUploaded: 'Belum ada berkas PDF yang dipilih.',
      publicEmail: 'Email kontak publik',
      publicEmailDesc:
        'Alamat email utama yang ditampilkan untuk saluran kontak dan pertanyaan langsung.',
      homepageSeoHeading: 'SEO Halaman Beranda',
      homepageSeoDesc:
        'Atur judul tab browser dan deskripsi khusus untuk halaman beranda utama (/).',
      metaLanguageEn: 'Bahasa Inggris (EN)',
      metaLanguageId: 'Bahasa Indonesia (ID)',
      metaTitleEn: 'Judul Meta Beranda (Bahasa Inggris)',
      metaTitleId: 'Judul Meta Beranda (Bahasa Indonesia)',
      metaTitleDesc:
        'Judul tab browser dan snippet pencarian khusus untuk Halaman Beranda.',
      metaDescriptionEn: 'Deskripsi SEO Beranda (Bahasa Inggris)',
      metaDescriptionId: 'Deskripsi SEO Beranda (Bahasa Indonesia)',
      metaDescriptionDesc:
        'Ringkasan yang ditampilkan pada cuplikan hasil mesin pencari untuk beranda.',
      ogDescriptionEn: 'Deskripsi OpenGraph (Bahasa Inggris)',
      ogDescriptionId: 'Deskripsi OpenGraph (Bahasa Indonesia)',
      ogDescriptionDesc:
        'Deskripsi kartu share media sosial (Twitter/X, LinkedIn, Discord, WhatsApp).',
      subpageSeoHeading: 'Template Format Judul Halaman Turunan',
      subpageSeoDesc:
        'Atur format judul browser untuk seluruh halaman turunan (seperti /about, /projects, /contact, /dashboard).',
      metaTitleTemplate: 'Template format judul meta',
      metaTitleTemplateDesc:
        'Format judul tab browser di mana %s akan diganti dengan nama halaman (cth. %s | Winterest).',
      templatePreviewLabel: 'Pratinjau format judul:',
      templatePreviewExample: 'Tentang | Winterest',
      faviconUrl: 'Favicon / Ikon Browser',
      faviconDesc:
        'Ikon kecil yang ditampilkan pada tab browser dan bookmark (PNG, SVG, atau ICO).',
      ogImageUrl: 'Gambar Share OpenGraph',
      ogImageDesc:
        'Gambar banner (disarankan 1200x630px) saat tautan situs dibagikan ke media sosial.',
      socialPreviewTitle: 'Pratinjau Kartu Share Medsos',
      maintenanceMode: 'Mode pemeliharaan',
      maintenanceModeDesc:
        'Tampilkan pesan pemeliharaan untuk pengunjung publik.',
      saveChanges: 'Simpan pengaturan',
      saving: 'Menyimpan pengaturan...',
    },
    feedback: {
      updated: 'Pengaturan berhasil disimpan.',
      saveError: 'Gagal menyimpan pengaturan.',
      loadError: 'Gagal memuat pengaturan.',
    },
  },
} as const

export function getSettingsCopy() {
  const locale = getLocale() === 'id' ? 'id' : 'en'
  return settingsCopy[locale]
}
