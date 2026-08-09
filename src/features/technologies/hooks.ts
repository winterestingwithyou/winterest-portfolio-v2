import { useQuery } from '@tanstack/react-query'

export type TechnologyItem = {
  id: string
  name: string
  slug: string
  category: string
  icon?: string | null
  color?: string | null
  url?: string | null
  description?: string | null
}

export function useTechnologies() {
  return useQuery({
    queryKey: ['technologies'],
    queryFn: async (): Promise<TechnologyItem[]> => {
      const res = await fetch('/api/technologies')
      if (!res.ok) {
        throw new Error('Failed to fetch technologies')
      }
      const json: { data?: TechnologyItem[] } = await res.json()
      return json.data ?? []
    },
  })
}
