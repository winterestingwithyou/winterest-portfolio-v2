import { useForm } from '@tanstack/react-form'
import { AlertCircle, Loader2, Save } from 'lucide-react'
import { useState } from 'react'

import { Button } from '#/components/ui/button'
import { Checkbox } from '#/components/ui/checkbox'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '#/components/ui/dialog'
import {
  Field,
  FieldContent,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
} from '#/components/ui/field'
import { Input } from '#/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '#/components/ui/select'
import { getDashboardCopy } from '#/features/dashboard/copy'

import { useCreateSocialLink, useUpdateSocialLink } from './hooks'
import type { SocialLink, SocialPlatform } from './types'
import {
  platformMetaMap,
  socialLinkSchema,
  socialPlatforms,
} from './types'

type SocialEditorDialogProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
  socialLink?: SocialLink | null
  existingPlatforms: SocialPlatform[]
}

export function SocialEditorDialog({
  open,
  onOpenChange,
  socialLink,
  existingPlatforms,
}: SocialEditorDialogProps) {
  const copy = getDashboardCopy()
  const socialCopy = copy.social
  const isEditing = Boolean(socialLink)

  const [formError, setFormError] = useState<string | null>(null)

  const createMutation = useCreateSocialLink()
  const updateMutation = useUpdateSocialLink()
  const isSaving = createMutation.isPending || updateMutation.isPending

  // Filter available platforms when creating
  const availablePlatforms = isEditing
    ? socialPlatforms
    : socialPlatforms.filter(
        (p) => !existingPlatforms.includes(p) || p === socialLink?.platform,
      )

  const initialPlatform: SocialPlatform =
    socialLink?.platform ??
    (availablePlatforms.length > 0 ? availablePlatforms[0] : 'github')

  const form = useForm({
    defaultValues: {
      platform: initialPlatform,
      username: socialLink?.username ?? '',
      accountName: socialLink?.accountName ?? '',
      url: socialLink?.url ?? '',
      isEnabled: socialLink?.isEnabled ?? true,
      sortOrder: socialLink?.sortOrder ?? 0,
    },
    validators: {
      onSubmit: socialLinkSchema,
    },
    onSubmit: async ({ value }) => {
      setFormError(null)
      try {
        if (isEditing && socialLink) {
          await updateMutation.mutateAsync({
            id: socialLink.id,
            data: value,
          })
        } else {
          await createMutation.mutateAsync(value)
        }
        onOpenChange(false)
      } catch (err: unknown) {
        console.error(err)
        setFormError(
          err instanceof Error
            ? err.message
            : 'An unexpected error occurred while saving.',
        )
      }
    },
  })

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="flex max-h-[90vh] w-full flex-col gap-0 overflow-hidden p-0 sm:max-w-xl">
        {/* Modal Header */}
        <DialogHeader className="shrink-0 border-b border-(--brand-line) bg-surface/50 p-5 sm:p-6">
          <DialogTitle className="text-base sm:text-lg">
            {isEditing
              ? socialCopy.dialogTitleEdit
              : socialCopy.dialogTitleNew}
          </DialogTitle>
          <DialogDescription className="text-xs sm:text-sm text-(--brand-muted)">
            {socialCopy.dialogDescription}
          </DialogDescription>
        </DialogHeader>

        {/* Modal Form */}
        <form
          onSubmit={(e) => {
            e.preventDefault()
            e.stopPropagation()
            void form.handleSubmit()
          }}
          className="flex min-h-0 flex-1 flex-col overflow-hidden"
        >
          {/* Scrollable Form Body */}
          <div className="flex-1 overflow-y-auto p-5 sm:p-6">
            <FieldGroup className="gap-4">
              {formError && (
                <div className="flex items-center gap-2 rounded-lg border border-red-200 bg-red-50 p-3 text-xs text-red-900 dark:border-red-900/50 dark:bg-red-950/30 dark:text-red-200">
                  <AlertCircle className="size-4 shrink-0 text-red-600 dark:text-red-400" />
                  <span>{formError}</span>
                </div>
              )}

              {/* Platform Selection using shadcn Select */}
              <form.Field name="platform">
                {(field) => {
                  return (
                    <Field>
                      <FieldLabel>{socialCopy.form.platform}</FieldLabel>
                      <Select
                        name={field.name}
                        disabled={isEditing || isSaving}
                        value={field.state.value}
                        onValueChange={(val) => {
                          const newPlatform = val as SocialPlatform
                          field.handleChange(newPlatform)
                          // Auto set URL placeholder if empty
                          const meta = platformMetaMap[newPlatform]
                          if (!form.getFieldValue('url')) {
                            form.setFieldValue('url', meta.placeholderUrl)
                          }
                        }}
                      >
                        <SelectTrigger
                          id="platform-select"
                          className="h-10 w-full rounded-lg border-(--brand-line) bg-(--surface) text-sm text-(--brand-ink)"
                        >
                          <SelectValue placeholder="Pilih platform" />
                        </SelectTrigger>
                        <SelectContent
                          position="popper"
                          className="z-60 max-h-60"
                        >
                          {socialPlatforms.map((p) => {
                            const meta = platformMetaMap[p]
                            const PlatformIcon = meta.icon
                            const isTaken =
                              !isEditing && existingPlatforms.includes(p)

                            return (
                              <SelectItem
                                key={p}
                                value={p}
                                disabled={isTaken}
                              >
                                <PlatformIcon className="size-4 shrink-0 text-(--brand-muted)" />
                                <span>{meta.name}</span>
                                {isTaken && (
                                  <span className="text-xs text-muted-foreground italic">
                                    (Sudah ditambahkan)
                                  </span>
                                )}
                              </SelectItem>
                            )
                          })}
                        </SelectContent>
                      </Select>
                      <FieldError errors={field.state.meta.errors} />
                    </Field>
                  )
                }}
              </form.Field>

              {/* Profile URL */}
              <form.Subscribe
                selector={(state) => platformMetaMap[state.values.platform]}
              >
                {(meta) => (
                  <form.Field name="url">
                    {(field) => (
                      <Field>
                        <FieldLabel>{socialCopy.form.url}</FieldLabel>
                        <Input
                          type="url"
                          disabled={isSaving}
                          value={field.state.value}
                          onBlur={field.handleBlur}
                          onChange={(e) => field.handleChange(e.target.value)}
                          placeholder={meta.placeholderUrl}
                          className="h-10 rounded-lg border-(--brand-line) bg-(--surface)"
                        />
                        <FieldError errors={field.state.meta.errors} />
                      </Field>
                    )}
                  </form.Field>
                )}
              </form.Subscribe>

              {/* 2-Col Grid: Username & Display Name */}
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <form.Subscribe
                  selector={(state) => platformMetaMap[state.values.platform]}
                >
                  {(meta) => (
                    <form.Field name="username">
                      {(field) => (
                        <Field>
                          <FieldLabel>{socialCopy.form.username}</FieldLabel>
                          <Input
                            disabled={isSaving}
                            value={field.state.value}
                            onBlur={field.handleBlur}
                            onChange={(e) => field.handleChange(e.target.value)}
                            placeholder={`e.g. ${meta.placeholderUsername}`}
                            className="h-10 rounded-lg border-(--brand-line) bg-(--surface)"
                          />
                          <FieldError errors={field.state.meta.errors} />
                        </Field>
                      )}
                    </form.Field>
                  )}
                </form.Subscribe>

                <form.Subscribe
                  selector={(state) => platformMetaMap[state.values.platform]}
                >
                  {(meta) => (
                    <form.Field name="accountName">
                      {(field) => (
                        <Field>
                          <FieldLabel>{socialCopy.form.accountName}</FieldLabel>
                          <Input
                            disabled={isSaving}
                            value={field.state.value}
                            onBlur={field.handleBlur}
                            onChange={(e) => field.handleChange(e.target.value)}
                            placeholder={`e.g. ${meta.placeholderAccountName}`}
                            className="h-10 rounded-lg border-(--brand-line) bg-(--surface)"
                          />
                          <FieldError errors={field.state.meta.errors} />
                        </Field>
                      )}
                    </form.Field>
                  )}
                </form.Subscribe>
              </div>

              {/* 2-Col Grid: Sort Order & isEnabled Card */}
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:items-start">
                <form.Field name="sortOrder">
                  {(field) => (
                    <Field>
                      <FieldLabel>{socialCopy.form.sortOrder}</FieldLabel>
                      <Input
                        type="number"
                        min={0}
                        disabled={isSaving}
                        value={field.state.value}
                        onBlur={field.handleBlur}
                        onChange={(e) =>
                          field.handleChange(Number(e.target.value) || 0)
                        }
                        className="h-10 rounded-lg border-(--brand-line) bg-(--surface)"
                      />
                      <FieldDescription className="text-[11px] leading-relaxed">
                        {socialCopy.form.sortOrderDesc}
                      </FieldDescription>
                      <FieldError errors={field.state.meta.errors} />
                    </Field>
                  )}
                </form.Field>

                <form.Field name="isEnabled">
                  {(field) => (
                    <Field
                      orientation="horizontal"
                      className="flex h-auto items-center justify-between rounded-lg border border-(--brand-line) bg-(--surface) p-3 sm:mt-6"
                    >
                      <FieldContent className="flex flex-col gap-0.5">
                        <FieldLabel
                          htmlFor="isEnabled"
                          className="cursor-pointer font-bold text-xs text-(--brand-ink)"
                        >
                          {socialCopy.form.isEnabled}
                        </FieldLabel>
                        <FieldDescription className="text-[11px] leading-tight">
                          {socialCopy.form.isEnabledDesc}
                        </FieldDescription>
                      </FieldContent>
                      <Checkbox
                        id="isEnabled"
                        name={field.name}
                        disabled={isSaving}
                        checked={field.state.value}
                        onCheckedChange={(checked) =>
                          field.handleChange(Boolean(checked))
                        }
                      />
                    </Field>
                  )}
                </form.Field>
              </div>
            </FieldGroup>
          </div>

          {/* Fixed Modal Footer */}
          <DialogFooter className="shrink-0 border-t border-(--brand-line) bg-surface/50 p-4 sm:p-5">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={isSaving}
              className="text-xs"
            >
              {socialCopy.form.cancel}
            </Button>
            <Button
              type="submit"
              disabled={isSaving}
              className="bg-linear-to-r from-(--brand-orange) to-(--brand-orange-deep) text-xs font-bold text-white shadow-xs hover:opacity-95"
            >
              {isSaving ? (
                <>
                  <Loader2 className="mr-1.5 size-3.5 animate-spin" />
                  {socialCopy.form.saving}
                </>
              ) : (
                <>
                  <Save className="mr-1.5 size-3.5" />
                  {socialCopy.form.save}
                </>
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
