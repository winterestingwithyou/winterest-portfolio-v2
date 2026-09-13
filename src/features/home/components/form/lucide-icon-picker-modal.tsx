import { useState } from 'react'
import * as LucideIcons from 'lucide-react'
import { Check, Search } from 'lucide-react'

import { Button } from '#/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '#/components/ui/dialog'
import { Input } from '#/components/ui/input'

export const CURATED_LUCIDE_ICONS = [
  'Terminal',
  'Code',
  'Code2',
  'Cpu',
  'FileCode',
  'GitBranch',
  'GitPullRequest',
  'Bug',
  'Wrench',
  'Boxes',
  'Binary',
  'Layout',
  'Layers',
  'Globe',
  'Palette',
  'Eye',
  'Component',
  'Compass',
  'Sparkles',
  'Server',
  'Database',
  'Cloud',
  'Network',
  'HardDrive',
  'Workflow',
  'Radio',
  'Router',
  'ShieldCheck',
  'Shield',
  'Lock',
  'CheckCircle2',
  'Activity',
  'Gauge',
  'Fingerprint',
  'Smartphone',
  'Tablet',
  'Monitor',
  'Tv',
  'Watch',
  'Zap',
  'Flame',
  'Rocket',
  'Star',
  'Bookmark',
  'Award',
  'FolderKanban',
  'Search',
] as const

export type CuratedIconName = (typeof CURATED_LUCIDE_ICONS)[number]

type LucideIconPickerModalProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
  selectedIcon: string
  onSelectIcon: (iconName: string) => void
}

export function LucideIconPickerModal({
  open,
  onOpenChange,
  selectedIcon,
  onSelectIcon,
}: LucideIconPickerModalProps) {
  const [search, setSearch] = useState('')

  const filteredIcons = CURATED_LUCIDE_ICONS.filter((icon) =>
    icon.toLowerCase().includes(search.toLowerCase().trim()),
  )

  const handleSelect = (iconName: string) => {
    onSelectIcon(iconName)
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md max-h-[85vh] flex flex-col gap-4 p-5">
        <DialogHeader className="pb-1">
          <DialogTitle className="text-base font-bold text-(--brand-ink)">
            Pilih Ikon Fokus Area
          </DialogTitle>
          <DialogDescription className="text-xs text-(--brand-muted)">
            Pilih dari daftar ikon engineering & teknologi Lucide.
          </DialogDescription>
        </DialogHeader>

        <div className="relative">
          <Search className="absolute left-3 top-2.5 size-4 text-muted-foreground" />
          <Input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Cari ikon (mis. Terminal, Server, Code)..."
            className="pl-9 text-xs"
            autoFocus
          />
        </div>

        <div className="grid grid-cols-5 gap-2 overflow-y-auto max-h-72 p-1 no-scrollbar">
          {filteredIcons.map((iconName) => {
            // Safely resolve component
            const IconComp = (
              LucideIcons as unknown as Record<
                string,
                React.ComponentType<{ className?: string }> | undefined
              >
            )[iconName]
            if (!IconComp) return null

            const isSelected = selectedIcon === iconName

            return (
              <button
                key={iconName}
                type="button"
                onClick={() => handleSelect(iconName)}
                title={iconName}
                className={`group relative flex flex-col items-center justify-center gap-1 rounded-xl border p-2.5 text-center transition-all cursor-pointer ${
                  isSelected
                    ? 'border-(--brand-orange) bg-(--brand-orange-soft) text-(--brand-orange-deep) ring-2 ring-(--brand-orange)/40'
                    : 'border-(--brand-line) bg-card text-(--brand-ink) hover:border-(--brand-orange)/60 hover:bg-muted/40'
                }`}
              >
                <IconComp className="size-5" />
                <span className="text-[10px] truncate max-w-full font-medium">
                  {iconName}
                </span>
                {isSelected && (
                  <div className="absolute top-1 right-1 size-3.5 rounded-full bg-(--brand-orange) text-white flex items-center justify-center">
                    <Check className="size-2.5 stroke-[3]" />
                  </div>
                )}
              </button>
            )
          })}
        </div>

        <div className="flex justify-end pt-2 border-t border-(--brand-line)">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => onOpenChange(false)}
            className="text-xs"
          >
            Tutup
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
