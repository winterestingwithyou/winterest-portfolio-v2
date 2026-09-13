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
    dashboard: {
      title: 'Tech Stack & Skills',
      description:
        'Manage technologies and skill categories displayed on the portfolio.',
      heading: 'Tech Stack & Skills',
      subheading:
        'Manage technologies and skill categories displayed on the portfolio.',
      technologiesLabel: 'technologies',
      categoriesLabel: 'categories',
      noMatchingTech: 'No matching technologies found.',
      noMatchingCategories: 'No matching categories found.',
      newCategory: 'New Category',
      newCategoryDesc: 'Add a new category to group technologies and tools.',
      editCategory: 'Edit Category',
      editCategoryDesc: 'Update technology category details and display order.',
      newTechnology: 'New Technology',
      newTechnologyDesc:
        'Add a technology, framework, or tool to your tech stack.',
      editTechnology: 'Edit Technology',
      editTechnologyDesc:
        'Update technology details, icon, or category associations.',
      tabs: {
        technologies: 'Technologies',
        categories: 'Categories',
      },
      actions: {
        addTechnology: 'Add Technology',
        addCategory: 'Add Category',
        backToStack: 'Back to Tech Stack',
      },
      deleteCategoryConfirm: (name: string) =>
        `Are you sure you want to delete category "${name}"?`,
      deleteCategoryError: 'Failed to delete category.',
      deleteTechConfirm: (name: string) =>
        `Are you sure you want to delete technology "${name}"?`,
      deleteTechError: 'Failed to delete technology.',
      categoriesTable: {
        loading: 'Loading categories...',
        empty: 'No categories yet.',
        addFirst: 'Add First Category',
        searchPlaceholder: 'Search categories...',
        columns: {
          order: 'Order',
          name: 'Category Name',
          slug: 'Slug',
          actions: 'Actions',
        },
        tooltips: {
          edit: 'Edit Category',
          delete: 'Delete Category',
        },
      },
      techTable: {
        loading: 'Loading technologies...',
        empty: 'No technologies yet.',
        addFirst: 'Add First Technology',
        searchPlaceholder: 'Search technologies...',
        allCategories: 'All Categories',
        columns: {
          icon: 'Icon',
          name: 'Name',
          slug: 'Slug',
          ultimate: 'Ultimate',
          categories: 'Categories',
          actions: 'Actions',
        },
        tooltips: {
          edit: 'Edit Technology',
          delete: 'Delete Technology',
        },
      },
      categoryForm: {
        name: 'Category Name',
        namePlaceholder: 'e.g. Frontend',
        slug: 'Slug URL',
        slugPlaceholder: 'e.g. frontend',
        sortOrder: 'Display Order',
        sortOrderPlaceholder: '1',
        sortOrderDesc:
          'Lower numbers will appear earlier in the category list.',
        save: 'Save Category',
        saving: 'Saving...',
        delete: 'Delete Category',
        deleting: 'Deleting...',
        cancel: 'Cancel',
        saveError: 'Failed to save category.',
        deleteError: 'Failed to delete category.',
        deleteConfirm: (name: string) =>
          `Are you sure you want to delete category "${name}"?`,
      },
      techForm: {
        name: 'Technology Name',
        namePlaceholder: 'e.g. React',
        slug: 'Slug URL',
        slugPlaceholder: 'e.g. react',
        icon: 'Icon URL',
        iconSource: 'Icon Source',
        iconSourceSimple: 'Simple Icons',
        iconSourceCustom: 'Custom URL',
        simpleIconsSlug: 'Simple Icons Identifier',
        simpleIconsSlugPlaceholder: 'e.g. react, typescript, bun',
        simpleIconsDesc:
          'Enter the icon slug from simpleicons.org (e.g. react, bun).',
        customIconUrl: 'Custom Icon URL',
        customIconUrlPlaceholder: 'https://... or /assets/...',
        customIconDesc: 'Enter full image URL (SVG/PNG/WebP).',
        iconPlaceholder: 'https://... or /assets/...',
        iconDesc: 'Enter icon image URL (SVG/PNG/WebP).',
        color: 'Hex Color / CSS',
        colorPlaceholder: '#61DAFB',
        websiteUrl: 'Official Website URL',
        websiteUrlPlaceholder: 'https://react.dev',
        ultimateTitle: 'Ultimate Tech Stack',
        ultimateDesc:
          'Display prominently at the top of the Stack page and Homepage Marquee.',
        categoriesTitle: 'Technology Categories',
        categoriesLoading: 'Loading categories...',
        noCategories: 'No categories yet. Please create a category first.',
        addCategoryBtn: 'New Category',
        addCategoryEmpty: 'Create your first category',
        quickAddTitle: 'Create New Category',
        quickAddDescription:
          'Add a new category quickly without leaving the technology editor.',
        quickAddTechTitle: 'Create New Technology',
        quickAddTechDescription:
          'Add a new technology quickly without leaving the project editor.',
        save: 'Save Technology',
        saving: 'Saving...',
        delete: 'Delete Technology',
        deleting: 'Deleting...',
        cancel: 'Cancel',
        saveError: 'Failed to save technology.',
        deleteError: 'Failed to delete technology.',
        deleteConfirm: (name: string) =>
          `Are you sure you want to delete technology "${name}"?`,
      },
      pageContent: {
        title: 'Content Settings: Tech Stack Page',
        description:
          'Manage title, description, and visibility on the /stack page and Ultimate Tech Stack.',
        resetConfirm:
          'Reset form to default copywriting? Unsaved changes will be replaced.',
        resetSuccess: 'Form has been reset to default. Click save to apply.',
        saveSuccess: 'Tech stack page changes saved successfully.',
        saveError: 'Failed to save changes.',
        mainHeaderTitle: (lang: string) =>
          `1. Main Stack Page Header (${lang})`,
        mainHeaderDesc: 'Introductory text at the very top of the /stack page.',
        eyebrowLabel: (lang: string) => `Eyebrow (${lang})`,
        eyebrowPlaceholder: 'e.g. Stack',
        titleLabel: (lang: string) => `Main Title (${lang}) *`,
        titlePlaceholder: 'e.g. Tech Stack that I use',
        descLabel: (lang: string) => `Description (${lang})`,
        descPlaceholder: 'Explain the tools and technologies you use...',
        ultimateHeaderTitle: (lang: string) =>
          `2. Ultimate Tech Stack Section (${lang})`,
        ultimateHeaderDesc:
          'Heading and description for the Ultimate Tech Stack marquee section.',
        ultimateEyebrowLabel: (lang: string) => `Eyebrow (${lang})`,
        ultimateEyebrowPlaceholder: 'e.g. Ultimate Tech Stack',
        ultimateTitleLabel: (lang: string) => `Section Title (${lang}) *`,
        ultimateTitlePlaceholder: 'e.g. Core Architecture & Preferred Stack',
        ultimateDescLabel: (lang: string) => `Section Description (${lang})`,
        ultimateDescPlaceholder:
          'Explain why these technologies are in your preferred stack...',
        visibilityTitle: '3. Page Visibility',
        visibilityDesc:
          'Control whether the tech stack page is visible to the public.',
        enablePage: 'Enable Tech Stack Page',
        enablePageDesc:
          'If disabled, visitors will see a 404 or maintenance notice.',
        showUltimateDescTitle: 'Show Ultimate Section Description',
        showUltimateDescSubtitle:
          'Display description text above architecture nodes.',
      },
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
    dashboard: {
      title: 'Tech Stack & Keahlian',
      description:
        'Kelola daftar teknologi dan kategori keahlian yang ditampilkan pada portfolio.',
      heading: 'Tech Stack & Keahlian',
      subheading:
        'Kelola daftar teknologi dan kategori keahlian yang ditampilkan pada portfolio.',
      technologiesLabel: 'teknologi',
      categoriesLabel: 'kategori',
      noMatchingTech: 'Tidak ada teknologi yang cocok.',
      noMatchingCategories: 'Tidak ada kategori yang cocok.',
      newCategory: 'Kategori Baru',
      newCategoryDesc:
        'Tambahkan kategori baru untuk mengelompokkan teknologi.',
      editCategory: 'Edit Kategori',
      editCategoryDesc:
        'Perbarui informasi kategori teknologi dan urutan tampil.',
      newTechnology: 'Teknologi Baru',
      newTechnologyDesc:
        'Tambahkan teknologi, framework, atau tool ke personal tech stack.',
      editTechnology: 'Edit Teknologi',
      editTechnologyDesc:
        'Perbarui informasi teknologi, icon, atau kategori terkait.',
      tabs: {
        technologies: 'Teknologi',
        categories: 'Kategori',
      },
      actions: {
        addTechnology: 'Tambah Teknologi',
        addCategory: 'Tambah Kategori',
        backToStack: 'Kembali ke Tech Stack',
      },
      deleteCategoryConfirm: (name: string) =>
        `Apakah Anda yakin ingin menghapus kategori "${name}"?`,
      deleteCategoryError: 'Gagal menghapus kategori.',
      deleteTechConfirm: (name: string) =>
        `Apakah Anda yakin ingin menghapus teknologi "${name}"?`,
      deleteTechError: 'Gagal menghapus teknologi.',
      categoriesTable: {
        loading: 'Memuat daftar kategori...',
        empty: 'Belum ada kategori.',
        addFirst: 'Tambah Kategori Pertama',
        searchPlaceholder: 'Cari kategori...',
        columns: {
          order: 'Urutan',
          name: 'Nama Kategori',
          slug: 'Slug',
          actions: 'Aksi',
        },
        tooltips: {
          edit: 'Edit Kategori',
          delete: 'Hapus Kategori',
        },
      },
      techTable: {
        loading: 'Memuat daftar teknologi...',
        empty: 'Belum ada teknologi.',
        addFirst: 'Tambah Teknologi Pertama',
        searchPlaceholder: 'Cari teknologi...',
        allCategories: 'Semua Kategori',
        columns: {
          icon: 'Icon',
          name: 'Nama',
          slug: 'Slug',
          ultimate: 'Ultimate',
          categories: 'Kategori',
          actions: 'Aksi',
        },
        tooltips: {
          edit: 'Edit Teknologi',
          delete: 'Hapus Teknologi',
        },
      },
      categoryForm: {
        name: 'Nama Kategori',
        namePlaceholder: 'mis. Frontend',
        slug: 'Slug URL',
        slugPlaceholder: 'mis. frontend',
        sortOrder: 'Urutan Tampil',
        sortOrderPlaceholder: '1',
        sortOrderDesc:
          'Angka lebih kecil akan ditampilkan lebih awal pada daftar kategori.',
        save: 'Simpan Kategori',
        saving: 'Menyimpan...',
        delete: 'Hapus Kategori',
        deleting: 'Menghapus...',
        cancel: 'Batal',
        saveError: 'Gagal menyimpan kategori.',
        deleteError: 'Gagal menghapus kategori.',
        deleteConfirm: (name: string) =>
          `Apakah Anda yakin ingin menghapus kategori "${name}"?`,
      },
      techForm: {
        name: 'Nama Teknologi',
        namePlaceholder: 'mis. React',
        slug: 'Slug URL',
        slugPlaceholder: 'mis. react',
        icon: 'URL Icon',
        iconSource: 'Sumber Icon',
        iconSourceSimple: 'Simple Icons',
        iconSourceCustom: 'URL Kustom',
        simpleIconsSlug: 'Identifier Simple Icons',
        simpleIconsSlugPlaceholder: 'mis. react, typescript, bun',
        simpleIconsDesc:
          'Masukkan slug icon dari simpleicons.org (mis. react, bun).',
        customIconUrl: 'URL Icon Kustom',
        customIconUrlPlaceholder: 'https://... atau /assets/...',
        customIconDesc: 'Masukkan URL gambar lengkap (SVG/PNG/WebP).',
        iconPlaceholder: 'https://... atau /assets/...',
        iconDesc: 'Masukkan URL gambar icon (SVG/PNG/WebP).',
        color: 'Warna Hex / CSS',
        colorPlaceholder: '#61DAFB',
        websiteUrl: 'Official Website URL',
        websiteUrlPlaceholder: 'https://react.dev',
        ultimateTitle: 'Ultimate Tech Stack',
        ultimateDesc:
          'Tampilkan di bagian paling atas halaman Stack dan Marquee Homepage.',
        categoriesTitle: 'Kategori Teknologi',
        categoriesLoading: 'Memuat kategori...',
        noCategories:
          'Belum ada kategori. Silakan buat kategori baru terlebih dahulu.',
        addCategoryBtn: 'Kategori Baru',
        addCategoryEmpty: 'Buat kategori pertama',
        quickAddTitle: 'Buat Kategori Baru',
        quickAddDescription:
          'Tambah kategori baru dengan cepat tanpa meninggalkan editor teknologi.',
        quickAddTechTitle: 'Tambah Teknologi Baru',
        quickAddTechDescription:
          'Tambah teknologi baru dengan cepat tanpa meninggalkan editor project.',
        save: 'Simpan Teknologi',
        saving: 'Menyimpan...',
        delete: 'Hapus Teknologi',
        deleting: 'Menghapus...',
        cancel: 'Batal',
        saveError: 'Gagal menyimpan teknologi.',
        deleteError: 'Gagal menghapus teknologi.',
        deleteConfirm: (name: string) =>
          `Apakah Anda yakin ingin menghapus teknologi "${name}"?`,
      },
      pageContent: {
        title: 'Pengaturan Konten: Halaman Tech Stack',
        description:
          'Kelola judul, deskripsi, dan visibilitas pada halaman /stack dan Ultimate Tech Stack.',
        resetConfirm:
          'Reset form ke default copywriting? Perubahan belum tersimpan akan diganti.',
        resetSuccess:
          'Form telah direset ke default. Klik simpan untuk menerapkan.',
        saveSuccess: 'Perubahan halaman tech stack berhasil disimpan.',
        saveError: 'Gagal menyimpan perubahan.',
        mainHeaderTitle: (lang: string) =>
          `1. Header Utama Halaman Stack (${lang})`,
        mainHeaderDesc: 'Teks pengantar di bagian paling atas halaman /stack.',
        eyebrowLabel: (lang: string) => `Eyebrow (${lang})`,
        eyebrowPlaceholder: 'mis. Stack',
        titleLabel: (lang: string) => `Judul Utama (${lang}) *`,
        titlePlaceholder: 'mis. Tech Stack yang kupakai',
        descLabel: (lang: string) => `Deskripsi (${lang})`,
        descPlaceholder: 'Jelaskan alat dan teknologi yang Anda gunakan...',
        ultimateHeaderTitle: (lang: string) =>
          `2. Seksi Ultimate Tech Stack (${lang})`,
        ultimateHeaderDesc:
          'Judul dan deskripsi untuk seksi marquee Ultimate Tech Stack.',
        ultimateEyebrowLabel: (lang: string) => `Eyebrow (${lang})`,
        ultimateEyebrowPlaceholder: 'mis. Ultimate Tech Stack',
        ultimateTitleLabel: (lang: string) => `Judul Seksi (${lang}) *`,
        ultimateTitlePlaceholder: 'mis. Arsitektur Utama & Stack Pilihan',
        ultimateDescLabel: (lang: string) => `Deskripsi Seksi (${lang})`,
        ultimateDescPlaceholder:
          'Jelaskan mengapa teknologi ini menjadi pilihan utama Anda...',
        visibilityTitle: '3. Visibilitas Halaman',
        visibilityDesc:
          'Atur apakah halaman tech stack dapat diakses oleh publik.',
        enablePage: 'Aktifkan Halaman Tech Stack',
        enablePageDesc:
          'Jika dimatikan, pengunjung akan melihat halaman 404 atau pesan pemeliharaan.',
        showUltimateDescTitle: 'Tampilkan Deskripsi Seksi Ultimate',
        showUltimateDescSubtitle:
          'Tampilkan teks deskripsi di atas daftar node arsitektur.',
      },
    },
  },
} as const

export function getTechnologiesCopy() {
  const locale = getLocale() === 'id' ? 'id' : 'en'
  return technologiesCopy[locale]
}
