import { useState } from 'react'
import { FolderKanban } from 'lucide-react'

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
import { getDefaultProjectsPageConfig } from '#/features/portfolio/page-content-schemas'
import type { ProjectsPageConfig } from '#/features/portfolio/page-content-schemas'
import { getProjectsCopy } from '#/features/projects/copy'

type ProjectsPageContentFormProps = {
  initialData: ProjectsPageConfig
}

export function ProjectsPageContentForm({
  initialData,
}: ProjectsPageContentFormProps) {
  const projectsCopy = getProjectsCopy()
  const copy = projectsCopy.dashboard.pageContent

  const [locale, setLocale] = useState<'en' | 'id'>('en')
  const [formData, setFormData] = useState<ProjectsPageConfig>(initialData)
  const [statusMessage, setStatusMessage] = useState<string | null>(null)
  const [isError, setIsError] = useState(false)

  const mutation = useUpdatePageContent<ProjectsPageConfig>('projects')

  const handleResetToDefault = () => {
    if (window.confirm(copy.resetConfirm)) {
      setFormData(getDefaultProjectsPageConfig())
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
      icon={<FolderKanban className="size-5" />}
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
              <FieldLabel htmlFor="projects-eyebrow">
                {copy.eyebrowLabel(locale.toUpperCase())}
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
                placeholder={copy.eyebrowPlaceholder}
              />
            </Field>

            <Field>
              <FieldLabel htmlFor="projects-title">
                {copy.titleLabel(locale.toUpperCase())}
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
                placeholder={copy.titlePlaceholder}
              />
            </Field>

            <Field>
              <FieldLabel htmlFor="projects-description">
                {copy.descLabel(locale.toUpperCase())}
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
    </CmsPageShell>
  )
}
