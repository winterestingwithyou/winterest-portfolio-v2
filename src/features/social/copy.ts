import { getLocale } from '#/paraglide/runtime'

export const socialCopy = {
  en: {
    title: 'Social Links',
    description:
      'Manage public social media links, developer profiles, and direct community channels.',
    addLink: 'Add social link',
    editLink: 'Edit social link',
    dialogTitleNew: 'Add Social Media Link',
    dialogTitleEdit: 'Edit Social Media Link',
    dialogDescription:
      'Configure profile URL, display name, and public visibility for this platform.',
    emptyTitle: 'No social links configured yet',
    emptyDescription:
      'Add your GitHub, LinkedIn, X, or other social profiles to display them across public pages.',
    dialog: {
      selectPlatform: 'Select platform',
      alreadyAdded: 'Already added',
    },
    form: {
      platform: 'Platform',
      platformPlaceholder: 'Select a platform',
      username: 'Username',
      usernamePlaceholder: 'e.g. username or @handle',
      accountName: 'Display name',
      accountNamePlaceholder: 'e.g. Your Name',
      url: 'Profile URL',
      urlPlaceholder: 'https://...',
      isEnabled: 'Visible on public site',
      isEnabledDesc:
        'Toggle whether this link is rendered on the public header, footer, and contact page.',
      sortOrder: 'Display order',
      sortOrderDesc: 'Lower numbers appear first (e.g. 0, 1, 2).',
      save: 'Save link',
      saving: 'Saving...',
      cancel: 'Cancel',
      delete: 'Delete link',
      deleteConfirm: 'Are you sure you want to delete this social link?',
      deleteConfirmDesc:
        'This link will be removed immediately from your public profile.',
    },
    status: {
      active: 'Active',
      inactive: 'Hidden',
    },
    actions: {
      openLink: 'Open URL',
      edit: 'Edit',
      delete: 'Delete',
      toggleEnable: 'Toggle visibility',
    },
    feedback: {
      created: 'Social link added successfully.',
      updated: 'Social link updated successfully.',
      deleted: 'Social link deleted successfully.',
    },
  },
  id: {
    title: 'Media Sosial',
    description:
      'Kelola tautan media sosial publik, profil pengembang, dan kanal komunitas langsung.',
    addLink: 'Tambah tautan sosial',
    editLink: 'Edit tautan sosial',
    dialogTitleNew: 'Tambah Tautan Media Sosial',
    dialogTitleEdit: 'Edit Tautan Media Sosial',
    dialogDescription:
      'Atur URL profil, nama tampilan, dan visibilitas publik untuk platform ini.',
    emptyTitle: 'Belum ada tautan media sosial',
    emptyDescription:
      'Tambahkan profil GitHub, LinkedIn, X, atau media sosial lainnya untuk ditampilkan di halaman publik.',
    dialog: {
      selectPlatform: 'Pilih platform',
      alreadyAdded: 'Sudah ditambahkan',
    },
    form: {
      platform: 'Platform',
      platformPlaceholder: 'Pilih platform',
      username: 'Username',
      usernamePlaceholder: 'cth. username atau @handle',
      accountName: 'Nama tampilan',
      accountNamePlaceholder: 'cth. Nama Anda',
      url: 'URL Profil',
      urlPlaceholder: 'https://...',
      isEnabled: 'Tampilkan di situs publik',
      isEnabledDesc:
        'Aktifkan untuk menampilkan tautan ini di header, footer, dan halaman kontak publik.',
      sortOrder: 'Urutan tampilan',
      sortOrderDesc: 'Angka lebih kecil tampil lebih awal (cth. 0, 1, 2).',
      save: 'Simpan tautan',
      saving: 'Menyimpan...',
      cancel: 'Batal',
      delete: 'Hapus tautan',
      deleteConfirm: 'Apakah kamu yakin ingin menghapus tautan sosial ini?',
      deleteConfirmDesc:
        'Tautan ini akan segera dihapus dari profil publik kamu.',
    },
    status: {
      active: 'Aktif',
      inactive: 'Disembunyikan',
    },
    actions: {
      openLink: 'Buka URL',
      edit: 'Edit',
      delete: 'Hapus',
      toggleEnable: 'Ubah visibilitas',
    },
    feedback: {
      created: 'Tautan sosial berhasil ditambahkan.',
      updated: 'Tautan sosial berhasil diperbarui.',
      deleted: 'Tautan sosial berhasil dihapus.',
    },
  },
} as const

export function getSocialCopy() {
  const locale = getLocale() === 'id' ? 'id' : 'en'
  return socialCopy[locale]
}
