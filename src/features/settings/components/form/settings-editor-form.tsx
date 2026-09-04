import { useForm } from '@tanstack/react-form'
import { Link } from '@tanstack/react-router'
import {
  AlertCircle,
  CheckCircle2,
  ExternalLink,
  FileText,
  FolderOpen,
  Globe,
  Loader2,
  Mail,
  Palette,
  Save,
  Search,
  Share2,
  Sliders,
  Trash2,
} from 'lucide-react'
import { useState } from 'react'

import { ImageUploader } from '#/components/media/image-uploader'
import { MediaPickerDialog } from '#/components/media/media-picker-dialog'
import { Button } from '#/components/ui/button'
import { Checkbox } from '#/components/ui/checkbox'
import {
  Field,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
} from '#/components/ui/field'
import { Input } from '#/components/ui/input'
import { Textarea } from '#/components/ui/textarea'
import { getDashboardCopy } from '#/features/dashboard/copy'

import { getBaseUrl } from '#/lib/api-client'
import { useUpdateSiteSettings } from '#/features/settings/hooks'
import type { SiteSettingsInput } from '#/features/settings/types'
import { siteSettingsSchema } from '#/features/settings/types'
import { formatMetaTitle } from '#/lib/metadata'

type SettingsEditorFormProps = {
  initialData: SiteSettingsInput
  canEdit: boolean
}

type SettingsTab = 'general' | 'visual' | 'contact' | 'seo' | 'system'

