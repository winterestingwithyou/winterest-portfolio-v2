import { useState } from 'react'
import * as LucideIcons from 'lucide-react'
import { ArrowDown, ArrowUp, Edit2, Plus, Terminal, Trash2 } from 'lucide-react'

import { Button } from '#/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '#/components/ui/card'
import { Field, FieldGroup, FieldLabel } from '#/components/ui/field'
import { Input } from '#/components/ui/input'
import { Switch } from '#/components/ui/switch'
import { Textarea } from '#/components/ui/textarea'
import { EnthusiasmDialog } from '#/features/home/components/form/enthusiasm-dialog'
import {
  useCreateEnthusiasm,
  useDeleteEnthusiasm,
  useReorderEnthusiasms,
  useUpdateEnthusiasm,
} from '#/features/home/hooks'
import type {
  EnthusiasmItemInput,
  EnthusiasmRecord,
  HomeConfigInput,
} from '#/features/home/validation'

type HomeEnthusiasmsManagerProps = {
  locale: 'en' | 'id'
  formData: HomeConfigInput
  onChange: (updater: (prev: HomeConfigInput) => HomeConfigInput) => void
  enthusiasms: EnthusiasmRecord[]
}

export function HomeEnthusiasmsManager({
  locale,
  formData,
  onChange,
  enthusiasms,
}: HomeEnthusiasmsManagerProps) {
  const [dialogOpen, setDialogOpen] = useState(false)
  const [editingItem, setEditingItem] = useState<EnthusiasmRecord | null>(null)

  const createMutation = useCreateEnthusiasm()
  const updateMutation = useUpdateEnthusiasm()
  const deleteMutation = useDeleteEnthusiasm()
  const reorderMutation = useReorderEnthusiasms()

  const handleOpenAdd = () => {
    setEditingItem(null)
    setDialogOpen(true)
  }

  const handleOpenEdit = (item: EnthusiasmRecord) => {
    setEditingItem(item)
    setDialogOpen(true)
  }

  const handleSaveItem = (data: EnthusiasmItemInput) => {
    if (editingItem) {
      updateMutation.mutate(
        { id: editingItem.id, input: data },
        {
          onSuccess: () => setDialogOpen(false),
        },
      )
    } else {
      createMutation.mutate(
        {
          ...data,
          sortOrder: enthusiasms.length,
        },
        {
          onSuccess: () => setDialogOpen(false),
        },
      )
    }
  }

  const handleDelete = (id: string, title: string) => {
    if (
      window.confirm(
        `Hapus fokus area "${title}"? Tindakan tidak bisa dibatalkan.`,
      )
    ) {
      deleteMutation.mutate(id)
    }
  }

  const handleToggleEnabled = (id: string, isEnabled: boolean) => {
    updateMutation.mutate({ id, input: { isEnabled } })
  }

  const handleMove = (index: number, direction: 'up' | 'down') => {
    const targetIndex = direction === 'up' ? index - 1 : index + 1
    if (targetIndex < 0 || targetIndex >= enthusiasms.length) return

    const newItems = [...enthusiasms]
    const temp = newItems[index]
    newItems[index] = newItems[targetIndex]
    newItems[targetIndex] = temp

    const payload = {
      items: newItems.map((item, idx) => ({
        id: item.id,
        sortOrder: idx,
      })),
    }

    reorderMutation.mutate(payload)
  }

  return (
    <div className="flex flex-col gap-6">
      {/* 1. Enthusiasms Section Header */}
      <Card className="border-(--brand-line) bg-card">
        <CardHeader>
          <CardTitle className="text-base font-bold text-(--brand-ink)">
            Header Seksi Bidang Minat & Antusiasme ({locale.toUpperCase()})
          </CardTitle>
          <CardDescription className="text-xs text-(--brand-muted)">
            Pengantar seksi fokus keahlian di beranda.
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-4">
          <FieldGroup className="flex flex-col gap-4">
            <Field>
              <FieldLabel htmlFor="enthusiasms-eyebrow">
                Eyebrow ({locale.toUpperCase()})
              </FieldLabel>
              <Input
                id="enthusiasms-eyebrow"
                value={
                  locale === 'en'
                    ? formData.enthusiasmsEyebrowEn
                    : formData.enthusiasmsEyebrowId
                }
                onChange={(e) =>
                  onChange((prev) => ({
                    ...prev,
                    [locale === 'en'
                      ? 'enthusiasmsEyebrowEn'
                      : 'enthusiasmsEyebrowId']: e.target.value,
                  }))
                }
                placeholder="mis. PASSION & FOCUS AREAS"
              />
            </Field>

            <Field>
              <FieldLabel htmlFor="enthusiasms-title">
                Judul Seksi ({locale.toUpperCase()}) *
              </FieldLabel>
              <Input
                id="enthusiasms-title"
                required
                value={
                  locale === 'en'
                    ? formData.enthusiasmsTitleEn
                    : formData.enthusiasmsTitleId
                }
                onChange={(e) =>
                  onChange((prev) => ({
                    ...prev,
                    [locale === 'en'
                      ? 'enthusiasmsTitleEn'
                      : 'enthusiasmsTitleId']: e.target.value,
                  }))
                }
                placeholder="mis. Hal yang Saya Antusias"
              />
            </Field>

            <Field>
              <FieldLabel htmlFor="enthusiasms-description">
                Deskripsi Seksi ({locale.toUpperCase()})
              </FieldLabel>
              <Textarea
                id="enthusiasms-description"
                rows={3}
                value={
                  locale === 'en'
                    ? formData.enthusiasmsDescriptionEn
                    : formData.enthusiasmsDescriptionId
                }
                onChange={(e) =>
                  onChange((prev) => ({
                    ...prev,
                    [locale === 'en'
                      ? 'enthusiasmsDescriptionEn'
                      : 'enthusiasmsDescriptionId']: e.target.value,
                  }))
                }
                placeholder="mis. Bidang-bidang Software Engineering yang selalu saya eksplorasi..."
              />
            </Field>
          </FieldGroup>

          <div className="flex items-center justify-between border-t border-(--brand-line) pt-4">
            <div className="flex flex-col gap-0.5">
              <span className="text-xs font-bold text-(--brand-ink)">
                Tampilkan Deskripsi Seksi
              </span>
              <span className="text-[11px] text-(--brand-muted)">
                Sembunyikan deskripsi di atas daftar kartu keahlian.
              </span>
            </div>
            <Switch
              checked={formData.showEnthusiasmsDescription}
              onCheckedChange={(checked) =>
                onChange((prev) => ({
                  ...prev,
                  showEnthusiasmsDescription: checked,
                }))
              }
            />
          </div>
        </CardContent>
      </Card>

      {/* 2. Enthusiasms List Manager */}
      <Card className="border-(--brand-line) bg-card">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-base font-bold text-(--brand-ink)">
                Daftar Kartu Fokus Keahlian ({enthusiasms.length})
              </CardTitle>
              <CardDescription className="text-xs text-(--brand-muted) mt-0.5">
                Kelola item fokus area, ubah urutan tampil, atau sesuaikan ikon
                tampilan.
              </CardDescription>
            </div>
            <Button
              type="button"
              size="sm"
              onClick={handleOpenAdd}
              className="flex items-center gap-1.5 bg-(--brand-orange) font-bold text-white hover:brightness-105"
            >
              <Plus className="size-4" />
              Tambah Fokus
            </Button>
          </div>
        </CardHeader>
        <CardContent className="flex flex-col gap-3">
          {enthusiasms.length === 0 ? (
            <div className="p-8 text-center border border-dashed border-(--brand-line) rounded-xl">
              <p className="text-sm text-(--brand-muted)">
                Belum ada item fokus keahlian. Klik "Tambah Fokus" di atas.
              </p>
            </div>
          ) : (
            enthusiasms.map((item, index) => {
              const IconComp =
                (
                  LucideIcons as unknown as Record<
                    string,
                    React.ComponentType<{ className?: string }> | undefined
                  >
                )[item.icon] || Terminal

              const title = locale === 'en' ? item.titleEn : item.titleId
              const desc =
                locale === 'en' ? item.descriptionEn : item.descriptionId

              return (
                <div
                  key={item.id}
                  className="flex items-center justify-between gap-4 rounded-xl border border-(--brand-line) bg-surface-soft/40 p-3.5 transition hover:border-(--brand-orange)/60"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    {/* Urutan Move Up/Down Controls */}
                    <div className="flex flex-col gap-1 shrink-0">
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        disabled={index === 0}
                        onClick={() => handleMove(index, 'up')}
                        className="size-6 text-muted-foreground hover:text-foreground"
                      >
                        <ArrowUp className="size-3.5" />
                      </Button>
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        disabled={index === enthusiasms.length - 1}
                        onClick={() => handleMove(index, 'down')}
                        className="size-6 text-muted-foreground hover:text-foreground"
                      >
                        <ArrowDown className="size-3.5" />
                      </Button>
                    </div>

                    {/* Ikon */}
                    <div className="flex size-10 items-center justify-center rounded-lg bg-(--brand-orange-soft) text-(--brand-orange-deep) shrink-0">
                      <IconComp className="size-5" />
                    </div>

                    {/* Teks */}
                    <div className="flex flex-col min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-(--brand-ink) truncate">
                          {title}
                        </span>
                        {!item.isEnabled && (
                          <span className="rounded bg-muted px-1.5 py-0.5 text-[10px] font-semibold text-muted-foreground">
                            Nonaktif
                          </span>
                        )}
                      </div>
                      <p className="text-[11px] text-(--brand-muted) line-clamp-1 mt-0.5">
                        {desc}
                      </p>
                    </div>
                  </div>

                  {/* Actions & Switch */}
                  <div className="flex items-center gap-3 shrink-0">
                    <Switch
                      checked={item.isEnabled}
                      onCheckedChange={(checked) =>
                        handleToggleEnabled(item.id, checked)
                      }
                      aria-label="Toggle status aktif"
                    />

                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      onClick={() => handleOpenEdit(item)}
                      className="size-8 text-muted-foreground hover:text-foreground"
                    >
                      <Edit2 className="size-4" />
                    </Button>

                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      onClick={() => handleDelete(item.id, title)}
                      className="size-8 text-red-500 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-950/30"
                    >
                      <Trash2 className="size-4" />
                    </Button>
                  </div>
                </div>
              )
            })
          )}
        </CardContent>
      </Card>

      <EnthusiasmDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        item={editingItem}
        onSave={handleSaveItem}
        isPending={createMutation.isPending || updateMutation.isPending}
      />
    </div>
  )
}
