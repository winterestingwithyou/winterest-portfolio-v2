import { useState } from 'react'
import { Layers } from 'lucide-react'

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
import { useUpdatePageContent } from '#/features/portfolio/page-content-hooks'
import { getDefaultStackPageConfig } from '#/features/portfolio/page-content-schemas'
import type { StackPageConfig } from '#/features/portfolio/page-content-schemas'
import { getTechnologiesCopy } from '#/features/technologies/copy'

type StackPageContentFormProps = {
  initialData: StackPageConfig
}

export function StackPageContentForm({
  initialData,
}: StackPageContentFormProps) {
  const techCopy = getTechnologiesCopy()
  const copy = techCopy.dashboard.pageContent

  const [locale, setLocale] = useState<'en' | 'id'>('en')
  const [formData, setFormData] = useState<StackPageConfig>(initialData)
  const [statusMessage, setStatusMessage] = useState<string | null>(null)
  const [isError, setIsError] = useState(false)

  const mutation = useUpdatePageContent<StackPageConfig>('stack')

  const handleResetToDefault = () => {
    if (window.confirm(copy.resetConfirm)) {
      setFormData(getDefaultStackPageConfig())
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
      icon={<Layers className="size-5" />}
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
      {/* Bagian 1: Header Halaman Utama */}
      <Card className="border-(--brand-line) bg-card">
        <CardHeader>
          <CardTitle className="text-base font-bold text-(--brand-ink)">
            {copy.mainHeaderTitle(locale.toUpperCase())}
          </CardTitle>
          <CardDescription className="text-xs text-(--brand-muted)">
            {copy.mainHeaderDesc}
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-5">
          <FieldGroup className="flex flex-col gap-4">
            <Field>
              <FieldLabel htmlFor="stack-eyebrow">
                {copy.eyebrowLabel(locale.toUpperCase())}
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
                placeholder={copy.eyebrowPlaceholder}
              />
            </Field>

            <Field>
              <FieldLabel htmlFor="stack-title">
                {copy.titleLabel(locale.toUpperCase())}
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
                placeholder={copy.titlePlaceholder}
              />
            </Field>

            <Field>
              <FieldLabel htmlFor="stack-description">
                {copy.descLabel(locale.toUpperCase())}
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
                placeholder={copy.descPlaceholder}
              />
            </Field>
          </FieldGroup>

          <div className="flex items-center justify-between border-t border-(--brand-line) pt-4">
            <div className="flex flex-col gap-0.5">
              <span className="text-xs font-bold text-(--brand-ink)">
                {copy.showDescription}
              </span>
              <span className="text-[11px] text-(--brand-muted)">
                {copy.showDescriptionDesc}
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
            {copy.ultimateHeaderTitle(locale.toUpperCase())}
          </CardTitle>
          <CardDescription className="text-xs text-(--brand-muted)">
            {copy.ultimateHeaderDesc}
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-5">
          <FieldGroup className="flex flex-col gap-4">
            <Field>
              <FieldLabel htmlFor="ultimate-eyebrow">
                {copy.ultimateEyebrowLabel(locale.toUpperCase())}
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
                placeholder={copy.ultimateEyebrowPlaceholder}
              />
            </Field>

            <Field>
              <FieldLabel htmlFor="ultimate-title">
                {copy.ultimateTitleLabel(locale.toUpperCase())}
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
                placeholder={copy.ultimateTitlePlaceholder}
              />
            </Field>

            <Field>
              <FieldLabel htmlFor="ultimate-description">
                {copy.ultimateDescLabel(locale.toUpperCase())}
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
                placeholder={copy.ultimateDescPlaceholder}
              />
            </Field>
          </FieldGroup>

          <div className="flex items-center justify-between border-t border-(--brand-line) pt-4">
            <div className="flex flex-col gap-0.5">
              <span className="text-xs font-bold text-(--brand-ink)">
                {copy.showUltimateDescTitle}
              </span>
              <span className="text-[11px] text-(--brand-muted)">
                {copy.showUltimateDescSubtitle}
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
      </Card>
    </CmsPageShell>
  )
}
