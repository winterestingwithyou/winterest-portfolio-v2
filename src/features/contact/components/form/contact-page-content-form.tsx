import { useState } from 'react'
import { Mail, RotateCcw, Save } from 'lucide-react'

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
import { getDefaultContactPageConfig } from '#/features/portfolio/page-content-schemas'
import type { ContactPageConfig } from '#/features/portfolio/page-content-schemas'

type ContactPageContentFormProps = {
  initialData: ContactPageConfig
}

export function ContactPageContentForm({
  initialData,
}: ContactPageContentFormProps) {
  const [locale, setLocale] = useState<'en' | 'id'>('en')
  const [formData, setFormData] = useState<ContactPageConfig>(initialData)
  const [statusMessage, setStatusMessage] = useState<string | null>(null)

  const mutation = useUpdatePageContent<ContactPageConfig>('contact')

  const handleResetToDefault = () => {
    if (
      window.confirm(
        'Reset form ke default copywriting? Perubahan belum tersimpan akan diganti.',
      )
    ) {
      setFormData(getDefaultContactPageConfig())
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
        setStatusMessage('Perubahan halaman kontak berhasil disimpan.')
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
            <Mail className="size-6 text-(--brand-orange)" />
            Pengaturan Konten: Halaman Kontak
          </h1>
          <p className="text-sm text-(--brand-muted) mt-1">
            Kelola teks header, label kartu kontak langsung, dan judul formulir
            pesan pada /contact.
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

      {/* Bagian 1: Header Halaman */}
      <Card className="border-(--brand-line) bg-card">
        <CardHeader>
          <CardTitle className="text-base font-bold text-(--brand-ink)">
            1. Header Halaman Kontak ({locale.toUpperCase()})
          </CardTitle>
          <CardDescription className="text-xs text-(--brand-muted)">
            Teks utama di bagian paling atas halaman /contact.
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-5">
          <FieldGroup className="flex flex-col gap-4">
            <Field>
              <FieldLabel htmlFor="contact-eyebrow">
                Eyebrow ({locale.toUpperCase()})
              </FieldLabel>
              <Input
                id="contact-eyebrow"
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
                placeholder={locale === 'en' ? 'e.g. Contact' : 'mis. Kontak'}
              />
            </Field>

            <Field>
              <FieldLabel htmlFor="contact-title">
                Judul Utama ({locale.toUpperCase()}) *
              </FieldLabel>
              <Input
                id="contact-title"
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
                    ? "e.g. Let's connect."
                    : 'mis. Mari terhubung.'
                }
              />
            </Field>

            <Field>
              <FieldLabel htmlFor="contact-description">
                Deskripsi ({locale.toUpperCase()})
              </FieldLabel>
              <Textarea
                id="contact-description"
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
                    ? 'Have a project idea, question, or opportunity?...'
                    : 'Punya ide proyek, pertanyaan, atau peluang kerja sama?...'
                }
              />
            </Field>
          </FieldGroup>

          <div className="flex items-center justify-between border-t border-(--brand-line) pt-4">
            <div className="flex flex-col gap-0.5">
              <span className="text-xs font-bold text-(--brand-ink)">
                Tampilkan Deskripsi Header
              </span>
              <span className="text-[11px] text-(--brand-muted)">
                Sembunyikan deskripsi untuk tampilan yang lebih minimalis.
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

      {/* Bagian 2: Kartu Kontak Langsung */}
      <Card className="border-(--brand-line) bg-card">
        <CardHeader>
          <CardTitle className="text-base font-bold text-(--brand-ink)">
            2. Kartu Kontak Langsung ({locale.toUpperCase()})
          </CardTitle>
          <CardDescription className="text-xs text-(--brand-muted)">
            Label status, lokasi, dan sub-judul pada kartu kanal komunikasi
            langsung.
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-4">
          <FieldGroup className="grid gap-4 sm:grid-cols-2">
            <Field>
              <FieldLabel htmlFor="direct-title">
                Judul Kartu ({locale.toUpperCase()})
              </FieldLabel>
              <Input
                id="direct-title"
                value={
                  locale === 'en'
                    ? formData.directTitleEn
                    : formData.directTitleId
                }
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    [locale === 'en' ? 'directTitleEn' : 'directTitleId']:
                      e.target.value,
                  }))
                }
                placeholder="mis. Direct Channels"
              />
            </Field>

            <Field>
              <FieldLabel htmlFor="direct-subtitle">
                Sub-judul Kartu ({locale.toUpperCase()})
              </FieldLabel>
              <Input
                id="direct-subtitle"
                value={
                  locale === 'en'
                    ? formData.directSubtitleEn
                    : formData.directSubtitleId
                }
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    [locale === 'en' ? 'directSubtitleEn' : 'directSubtitleId']:
                      e.target.value,
                  }))
                }
                placeholder="mis. Social media & public profiles."
              />
            </Field>

            <Field>
              <FieldLabel htmlFor="direct-status">
                Status Ketersediaan ({locale.toUpperCase()})
              </FieldLabel>
              <Input
                id="direct-status"
                value={
                  locale === 'en'
                    ? formData.directStatusEn
                    : formData.directStatusId
                }
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    [locale === 'en' ? 'directStatusEn' : 'directStatusId']:
                      e.target.value,
                  }))
                }
                placeholder="mis. Open for new projects & opportunities"
              />
            </Field>

            <Field>
              <FieldLabel htmlFor="direct-location">
                Zona Waktu / Lokasi ({locale.toUpperCase()})
              </FieldLabel>
              <Input
                id="direct-location"
                value={
                  locale === 'en'
                    ? formData.directLocationEn
                    : formData.directLocationId
                }
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    [locale === 'en' ? 'directLocationEn' : 'directLocationId']:
                      e.target.value,
                  }))
                }
                placeholder="mis. Indonesia (UTC+7)"
              />
            </Field>
          </FieldGroup>
        </CardContent>
      </Card>

      {/* Bagian 3: Kartu Formulir Pesan */}
      <Card className="border-(--brand-line) bg-card">
        <CardHeader>
          <CardTitle className="text-base font-bold text-(--brand-ink)">
            3. Kartu Formulir Kirim Pesan ({locale.toUpperCase()})
          </CardTitle>
          <CardDescription className="text-xs text-(--brand-muted)">
            Judul dan instruksi pembuka di atas formulir pesan pengunjung.
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-4">
          <FieldGroup className="grid gap-4 sm:grid-cols-2">
            <Field>
              <FieldLabel htmlFor="form-title">
                Judul Formulir ({locale.toUpperCase()})
              </FieldLabel>
              <Input
                id="form-title"
                value={
                  locale === 'en' ? formData.formTitleEn : formData.formTitleId
                }
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    [locale === 'en' ? 'formTitleEn' : 'formTitleId']:
                      e.target.value,
                  }))
                }
                placeholder="mis. Send a Message"
              />
            </Field>

            <Field>
              <FieldLabel htmlFor="form-subtitle">
                Sub-judul Formulir ({locale.toUpperCase()})
              </FieldLabel>
              <Input
                id="form-subtitle"
                value={
                  locale === 'en'
                    ? formData.formSubtitleEn
                    : formData.formSubtitleId
                }
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    [locale === 'en' ? 'formSubtitleEn' : 'formSubtitleId']:
                      e.target.value,
                  }))
                }
                placeholder="mis. Fill out the form to compose a direct message."
              />
            </Field>
          </FieldGroup>
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
