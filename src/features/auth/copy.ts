import { getLocale } from '#/paraglide/runtime'

export type AuthCopy = {
  metaTitle: string
  metaDescription: string
  brandName: string
  backHome: string
  eyebrow: string
  title: string
  description: string
  formTitle: string
  formSubtitle: string
  fields: {
    email: string
    password: string
  }
  placeholders: {
    email: string
    password: string
  }
  submit: {
    signin: string
    pending: string
  }
  errors: {
    signin: string
    request: string
  }
}

export const authCopy: Record<'en' | 'id', AuthCopy> = {
  en: {
    metaTitle: 'Sign In | Winterest Portfolio',
    metaDescription:
      'Sign in to manage portfolio content, media assets, site settings, and publishing workflows.',
    brandName: 'Winterest',
    backHome: 'Back to portfolio',
    eyebrow: 'Dashboard Access',
    title: 'Sign in to manage your portfolio.',
    description:
      'A central workspace to manage portfolio content, media assets, site configurations, and publishing workflows.',
    formTitle: 'Account sign in',
    formSubtitle: 'Enter your credentials to continue',
    fields: {
      email: 'Email',
      password: 'Password',
    },
    placeholders: {
      email: 'name@example.com',
      password: 'Enter your password',
    },
    submit: {
      signin: 'Sign in',
      pending: 'Signing in...',
    },
    errors: {
      signin: 'Invalid email or password. Please check your credentials.',
      request: 'Authentication request failed. Please try again.',
    },
  },
  id: {
    metaTitle: 'Masuk | Winterest Portfolio',
    metaDescription:
      'Masuk untuk mengelola konten portfolio, aset media, pengaturan situs, dan alur publikasi.',
    brandName: 'Winterest Portfolio',
    backHome: 'Kembali ke portfolio',
    eyebrow: 'Akses Dashboard',
    title: 'Masuk untuk mengelola portfolio.',
    description:
      'Workspace terpusat untuk mengelola konten portfolio, aset media, konfigurasi situs, dan alur publikasi.',
    formTitle: 'Masuk ke akun',
    formSubtitle: 'Masukkan kredensial kamu untuk melanjutkan',
    fields: {
      email: 'Email',
      password: 'Kata sandi',
    },
    placeholders: {
      email: 'nama@example.com',
      password: 'Masukkan kata sandi',
    },
    submit: {
      signin: 'Masuk',
      pending: 'Memproses...',
    },
    errors: {
      signin: 'Email atau kata sandi salah. Silakan periksa kembali.',
      request: 'Permintaan autentikasi gagal. Silakan coba lagi.',
    },
  },
}

export function getAuthCopy(): AuthCopy {
  return authCopy[getLocale() === 'id' ? 'id' : 'en']
}