export function SettingsEditorForm({
  initialData,
  canEdit,
}: SettingsEditorFormProps) {
  const copy = getDashboardCopy()
  const settingsCopy = copy.settings

  const [activeTab, setActiveTab] = useState<SettingsTab>('general')
  const [metaLangTab, setMetaLangTab] = useState<'en' | 'id'>('en')
  const [successMessage, setSuccessMessage] = useState<string | null>(null)
  const [enCvPickerOpen, setEnCvPickerOpen] = useState(false)
  const [idCvPickerOpen, setIdCvPickerOpen] = useState(false)

  const updateMutation = useUpdateSiteSettings()
  const isSaving = updateMutation.isPending
  const saveError = updateMutation.error?.message ?? null

  const previewAppUrl = (() => {
    const rawUrl = getBaseUrl() as string
    try {
      if (rawUrl) {
        return (
          new URL(rawUrl).host ||
          rawUrl.replace(/^https?:\/\//, '').replace(/\/+$/, '')
        )
      }
    } catch {
      return rawUrl.replace(/^https?:\/\//, '').replace(/\/+$/, '')
    }
    return 'example.com'
  })()

  const form = useForm({
    defaultValues: initialData,
    validators: {
      onChange: siteSettingsSchema,
    },
    onSubmit: async ({ value }) => {
      setSuccessMessage(null)
      try {
        await updateMutation.mutateAsync(value)
        setSuccessMessage(settingsCopy.feedback.updated)
      } catch (err) {
        console.error(err)
      }
    },
  })

  const tabs: Array<{ id: SettingsTab; label: string; icon: typeof Globe }> = [
    { id: 'general', label: settingsCopy.tabs.general, icon: Globe },
    { id: 'visual', label: settingsCopy.tabs.visual, icon: Palette },
    { id: 'contact', label: settingsCopy.tabs.contact, icon: Mail },
    { id: 'seo', label: settingsCopy.tabs.seo, icon: Search },
    { id: 'system', label: settingsCopy.tabs.system, icon: Sliders },
  ]

  return (
    <div className="flex flex-col gap-6">
      {!canEdit && (
        <div className="flex items-start gap-3 rounded-lg border border-amber-200 bg-amber-50 p-4 text-amber-900 dark:border-amber-900/50 dark:bg-amber-950/30 dark:text-amber-200">
          <AlertCircle className="mt-0.5 size-5 shrink-0 text-amber-600 dark:text-amber-400" />
          <div className="flex flex-col gap-0.5">
            <span className="font-bold text-sm">
              {settingsCopy.accessDeniedTitle}
            </span>
            <span className="text-xs">
              {settingsCopy.accessDeniedDescription}
            </span>
          </div>
        </div>
      )}

      {successMessage && (
        <div className="flex items-center gap-3 rounded-lg border border-emerald-200 bg-emerald-50 p-4 text-emerald-900 dark:border-emerald-900/50 dark:bg-emerald-950/30 dark:text-emerald-200">
          <CheckCircle2 className="size-5 shrink-0 text-emerald-600 dark:text-emerald-400" />
          <span className="font-semibold text-sm">{successMessage}</span>
        </div>
      )}

      {saveError && (
        <div className="flex items-center gap-3 rounded-lg border border-red-200 bg-red-50 p-4 text-red-900 dark:border-red-900/50 dark:bg-red-950/30 dark:text-red-200">
          <AlertCircle className="size-5 shrink-0 text-red-600 dark:text-red-400" />
          <span className="font-semibold text-sm">{saveError}</span>
        </div>
      )}

      {/* Navigation Tabs */}
      <div className="flex items-center gap-1 overflow-x-auto border-b border-(--brand-line) no-scrollbar scroll-smooth">
        {tabs.map((tab) => {
          const Icon = tab.icon
          const isActive = activeTab === tab.id
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id)}
              className={`flex min-h-[44px] shrink-0 items-center gap-2 border-b-2 px-4 py-3 text-xs font-semibold whitespace-nowrap transition-colors sm:text-sm ${
                isActive
                  ? 'border-(--brand-orange) text-(--brand-orange-deep) dark:text-(--brand-orange)'
                  : 'border-transparent text-muted-foreground hover:border-muted hover:text-foreground'
              }`}
            >
              <Icon className="size-4" />
              <span>{tab.label}</span>
            </button>
          )
        })}
      </div>

      <form
        onSubmit={(e) => {
          e.preventDefault()
          e.stopPropagation()
          void form.handleSubmit()
        }}
        className="flex flex-col gap-6"
      >
        {/* Tab 1: General Settings */}
        {activeTab === 'general' && (
          <div className="grid gap-6 rounded-xl border border-(--brand-line) bg-card p-6 shadow-xs">
            <FieldGroup>
              <form.Field name="siteName">
                {(field) => (
                  <Field>
                    <FieldLabel>{settingsCopy.form.siteName}</FieldLabel>
                    <Input
                      disabled={!canEdit || isSaving}
                      value={field.state.value}
                      onBlur={field.handleBlur}
                      onChange={(e) => field.handleChange(e.target.value)}
                      placeholder="e.g. Winterest"
                    />
                    <FieldDescription>
                      {settingsCopy.form.siteNameDesc}
                    </FieldDescription>
                    <FieldError errors={field.state.meta.errors} />
                  </Field>
                )}
              </form.Field>

              <form.Field name="siteTagline">
                {(field) => (
                  <Field>
                    <FieldLabel>{settingsCopy.form.siteTagline}</FieldLabel>
                    <Input
                      disabled={!canEdit || isSaving}
                      value={field.state.value}
                      onBlur={field.handleBlur}
                      onChange={(e) => field.handleChange(e.target.value)}
                      placeholder="e.g. Personal Portfolio Platform"
                    />
                    <FieldDescription>
                      {settingsCopy.form.siteTaglineDesc}
                    </FieldDescription>
                    <FieldError errors={field.state.meta.errors} />
                  </Field>
                )}
              </form.Field>

              <form.Field name="siteDescription">
                {(field) => (
                  <Field>
                    <FieldLabel>{settingsCopy.form.siteDescription}</FieldLabel>
                    <Textarea
                      rows={3}
                      disabled={!canEdit || isSaving}
                      value={field.state.value}
                      onBlur={field.handleBlur}
                      onChange={(e) => field.handleChange(e.target.value)}
                      placeholder="Brief intro summary..."
                    />
                    <FieldDescription>
                      {settingsCopy.form.siteDescriptionDesc}
                    </FieldDescription>
                    <FieldError errors={field.state.meta.errors} />
                  </Field>
                )}
              </form.Field>

              <form.Field name="defaultLocale">
                {(field) => (
                  <Field>
                    <FieldLabel>{settingsCopy.form.defaultLocale}</FieldLabel>
                    <div className="flex items-center gap-4 pt-1">
                      <label className="flex cursor-pointer items-center gap-2 text-xs font-medium">
                        <input
                          type="radio"
                          name="defaultLocale"
                          value="en"
                          disabled={!canEdit || isSaving}
                          checked={field.state.value === 'en'}
                          onChange={() => field.handleChange('en')}
                          className="accent-(--brand-orange)"
                        />
                        English (en)
                      </label>
                      <label className="flex cursor-pointer items-center gap-2 text-xs font-medium">
                        <input
                          type="radio"
                          name="defaultLocale"
                          value="id"
                          disabled={!canEdit || isSaving}
                          checked={field.state.value === 'id'}
                          onChange={() => field.handleChange('id')}
                          className="accent-(--brand-orange)"
                        />
                        Bahasa Indonesia (id)
                      </label>
                    </div>
                    <FieldError errors={field.state.meta.errors} />
                  </Field>
                )}
              </form.Field>
            </FieldGroup>
          </div>
        )}

        {/* Tab 2: Branding & Visual */}
        {activeTab === 'visual' && (
          <div className="grid gap-6 rounded-xl border border-(--brand-line) bg-card p-6 shadow-xs">
            <FieldGroup>
              <form.Field name="heroVisualUrl">
                {(field) => (
                  <ImageUploader
                    label={settingsCopy.form.heroVisualUrl}
                    description={settingsCopy.form.heroVisualDesc}
                    value={field.state.value}
                    onChange={(val) => field.handleChange(val ?? '')}
                    aspectRatio="wide"
                  />
                )}
              </form.Field>
            </FieldGroup>

            {/* Section: Curriculum Vitae / Resume Documents */}
            <div className="border-t border-(--brand-line) pt-6">
              <div className="mb-4">
                <div className="flex items-center gap-2">
                  <FileText className="size-4 text-(--brand-orange)" />
                  <h3 className="text-sm font-bold text-(--brand-ink)">
                    {settingsCopy.form.cvHeading}
                  </h3>
                </div>
                <p className="mt-1 text-xs text-(--brand-muted)">
                  {settingsCopy.form.cvHeadingDesc}
                </p>
              </div>

              <div className="grid gap-5 sm:grid-cols-2">
                {/* English CV Slot */}
                <form.Field name="cvEnUrl">
                  {(field) => {
                    const hasFile = Boolean(
                      field.state.value && field.state.value.trim(),
                    )
                    const fileName = hasFile
                      ? field.state.value.split('/').pop() || 'Resume-EN.pdf'
                      : null

                    return (
                      <div className="surface-card flex flex-col justify-between rounded-xl border border-(--brand-line) p-4 transition hover:border-(--brand-orange)/50">
                        <div>
                          <div className="flex items-center justify-between gap-2">
                            <span className="flex items-center gap-1.5 text-xs font-semibold text-(--brand-ink)">
                              <span className="text-sm">🇺🇸</span>
                              {settingsCopy.form.cvEnLabel}
                            </span>
                            {hasFile ? (
                              <span className="rounded-full bg-emerald-500/10 px-2.5 py-0.5 text-[11px] font-medium text-emerald-600">
                                {settingsCopy.form.cvStatusActive}
                              </span>
                            ) : (
                              <span className="rounded-full border border-(--brand-line) bg-(--surface-strong) px-2.5 py-0.5 text-[11px] font-medium text-(--brand-muted)">
                                {settingsCopy.form.cvStatusEmpty}
                              </span>
                            )}
                          </div>
                          <p className="mt-1.5 text-xs leading-relaxed text-(--brand-muted)">
                            {settingsCopy.form.cvEnDesc}
                          </p>

                          {hasFile ? (
                            <div className="mt-3 flex items-center gap-2.5 rounded-lg border border-rose-500/20 bg-rose-500/5 p-2.5">
                              <FileText className="size-5 shrink-0 text-rose-600" />
                              <div className="min-w-0 flex-1">
                                <p className="truncate text-xs font-semibold text-(--brand-ink)">
                                  {fileName}
                                </p>
                              </div>
                            </div>
                          ) : (
                            <div className="mt-3 rounded-lg border border-dashed border-(--brand-line) p-3 text-center">
                              <p className="text-xs text-(--brand-muted)">
                                {settingsCopy.form.noCvUploaded}
                              </p>
                            </div>
                          )}
                        </div>

                        <div className="mt-4 flex flex-wrap items-center gap-2 border-t border-(--brand-line) pt-3">
                          {hasFile ? (
                            <>
                              <a
                                href={field.state.value}
                                target="_blank"
                                rel="noreferrer"
                                className="inline-flex h-8 items-center gap-1.5 rounded-lg border border-(--brand-line) bg-(--surface-strong) px-2.5 text-xs font-semibold text-(--brand-ink) transition hover:border-(--brand-orange)"
                              >
                                <ExternalLink className="size-3 text-(--brand-orange)" />
                                {copy.media.preview}
                              </a>
                              <Button
                                type="button"
                                variant="outline"
                                size="sm"
                                onClick={() => setEnCvPickerOpen(true)}
                                className="h-8 gap-1.5 text-xs font-semibold"
                              >
                                <FolderOpen className="size-3" />
                                {settingsCopy.form.changeCvPdf}
                              </Button>
                              <Button
                                type="button"
                                variant="ghost"
                                size="sm"
                                onClick={() => field.handleChange('')}
                                className="h-8 px-2 text-xs font-semibold text-rose-500 hover:bg-rose-500/10 hover:text-rose-600"
                                title={settingsCopy.form.removeCvPdf}
                              >
                                <Trash2 className="size-3.5" />
                              </Button>
                            </>
                          ) : (
                            <Button
                              type="button"
                              variant="outline"
                              size="sm"
                              onClick={() => setEnCvPickerOpen(true)}
                              className="w-full gap-2 border-(--brand-line) text-xs font-semibold text-(--brand-orange-deep) hover:border-(--brand-orange)"
                            >
                              <FolderOpen className="size-3.5" />
                              {settingsCopy.form.selectCvPdf}
                            </Button>
                          )}
                        </div>

                        <MediaPickerDialog
                          open={enCvPickerOpen}
                          onOpenChange={setEnCvPickerOpen}
                          onSelect={(media) => field.handleChange(media.url)}
                          currentUrl={field.state.value}
                          accept="document"
                        />
                      </div>
                    )
                  }}
                </form.Field>

                {/* Indonesian CV Slot */}
                <form.Field name="cvIdUrl">
                  {(field) => {
                    const hasFile = Boolean(
                      field.state.value && field.state.value.trim(),
                    )
                    const fileName = hasFile
                      ? field.state.value.split('/').pop() || 'Resume-ID.pdf'
                      : null

                    return (
                      <div className="surface-card flex flex-col justify-between rounded-xl border border-(--brand-line) p-4 transition hover:border-(--brand-orange)/50">
                        <div>
                          <div className="flex items-center justify-between gap-2">
                            <span className="flex items-center gap-1.5 text-xs font-semibold text-(--brand-ink)">
                              <span className="text-sm">🇮🇩</span>
                              {settingsCopy.form.cvIdLabel}
                            </span>
                            {hasFile ? (
                              <span className="rounded-full bg-emerald-500/10 px-2.5 py-0.5 text-[11px] font-medium text-emerald-600">
                                {settingsCopy.form.cvStatusActive}
                              </span>
                            ) : (
                              <span className="rounded-full bg-blue-500/10 px-2.5 py-0.5 text-[11px] font-medium text-blue-600 dark:text-blue-400">
                                {settingsCopy.form.cvStatusUsingEn}
                              </span>
                            )}
                          </div>
                          <p className="mt-1.5 text-xs leading-relaxed text-(--brand-muted)">
                            {settingsCopy.form.cvIdDesc}
                          </p>

                          {hasFile ? (
                            <div className="mt-3 flex items-center gap-2.5 rounded-lg border border-rose-500/20 bg-rose-500/5 p-2.5">
                              <FileText className="size-5 shrink-0 text-rose-600" />
                              <div className="min-w-0 flex-1">
                                <p className="truncate text-xs font-semibold text-(--brand-ink)">
                                  {fileName}
                                </p>
                              </div>
                            </div>
                          ) : (
                            <div className="mt-3 rounded-lg border border-dashed border-(--brand-line) p-3 text-center">
                              <p className="text-xs text-(--brand-muted)">
                                {settingsCopy.form.cvFallbackActive}
                              </p>
                            </div>
                          )}
                        </div>

                        <div className="mt-4 flex flex-wrap items-center gap-2 border-t border-(--brand-line) pt-3">
                          {hasFile ? (
                            <>
                              <a
                                href={field.state.value}
                                target="_blank"
                                rel="noreferrer"
                                className="inline-flex h-8 items-center gap-1.5 rounded-lg border border-(--brand-line) bg-(--surface-strong) px-2.5 text-xs font-semibold text-(--brand-ink) transition hover:border-(--brand-orange)"
                              >
                                <ExternalLink className="size-3 text-(--brand-orange)" />
                                {copy.media.preview}
                              </a>
                              <Button
                                type="button"
                                variant="outline"
                                size="sm"
                                onClick={() => setIdCvPickerOpen(true)}
                                className="h-8 gap-1.5 text-xs font-semibold"
                              >
                                <FolderOpen className="size-3" />
                                {settingsCopy.form.changeCvPdf}
                              </Button>
                              <Button
                                type="button"
                                variant="ghost"
                                size="sm"
                                onClick={() => field.handleChange('')}
                                className="h-8 px-2 text-xs font-semibold text-rose-500 hover:bg-rose-500/10 hover:text-rose-600"
                                title={settingsCopy.form.removeCvPdf}
                              >
                                <Trash2 className="size-3.5" />
                              </Button>
                            </>
                          ) : (
                            <Button
                              type="button"
                              variant="outline"
                              size="sm"
                              onClick={() => setIdCvPickerOpen(true)}
                              className="w-full gap-2 border-(--brand-line) text-xs font-semibold text-(--brand-orange-deep) hover:border-(--brand-orange)"
                            >
                              <FolderOpen className="size-3.5" />
                              {settingsCopy.form.selectCvPdf}
                            </Button>
                          )}
                        </div>

                        <MediaPickerDialog
                          open={idCvPickerOpen}
                          onOpenChange={setIdCvPickerOpen}
                          onSelect={(media) => field.handleChange(media.url)}
                          currentUrl={field.state.value}
                          accept="document"
                        />
                      </div>
                    )
                  }}
                </form.Field>
              </div>
            </div>
          </div>
        )}

        {/* Tab 3: Contact Settings */}
        {activeTab === 'contact' && (
          <div className="grid gap-6 rounded-xl border border-(--brand-line) bg-card p-6 shadow-xs">
            {/* Notice Banner to Social Links */}
            <div className="flex flex-col gap-3 rounded-lg border border-(--brand-orange)/30 bg-(--brand-orange-soft) p-4 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex items-start gap-3">
                <Share2 className="mt-0.5 size-5 shrink-0 text-(--brand-orange-deep)" />
                <div className="flex flex-col gap-0.5">
                  <span className="font-bold text-xs text-(--brand-ink)">
                    {settingsCopy.socialNotice}
                  </span>
                </div>
              </div>
              <Button
                variant="outline"
                size="sm"
                asChild
                className="shrink-0 border-(--brand-line) font-bold text-xs text-(--brand-ink) hover:bg-surface-strong"
              >
                <Link to="/dashboard/social">
                  <Share2 className="mr-1.5 size-3.5 text-(--brand-orange)" />
                  {settingsCopy.goToSocial}
                </Link>
              </Button>
            </div>

            <FieldGroup>
              {/* Public Email */}
              <form.Field name="publicEmail">
                {(field) => (
                  <Field>
                    <FieldLabel>{settingsCopy.form.publicEmail}</FieldLabel>
                    <Input
                      type="email"
                      disabled={!canEdit || isSaving}
                      value={field.state.value}
                      onBlur={field.handleBlur}
                      onChange={(e) => field.handleChange(e.target.value)}
                      placeholder="user@example.com"
                    />
                    <FieldDescription>
                      {settingsCopy.form.publicEmailDesc}
                    </FieldDescription>
                    <FieldError errors={field.state.meta.errors} />
                  </Field>
                )}
              </form.Field>
            </FieldGroup>
          </div>
        )}

        {/* Tab 4: SEO Settings */}
        {activeTab === 'seo' && (
          <div className="grid gap-8">
            {/* Visual Meta (Favicon & OpenGraph Image) */}
            <div className="grid gap-6 rounded-xl border border-(--brand-line) bg-card p-6 shadow-xs">
              <h3 className="font-bold text-sm text-(--brand-ink)">
                Visual Meta & Social Asset
              </h3>
              <FieldGroup>
                <div className="grid gap-6 md:grid-cols-2">
                  <form.Field name="faviconUrl">
                    {(field) => (
                      <ImageUploader
                        label={settingsCopy.form.faviconUrl}
                        description={settingsCopy.form.faviconDesc}
                        value={field.state.value}
                        onChange={(val) => field.handleChange(val ?? '')}
                        aspectRatio="square"
                      />
                    )}
                  </form.Field>

                  <form.Field name="ogImageUrl">
                    {(field) => (
                      <ImageUploader
                        label={settingsCopy.form.ogImageUrl}
                        description={settingsCopy.form.ogImageDesc}
                        value={field.state.value}
                        onChange={(val) => field.handleChange(val ?? '')}
                        aspectRatio="wide"
                      />
                    )}
                  </form.Field>
                </div>
              </FieldGroup>
            </div>

            {/* Homepage SEO */}
            <div className="grid gap-6 rounded-xl border border-(--brand-line) bg-card p-6 shadow-xs">
              <div className="flex flex-wrap items-center justify-between gap-4 border-b border-(--brand-line) pb-4">
                <div>
                  <h3 className="font-bold text-sm text-(--brand-ink)">
                    {settingsCopy.form.homepageSeoHeading}
                  </h3>
                  <p className="text-xs text-(--brand-muted) mt-0.5">
                    {settingsCopy.form.homepageSeoDesc}
                  </p>
                </div>
                <div className="flex rounded-lg border border-(--brand-line) bg-muted/40 p-1">
                  <button
                    type="button"
                    onClick={() => setMetaLangTab('en')}
                    className={`flex items-center gap-1.5 rounded-md px-3 py-1 text-xs font-bold transition ${
                      metaLangTab === 'en'
                        ? 'bg-(--surface-strong) text-(--brand-orange-deep) shadow-xs'
                        : 'text-(--brand-muted) hover:text-(--brand-ink)'
                    }`}
                  >
                    🇺🇸 {settingsCopy.form.metaLanguageEn}
                  </button>
                  <button
                    type="button"
                    onClick={() => setMetaLangTab('id')}
                    className={`flex items-center gap-1.5 rounded-md px-3 py-1 text-xs font-bold transition ${
                      metaLangTab === 'id'
                        ? 'bg-(--surface-strong) text-(--brand-orange-deep) shadow-xs'
                        : 'text-(--brand-muted) hover:text-(--brand-ink)'
                    }`}
                  >
                    🇮🇩 {settingsCopy.form.metaLanguageId}
                  </button>
                </div>
              </div>

              <FieldGroup>
                {metaLangTab === 'en' ? (
                  <>
                    <form.Field name="metaTitleEn">
                      {(field) => (
                        <Field>
                          <FieldLabel>
                            {settingsCopy.form.metaTitleEn}
                          </FieldLabel>
                          <Input
                            disabled={!canEdit || isSaving}
                            value={field.state.value}
                            onBlur={field.handleBlur}
                            onChange={(e) => field.handleChange(e.target.value)}
                            placeholder="Winterest Portfolio"
                          />
                          <FieldDescription>
                            {settingsCopy.form.metaTitleDesc}
                          </FieldDescription>
                          <FieldError errors={field.state.meta.errors} />
                        </Field>
                      )}
                    </form.Field>

                    <form.Field name="metaDescriptionEn">
                      {(field) => (
                        <Field>
                          <FieldLabel>
                            {settingsCopy.form.metaDescriptionEn}
                          </FieldLabel>
                          <Textarea
                            rows={3}
                            disabled={!canEdit || isSaving}
                            value={field.state.value}
                            onBlur={field.handleBlur}
                            onChange={(e) => field.handleChange(e.target.value)}
                            placeholder="Personal portfolio platform for Winterest..."
                          />
                          <FieldDescription>
                            {settingsCopy.form.metaDescriptionDesc}
                          </FieldDescription>
                          <FieldError errors={field.state.meta.errors} />
                        </Field>
                      )}
                    </form.Field>

                    <form.Field name="ogDescriptionEn">
                      {(field) => (
                        <Field>
                          <FieldLabel>
                            {settingsCopy.form.ogDescriptionEn}
                          </FieldLabel>
                          <Textarea
                            rows={3}
                            disabled={!canEdit || isSaving}
                            value={field.state.value}
                            onBlur={field.handleBlur}
                            onChange={(e) => field.handleChange(e.target.value)}
                            placeholder="Projects, developer tools, and practical fullstack web work..."
                          />
                          <FieldDescription>
                            {settingsCopy.form.ogDescriptionDesc}
                          </FieldDescription>
                          <FieldError errors={field.state.meta.errors} />
                        </Field>
                      )}
                    </form.Field>
                  </>
                ) : (
                  <>
                    <form.Field name="metaTitleId">
                      {(field) => (
                        <Field>
                          <FieldLabel>
                            {settingsCopy.form.metaTitleId}
                          </FieldLabel>
                          <Input
                            disabled={!canEdit || isSaving}
                            value={field.state.value}
                            onBlur={field.handleBlur}
                            onChange={(e) => field.handleChange(e.target.value)}
                            placeholder="Winterest Portfolio"
                          />
                          <FieldDescription>
                            {settingsCopy.form.metaTitleDesc}
                          </FieldDescription>
                          <FieldError errors={field.state.meta.errors} />
                        </Field>
                      )}
                    </form.Field>

                    <form.Field name="metaDescriptionId">
                      {(field) => (
                        <Field>
                          <FieldLabel>
                            {settingsCopy.form.metaDescriptionId}
                          </FieldLabel>
                          <Textarea
                            rows={3}
                            disabled={!canEdit || isSaving}
                            value={field.state.value}
                            onBlur={field.handleBlur}
                            onChange={(e) => field.handleChange(e.target.value)}
                            placeholder="Platform portfolio personal milik Winterest..."
                          />
                          <FieldDescription>
                            {settingsCopy.form.metaDescriptionDesc}
                          </FieldDescription>
                          <FieldError errors={field.state.meta.errors} />
                        </Field>
                      )}
                    </form.Field>

                    <form.Field name="ogDescriptionId">
                      {(field) => (
                        <Field>
                          <FieldLabel>
                            {settingsCopy.form.ogDescriptionId}
                          </FieldLabel>
                          <Textarea
                            rows={3}
                            disabled={!canEdit || isSaving}
                            value={field.state.value}
                            onBlur={field.handleBlur}
                            onChange={(e) => field.handleChange(e.target.value)}
                            placeholder="Project, developer tools, dan karya web fullstack praktis..."
                          />
                          <FieldDescription>
                            {settingsCopy.form.ogDescriptionDesc}
                          </FieldDescription>
                          <FieldError errors={field.state.meta.errors} />
                        </Field>
                      )}
                    </form.Field>
                  </>
                )}
              </FieldGroup>
            </div>

            {/* Sub-page Title Template */}
            <div className="grid gap-6 rounded-xl border border-(--brand-line) bg-card p-6 shadow-xs">
              <div>
                <h3 className="font-bold text-sm text-(--brand-ink)">
                  {settingsCopy.form.subpageSeoHeading}
                </h3>
                <p className="text-xs text-(--brand-muted) mt-0.5">
                  {settingsCopy.form.subpageSeoDesc}
                </p>
              </div>

              <FieldGroup>
                <form.Field name="metaTitleTemplate">
                  {(field) => (
                    <Field>
                      <FieldLabel>
                        {settingsCopy.form.metaTitleTemplate}
                      </FieldLabel>
                      <Input
                        disabled={!canEdit || isSaving}
                        value={field.state.value}
                        onBlur={field.handleBlur}
                        onChange={(e) => field.handleChange(e.target.value)}
                        placeholder="%s | Winterest"
                      />
                      <FieldDescription>
                        {settingsCopy.form.metaTitleTemplateDesc}
                      </FieldDescription>
                      <FieldError errors={field.state.meta.errors} />

                      {/* Live Template Preview */}
                      <div className="mt-2 flex items-center gap-2 rounded-md border border-(--brand-line) bg-(--surface-strong) px-3 py-2 text-xs">
                        <span className="font-mono text-(--brand-muted)">
                          {settingsCopy.form.templatePreviewLabel}
                        </span>
                        <span className="font-mono font-semibold text-(--brand-orange-deep)">
                          {formatMetaTitle(
                            metaLangTab === 'id' ? 'Tentang' : 'About',
                            field.state.value || '%s | Winterest',
                          )}
                        </span>
                      </div>
                    </Field>
                  )}
                </form.Field>
              </FieldGroup>
            </div>

            {/* Social Card Preview */}
            <form.Subscribe
              selector={(state) => ({
                ogImageUrl: state.values.ogImageUrl,
                metaTitle:
                  metaLangTab === 'en'
                    ? state.values.metaTitleEn
                    : state.values.metaTitleId,
                description:
                  metaLangTab === 'en'
                    ? state.values.ogDescriptionEn ||
                      state.values.metaDescriptionEn
                    : state.values.ogDescriptionId ||
                      state.values.metaDescriptionId,
              })}
            >
              {({ ogImageUrl, metaTitle, description }) => (
                <div className="grid gap-3 rounded-xl border border-(--brand-line) bg-card p-6 shadow-xs">
                  <div className="flex items-center justify-between">
                    <h3 className="font-bold text-sm text-(--brand-ink)">
                      {settingsCopy.form.socialPreviewTitle}
                    </h3>
                    <span className="text-xs text-(--brand-muted) uppercase font-mono">
                      {metaLangTab} Preview
                    </span>
                  </div>

                  <div className="mx-auto w-full max-w-lg overflow-hidden rounded-xl border border-(--brand-line) bg-(--surface-strong) shadow-md">
                    <div className="aspect-1200/630 w-full bg-linear-to-br from-neutral-800 to-neutral-900 relative overflow-hidden flex items-center justify-center">
                      {ogImageUrl ? (
                        <img
                          src={ogImageUrl}
                          alt="OpenGraph preview"
                          className="size-full object-cover"
                        />
                      ) : (
                        <div className="flex flex-col items-center gap-2 p-6 text-center text-neutral-400">
                          <Share2 className="size-8 text-(--brand-orange)" />
                          <p className="text-xs font-mono font-medium text-neutral-300">
                            No OpenGraph Image configured
                          </p>
                        </div>
                      )}
                    </div>
                    <div className="p-4 space-y-1 bg-surface">
                      <p className="font-mono text-[11px] text-(--brand-orange-deep) font-semibold uppercase tracking-wider">
                        {previewAppUrl}
                      </p>
                      <p className="font-bold text-sm text-(--brand-ink) line-clamp-1">
                        {metaTitle || 'Winterest Portfolio'}
                      </p>
                      <p className="text-xs text-(--brand-muted) line-clamp-2 leading-relaxed">
                        {description ||
                          'No description provided. Set an OG or SEO description to display preview text.'}
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </form.Subscribe>
          </div>
        )}

        {/* Tab 5: System Preferences */}
        {activeTab === 'system' && (
          <div className="grid gap-6 rounded-xl border border-(--brand-line) bg-card p-6 shadow-xs">
            <FieldGroup>
              <form.Field name="maintenanceMode">
                {(field) => (
                  <div className="flex items-start gap-3 rounded-lg border border-red-200 bg-red-50/50 p-4 dark:border-red-900/30 dark:bg-red-950/20">
                    <Checkbox
                      id="maintenanceMode"
                      disabled={!canEdit || isSaving}
                      checked={field.state.value}
                      onCheckedChange={(checked) =>
                        field.handleChange(Boolean(checked))
                      }
                    />
                    <div className="flex flex-col gap-0.5 leading-none">
                      <label
                        htmlFor="maintenanceMode"
                        className="cursor-pointer font-bold text-xs text-red-900 dark:text-red-200"
                      >
                        {settingsCopy.form.maintenanceMode}
                      </label>
                      <span className="text-xs text-red-700/80 dark:text-red-300/80">
                        {settingsCopy.form.maintenanceModeDesc}
                      </span>
                    </div>
                  </div>
                )}
              </form.Field>
            </FieldGroup>
          </div>
        )}

        {/* Submit Actions */}
        {canEdit && (
          <div className="flex items-center justify-end gap-3 pt-2">
            <Button
              type="submit"
              disabled={isSaving}
              className="bg-linear-to-r from-(--brand-orange) to-(--brand-orange-deep) font-bold text-white shadow-md hover:opacity-95"
            >
              {isSaving ? (
                <>
                  <Loader2 className="mr-2 size-4 animate-spin" />
                  {settingsCopy.form.saving}
                </>
              ) : (
                <>
                  <Save className="mr-2 size-4" />
                  {settingsCopy.form.saveChanges}
                </>
              )}
            </Button>
          </div>
        )}
      </form>
    </div>
  )
}
