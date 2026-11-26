import { useState } from 'react'
import { Award } from 'lucide-react'

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
import { getDefaultCertificatesPageConfig } from '#/features/portfolio/page-content-schemas'
import type { CertificatesPageConfig } from '#/features/portfolio/page-content-schemas'
import { getCertificateCopy } from '#/features/certificates/copy'

type CertificatesPageContentFormProps = {
  initialData: CertificatesPageConfig
}

export function CertificatesPageContentForm({
  initialData,
}: CertificatesPageContentFormProps) {
  const copy = getCertificateCopy().dashboard.pageContent
  const [locale, setLocale] = useState<'en' | 'id'>('en')
  const [formData, setFormData] = useState(initialData)
  const [statusMessage, setStatusMessage] = useState<string | null>(null)
  const [isError, setIsError] = useState(false)
  const mutation = useUpdatePageContent<CertificatesPageConfig>('certificates')

  const updateField = <TKey extends keyof CertificatesPageConfig>(
    key: TKey,
    value: CertificatesPageConfig[TKey],
  ) => setFormData((previous) => ({ ...previous, [key]: value }))

  const handleReset = () => {
    if (window.confirm(copy.resetConfirm)) {
      const defaults = getDefaultCertificatesPageConfig()
      setFormData((current) => ({
        ...defaults,
        homeEyebrowEn: current.homeEyebrowEn,
        homeEyebrowId: current.homeEyebrowId,
        homeTitleEn: current.homeTitleEn,
        homeTitleId: current.homeTitleId,
        homeDescriptionEn: current.homeDescriptionEn,
        homeDescriptionId: current.homeDescriptionId,
        showHomeDescription: current.showHomeDescription,
      }))
      setIsError(false)
      setStatusMessage(copy.resetSuccess)
    }
  }

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault()
    setStatusMessage(null)
    mutation.mutate(formData, {
      onSuccess: () => {
        setIsError(false)
        setStatusMessage(copy.saveSuccess)
        setTimeout(() => setStatusMessage(null), 4000)
      },
      onError: (error) => {
        setIsError(true)
        setStatusMessage(
          error instanceof Error ? error.message : copy.saveError,
        )
      },
    })
  }

  const localeSuffix = locale === 'en' ? 'En' : 'Id'

  return (
    <CmsPageShell
      icon={<Award className="size-5" />}
      title={copy.title}
      description={copy.description}
      locale={locale}
      onLocaleChange={setLocale}
      onReset={handleReset}
      isSaving={mutation.isPending}
      asForm
      onSubmit={handleSubmit}
      statusMessage={
        statusMessage ? { text: statusMessage, isError } : undefined
      }
    >
      <Card className="border-(--brand-line) bg-card">
        <CardHeader>
          <CardTitle className="text-base font-bold text-(--brand-ink)">
            {copy.pageHeaderTitle}
          </CardTitle>
          <CardDescription className="text-xs text-(--brand-muted)">
            {copy.pageHeaderDescription}
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-5">
          <FieldGroup className="flex flex-col gap-4">
            <Field>
              <FieldLabel htmlFor="certificates-page-eyebrow">
                {copy.eyebrowLabel(locale.toUpperCase())}
              </FieldLabel>
              <Input
                id="certificates-page-eyebrow"
                value={formData[`eyebrow${localeSuffix}`]}
                onChange={(event) =>
                  updateField(`eyebrow${localeSuffix}`, event.target.value)
                }
              />
            </Field>
            <Field>
              <FieldLabel htmlFor="certificates-page-title">
                {copy.titleLabel(locale.toUpperCase())}
              </FieldLabel>
              <Input
                id="certificates-page-title"
                required
                value={formData[`title${localeSuffix}`]}
                onChange={(event) =>
                  updateField(`title${localeSuffix}`, event.target.value)
                }
              />
            </Field>
            <Field>
              <FieldLabel htmlFor="certificates-page-description">
                {copy.descriptionLabel(locale.toUpperCase())}
              </FieldLabel>
              <Textarea
                id="certificates-page-description"
                rows={3}
                value={formData[`description${localeSuffix}`]}
                onChange={(event) =>
                  updateField(`description${localeSuffix}`, event.target.value)
                }
              />
            </Field>
          </FieldGroup>
          <div className="flex items-center justify-between border-t border-(--brand-line) pt-4">
            <span className="text-xs font-bold text-(--brand-ink)">
              {copy.showDescription}
            </span>
            <Switch
              aria-label={copy.showDescription}
              checked={formData.showDescription}
              onCheckedChange={(checked) =>
                updateField('showDescription', checked)
              }
            />
          </div>
        </CardContent>
      </Card>
    </CmsPageShell>
  )
}
