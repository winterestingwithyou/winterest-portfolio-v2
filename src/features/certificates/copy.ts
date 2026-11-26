import { getLocale } from '#/paraglide/runtime'

export type CertificateFormValidationCopy = {
  required: string
  titleTooLong: string
  issuerTooLong: string
  credentialTooLong: string
  descriptionTooLong: string
  invalidUrl: string
  invalidDate: string
  invalidStatus: string
  expiryDateError: string
  mediaRequired: string
  unsupportedMedia: string
  mediaTooLarge: string
}

export const certificatesCopy = {
  en: {
    meta: {
      title: 'Certificates',
      description: 'Certificates and credentials earned by Winterest.',
    },
    public: {
      eyebrow: 'CREDENTIALS',
      title: 'Certificates',
      description: 'Credentials I have earned and ways to verify them.',
      empty: 'There are no published certificates yet.',
      searchLabel: 'Search certificates',
      searchPlaceholder: 'Search by certificate, issuer, or description',
      noMatchesTitle: 'No matching certificates.',
      noMatchesDescription: 'Try another search term or clear your search.',
      clearSearch: 'Clear search',
      itemLabel: 'certificates',
      issued: 'Issued',
      expires: 'Expires',
      expired: 'Expired',
      credentialId: 'Credential ID',
      openPdf: 'Open certificate PDF',
      verify: 'Verify with issuer',
      coverAlt: (title: string, issuer: string) =>
        `${title}, issued by ${issuer}`,
    },
    home: {
      eyebrow: 'LEARNING & CREDENTIALS',
      title: 'Certificates',
      description: 'A selection of certificates and credentials I have earned.',
      viewAll: 'View all certificates',
      issued: 'Issued',
      openPdf: 'Open PDF',
      verify: 'Verify',
      expired: 'Expired',
      position: (current: number, total: number) =>
        `Certificate ${current} of ${total}`,
      coverAlt: (title: string, issuer: string) =>
        `${title}, issued by ${issuer}`,
    },
    dashboard: {
      title: 'Certificates',
      description: 'Manage certificates and their public verification links.',
      pageContent: {
        title: 'Certificate page content',
        description: 'Edit the heading shown on the public certificate page.',
        saveSuccess: 'Certificate page content saved successfully.',
        saveError: 'Failed to save certificate page content.',
        resetConfirm: 'Reset certificate page text to the defaults?',
        resetSuccess: 'Defaults restored. Save to apply these changes.',
        homeResetConfirm:
          'Reset the homepage certificates section to defaults?',
        homeResetSuccess: 'Homepage section defaults restored. Save to apply.',
        saveHomeContent: 'Save Section',
        saveHomeSuccess: 'Homepage certificates section saved successfully.',
        saveHomeError: 'Failed to save the homepage certificates section.',
        pageHeaderTitle: 'Certificates page header',
        pageHeaderDescription:
          'Shown at the top of the public certificate list.',
        homeHeaderTitle: 'Homepage certificates section',
        homeHeaderDescription:
          'Shown above the certificate carousel on the homepage.',
        eyebrowLabel: (locale: string) => `Eyebrow (${locale})`,
        titleLabel: (locale: string) => `Title (${locale})`,
        descriptionLabel: (locale: string) => `Description (${locale})`,
        showDescription: 'Show description',
      },
      refresh: 'Refresh',
      searchPlaceholder:
        'Search by title, issuer, credential ID, or description',
      clearSearch: 'Clear search',
      allStatuses: 'All statuses',
      allIssuers: 'All issuers',
      statusFilterLabel: 'Filter by status',
      issuerFilterLabel: 'Filter by issuer',
      noMatchingCertificates: 'No matching certificates.',
      certificatesLabel: 'certificates',
      statusDraft: 'Draft',
      statusPublished: 'Published',
      new: 'New certificate',
      createFirst: 'Add a certificate',
      emptyTitle: 'No certificates yet.',
      emptyDescription:
        'Add a certificate to make it available for publishing.',
      newTitle: 'New certificate',
      newDescription:
        'Add the certificate details and its document or verification link.',
      editTitle: 'Edit certificate',
      editDescription: 'Update certificate details and publication status.',
      notFound: 'Certificate not found.',
      deleteTitle: 'Delete certificate',
      deleteConfirm: (title: string) =>
        `Delete “${title}”? This cannot be undone.`,
      saveError: 'Failed to save certificate.',
      deleteError: 'Failed to delete certificate.',
      form: {
        title: 'Certificate title',
        issuer: 'Issuer',
        credentialId: 'Credential ID',
        issuedAt: 'Issue date',
        expiresAt: 'Expiration date',
        descriptionEn: 'Description (English)',
        descriptionId: 'Description (Indonesian)',
        coverImage: 'Cover image',
        pdf: 'Certificate PDF',
        verificationUrl: 'Verification URL',
        status: 'Status',
        draft: 'Draft',
        published: 'Published',
        chooseImage: 'Choose cover image',
        choosePdf: 'Choose PDF',
        removeImage: 'Remove image',
        removePdf: 'Remove PDF',
        imageSelected: 'Cover image selected',
        imageNotSelected: 'No cover image selected',
        pdfSelected: 'Certificate PDF selected',
        pdfNotSelected: 'No certificate PDF selected',
        viewPdf: 'View PDF',

        expiryDateError: 'Expiry date must be after the issue date.',
        save: 'Save certificate',
        saving: 'Saving certificate...',
        delete: 'Delete certificate',
        cancel: 'Cancel',
        selectPdf: 'Select PDF from Media Library',
        selectImage: 'Select image from Media Library',
        optional: 'Optional',
        artifactTabsLabel: 'Certificate document or verification link',
        artifactRequirement:
          'At least one option is required. You may provide both.',
        provided: 'Provided',
        notProvided: 'Not provided',
        validation: {
          required: 'This field is required.',
          titleTooLong: 'Keep the title within 200 characters.',
          issuerTooLong: 'Keep the issuer within 160 characters.',
          credentialTooLong: 'Keep the credential ID within 160 characters.',
          descriptionTooLong: 'Keep the description within 2,000 characters.',
          invalidUrl: 'Enter a valid URL.',
          invalidDate: 'Enter a valid date.',
          invalidStatus: 'Choose a valid publication status.',
          expiryDateError: 'Expiry date must be after the issue date.',
          mediaRequired: 'Add a PDF certificate or a verification URL.',
          unsupportedMedia: 'Select a supported file from the Media Library.',
          mediaTooLarge:
            'The selected file exceeds the 10 MB Media Library limit.',
        },
      },
    },
  },
  id: {
    meta: {
      title: 'Sertifikat',
      description: 'Sertifikat dan kredensial yang dimiliki Winterest.',
    },
    public: {
      eyebrow: 'KREDENSIAL',
      title: 'Sertifikat',
      description: 'Sertifikat yang saya peroleh dan cara memverifikasinya.',
      empty: 'Belum ada sertifikat yang dipublikasikan.',
      searchLabel: 'Cari sertifikat',
      searchPlaceholder:
        'Cari berdasarkan sertifikat, penerbit, atau deskripsi',
      noMatchesTitle: 'Sertifikat tidak ditemukan.',
      noMatchesDescription: 'Coba kata kunci lain atau hapus pencarian.',
      clearSearch: 'Hapus pencarian',
      itemLabel: 'sertifikat',
      issued: 'Diterbitkan',
      expires: 'Berlaku sampai',
      expired: 'Kedaluwarsa',
      credentialId: 'ID Kredensial',
      openPdf: 'Buka PDF sertifikat',
      verify: 'Verifikasi melalui penerbit',
      coverAlt: (title: string, issuer: string) =>
        `${title}, diterbitkan oleh ${issuer}`,
    },
    home: {
      eyebrow: 'PEMBELAJARAN & KREDENSIAL',
      title: 'Sertifikat',
      description: 'Pilihan sertifikat dan kredensial yang telah saya peroleh.',
      viewAll: 'Lihat semua sertifikat',
      issued: 'Diterbitkan',
      openPdf: 'Buka PDF',
      verify: 'Verifikasi',
      expired: 'Kedaluwarsa',
      position: (current: number, total: number) =>
        `Sertifikat ${current} dari ${total}`,
      coverAlt: (title: string, issuer: string) =>
        `${title}, diterbitkan oleh ${issuer}`,
    },
    dashboard: {
      title: 'Sertifikat',
      description: 'Kelola sertifikat dan tautan verifikasi publiknya.',
      pageContent: {
        title: 'Konten halaman sertifikat',
        description:
          'Atur judul yang ditampilkan pada halaman sertifikat publik.',
        saveSuccess: 'Konten halaman sertifikat berhasil disimpan.',
        saveError: 'Gagal menyimpan konten halaman sertifikat.',
        resetConfirm:
          'Kembalikan teks halaman sertifikat ke pengaturan bawaan?',
        resetSuccess: 'Pengaturan bawaan dipulihkan. Simpan untuk menerapkan.',
        homeResetConfirm:
          'Kembalikan section sertifikat beranda ke pengaturan bawaan?',
        homeResetSuccess:
          'Pengaturan bawaan section beranda dipulihkan. Simpan untuk menerapkan.',
        saveHomeContent: 'Simpan Seksi',
        saveHomeSuccess: 'Section sertifikat beranda berhasil disimpan.',
        saveHomeError: 'Gagal menyimpan section sertifikat beranda.',
        pageHeaderTitle: 'Header halaman sertifikat',
        pageHeaderDescription:
          'Ditampilkan di bagian atas daftar sertifikat publik.',
        homeHeaderTitle: 'Section sertifikat di beranda',
        homeHeaderDescription:
          'Ditampilkan di atas carousel sertifikat di beranda.',
        eyebrowLabel: (locale: string) => `Eyebrow (${locale})`,
        titleLabel: (locale: string) => `Judul (${locale})`,
        descriptionLabel: (locale: string) => `Deskripsi (${locale})`,
        showDescription: 'Tampilkan deskripsi',
      },
      refresh: 'Segarkan',
      searchPlaceholder: 'Cari judul, penerbit, ID kredensial, atau deskripsi',
      clearSearch: 'Hapus pencarian',
      allStatuses: 'Semua status',
      allIssuers: 'Semua penerbit',
      statusFilterLabel: 'Filter berdasarkan status',
      issuerFilterLabel: 'Filter berdasarkan penerbit',
      noMatchingCertificates: 'Tidak ada sertifikat yang cocok.',
      certificatesLabel: 'sertifikat',
      statusDraft: 'Draf',
      statusPublished: 'Dipublikasikan',
      new: 'Sertifikat baru',
      createFirst: 'Tambah sertifikat',
      emptyTitle: 'Belum ada sertifikat.',
      emptyDescription: 'Tambahkan sertifikat agar bisa dipublikasikan.',
      newTitle: 'Sertifikat baru',
      newDescription:
        'Tambahkan detail sertifikat dan dokumen atau tautan verifikasinya.',
      editTitle: 'Edit sertifikat',
      editDescription: 'Ubah detail sertifikat dan status publikasinya.',
      notFound: 'Sertifikat tidak ditemukan.',
      deleteTitle: 'Hapus sertifikat',
      deleteConfirm: (title: string) =>
        `Hapus “${title}”? Tindakan ini tidak dapat dibatalkan.`,
      saveError: 'Gagal menyimpan sertifikat.',
      deleteError: 'Gagal menghapus sertifikat.',
      form: {
        title: 'Nama sertifikat',
        issuer: 'Penerbit',
        credentialId: 'ID Kredensial',
        issuedAt: 'Tanggal diterbitkan',
        expiresAt: 'Tanggal kedaluwarsa',
        descriptionEn: 'Deskripsi (English)',
        descriptionId: 'Deskripsi (Indonesia)',
        coverImage: 'Gambar cover',
        pdf: 'PDF sertifikat',
        verificationUrl: 'URL verifikasi',
        status: 'Status',
        draft: 'Draf',
        published: 'Dipublikasikan',
        chooseImage: 'Pilih gambar cover',
        choosePdf: 'Pilih PDF',
        removeImage: 'Hapus gambar',
        removePdf: 'Hapus PDF',
        imageSelected: 'Gambar cover terpilih',
        imageNotSelected: 'Belum ada gambar cover',
        pdfSelected: 'PDF sertifikat terpilih',
        pdfNotSelected: 'Belum ada PDF sertifikat',
        viewPdf: 'Lihat PDF',

        expiryDateError:
          'Tanggal kedaluwarsa harus setelah tanggal diterbitkan.',
        save: 'Simpan sertifikat',
        saving: 'Menyimpan sertifikat...',
        delete: 'Hapus sertifikat',
        cancel: 'Batal',
        selectPdf: 'Pilih PDF dari Media Library',
        selectImage: 'Pilih gambar dari Media Library',
        optional: 'Opsional',
        artifactTabsLabel: 'Dokumen sertifikat atau tautan verifikasi',
        artifactRequirement:
          'Minimal satu opsi wajib diisi. Keduanya boleh diisi.',
        provided: 'Terisi',
        notProvided: 'Belum diisi',
        validation: {
          required: 'Kolom ini wajib diisi.',
          titleTooLong: 'Nama sertifikat maksimal 200 karakter.',
          issuerTooLong: 'Nama penerbit maksimal 160 karakter.',
          credentialTooLong: 'ID kredensial maksimal 160 karakter.',
          descriptionTooLong: 'Deskripsi maksimal 2.000 karakter.',
          invalidUrl: 'Masukkan URL yang valid.',
          invalidDate: 'Masukkan tanggal yang valid.',
          invalidStatus: 'Pilih status publikasi yang valid.',
          expiryDateError:
            'Tanggal kedaluwarsa harus setelah tanggal diterbitkan.',
          mediaRequired: 'Tambahkan PDF sertifikat atau URL verifikasi.',
          unsupportedMedia: 'Pilih file yang didukung dari Media Library.',
          mediaTooLarge:
            'Ukuran file yang dipilih melebihi batas 10 MB Media Library.',
        },
      },
    },
  },
} as const

export function getCertificateCopy() {
  return certificatesCopy[getLocale() === 'id' ? 'id' : 'en']
}
