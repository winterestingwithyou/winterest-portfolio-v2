import { useForm } from '@tanstack/react-form'
import {
  AlertCircle,
  CheckCircle2,
  Globe,
  Loader2,
  Save,
  Search,
  Share2,
  Sliders,
} from 'lucide-react'
import { useState } from 'react'

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

import { useUpdateSiteSettings } from './hooks'
import type { SiteSettingsInput } from './types'
import { siteSettingsSchema } from './types'

type SettingsEditorFormProps = {
  initialData: SiteSettingsInput
  canEdit: boolean
}

type SettingsTab = 'general' | 'social' | 'seo' | 'system'

export function SettingsEditorForm({
  initialData,
  canEdit,
}: SettingsEditorFormProps) {
  const copy = getDashboardCopy()
  const settingsCopy = copy.settings

  const [activeTab, setActiveTab] = useState<SettingsTab>('general')
  const [successMessage, setSuccessMessage] = useState<string | null>(null)

  const updateMutation = useUpdateSiteSettings()
  const isSaving = updateMutation.isPending
  const saveError = updateMutation.error?.message ?? null

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
    { id: 'social', label: settingsCopy.tabs.social, icon: Share2 },
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
      <div className="flex flex-wrap items-center gap-2 border-b border-(--brand-line) pb-2">
        {tabs.map((tab) => {
          const Icon = tab.icon
          const isActive = activeTab === tab.id
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 rounded-md px-3.5 py-2 text-xs font-bold transition-all ${
                isActive
                  ? 'bg-(--brand-orange-soft) text-(--brand-orange-deep) shadow-xs'
                  : 'text-muted-foreground hover:bg-accent hover:text-foreground'
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

        {/* Tab 2: Social & Contact Settings */}
        {activeTab === 'social' && (
          <div className="grid gap-6 rounded-xl border border-(--brand-line) bg-card p-6 shadow-xs">
            <FieldGroup>
              {/* GitHub */}
              <div className="grid gap-4 rounded-lg border border-(--brand-line) bg-muted/20 p-4 sm:grid-cols-2">
                <form.Field name="githubUrl">
                  {(field) => (
                    <Field>
                      <FieldLabel>{settingsCopy.form.githubUrl}</FieldLabel>
                      <Input
                        type="url"
                        disabled={!canEdit || isSaving}
                        value={field.state.value}
                        onBlur={field.handleBlur}
                        onChange={(e) => field.handleChange(e.target.value)}
                        placeholder="https://github.com/username"
                      />
                      <FieldError errors={field.state.meta.errors} />
                    </Field>
                  )}
                </form.Field>
                <form.Field name="githubName">
                  {(field) => (
                    <Field>
                      <FieldLabel>{settingsCopy.form.githubName}</FieldLabel>
                      <Input
                        disabled={!canEdit || isSaving}
                        value={field.state.value}
                        onBlur={field.handleBlur}
                        onChange={(e) => field.handleChange(e.target.value)}
                        placeholder="e.g. Winterest | M. Adam Yudistira"
                      />
                      <FieldError errors={field.state.meta.errors} />
                    </Field>
                  )}
                </form.Field>
              </div>

              {/* LinkedIn */}
              <div className="grid gap-4 rounded-lg border border-(--brand-line) bg-muted/20 p-4 sm:grid-cols-2">
                <form.Field name="linkedinUrl">
                  {(field) => (
                    <Field>
                      <FieldLabel>{settingsCopy.form.linkedinUrl}</FieldLabel>
                      <Input
                        type="url"
                        disabled={!canEdit || isSaving}
                        value={field.state.value}
                        onBlur={field.handleBlur}
                        onChange={(e) => field.handleChange(e.target.value)}
                        placeholder="https://linkedin.com/in/username"
                      />
                      <FieldError errors={field.state.meta.errors} />
                    </Field>
                  )}
                </form.Field>
                <form.Field name="linkedinName">
                  {(field) => (
                    <Field>
                      <FieldLabel>{settingsCopy.form.linkedinName}</FieldLabel>
                      <Input
                        disabled={!canEdit || isSaving}
                        value={field.state.value}
                        onBlur={field.handleBlur}
                        onChange={(e) => field.handleChange(e.target.value)}
                        placeholder="e.g. M. Adam Yudistira"
                      />
                      <FieldError errors={field.state.meta.errors} />
                    </Field>
                  )}
                </form.Field>
              </div>

              {/* Twitter / X */}
              <div className="grid gap-4 rounded-lg border border-(--brand-line) bg-muted/20 p-4 sm:grid-cols-2">
                <form.Field name="twitterUrl">
                  {(field) => (
                    <Field>
                      <FieldLabel>{settingsCopy.form.twitterUrl}</FieldLabel>
                      <Input
                        type="url"
                        disabled={!canEdit || isSaving}
                        value={field.state.value}
                        onBlur={field.handleBlur}
                        onChange={(e) => field.handleChange(e.target.value)}
                        placeholder="https://x.com/username"
                      />
                      <FieldError errors={field.state.meta.errors} />
                    </Field>
                  )}
                </form.Field>
                <form.Field name="twitterName">
                  {(field) => (
                    <Field>
                      <FieldLabel>{settingsCopy.form.twitterName}</FieldLabel>
                      <Input
                        disabled={!canEdit || isSaving}
                        value={field.state.value}
                        onBlur={field.handleBlur}
                        onChange={(e) => field.handleChange(e.target.value)}
                        placeholder="e.g. @winterest"
                      />
                      <FieldError errors={field.state.meta.errors} />
                    </Field>
                  )}
                </form.Field>
              </div>

              {/* Facebook */}
              <div className="grid gap-4 rounded-lg border border-(--brand-line) bg-muted/20 p-4 sm:grid-cols-2">
                <form.Field name="facebookUrl">
                  {(field) => (
                    <Field>
                      <FieldLabel>{settingsCopy.form.facebookUrl}</FieldLabel>
                      <Input
                        type="url"
                        disabled={!canEdit || isSaving}
                        value={field.state.value}
                        onBlur={field.handleBlur}
                        onChange={(e) => field.handleChange(e.target.value)}
                        placeholder="https://facebook.com/username"
                      />
                      <FieldError errors={field.state.meta.errors} />
                    </Field>
                  )}
                </form.Field>
                <form.Field name="facebookName">
                  {(field) => (
                    <Field>
                      <FieldLabel>{settingsCopy.form.facebookName}</FieldLabel>
                      <Input
                        disabled={!canEdit || isSaving}
                        value={field.state.value}
                        onBlur={field.handleBlur}
                        onChange={(e) => field.handleChange(e.target.value)}
                        placeholder="e.g. Adam Winter"
                      />
                      <FieldError errors={field.state.meta.errors} />
                    </Field>
                  )}
                </form.Field>
              </div>

              {/* Instagram */}
              <div className="grid gap-4 rounded-lg border border-(--brand-line) bg-muted/20 p-4 sm:grid-cols-2">
                <form.Field name="instagramUrl">
                  {(field) => (
                    <Field>
                      <FieldLabel>{settingsCopy.form.instagramUrl}</FieldLabel>
                      <Input
                        type="url"
                        disabled={!canEdit || isSaving}
                        value={field.state.value}
                        onBlur={field.handleBlur}
                        onChange={(e) => field.handleChange(e.target.value)}
                        placeholder="https://instagram.com/username"
                      />
                      <FieldError errors={field.state.meta.errors} />
                    </Field>
                  )}
                </form.Field>
                <form.Field name="instagramName">
                  {(field) => (
                    <Field>
                      <FieldLabel>{settingsCopy.form.instagramName}</FieldLabel>
                      <Input
                        disabled={!canEdit || isSaving}
                        value={field.state.value}
                        onBlur={field.handleBlur}
                        onChange={(e) => field.handleChange(e.target.value)}
                        placeholder="e.g. Adam Y"
                      />
                      <FieldError errors={field.state.meta.errors} />
                    </Field>
                  )}
                </form.Field>
              </div>

              {/* TikTok */}
              <div className="grid gap-4 rounded-lg border border-(--brand-line) bg-muted/20 p-4 sm:grid-cols-2">
                <form.Field name="tiktokUrl">
                  {(field) => (
                    <Field>
                      <FieldLabel>{settingsCopy.form.tiktokUrl}</FieldLabel>
                      <Input
                        type="url"
                        disabled={!canEdit || isSaving}
                        value={field.state.value}
                        onBlur={field.handleBlur}
                        onChange={(e) => field.handleChange(e.target.value)}
                        placeholder="https://tiktok.com/@username"
                      />
                      <FieldError errors={field.state.meta.errors} />
                    </Field>
                  )}
                </form.Field>
                <form.Field name="tiktokName">
                  {(field) => (
                    <Field>
                      <FieldLabel>{settingsCopy.form.tiktokName}</FieldLabel>
                      <Input
                        disabled={!canEdit || isSaving}
                        value={field.state.value}
                        onBlur={field.handleBlur}
                        onChange={(e) => field.handleChange(e.target.value)}
                        placeholder="e.g. @winterest"
                      />
                      <FieldError errors={field.state.meta.errors} />
                    </Field>
                  )}
                </form.Field>
              </div>

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
                      placeholder="yudistiraadam3@gmail.com"
                    />
                    <FieldError errors={field.state.meta.errors} />
                  </Field>
                )}
              </form.Field>
            </FieldGroup>
          </div>
        )}

        {/* Tab 3: SEO Settings */}
        {activeTab === 'seo' && (
          <div className="grid gap-6 rounded-xl border border-(--brand-line) bg-card p-6 shadow-xs">
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
                  </Field>
                )}
              </form.Field>

              <form.Field name="metaDescription">
                {(field) => (
                  <Field>
                    <FieldLabel>{settingsCopy.form.metaDescription}</FieldLabel>
                    <Textarea
                      rows={3}
                      disabled={!canEdit || isSaving}
                      value={field.state.value}
                      onBlur={field.handleBlur}
                      onChange={(e) => field.handleChange(e.target.value)}
                      placeholder="Default SEO description..."
                    />
                    <FieldError errors={field.state.meta.errors} />
                  </Field>
                )}
              </form.Field>

              <form.Field name="ogImageUrl">
                {(field) => (
                  <Field>
                    <FieldLabel>{settingsCopy.form.ogImageUrl}</FieldLabel>
                    <Input
                      disabled={!canEdit || isSaving}
                      value={field.state.value}
                      onBlur={field.handleBlur}
                      onChange={(e) => field.handleChange(e.target.value)}
                      placeholder="https://..."
                    />
                    <FieldError errors={field.state.meta.errors} />
                  </Field>
                )}
              </form.Field>
            </FieldGroup>
          </div>
        )}

        {/* Tab 4: System Preferences */}
        {activeTab === 'system' && (
          <div className="grid gap-6 rounded-xl border border-(--brand-line) bg-card p-6 shadow-xs">
            <FieldGroup>
              <form.Field name="enableCharacter">
                {(field) => (
                  <div className="flex items-start gap-3 rounded-lg border border-(--brand-line) p-4 bg-muted/20">
                    <Checkbox
                      id="enableCharacter"
                      disabled={!canEdit || isSaving}
                      checked={field.state.value}
                      onCheckedChange={(checked) =>
                        field.handleChange(Boolean(checked))
                      }
                    />
                    <div className="flex flex-col gap-0.5 leading-none">
                      <label
                        htmlFor="enableCharacter"
                        className="cursor-pointer font-bold text-xs"
                      >
                        {settingsCopy.form.enableCharacter}
                      </label>
                      <span className="text-muted-foreground text-xs">
                        {settingsCopy.form.enableCharacterDesc}
                      </span>
                    </div>
                  </div>
                )}
              </form.Field>

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
