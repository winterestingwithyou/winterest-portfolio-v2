import { useState } from 'react'
import { Mail } from 'lucide-react'

import { CmsPageShell } from '#/components/dashboard/cms-page-shell'
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
import { getContactCopy } from '#/features/contact/copy'
import { useUpdatePageContent } from '#/features/portfolio/page-content-hooks'
import { getDefaultContactPageConfig } from '#/features/portfolio/page-content-schemas'
import type { ContactPageConfig } from '#/features/portfolio/page-content-schemas'

type ContactPageContentFormProps = {
  initialData: ContactPageConfig
}

export function ContactPageContentForm({
  initialData,
}: ContactPageContentFormProps) {
  const contactCopy = getContactCopy()
  const copy = contactCopy.dashboard

  const [locale, setLocale] = useState<'en' | 'id'>('en')
  const [formData, setFormData] = useState<ContactPageConfig>(initialData)
  const [statusMessage, setStatusMessage] = useState<string | null>(null)
  const [isError, setIsError] = useState(false)

  const mutation = useUpdatePageContent<ContactPageConfig>('contact')

  const handleResetToDefault = () => {
    if (window.confirm(copy.resetConfirm)) {
      setFormData(getDefaultContactPageConfig())
      setIsError(false)
      setStatusMessage(copy.resetSuccess)
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setStatusMessage(null)

    mutation.mutate(formData, {
      onSuccess: () => {
        setIsError(false)
        setStatusMessage(copy.saveSuccess)
        setTimeout(() => setStatusMessage(null), 4000)
      },
      onError: (err) => {
        setIsError(true)
        setStatusMessage(err instanceof Error ? err.message : copy.saveError)
      },
    })
  }

  return (
    <CmsPageShell
      icon={<Mail className="size-5" />}
      title={copy.title}
      description={copy.description}
      locale={locale}
      onLocaleChange={setLocale}
      onReset={handleResetToDefault}
      isSaving={mutation.isPending}
      asForm
      onSubmit={handleSubmit}
      statusMessage={
        statusMessage ? { text: statusMessage, isError } : undefined
      }
    >
      {/* Bagian 1: Header Halaman */}
      <Card className="border-(--brand-line) bg-card">
        <CardHeader>
          <CardTitle className="text-base font-bold text-(--brand-ink)">
            {copy.headerTitle(locale.toUpperCase())}
          </CardTitle>
          <CardDescription className="text-xs text-(--brand-muted)">
            {copy.headerDesc}
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-5">
          <FieldGroup className="flex flex-col gap-4">
            <Field>
              <FieldLabel htmlFor="contact-eyebrow">
                {copy.eyebrowLabel(locale.toUpperCase())}
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
                placeholder={copy.eyebrowPlaceholder}
              />
            </Field>

            <Field>
              <FieldLabel htmlFor="contact-title">
                {copy.titleLabel(locale.toUpperCase())}
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
                placeholder={copy.titlePlaceholder}
              />
            </Field>

            <Field>
              <FieldLabel htmlFor="contact-description">
                {copy.descLabel(locale.toUpperCase())}
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
                placeholder={copy.descPlaceholder}
              />
            </Field>
          </FieldGroup>

          <div className="flex items-center justify-between border-t border-(--brand-line) pt-4">
            <div className="flex flex-col gap-0.5">
              <span className="text-xs font-bold text-(--brand-ink)">
                {copy.enablePage}
              </span>
              <span className="text-[11px] text-(--brand-muted)">
                {copy.enablePageDesc}
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
            {copy.channelsTitle(locale.toUpperCase())}
          </CardTitle>
          <CardDescription className="text-xs text-(--brand-muted)">
            {copy.channelsDesc}
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-4">
          <FieldGroup className="grid gap-4 sm:grid-cols-2">
            <Field>
              <FieldLabel htmlFor="direct-title">
                {copy.channelsCardTitle(locale.toUpperCase())}
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
                placeholder={copy.channelsCardTitlePlaceholder}
              />
            </Field>

            <Field>
              <FieldLabel htmlFor="direct-subtitle">
                {copy.channelsCardSubtitle(locale.toUpperCase())}
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
                placeholder={copy.channelsCardSubtitlePlaceholder}
              />
            </Field>

            <Field>
              <FieldLabel htmlFor="direct-status">
                {copy.statusPillLabel(locale.toUpperCase())}
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
                placeholder={copy.statusPillPlaceholder}
              />
            </Field>

            <Field>
              <FieldLabel htmlFor="direct-location">
                {copy.locationLabel(locale.toUpperCase())}
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
                placeholder={copy.locationPlaceholder}
              />
            </Field>
          </FieldGroup>
        </CardContent>
      </Card>

      {/* Bagian 3: Kartu Formulir Pesan */}
      <Card className="border-(--brand-line) bg-card">
        <CardHeader>
          <CardTitle className="text-base font-bold text-(--brand-ink)">
            {copy.formTitle(locale.toUpperCase())}
          </CardTitle>
          <CardDescription className="text-xs text-(--brand-muted)">
            {copy.formDesc}
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-4">
          <FieldGroup className="grid gap-4 sm:grid-cols-2">
            <Field>
              <FieldLabel htmlFor="form-title">
                {copy.formHeading(locale.toUpperCase())}
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
                placeholder={copy.formHeadingPlaceholder}
              />
            </Field>

            <Field>
              <FieldLabel htmlFor="form-subtitle">
                {copy.formSubtitle(locale.toUpperCase())}
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
                placeholder={copy.formSubtitlePlaceholder}
              />
            </Field>
          </FieldGroup>
        </CardContent>
      </Card>
    </CmsPageShell>
  )
}
