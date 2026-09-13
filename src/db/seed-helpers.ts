export type SeedCollection =
  | 'categories'
  | 'technologies'
  | 'projects'
  | 'socialLinks'
  | 'homeEnthusiasms'

export type SeedCollectionOption = {
  value: SeedCollection
  label: string
  hint: string
}

export const SEED_COLLECTION_OPTIONS: SeedCollectionOption[] = [
  {
    value: 'categories',
    label: 'Kategori Teknologi (Categories)',
    hint: '5 kategori stack teknologi',
  },
  {
    value: 'technologies',
    label: 'Tech Stack & Tools (Technologies)',
    hint: '12 teknologi & keterhubungan kategori',
  },
  {
    value: 'projects',
    label: 'Proyek Portofolio (Projects)',
    hint: '1 proyek utama & translasi bilingual',
  },
  {
    value: 'socialLinks',
    label: 'Tautan Sosial (Social Links)',
    hint: '4 tautan profil sosial',
  },
  {
    value: 'homeEnthusiasms',
    label: 'Bidang Minat & Fokus Area (Enthusiasms)',
    hint: '9 kartu keahlian beranda',
  },
]

export const ALL_SEED_COLLECTIONS: SeedCollection[] = [
  'categories',
  'technologies',
  'projects',
  'socialLinks',
  'homeEnthusiasms',
]

/**
 * Resolves dependencies between data collections.
 * - Projects requires Technologies & Categories
 * - Technologies requires Categories
 */
export function resolveSeedDependencies(selected: SeedCollection[]): {
  resolved: SeedCollection[]
  autoAdded: SeedCollection[]
} {
  const selectedSet = new Set<SeedCollection>(selected)
  const autoAdded: SeedCollection[] = []

  if (selectedSet.has('projects')) {
    if (!selectedSet.has('technologies')) {
      selectedSet.add('technologies')
      autoAdded.push('technologies')
    }
    if (!selectedSet.has('categories')) {
      selectedSet.add('categories')
      autoAdded.push('categories')
    }
  }

  if (selectedSet.has('technologies') && !selectedSet.has('categories')) {
    selectedSet.add('categories')
    if (!autoAdded.includes('categories')) {
      autoAdded.push('categories')
    }
  }

  // Preserve topological ordering
  const resolved = ALL_SEED_COLLECTIONS.filter((c) => selectedSet.has(c))

  return { resolved, autoAdded }
}

export function formatSeedSummary(
  target: 'local' | 'remote',
  collections: SeedCollection[],
  autoAdded: SeedCollection[] = [],
): string {
  const labels: Record<SeedCollection, string> = {
    categories: 'Kategori Teknologi (5 items)',
    technologies: 'Tech Stack & Tools (12 items)',
    projects: 'Proyek Portofolio (1 item)',
    socialLinks: 'Tautan Sosial (4 items)',
    homeEnthusiasms: 'Bidang Minat Beranda (9 items)',
  }

  const lines: string[] = [
    `Target: ${target === 'local' ? 'Local D1 (Miniflare SQLite)' : 'Remote D1 (Cloudflare)'}`,
    `Total Entitas: ${collections.length} dari ${ALL_SEED_COLLECTIONS.length}`,
    '',
    'Entitas yang akan di-seed:',
    ...collections.map((c) => {
      const isAuto = autoAdded.includes(c)
      return `  - ${labels[c]}${isAuto ? ' [Otomatis disertakan]' : ''}`
    }),
  ]

  return lines.join('\n')
}
