import { getLocale } from '#/paraglide/runtime'

export const mediaCopy = {
  en: {
    title: 'Media Library',
    description:
      'Upload, manage, and organize project cover images and portfolio media assets.',
    emptyTitle: 'No media assets yet.',
    emptyDescription:
      'Upload your first project image or visual asset to get started.',
    uploadTitle: 'Upload New Media',
    uploadDesc:
      'Drag & drop or select image files (PNG, JPG, WebP, GIF, SVG, AVIF) or PDF documents up to 10MB.',
    uploading: 'Uploading image...',
    uploadSuccess: 'Media asset uploaded successfully.',
    uploadError: 'Failed to upload media asset.',
    deleteConfirm:
      'Are you sure you want to delete this media asset? This action cannot be undone.',
    deleteSuccess: 'Media deleted successfully.',
    deleteError: 'Failed to delete media asset.',
    copyUrl: 'Copy URL',
    copied: 'Copied!',
    searchPlaceholder: 'Search media files or alt text...',
    selectFromLibrary: 'Choose from Media Library',
    useSelectedImage: 'Use Selected Image',
    noImagesFound: 'No matching media assets found.',
    noMatchingDescription:
      'Try searching with different terms or select a different asset type.',
    resetFilters: 'Reset filters',
    assetsLabel: 'assets',
    totalMedia: 'Total assets',
    preview: 'Preview',
    dropToUpload: 'Drop image here to upload',
    browseFiles: 'Browse files',
    changeImage: 'Change image',
    removeImage: 'Remove image',
    coverImageRecommended:
      'Recommended aspect ratio: 16:9 or 21:9 (min. 1200x675px).',
    directUpload: 'Upload image',
    orPasteUrl: 'Or enter image URL manually',
    tabAll: 'All Assets',
    tabImages: 'Images',
    tabDocuments: 'Documents (PDF)',
    pdfBadge: 'PDF',
    document: 'Document',
    openPdf: 'Preview PDF',
    useSelectedFile: 'Use Selected File',
    noDocumentsFound: 'No PDF documents found.',
    dropToUploadDoc: 'Drop PDF document here to upload',
    uploadDocButton: 'Upload PDF',
    usageWarningTitle: 'Asset Is Currently In Use',
    usageWarningDesc:
      'This asset is actively referenced by the following site components:',
    usageAutoCleanNotice:
      'Deleting this asset will automatically clear its references (Cascade Nullify) to prevent broken links or missing images on your live site.',
    confirmDeleteAndClean: (count: number) =>
      `Delete & Clear References (${count})`,
    siteSettingsLabel: 'Site Settings',
    projectCoverLabel: 'Project Cover',
    techIconLabel: 'Technology Icon',
    projectContentLabel: 'Project Content',
    checkingUsage: 'Checking asset usage...',
  },
  id: {
    title: 'Media Library',
    description:
      'Unggah, kelola, dan atur gambar cover project dan aset visual portfolio kamu.',
    emptyTitle: 'Belum ada aset media.',
    emptyDescription:
      'Unggah gambar project atau aset visual pertama kamu untuk memulai.',
    uploadTitle: 'Unggah Media Baru',
    uploadDesc:
      'Tarik & lepas atau pilih file gambar (PNG, JPG, WebP, GIF, SVG, AVIF) atau dokumen PDF hingga 10MB.',
    uploading: 'Mengunggah gambar...',
    uploadSuccess: 'Aset media berhasil diunggah.',
    uploadError: 'Gagal mengunggah aset media.',
    deleteConfirm:
      'Apakah kamu yakin ingin menghapus aset media ini? Tindakan ini tidak dapat dibatalkan.',
    deleteSuccess: 'Media berhasil dihapus.',
    deleteError: 'Gagal menghapus aset media.',
    copyUrl: 'Salin URL',
    copied: 'Disalin!',
    searchPlaceholder: 'Cari nama file atau teks alt...',
    selectFromLibrary: 'Pilih dari Media Library',
    useSelectedImage: 'Gunakan Gambar Terpilih',
    noImagesFound: 'Tidak ada aset media yang cocok.',
    noMatchingDescription:
      'Coba cari dengan kata kunci lain atau pilih jenis aset yang berbeda.',
    resetFilters: 'Reset filter',
    assetsLabel: 'aset',
    totalMedia: 'Total aset',
    preview: 'Pratinjau',
    dropToUpload: 'Lepaskan gambar di sini untuk mengunggah',
    browseFiles: 'Pilih file',
    changeImage: 'Ganti gambar',
    removeImage: 'Hapus gambar',
    coverImageRecommended:
      'Rasio aspek yang disarankan: 16:9 atau 21:9 (min. 1200x675px).',
    directUpload: 'Unggah gambar',
    orPasteUrl: 'Atau masukkan URL gambar manual',
    tabAll: 'Semua Aset',
    tabImages: 'Gambar',
    tabDocuments: 'Dokumen (PDF)',
    pdfBadge: 'PDF',
    document: 'Dokumen',
    openPdf: 'Pratinjau PDF',
    useSelectedFile: 'Gunakan File Terpilih',
    noDocumentsFound: 'Belum ada dokumen PDF yang diunggah.',
    dropToUploadDoc: 'Lepaskan berkas PDF di sini untuk mengunggah',
    uploadDocButton: 'Unggah PDF',
    usageWarningTitle: 'Aset Ini Sedang Digunakan',
    usageWarningDesc:
      'Aset ini terpasang secara aktif pada komponen situs berikut:',
    usageAutoCleanNotice:
      'Menghapus aset ini akan secara otomatis mengosongkan referensinya (Cascade Nullify) agar halaman web terbebas dari gambar rusak (broken link).',
    confirmDeleteAndClean: (count: number) => `Hapus & Bersihkan (${count})`,
    siteSettingsLabel: 'Site Settings',
    projectCoverLabel: 'Cover Proyek',
    techIconLabel: 'Icon Teknologi',
    projectContentLabel: 'Konten Proyek',
    checkingUsage: 'Memeriksa penggunaan aset...',
  },
} as const

export function getMediaCopy() {
  const locale = getLocale() === 'id' ? 'id' : 'en'
  return mediaCopy[locale]
}
