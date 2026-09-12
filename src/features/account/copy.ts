import { getLocale } from '#/paraglide/runtime'

export const accountCopy = {
  en: {
    title: 'Account Settings',
    description:
      'Manage your personal profile, credentials, and security preferences.',
    profileTitle: 'Profile Information',
    profileDescription:
      'Update your personal details and how you appear in the dashboard.',
    securityTitle: 'Security & Password',
    securityDescription:
      'Ensure your account stays secure by using a strong, unique password.',
    sessionsTitle: 'Active Sessions',
    sessionsDescription:
      'Summary of active browser sessions associated with this account.',
    currentRoleNotice:
      'Your account role is assigned by the platform owner and cannot be edited manually.',
    form: {
      name: 'Full name',
      namePlaceholder: 'e.g. Your Name',
      email: 'Email address',
      emailPlaceholder: 'e.g. user@example.com',
      role: 'Current role',
      currentPassword: 'Current password',
      currentPasswordPlaceholder: 'Enter current password',
      newPassword: 'New password',
      newPasswordPlaceholder: 'Minimum 8 characters',
      confirmPassword: 'Confirm new password',
      confirmPasswordPlaceholder: 'Re-enter new password',
      saveProfile: 'Save profile',
      savingProfile: 'Saving profile...',
      updatePassword: 'Update password',
      updatingPassword: 'Updating password...',
      memberSince: 'Member since',
      activeSessionsCount: 'Active sessions',
    },
    feedback: {
      profileUpdated: 'Profile updated successfully.',
      passwordChanged: 'Password changed successfully.',
      profileError: 'Failed to update profile.',
      passwordError: 'Failed to change password.',
      loadError: 'Failed to load account details.',
    },
    sessions: {
      currentSessionTitle: 'Current Active Browser Session',
      currentSessionDesc: 'Encrypted and secure active session on this device.',
      activeBadge: 'Active',
      securityTipsTitle: 'Account Security Tips',
      securityTip1:
        'Use a unique password with a mix of uppercase letters, lowercase letters, numbers, and symbols.',
      securityTip2:
        'Never share your login credentials or session tokens with anyone.',
      securityTip3:
        'Always sign out when finished using the dashboard on a shared device.',
    },
  },
  id: {
    title: 'Pengaturan Akun',
    description:
      'Kelola profil pribadi, kata sandi, dan preferensi keamanan akun kamu.',
    profileTitle: 'Informasi Profil',
    profileDescription:
      'Perbarui data pribadi dan informasi akun kamu di dashboard.',
    securityTitle: 'Keamanan & Kata Sandi',
    securityDescription:
      'Jaga keamanan akun kamu dengan menggunakan kata sandi yang kuat.',
    sessionsTitle: 'Sesi Aktif',
    sessionsDescription:
      'Informasi sesi login browser yang terhubung dengan akun ini.',
    currentRoleNotice:
      'Role akun kamu ditetapkan oleh platform owner dan tidak dapat diubah secara mandiri.',
    form: {
      name: 'Nama lengkap',
      namePlaceholder: 'cth. Nama Anda',
      email: 'Alamat email',
      emailPlaceholder: 'cth. user@example.com',
      role: 'Role saat ini',
      currentPassword: 'Kata sandi saat ini',
      currentPasswordPlaceholder: 'Masukkan kata sandi saat ini',
      newPassword: 'Kata sandi baru',
      newPasswordPlaceholder: 'Minimal 8 karakter',
      confirmPassword: 'Konfirmasi kata sandi baru',
      confirmPasswordPlaceholder: 'Masukkan ulang kata sandi baru',
      saveProfile: 'Simpan profil',
      savingProfile: 'Menyimpan profil...',
      updatePassword: 'Perbarui kata sandi',
      updatingPassword: 'Memperbarui kata sandi...',
      memberSince: 'Terdaftar sejak',
      activeSessionsCount: 'Sesi aktif',
    },
    feedback: {
      profileUpdated: 'Profil berhasil diperbarui.',
      passwordChanged: 'Kata sandi berhasil diperbarui.',
      profileError: 'Gagal memperbarui profil.',
      passwordError: 'Gagal memperbarui kata sandi.',
      loadError: 'Gagal memuat data akun.',
    },
    sessions: {
      currentSessionTitle: 'Sesi Browser Saat Ini',
      currentSessionDesc:
        'Sesi tersimpan yang terenkripsi dan aman pada perangkat ini.',
      activeBadge: 'Aktif',
      securityTipsTitle: 'Tips Keamanan Akun',
      securityTip1:
        'Gunakan kata sandi unik dengan kombinasi huruf besar, kecil, angka, dan simbol.',
      securityTip2:
        'Jangan pernah membagikan kredensial login atau token sesi kamu kepada siapapun.',
      securityTip3:
        'Selalu keluar (logout) setelah selesai menggunakan dashboard di perangkat bersama.',
    },
  },
} as const

export function getAccountCopy() {
  const locale = getLocale() === 'id' ? 'id' : 'en'
  return accountCopy[locale]
}
