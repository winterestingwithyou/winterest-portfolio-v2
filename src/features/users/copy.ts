import { getLocale } from '#/paraglide/runtime'

export const usersCopy = {
  en: {
    title: 'Users',
    description:
      'Manage users, assign dashboard roles, and configure credentials.',
    new: 'New user',
    newUser: 'Create user',
    editUser: 'Edit user',
    newDescription: 'Add a new user to the dashboard with role permissions.',
    editDescription: 'Update user profile and assign role permissions.',
    resetPasswordTitle: 'Reset password',
    resetPasswordDescription:
      'Set a new password for this user. Active sessions will be signed out.',
    loading: 'Loading users...',
    loadingUser: 'Loading user...',
    notFound: 'User not found.',
    emptyTitle: 'No users found.',
    emptyDescription:
      'Add users to grant dashboard access with granular roles.',
    accessDeniedTitle: 'Owner access only',
    accessDeniedDescription:
      'User management is restricted to accounts with the Owner role.',
    metrics: {
      total: 'Total users',
      owners: 'Owners',
      admins: 'Admins',
      team: 'Editors',
    },
    table: {
      user: 'User',
      email: 'Email',
      role: 'Role',
      sessions: 'Active sessions',
      created: 'Created',
      actions: 'Actions',
    },
    roles: {
      owner: 'Owner',
      admin: 'Admin',
      editor: 'Editor',
      ownerDesc: 'Full access to users, roles, settings, and all CMS content.',
      adminDesc: 'Manage content, media, and dashboard settings.',
      editorDesc: 'Create and edit portfolio content.',
    },
    form: {
      name: 'Full name',
      namePlaceholder: 'e.g. Your Name',
      email: 'Email address',
      emailPlaceholder: 'e.g. user@example.com',
      role: 'Role',
      password: 'Password',
      passwordPlaceholder: 'Minimum 8 characters',
      newPassword: 'New password',
      saveChanges: 'Save changes',
      createUser: 'Create user',
      resetPasswordButton: 'Update password',
      resettingPassword: 'Updating password...',
      deleteUser: 'Delete user',
      deleteConfirm:
        'Are you sure you want to delete this user? This action cannot be undone.',
      selfDeleteWarning: 'You cannot delete your own account.',
      soleOwnerWarning: 'You cannot demote or delete the only remaining owner.',
    },
    feedback: {
      created: 'User created successfully.',
      updated: 'User updated successfully.',
      deleted: 'User deleted successfully.',
      passwordReset: 'Password has been reset successfully.',
      saveError: 'Failed to save user.',
      deleteError: 'Failed to delete user.',
      resetError: 'Failed to reset password.',
    },
  },
  id: {
    title: 'Pengguna',
    description:
      'Kelola akun pengguna, tentukan role dashboard, dan konfigurasi kredensial.',
    new: 'Pengguna baru',
    newUser: 'Tambah pengguna',
    editUser: 'Edit pengguna',
    newDescription:
      'Tambahkan akun pengguna baru dengan hak akses role tertentu.',
    editDescription: 'Perbarui profil pengguna dan atur hak akses role.',
    resetPasswordTitle: 'Reset password',
    resetPasswordDescription:
      'Tetapkan password baru untuk pengguna ini. Sesi aktif pengguna akan dihentikan.',
    loading: 'Memuat pengguna...',
    loadingUser: 'Memuat data pengguna...',
    notFound: 'Pengguna tidak ditemukan.',
    emptyTitle: 'Belum ada pengguna.',
    emptyDescription:
      'Tambahkan pengguna untuk memberikan akses ke dashboard sesuai role.',
    accessDeniedTitle: 'Akses Khusus Owner',
    accessDeniedDescription:
      'Fitur manajemen pengguna hanya dapat diakses oleh akun dengan role Owner.',
    metrics: {
      total: 'Total pengguna',
      owners: 'Owner',
      admins: 'Admin',
      team: 'Editor',
    },
    table: {
      user: 'Pengguna',
      email: 'Email',
      role: 'Role',
      sessions: 'Sesi aktif',
      created: 'Dibuat',
      actions: 'Aksi',
    },
    roles: {
      owner: 'Owner',
      admin: 'Admin',
      editor: 'Editor',
      ownerDesc:
        'Akses penuh ke manajemen user, role, pengaturan, dan semua konten CMS.',
      adminDesc: 'Kelola konten CMS, media, dan pengaturan dashboard.',
      editorDesc: 'Buat dan edit konten portfolio.',
    },
    form: {
      name: 'Nama lengkap',
      namePlaceholder: 'cth. Nama Anda',
      email: 'Alamat email',
      emailPlaceholder: 'cth. user@example.com',
      role: 'Role',
      password: 'Password',
      passwordPlaceholder: 'Minimal 8 karakter',
      newPassword: 'Password baru',
      saveChanges: 'Simpan perubahan',
      createUser: 'Tambah pengguna',
      resetPasswordButton: 'Perbarui password',
      resettingPassword: 'Memperbarui password...',
      deleteUser: 'Hapus pengguna',
      deleteConfirm:
        'Apakah kamu yakin ingin menghapus pengguna ini? Tindakan ini tidak dapat dibatalkan.',
      selfDeleteWarning: 'Kamu tidak bisa menghapus akunmu sendiri.',
      soleOwnerWarning:
        'Kamu tidak bisa mendegradasi atau menghapus satu-satunya owner yang tersisa.',
    },
    feedback: {
      created: 'Pengguna berhasil ditambahkan.',
      updated: 'Pengguna berhasil diperbarui.',
      deleted: 'Pengguna berhasil dihapus.',
      passwordReset: 'Password berhasil direset.',
      saveError: 'Gagal menyimpan data pengguna.',
      deleteError: 'Gagal menghapus pengguna.',
      resetError: 'Gagal mereset password.',
    },
  },
} as const

export function getUsersCopy() {
  const locale = getLocale() === 'id' ? 'id' : 'en'
  return usersCopy[locale]
}
