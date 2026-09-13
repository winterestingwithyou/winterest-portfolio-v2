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
import { getHomeCopy } from '#/features/home/copy'
import type { HomeConfigInput } from '#/features/home/validation'

type HomeHeroEducationFormProps = {
  locale: 'en' | 'id'
  formData: HomeConfigInput
  onChange: (updater: (prev: HomeConfigInput) => HomeConfigInput) => void
}

export function HomeHeroEducationForm({
  locale,
  formData,
  onChange,
}: HomeHeroEducationFormProps) {
  const copy = getHomeCopy().dashboard

  return (
    <div className="flex flex-col gap-6">
      {/* 1. Hero Introduction Copy */}
      <Card className="border-(--brand-line) bg-card">
        <CardHeader>
          <CardTitle className="text-base font-bold text-(--brand-ink)">
            {copy.heroIntroSection.cardTitle(locale.toUpperCase())}
          </CardTitle>
          <CardDescription className="text-xs text-(--brand-muted)">
            {copy.heroIntroSection.cardDesc}
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-4">
          <FieldGroup className="flex flex-col gap-4">
            <Field>
              <FieldLabel htmlFor="hero-eyebrow">
                {copy.heroIntroSection.eyebrowLabel(locale.toUpperCase())}
              </FieldLabel>
              <Input
                id="hero-eyebrow"
                value={
                  locale === 'en'
                    ? formData.heroEyebrowEn
                    : formData.heroEyebrowId
                }
                onChange={(e) =>
                  onChange((prev) => ({
                    ...prev,
                    [locale === 'en' ? 'heroEyebrowEn' : 'heroEyebrowId']:
                      e.target.value,
                  }))
                }
                placeholder={copy.heroIntroSection.eyebrowPlaceholder}
              />
            </Field>

            <Field>
              <FieldLabel htmlFor="hero-title">
                {copy.heroIntroSection.titleLabel(locale.toUpperCase())}
              </FieldLabel>
              <Input
                id="hero-title"
                required
                value={
                  locale === 'en' ? formData.heroTitleEn : formData.heroTitleId
                }
                onChange={(e) =>
                  onChange((prev) => ({
                    ...prev,
                    [locale === 'en' ? 'heroTitleEn' : 'heroTitleId']:
                      e.target.value,
                  }))
                }
                placeholder={copy.heroIntroSection.titlePlaceholder}
              />
            </Field>

            <Field>
              <FieldLabel htmlFor="hero-intro">
                {copy.heroIntroSection.introLabel(locale.toUpperCase())}
              </FieldLabel>
              <Textarea
                id="hero-intro"
                rows={3}
                value={
                  locale === 'en' ? formData.heroIntroEn : formData.heroIntroId
                }
                onChange={(e) =>
                  onChange((prev) => ({
                    ...prev,
                    [locale === 'en' ? 'heroIntroEn' : 'heroIntroId']:
                      e.target.value,
                  }))
                }
                placeholder={copy.heroIntroSection.introPlaceholder}
              />
            </Field>

            <Field>
              <FieldLabel htmlFor="hero-intro-suffix">
                {copy.heroIntroSection.introSuffixLabel(locale.toUpperCase())}
              </FieldLabel>
              <Input
                id="hero-intro-suffix"
                value={
                  locale === 'en'
                    ? formData.heroIntroSuffixEn
                    : formData.heroIntroSuffixId
                }
                onChange={(e) =>
                  onChange((prev) => ({
                    ...prev,
                    [locale === 'en'
                      ? 'heroIntroSuffixEn'
                      : 'heroIntroSuffixId']: e.target.value,
                  }))
                }
                placeholder={copy.heroIntroSection.introSuffixPlaceholder}
              />
            </Field>
          </FieldGroup>
        </CardContent>
      </Card>

      {/* 2. Latest Education Background */}
      <Card className="border-(--brand-line) bg-card">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-base font-bold text-(--brand-ink)">
                {copy.education.cardTitle}
              </CardTitle>
              <CardDescription className="text-xs text-(--brand-muted) mt-0.5">
                {copy.education.cardDesc}
              </CardDescription>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold text-(--brand-ink)">
                {copy.education.showEducation}
              </span>
              <Switch
                checked={formData.showEducation}
                onCheckedChange={(checked) =>
                  onChange((prev) => ({ ...prev, showEducation: checked }))
                }
              />
            </div>
          </div>
        </CardHeader>
        <CardContent className="flex flex-col gap-4">
          <FieldGroup className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <Field>
              <FieldLabel htmlFor="education-university">
                {copy.education.universityLabel}
              </FieldLabel>
              <Input
                id="education-university"
                value={formData.educationUniversity}
                onChange={(e) =>
                  onChange((prev) => ({
                    ...prev,
                    educationUniversity: e.target.value,
                  }))
                }
                placeholder={copy.education.universityPlaceholder}
              />
            </Field>

            <Field>
              <FieldLabel htmlFor="education-major">
                {copy.education.majorLabel(locale.toUpperCase())}
              </FieldLabel>
              <Input
                id="education-major"
                value={
                  locale === 'en'
                    ? formData.educationMajorEn
                    : formData.educationMajorId
                }
                onChange={(e) =>
                  onChange((prev) => ({
                    ...prev,
                    [locale === 'en' ? 'educationMajorEn' : 'educationMajorId']:
                      e.target.value,
                  }))
                }
                placeholder={copy.education.majorPlaceholder}
              />
            </Field>

            <Field>
              <FieldLabel htmlFor="education-gpa">
                {copy.education.gpaLabel}
              </FieldLabel>
              <Input
                id="education-gpa"
                value={formData.educationGpa}
                onChange={(e) =>
                  onChange((prev) => ({
                    ...prev,
                    educationGpa: e.target.value,
                  }))
                }
                placeholder={copy.education.gpaPlaceholder}
              />
            </Field>
          </FieldGroup>
        </CardContent>
      </Card>
    </div>
  )
}
