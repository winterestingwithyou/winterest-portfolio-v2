import { useState } from 'react'
import { Layers, RotateCcw, Save } from 'lucide-react'

import { Button } from '#/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '#/components/ui/card'
import { Field, FieldGroup, FieldLabel } from '#/components/ui/field'
import { Input } from '#/components/ui/input'
import { LanguageSwitcherPill } from '#/components/ui/language-switcher-pill'
import { Switch } from '#/components/ui/switch'
import { Textarea } from '#/components/ui/textarea'
import { useUpdatePageContent } from '#/features/portfolio/page-content-hooks'
import { getDefaultStackPageConfig } from '#/features/portfolio/page-content-schemas'
import type { StackPageConfig } from '#/features/portfolio/page-content-schemas'

type StackPageContentFormProps = {
  initialData: StackPageConfig
}

export function StackPageContentForm({
  initialData,
}: StackPageContentFormProps) {
  const [locale, setLocale] = useState<'en' | 'id'>('en')
  const [formData, setFormData] = useState<StackPageConfig>(initialData)
  const [statusMessage, setStatusMessage] = useState<string | null>(null)

  const mutation = useUpdatePageContent<StackPageConfig>('stack')

  const handleResetToDefault = () => {
    if (
      window.confirm(
        'Reset form ke default copywriting? Perubahan belum tersimpan akan diganti.',
      )
    ) {
      setFormData(getDefaultStackPageConfig())
      setStatusMessage(
        'Form telah direset ke default. Klik simpan untuk menerapkan.',
      )
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setStatusMessage(null)

    mutation.mutate(formData, {
      onSuccess: () => {
        setStatusMessage('Perubahan halaman tech stack berhasil disimpan.')
        setTimeout(() => setStatusMessage(null), 4000)
      },
      onError: (err) => {
        setStatusMessage(
          err instanceof Error ? err.message : 'Gagal menyimpan perubahan.',
        )
      },
    })
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-6 max-w-4xl">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-(--brand-ink) tracking-tight flex items-center gap-2.5">
            <Layers className="size-6 text-(--brand-orange)" />
            Pengaturan Konten: Halaman Tech Stack
          </h1>
          <p className="text-sm text-(--brand-muted) mt-1">
            Kelola judul, deskripsi, dan visibilitas pada halaman /stack dan
            Ultimate Tech Stack.
          </p>
        </div>
        <div className="flex items-center gap-3 shrink-0">
          <LanguageSwitcherPill activeLocale={locale} onChange={setLocale} />
        </div>
      </div>

      {statusMessage && (
        <div
          className={`p-3.5 text-xs font-semibold rounded-lg border ${
            mutation.isError
              ? 'border-red-500/30 bg-red-50 text-red-700 dark:bg-red-950/30 dark:text-red-400'
              : 'border-green-500/30 bg-green-50 text-green-800 dark:bg-green-950/30 dark:text-green-300'
          }`}
        >
          {statusMessage}
        </div>
      )}

      {/* Bagian 1: Header Halaman Utama */}
      <Card className="border-(--brand-line) bg-card">
        <CardHeader>
          <CardTitle className="text-base font-bold text-(--brand-ink)">
            1. Header Utama Halaman Stack ({locale.toUpperCase()})
          </CardTitle>
          <CardDescription className="text-xs text-(--brand-muted)">
            Teks pengantar di bagian paling atas halaman /stack.
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-5">
          <FieldGroup className="flex flex-col gap-4">
            <Field>
              <FieldLabel htmlFor="stack-eyebrow">
                Eyebrow ({locale.toUpperCase()})
              </FieldLabel>
              <Input
                id="stack-eyebrow"
                value={
                  locale === 'en' ? formData.eyebrowEn : formData.eyebrowId
                }
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    [locale === 'en' ? 'eyebrowEn' : 'eyebrowId']:
                      e.target.value,
                  }))
                }
                placeholder={locale === 'en' ? 'e.g. Stack' : 'mis. Stack'}
              />
            </Field>

            <Field>
              <FieldLabel htmlFor="stack-title">
                Judul Utama ({locale.toUpperCase()}) *
              </FieldLabel>
              <Input
                id="stack-title"
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
                    ? 'e.g. Tech Stack that I use'
                    : 'mis. Tech Stack yang kupakai'
                }
              />
            </Field>

            <Field>
              <FieldLabel htmlFor="stack-description">
                Deskripsi ({locale.toUpperCase()})
              </FieldLabel>
              <Textarea
                id="stack-description"
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
                    ? 'List of Tech and Tools that I use...'
                    : 'Daftar Tech dan Tools yang kugunakan...'
                }
              />
            </Field>
          </FieldGroup>

          <div className="flex items-center justify-between border-t border-(--brand-line) pt-4">
            <div className="flex flex-col gap-0.5">
              <span className="text-xs font-bold text-(--brand-ink)">
                Tampilkan Deskripsi Header Utama
              </span>
              <span className="text-[11px] text-(--brand-muted)">
                Sembunyikan deskripsi untuk tampilan yang lebih padat.
              </span>
            </div>
            <Switch
              checked={formData.showDescription}
              onCheckedChange={(checked) =>
                setFormData((prev) => ({ ...prev, showDescription: checked }))
              }
            />
          </div>
        </CardContent>
      </Card>

      {/* Bagian 2: Header Seksi Ultimate Tech Stack */}
      <Card className="border-(--brand-line) bg-card">
        <CardHeader>
          <CardTitle className="text-base font-bold text-(--brand-ink)">
            2. Header Seksi Ultimate Tech Stack ({locale.toUpperCase()})
          </CardTitle>
          <CardDescription className="text-xs text-(--brand-muted)">
            Teks pembuka untuk deretan teknologi unggulan (Ultimate Stack).
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-5">
          <FieldGroup className="flex flex-col gap-4">
            <Field>
              <FieldLabel htmlFor="ultimate-eyebrow">
                Eyebrow Ultimate ({locale.toUpperCase()})
              </FieldLabel>
              <Input
                id="ultimate-eyebrow"
                value={
                  locale === 'en'
                    ? formData.ultimateEyebrowEn
                    : formData.ultimateEyebrowId
                }
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    [locale === 'en'
                      ? 'ultimateEyebrowEn'
                      : 'ultimateEyebrowId']: e.target.value,
                  }))
                }
                placeholder={
                  locale === 'en'
                    ? 'e.g. Ultimate Tech Stack'
                    : 'mis. Ultimate Tech Stack'
                }
              />
            </Field>

            <Field>
              <FieldLabel htmlFor="ultimate-title">
                Judul Seksi Ultimate ({locale.toUpperCase()}) *
              </FieldLabel>
              <Input
                id="ultimate-title"
                required
                value={
                  locale === 'en'
                    ? formData.ultimateTitleEn
                    : formData.ultimateTitleId
                }
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    [locale === 'en' ? 'ultimateTitleEn' : 'ultimateTitleId']:
                      e.target.value,
                  }))
                }
                placeholder={
                  locale === 'en'
                    ? 'e.g. Core Architecture & Preferred Stack'
                    : 'mis. Arsitektur Utama & Stack Pilihan'
                }
              />
            </Field>

            <Field>
              <FieldLabel htmlFor="ultimate-description">
                Deskripsi Seksi Ultimate ({locale.toUpperCase()})
              </FieldLabel>
              <Textarea
                id="ultimate-description"
                rows={3}
                value={
                  locale === 'en'
                    ? formData.ultimateDescriptionEn
                    : formData.ultimateDescriptionId
                }
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    [locale === 'en'
                      ? 'ultimateDescriptionEn'
                      : 'ultimateDescriptionId']: e.target.value,
                  }))
                }
                placeholder={
                  locale === 'en'
                    ? 'The primary frameworks, runtimes, and databases...'
                    : 'Framework, runtime, dan database utama...'
                }
              />
            </Field>
          </FieldGroup>

          <div className="flex items-center justify-between border-t border-(--brand-line) pt-4">
            <div className="flex flex-col gap-0.5">
              <span className="text-xs font-bold text-(--brand-ink)">
                Tampilkan Deskripsi Seksi Ultimate
              </span>
              <span className="text-[11px] text-(--brand-muted)">
                Sembunyikan deskripsi di atas daftar node arsitektur.
              </span>
            </div>
            <Switch
              checked={formData.showUltimateDescription}
              onCheckedChange={(checked) =>
                setFormData((prev) => ({
                  ...prev,
                  showUltimateDescription: checked,
                }))
              }
            />
          </div>
        </CardContent>
        <CardFooter className="flex items-center justify-between border-t border-(--brand-line) bg-surface-soft/40 px-6 py-3">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={handleResetToDefault}
            className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground"
          >
            <RotateCcw className="size-3.5" />
            Reset ke Default
          </Button>
          <Button
            type="submit"
            size="sm"
            disabled={mutation.isPending}
            className="flex items-center gap-1.5 bg-(--brand-orange) font-bold text-white hover:brightness-105"
          >
            <Save className="size-3.5" />
            {mutation.isPending ? 'Menyimpan...' : 'Simpan Perubahan'}
          </Button>
        </CardFooter>
      </Card>
    </form>
  )
}
