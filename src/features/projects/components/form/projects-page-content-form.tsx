import { useState } from 'react'
import { FolderKanban, RotateCcw, Save } from 'lucide-react'

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
import { getDefaultProjectsPageConfig } from '#/features/portfolio/page-content-schemas'
import type { ProjectsPageConfig } from '#/features/portfolio/page-content-schemas'

type ProjectsPageContentFormProps = {
  initialData: ProjectsPageConfig
}

export function ProjectsPageContentForm({
  initialData,
}: ProjectsPageContentFormProps) {
  const [locale, setLocale] = useState<'en' | 'id'>('en')
  const [formData, setFormData] = useState<ProjectsPageConfig>(initialData)
  const [statusMessage, setStatusMessage] = useState<string | null>(null)

  const mutation = useUpdatePageContent<ProjectsPageConfig>('projects')

  const handleResetToDefault = () => {
    if (
      window.confirm(
        'Reset form ke default copywriting? Perubahan belum tersimpan akan diganti.',
      )
    ) {
      setFormData(getDefaultProjectsPageConfig())
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
        setStatusMessage('Perubahan halaman project berhasil disimpan.')
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
            <FolderKanban className="size-6 text-(--brand-orange)" />
            Pengaturan Konten: Halaman Project
          </h1>
          <p className="text-sm text-(--brand-muted) mt-1">
            Kelola judul, sub-judul, deskripsi, dan visibilitas pada halaman
            /projects.
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

      <Card className="border-(--brand-line) bg-card">
        <CardHeader>
          <CardTitle className="text-base font-bold text-(--brand-ink)">
            Header Halaman ({locale.toUpperCase()})
          </CardTitle>
          <CardDescription className="text-xs text-(--brand-muted)">
            Teks utama yang tampil di bagian atas katalog project.
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-5">
          <FieldGroup className="flex flex-col gap-4">
            <Field>
              <FieldLabel htmlFor="projects-eyebrow">
                Eyebrow / Kategori Header ({locale.toUpperCase()})
              </FieldLabel>
              <Input
                id="projects-eyebrow"
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
                placeholder={locale === 'en' ? 'e.g. Projects' : 'mis. Project'}
              />
            </Field>

            <Field>
              <FieldLabel htmlFor="projects-title">
                Judul Utama ({locale.toUpperCase()}) *
              </FieldLabel>
              <Input
                id="projects-title"
                required
                value={locale === 'en' ? formData.titleEn : formData.titleId}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    [locale === 'en' ? 'titleEn' : 'titleId']: e.target.value,
                  }))
                }
                placeholder={
                  locale === 'en' ? 'e.g. Projects' : 'mis. Daftar Project'
                }
              />
            </Field>

            <Field>
              <FieldLabel htmlFor="projects-description">
                Deskripsi ({locale.toUpperCase()})
              </FieldLabel>
              <Textarea
                id="projects-description"
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
                    ? 'A collection of projects built to solve real problems...'
                    : 'Koleksi project yang dibuat berdasarkan masalah...'
                }
              />
            </Field>
          </FieldGroup>

          <div className="flex items-center justify-between border-t border-(--brand-line) pt-4">
            <div className="flex flex-col gap-0.5">
              <span className="text-xs font-bold text-(--brand-ink)">
                Tampilkan Deskripsi Halaman
              </span>
              <span className="text-[11px] text-(--brand-muted)">
                Sembunyikan deskripsi untuk tampilan yang lebih minimalis dan
                padat.
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
