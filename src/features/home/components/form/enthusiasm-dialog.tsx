import { useEffect, useState } from 'react'
import * as LucideIcons from 'lucide-react'
import { ChevronRight, Terminal } from 'lucide-react'

import { Button } from '#/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '#/components/ui/dialog'
import { Field, FieldGroup, FieldLabel } from '#/components/ui/field'
import { Input } from '#/components/ui/input'
import { LanguageSwitcherPill } from '#/components/ui/language-switcher-pill'
import { Switch } from '#/components/ui/switch'
import { Textarea } from '#/components/ui/textarea'
import { LucideIconPickerModal } from './lucide-icon-picker-modal'
import type {
  EnthusiasmItemInput,
  EnthusiasmRecord,
} from '#/features/home/validation'

type EnthusiasmDialogProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
  item?: EnthusiasmRecord | null
  onSave: (data: EnthusiasmItemInput) => void
  isPending: boolean
}

export function EnthusiasmDialog({
  open,
  onOpenChange,
  item,
  onSave,
  isPending,
}: EnthusiasmDialogProps) {
  const [locale, setLocale] = useState<'en' | 'id'>('en')
  const [iconModalOpen, setIconModalOpen] = useState(false)

  const [formData, setFormData] = useState<EnthusiasmItemInput>({
    icon: 'Terminal',
    titleEn: '',
    titleId: '',
    descriptionEn: '',
    descriptionId: '',
    isEnabled: true,
    sortOrder: 0,
  })

  useEffect(() => {
    if (item) {
      setFormData({
        icon: item.icon || 'Terminal',
        titleEn: item.titleEn || '',
        titleId: item.titleId || '',
        descriptionEn: item.descriptionEn || '',
        descriptionId: item.descriptionId || '',
        isEnabled: item.isEnabled,
        sortOrder: item.sortOrder,
      })
    } else {
      setFormData({
        icon: 'Terminal',
        titleEn: '',
        titleId: '',
        descriptionEn: '',
        descriptionId: '',
        isEnabled: true,
        sortOrder: 0,
      })
    }
  }, [item, open])

  const SelectedIconComp =
    (
      LucideIcons as unknown as Record<
        string,
        React.ComponentType<{ className?: string }> | undefined
      >
    )[formData.icon] || Terminal

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSave(formData)
  }

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="max-w-xl p-6">
          <DialogHeader className="pb-2">
            <div className="flex items-center justify-between">
              <DialogTitle className="text-lg font-bold text-(--brand-ink)">
                {item ? 'Edit Fokus Area' : 'Tambah Fokus Area Baru'}
              </DialogTitle>
              <LanguageSwitcherPill
                activeLocale={locale}
                onChange={setLocale}
              />
            </div>
            <DialogDescription className="text-xs text-(--brand-muted)">
              Atur judul, deskripsi bilingual, ikon, dan status aktif fokus
              keahlian.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleSubmit} className="flex flex-col gap-4 pt-2">
            {/* Ikon Picker Button */}
            <Field>
              <FieldLabel>Ikon Tampilan</FieldLabel>
              <button
                type="button"
                onClick={() => setIconModalOpen(true)}
                className="flex items-center justify-between w-full rounded-xl border border-(--brand-line) bg-surface-soft/40 p-3 hover:border-(--brand-orange) transition cursor-pointer"
              >
                <div className="flex items-center gap-3">
                  <div className="flex size-10 items-center justify-center rounded-lg bg-(--brand-orange-soft) text-(--brand-orange-deep)">
                    <SelectedIconComp className="size-5" />
                  </div>
                  <div className="flex flex-col text-left">
                    <span className="text-xs font-bold text-(--brand-ink)">
                      {formData.icon}
                    </span>
                    <span className="text-[11px] text-(--brand-muted)">
                      Klik untuk mengganti ikon
                    </span>
                  </div>
                </div>
                <ChevronRight className="size-4 text-muted-foreground" />
              </button>
            </Field>

            <FieldGroup className="flex flex-col gap-4">
              <Field>
                <FieldLabel htmlFor="enthusiasm-title">
                  Judul ({locale.toUpperCase()}) *
                </FieldLabel>
                <Input
                  id="enthusiasm-title"
                  required
                  value={locale === 'en' ? formData.titleEn : formData.titleId}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      [locale === 'en' ? 'titleEn' : 'titleId']: e.target.value,
                    }))
                  }
                  placeholder={
                    locale === 'en'
                      ? 'e.g. Frontend Development'
                      : 'mis. Rekayasa Perangkat Lunak'
                  }
                />
              </Field>

              <Field>
                <FieldLabel htmlFor="enthusiasm-description">
                  Deskripsi ({locale.toUpperCase()}) *
                </FieldLabel>
                <Textarea
                  id="enthusiasm-description"
                  required
                  rows={3}
                  value={
                    locale === 'en'
                      ? formData.descriptionEn
                      : formData.descriptionId
                  }
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      [locale === 'en' ? 'descriptionEn' : 'descriptionId']:
                        e.target.value,
                    }))
                  }
                  placeholder={
                    locale === 'en'
                      ? 'Crafting responsive, accessible web interfaces...'
                      : 'Membangun antarmuka web yang responsif...'
                  }
                />
              </Field>
            </FieldGroup>

            <div className="flex items-center justify-between border-t border-(--brand-line) pt-4">
              <div className="flex flex-col gap-0.5">
                <span className="text-xs font-bold text-(--brand-ink)">
                  Status Aktif
                </span>
                <span className="text-[11px] text-(--brand-muted)">
                  Item yang tidak aktif disembunyikan dari halaman publik.
                </span>
              </div>
              <Switch
                checked={formData.isEnabled}
                onCheckedChange={(checked) =>
                  setFormData((prev) => ({ ...prev, isEnabled: checked }))
                }
              />
            </div>

            <DialogFooter className="border-t border-(--brand-line) pt-4 mt-2">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => onOpenChange(false)}
              >
                Batal
              </Button>
              <Button
                type="submit"
                size="sm"
                disabled={isPending}
                className="bg-(--brand-orange) font-bold text-white hover:brightness-105"
              >
                {isPending ? 'Menyimpan...' : item ? 'Simpan' : 'Tambah'}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      <LucideIconPickerModal
        open={iconModalOpen}
        onOpenChange={setIconModalOpen}
        selectedIcon={formData.icon}
        onSelectIcon={(icon) => setFormData((prev) => ({ ...prev, icon }))}
      />
    </>
  )
}
