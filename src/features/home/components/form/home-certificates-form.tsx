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
import { getCertificateCopy } from '#/features/certificates/copy'
import type { CertificatesPageConfig } from '#/features/portfolio/page-content-schemas'

type HomeCertificatesFormProps = {
  locale: 'en' | 'id'
  formData: CertificatesPageConfig
  onChange: (
    updater: (previous: CertificatesPageConfig) => CertificatesPageConfig,
  ) => void
}

export function HomeCertificatesForm({
  locale,
  formData,
  onChange,
}: HomeCertificatesFormProps) {
  const copy = getCertificateCopy().dashboard.pageContent
  const localeSuffix = locale === 'en' ? 'En' : 'Id'

  return (
    <Card className="border-(--brand-line) bg-card">
      <CardHeader>
        <CardTitle className="text-base font-bold text-(--brand-ink)">
          {copy.homeHeaderTitle} ({locale.toUpperCase()})
        </CardTitle>
        <CardDescription className="text-xs text-(--brand-muted)">
          {copy.homeHeaderDescription}
        </CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col gap-5">
        <FieldGroup className="flex flex-col gap-4">
          <Field>
            <FieldLabel htmlFor="home-certificates-eyebrow">
              {copy.eyebrowLabel(locale.toUpperCase())}
            </FieldLabel>
            <Input
              id="home-certificates-eyebrow"
              value={formData[`homeEyebrow${localeSuffix}`]}
              onChange={(event) => {
                const value = event.target.value
                onChange((previous) => ({
                  ...previous,
                  [`homeEyebrow${localeSuffix}`]: value,
                }))
              }}
            />
          </Field>
          <Field>
            <FieldLabel htmlFor="home-certificates-title">
              {copy.titleLabel(locale.toUpperCase())}
            </FieldLabel>
            <Input
              id="home-certificates-title"
              required
              value={formData[`homeTitle${localeSuffix}`]}
              onChange={(event) => {
                const value = event.target.value
                onChange((previous) => ({
                  ...previous,
                  [`homeTitle${localeSuffix}`]: value,
                }))
              }}
            />
          </Field>
          <Field>
            <FieldLabel htmlFor="home-certificates-description">
              {copy.descriptionLabel(locale.toUpperCase())}
            </FieldLabel>
            <Textarea
              id="home-certificates-description"
              rows={3}
              value={formData[`homeDescription${localeSuffix}`]}
              onChange={(event) => {
                const value = event.target.value
                onChange((previous) => ({
                  ...previous,
                  [`homeDescription${localeSuffix}`]: value,
                }))
              }}
            />
          </Field>
        </FieldGroup>
        <div className="flex items-center justify-between border-t border-(--brand-line) pt-4">
          <span className="text-xs font-bold text-(--brand-ink)">
            {copy.showDescription}
          </span>
          <Switch
            aria-label={copy.showDescription}
            checked={formData.showHomeDescription}
            onCheckedChange={(checked) =>
              onChange((previous) => ({
                ...previous,
                showHomeDescription: checked,
              }))
            }
          />
        </div>
      </CardContent>
    </Card>
  )
}
