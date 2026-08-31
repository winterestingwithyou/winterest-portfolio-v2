import { Facebook, Github, Instagram, Linkedin, Youtube } from 'lucide-react'
import type { ComponentType } from 'react'
import { z } from 'zod'

import {
  DiscordIcon,
  TelegramIcon,
  TikTokIcon,
  XIcon,
} from '#/components/ui/icons'
import { socialPlatforms } from '#/db/schema'
import type { SocialPlatform } from '#/db/schema'

export { socialPlatforms }
export type { SocialPlatform }

export const socialLinkSchema = z.object({
  platform: z.enum(socialPlatforms),
  username: z.string().trim(),
  accountName: z.string().trim(),
  url: z
    .string()
    .trim()
    .min(1, 'URL is required.')
    .url('Invalid URL format (must start with https:// or http://).'),
  isEnabled: z.boolean(),
  sortOrder: z.number().int().min(0),
})

export type SocialLinkInput = z.infer<typeof socialLinkSchema>

export type SocialLink = SocialLinkInput & {
  id: string
  createdAt: Date
  updatedAt: Date
}

export type PlatformMeta = {
  platform: SocialPlatform
  name: string
  placeholderUrl: string
  placeholderUsername: string
  placeholderAccountName: string
  icon: ComponentType<{ className?: string }>
  badgeBg: string
  badgeText: string
  badgeBorder: string
}

export const platformMetaMap: Record<SocialPlatform, PlatformMeta> = {
  github: {
    platform: 'github',
    name: 'GitHub',
    placeholderUrl: 'https://github.com/username',
    placeholderUsername: 'username',
    placeholderAccountName: 'Winterest',
    icon: Github,
    badgeBg: 'bg-neutral-900/10 dark:bg-neutral-100/10',
    badgeText: 'text-neutral-900 dark:text-neutral-100',
    badgeBorder: 'border-neutral-700/20 dark:border-neutral-300/20',
  },
  linkedin: {
    platform: 'linkedin',
    name: 'LinkedIn',
    placeholderUrl: 'https://linkedin.com/in/username',
    placeholderUsername: 'username',
    placeholderAccountName: 'M. Adam Yudistira',
    icon: Linkedin,
    badgeBg: 'bg-blue-500/10',
    badgeText: 'text-blue-600 dark:text-blue-400',
    badgeBorder: 'border-blue-500/20',
  },
  x: {
    platform: 'x',
    name: 'X (Twitter)',
    placeholderUrl: 'https://x.com/username',
    placeholderUsername: '@username',
    placeholderAccountName: '@winterest',
    icon: XIcon,
    badgeBg: 'bg-neutral-800/10 dark:bg-neutral-200/10',
    badgeText: 'text-neutral-800 dark:text-neutral-200',
    badgeBorder: 'border-neutral-800/20 dark:border-neutral-200/20',
  },
  instagram: {
    platform: 'instagram',
    name: 'Instagram',
    placeholderUrl: 'https://instagram.com/username',
    placeholderUsername: 'username',
    placeholderAccountName: 'M. Adam Yudistira',
    icon: Instagram,
    badgeBg: 'bg-pink-500/10',
    badgeText: 'text-pink-600 dark:text-pink-400',
    badgeBorder: 'border-pink-500/20',
  },
  facebook: {
    platform: 'facebook',
    name: 'Facebook',
    placeholderUrl: 'https://facebook.com/username',
    placeholderUsername: 'username',
    placeholderAccountName: 'M. Adam Yudistira',
    icon: Facebook,
    badgeBg: 'bg-blue-600/10',
    badgeText: 'text-blue-700 dark:text-blue-400',
    badgeBorder: 'border-blue-600/20',
  },
  tiktok: {
    platform: 'tiktok',
    name: 'TikTok',
    placeholderUrl: 'https://tiktok.com/@username',
    placeholderUsername: '@username',
    placeholderAccountName: '@winterest',
    icon: TikTokIcon,
    badgeBg: 'bg-neutral-900/10 dark:bg-neutral-100/10',
    badgeText: 'text-neutral-900 dark:text-neutral-100',
    badgeBorder: 'border-neutral-700/20 dark:border-neutral-300/20',
  },
  youtube: {
    platform: 'youtube',
    name: 'YouTube',
    placeholderUrl: 'https://youtube.com/@channel',
    placeholderUsername: '@channel',
    placeholderAccountName: 'Winterest Dev',
    icon: Youtube,
    badgeBg: 'bg-red-500/10',
    badgeText: 'text-red-600 dark:text-red-400',
    badgeBorder: 'border-red-500/20',
  },
  discord: {
    platform: 'discord',
    name: 'Discord',
    placeholderUrl: 'https://discord.gg/inviteCode',
    placeholderUsername: 'username#0000',
    placeholderAccountName: 'Winterest Community',
    icon: DiscordIcon,
    badgeBg: 'bg-indigo-500/10',
    badgeText: 'text-indigo-600 dark:text-indigo-400',
    badgeBorder: 'border-indigo-500/20',
  },
  telegram: {
    platform: 'telegram',
    name: 'Telegram',
    placeholderUrl: 'https://t.me/username',
    placeholderUsername: '@username',
    placeholderAccountName: 'Winterest Telegram',
    icon: TelegramIcon,
    badgeBg: 'bg-sky-500/10',
    badgeText: 'text-sky-600 dark:text-sky-400',
    badgeBorder: 'border-sky-500/20',
  },
}
