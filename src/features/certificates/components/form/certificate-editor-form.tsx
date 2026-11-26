import { useForm } from '@tanstack/react-form'
import { useNavigate } from '@tanstack/react-router'
import {
  Check,
  ExternalLink,
  FileText,
  FolderOpen,
  ImagePlus,
  Trash2,
} from 'lucide-react'
import { useState } from 'react'
import type { FormEvent } from 'react'

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '#/components/ui/alert-dialog'
import { Button } from '#/components/ui/button'
import { DatePicker } from '#/components/ui/date-picker'
import {
  Field,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
} from '#/components/ui/field'
import { Input } from '#/components/ui/input'
import { MediaPickerDialog } from '#/components/media/media-picker-dialog'
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '#/components/ui/select'
import { Textarea } from '#/components/ui/textarea'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '#/components/ui/tabs'
import { getCertificateCopy } from '#/features/certificates/copy'
import {
  useCreateCertificate,
  useDeleteCertificate,
  useUpdateCertificate,
} from '#/features/certificates/hooks'
import type { CertificateRecord } from '#/features/certificates/queries'
import {
  getCertificateFormSchema,
  getCertificateInputSchema,
} from '#/features/certificates/validation'
import { getApiErrorMessage } from '#/lib/api-client'

function toDateInput(date: Date | null | undefined) {
  return date?.toISOString().slice(0, 10) ?? ''
}

type CertificateArtifactTab = 'pdf' | 'verification'

type CertificateFormState = {
  title: string
  issuer: string
  credentialId: string
  descriptionEn: string
  descriptionId: string
  coverImageUrl: string
  pdfUrl: string
  verificationUrl: string
  status: 'draft' | 'published'
  issuedAt: string
  expiresAt: string
}

function getInitialValues(
  certificate?: CertificateRecord,
): CertificateFormState {
  return {
    title: certificate?.title ?? '',
    issuer: certificate?.issuer ?? '',
    credentialId: certificate?.credentialId ?? '',
    descriptionEn: certificate?.descriptionEn ?? '',
    descriptionId: certificate?.descriptionId ?? '',
    coverImageUrl: certificate?.coverImageUrl ?? '',
    pdfUrl: certificate?.pdfUrl ?? '',
    verificationUrl: certificate?.verificationUrl ?? '',
    status: certificate?.status ?? 'draft',
    issuedAt: toDateInput(certificate?.issuedAt),
    expiresAt: toDateInput(certificate?.expiresAt),
  }
}

export function CertificateEditorForm({
  certificate,
}: {
  certificate?: CertificateRecord
}) {
  const copy = getCertificateCopy().dashboard
  const formCopy = copy.form

  const navigate = useNavigate()
  const [error, setError] = useState<string | null>(null)
  const [activeArtifactTab, setActiveArtifactTab] =
    useState<CertificateArtifactTab>(() =>
      certificate?.pdfUrl
        ? 'pdf'
        : certificate?.verificationUrl
          ? 'verification'
          : 'pdf',
    )
  const [picker, setPicker] = useState<'cover' | 'pdf' | null>(null)
  const [confirmDelete, setConfirmDelete] = useState(false)
  const createMutation = useCreateCertificate()
  const updateMutation = useUpdateCertificate(certificate?.id ?? '')
  const deleteMutation = useDeleteCertificate()
  const isSaving = createMutation.isPending || updateMutation.isPending

  const form = useForm({
    defaultValues: getInitialValues(certificate),
    validators: {
      onSubmit: getCertificateFormSchema(formCopy.validation),
    },
    onSubmit: async ({ value }) => {
      setError(null)
      try {
        const input = getCertificateInputSchema(formCopy.validation).parse(
          value,
        )
        if (certificate) {
          await updateMutation.mutateAsync(input)
        } else {
          await createMutation.mutateAsync(input)
        }
        await navigate({ to: '/dashboard/certificates' })
      } catch (caught) {
        setError(getApiErrorMessage(caught, copy.saveError))
      }
    },
  })

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    event.stopPropagation()
    await form.handleSubmit()

    if (form.getFieldMeta('pdfUrl')?.errors.length) {
      setActiveArtifactTab('pdf')
    } else if (form.getFieldMeta('verificationUrl')?.errors.length) {
      setActiveArtifactTab('verification')
    }
  }

  const handleDelete = async () => {
    if (!certificate) return
    setError(null)
    try {
      await deleteMutation.mutateAsync(certificate.id)
      await navigate({ to: '/dashboard/certificates' })
    } catch (caught) {
      setError(getApiErrorMessage(caught, copy.deleteError))
      setConfirmDelete(false)
    }
  }

  return (
    <>
      <form onSubmit={handleSubmit} className="w-full" noValidate>
        <FieldGroup className="gap-5">
          <form.Field name="title">
            {(field) => {
              const invalid = !field.state.meta.isValid
              return (
                <Field data-invalid={invalid}>
                  <FieldLabel htmlFor={field.name}>{formCopy.title}</FieldLabel>
                  <Input
                    id={field.name}
                    name={field.name}
                    maxLength={200}
                    value={field.state.value}
                    onBlur={field.handleBlur}
                    onChange={(event) => field.handleChange(event.target.value)}
                    aria-invalid={invalid}
                    className="min-h-11"
                  />
                  {invalid ? (
                    <FieldError errors={field.state.meta.errors} />
                  ) : null}
                </Field>
              )
            }}
          </form.Field>
          <form.Field name="issuer">
            {(field) => {
              const invalid = !field.state.meta.isValid
              return (
                <Field data-invalid={invalid}>
                  <FieldLabel htmlFor={field.name}>
                    {formCopy.issuer}
                  </FieldLabel>
                  <Input
                    id={field.name}
                    name={field.name}
                    maxLength={160}
                    value={field.state.value}
                    onBlur={field.handleBlur}
                    onChange={(event) => field.handleChange(event.target.value)}
                    aria-invalid={invalid}
                    className="min-h-11"
                  />
                  {invalid ? (
                    <FieldError errors={field.state.meta.errors} />
                  ) : null}
                </Field>
              )
            }}
          </form.Field>
          <form.Field name="credentialId">
            {(field) => {
              const invalid = !field.state.meta.isValid
              return (
                <Field data-invalid={invalid}>
                  <FieldLabel htmlFor={field.name}>
                    {formCopy.credentialId} ({formCopy.optional})
                  </FieldLabel>
                  <Input
                    id={field.name}
                    name={field.name}
                    maxLength={160}
                    value={field.state.value}
                    onBlur={field.handleBlur}
                    onChange={(event) => field.handleChange(event.target.value)}
                    aria-invalid={invalid}
                    className="min-h-11"
                  />
                  {invalid ? (
                    <FieldError errors={field.state.meta.errors} />
                  ) : null}
                </Field>
              )
            }}
          </form.Field>
          <FieldGroup className="gap-5 sm:grid sm:grid-cols-2">
            <form.Field name="issuedAt">
              {(field) => {
                const invalid = !field.state.meta.isValid
                return (
                  <Field data-invalid={invalid}>
                    <FieldLabel htmlFor={field.name}>
                      {formCopy.issuedAt}
                    </FieldLabel>
                    <DatePicker
                      id={field.name}
                      name={field.name}
                      value={field.state.value}
                      onBlur={field.handleBlur}
                      onChange={(_, isoString) => field.handleChange(isoString)}
                      aria-invalid={invalid}
                    />
                    {invalid ? (
                      <FieldError errors={field.state.meta.errors} />
                    ) : null}
                  </Field>
                )
              }}
            </form.Field>
            <form.Field name="expiresAt">
              {(field) => {
                const invalid = !field.state.meta.isValid
                return (
                  <Field data-invalid={invalid}>
                    <FieldLabel htmlFor={field.name}>
                      {formCopy.expiresAt} ({formCopy.optional})
                    </FieldLabel>
                    <DatePicker
                      id={field.name}
                      name={field.name}
                      value={field.state.value}
                      onBlur={field.handleBlur}
                      onChange={(_, isoString) => field.handleChange(isoString)}
                      aria-invalid={invalid}
                    />
                    {invalid ? (
                      <FieldError errors={field.state.meta.errors} />
                    ) : null}
                  </Field>
                )
              }}
            </form.Field>
          </FieldGroup>
          <form.Field name="descriptionEn">
            {(field) => {
              const invalid = !field.state.meta.isValid
              return (
                <Field data-invalid={invalid}>
                  <FieldLabel htmlFor={field.name}>
                    {formCopy.descriptionEn} ({formCopy.optional})
                  </FieldLabel>
                  <Textarea
                    id={field.name}
                    name={field.name}
                    maxLength={2000}
                    value={field.state.value}
                    onBlur={field.handleBlur}
                    onChange={(event) => field.handleChange(event.target.value)}
                    aria-invalid={invalid}
                  />
                  {invalid ? (
                    <FieldError errors={field.state.meta.errors} />
                  ) : null}
                </Field>
              )
            }}
          </form.Field>
          <form.Field name="descriptionId">
            {(field) => {
              const invalid = !field.state.meta.isValid
              return (
                <Field data-invalid={invalid}>
                  <FieldLabel htmlFor={field.name}>
                    {formCopy.descriptionId} ({formCopy.optional})
                  </FieldLabel>
                  <Textarea
                    id={field.name}
                    name={field.name}
                    maxLength={2000}
                    value={field.state.value}
                    onBlur={field.handleBlur}
                    onChange={(event) => field.handleChange(event.target.value)}
                    aria-invalid={invalid}
                  />
                  {invalid ? (
                    <FieldError errors={field.state.meta.errors} />
                  ) : null}
                </Field>
              )
            }}
          </form.Field>
          <form.Field name="coverImageUrl">
            {(field) => (
              <Field>
                <p className="text-sm font-medium">
                  {formCopy.coverImage} ({formCopy.optional})
                </p>
                <div className="flex flex-col gap-3 rounded-lg border border-(--brand-line) bg-surface-strong p-3 sm:flex-row sm:items-center sm:justify-between">
                  <div className="flex min-w-0 items-center gap-3">
                    {field.state.value ? (
                      <img
                        src={field.state.value}
                        alt=""
                        className="size-14 shrink-0 rounded-md border border-(--brand-line) object-cover sm:size-16"
                      />
                    ) : (
                      <div className="grid size-14 shrink-0 place-items-center rounded-md border border-(--brand-line) bg-(--surface-card) sm:size-16">
                        <ImagePlus
                          aria-hidden="true"
                          className="size-5 text-(--brand-muted)"
                        />
                      </div>
                    )}
                    <div className="min-w-0">
                      <p className="text-sm font-medium text-(--brand-ink)">
                        {field.state.value
                          ? formCopy.imageSelected
                          : formCopy.imageNotSelected}
                      </p>
                      <p className="text-xs text-(--brand-muted)">
                        {formCopy.selectImage}
                      </p>
                    </div>
                  </div>
                  <div className="flex flex-wrap items-center gap-2 sm:shrink-0">
                    <Button
                      type="button"
                      variant="outline"
                      className="min-h-11"
                      onClick={() => setPicker('cover')}
                    >
                      <FolderOpen aria-hidden="true" />
                      {formCopy.chooseImage}
                    </Button>
                    {field.state.value ? (
                      <Button
                        type="button"
                        variant="ghost"
                        className="min-h-11 text-destructive hover:text-destructive"
                        onClick={() => field.handleChange('')}
                      >
                        <Trash2 aria-hidden="true" />
                        {formCopy.removeImage}
                      </Button>
                    ) : null}
                  </div>
                </div>
              </Field>
            )}
          </form.Field>
          <div className="space-y-2">
            <FieldDescription id="certificate-artifact-requirement">
              {formCopy.artifactRequirement}
            </FieldDescription>
            <Tabs
              value={activeArtifactTab}
              onValueChange={(value) =>
                setActiveArtifactTab(value as CertificateArtifactTab)
              }
              aria-describedby="certificate-artifact-requirement"
              className="w-full"
            >
              <form.Subscribe
                selector={(state) => [
                  Boolean(state.values.pdfUrl),
                  Boolean(state.values.verificationUrl),
                ]}
              >
                {([hasPdf, hasVerification]) => (
                  <TabsList
                    aria-label={formCopy.artifactTabsLabel}
                    className="inline-flex h-auto w-fit max-w-full flex-nowrap justify-start rounded-lg border border-(--brand-line) bg-surface p-0.5 shadow-xs"
                  >
                    <TabsTrigger
                      value="pdf"
                      className="group min-h-11 min-w-0 gap-1.5 whitespace-nowrap rounded-md px-3 py-1 text-xs font-semibold transition sm:min-h-8 data-[state=active]:bg-(--brand-orange) data-[state=active]:font-bold data-[state=active]:text-white data-[state=active]:shadow-xs"
                      aria-label={`${formCopy.pdf}, ${hasPdf ? formCopy.provided : formCopy.notProvided}`}
                    >
                      <span>{formCopy.pdf}</span>
                      {hasPdf ? (
                        <Check
                          aria-hidden="true"
                          className="size-4 shrink-0 text-(--brand-orange-deep) group-data-[state=active]:text-white"
                        />
                      ) : null}
                    </TabsTrigger>
                    <TabsTrigger
                      value="verification"
                      className="group min-h-11 min-w-0 gap-1.5 whitespace-nowrap rounded-md px-3 py-1 text-xs font-semibold transition sm:min-h-8 data-[state=active]:bg-(--brand-orange) data-[state=active]:font-bold data-[state=active]:text-white data-[state=active]:shadow-xs"
                      aria-label={`${formCopy.verificationUrl}, ${hasVerification ? formCopy.provided : formCopy.notProvided}`}
                    >
                      <span>{formCopy.verificationUrl}</span>
                      {hasVerification ? (
                        <Check
                          aria-hidden="true"
                          className="size-4 shrink-0 text-(--brand-orange-deep) group-data-[state=active]:text-white"
                        />
                      ) : null}
                    </TabsTrigger>
                  </TabsList>
                )}
              </form.Subscribe>
              <TabsContent
                value="pdf"
                forceMount
                className="data-[state=inactive]:hidden"
              >
                <form.Field name="pdfUrl">
                  {(field) => (
                    <Field data-invalid={!field.state.meta.isValid}>
                      <p className="text-sm font-medium">
                        {formCopy.pdf} ({formCopy.optional})
                      </p>
                      <div className="flex flex-col gap-3 rounded-lg border border-(--brand-line) bg-surface-strong p-3 sm:flex-row sm:items-center sm:justify-between">
                        <div className="flex min-w-0 items-center gap-3">
                          <div className="grid size-14 shrink-0 place-items-center rounded-md border border-(--brand-line) bg-(--surface-card) sm:size-16">
                            <FileText
                              aria-hidden="true"
                              className={
                                field.state.value
                                  ? 'size-5 text-(--brand-orange-deep)'
                                  : 'size-5 text-(--brand-muted)'
                              }
                            />
                          </div>
                          <div className="min-w-0">
                            <p className="text-sm font-medium text-(--brand-ink)">
                              {field.state.value
                                ? formCopy.pdfSelected
                                : formCopy.pdfNotSelected}
                            </p>
                            <p className="text-xs text-(--brand-muted)">
                              {formCopy.selectPdf}
                            </p>
                          </div>
                        </div>
                        <div className="flex flex-wrap items-center gap-2 sm:shrink-0">
                          {field.state.value ? (
                            <Button
                              asChild
                              variant="secondary"
                              className="min-h-11"
                            >
                              <a
                                href={field.state.value}
                                target="_blank"
                                rel="noreferrer"
                              >
                                <ExternalLink aria-hidden="true" />
                                {formCopy.viewPdf}
                              </a>
                            </Button>
                          ) : null}
                          <Button
                            type="button"
                            variant="outline"
                            className="min-h-11"
                            onClick={() => setPicker('pdf')}
                          >
                            <FolderOpen aria-hidden="true" />
                            {formCopy.choosePdf}
                          </Button>
                          {field.state.value ? (
                            <Button
                              type="button"
                              variant="ghost"
                              className="min-h-11 text-destructive hover:text-destructive"
                              onClick={() => field.handleChange('')}
                            >
                              <Trash2 aria-hidden="true" />
                              {formCopy.removePdf}
                            </Button>
                          ) : null}
                        </div>
                      </div>
                      {field.state.meta.errors.length > 0 ? (
                        <FieldError errors={field.state.meta.errors} />
                      ) : null}
                    </Field>
                  )}
                </form.Field>
              </TabsContent>
              <TabsContent
                value="verification"
                forceMount
                className="data-[state=inactive]:hidden"
              >
                <form.Field name="verificationUrl">
                  {(field) => {
                    const invalid = !field.state.meta.isValid
                    return (
                      <Field data-invalid={invalid}>
                        <FieldLabel htmlFor={field.name}>
                          {formCopy.verificationUrl} ({formCopy.optional})
                        </FieldLabel>
                        <Input
                          id={field.name}
                          name={field.name}
                          type="url"
                          inputMode="url"
                          placeholder="https://"
                          value={field.state.value}
                          onBlur={field.handleBlur}
                          onChange={(event) =>
                            field.handleChange(event.target.value)
                          }
                          aria-invalid={invalid}
                          className="min-h-11"
                        />
                        {invalid ? (
                          <FieldError errors={field.state.meta.errors} />
                        ) : null}
                      </Field>
                    )
                  }}
                </form.Field>
              </TabsContent>
            </Tabs>
          </div>
          <form.Field name="status">
            {(field) => (
              <Field>
                <FieldLabel htmlFor="certificate-status">
                  {formCopy.status}
                </FieldLabel>
                <Select
                  value={field.state.value}
                  onValueChange={(value) =>
                    field.handleChange(value as CertificateFormState['status'])
                  }
                >
                  <SelectTrigger
                    id="certificate-status"
                    className="min-h-11 w-full"
                  >
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      <SelectItem value="draft">{formCopy.draft}</SelectItem>
                      <SelectItem value="published">
                        {formCopy.published}
                      </SelectItem>
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </Field>
            )}
          </form.Field>
          {error ? (
            <p role="alert" className="text-sm font-medium text-destructive">
              {error}
            </p>
          ) : null}
          <div className="flex flex-wrap gap-3">
            <Button type="submit" disabled={isSaving} className="min-h-11">
              {isSaving ? formCopy.saving : formCopy.save}
            </Button>
            {certificate ? (
              <Button
                type="button"
                variant="destructive"
                className="min-h-11"
                onClick={() => setConfirmDelete(true)}
              >
                {formCopy.delete}
              </Button>
            ) : null}
            <Button
              type="button"
              variant="outline"
              className="min-h-11"
              onClick={() => void navigate({ to: '/dashboard/certificates' })}
            >
              {formCopy.cancel}
            </Button>
          </div>
        </FieldGroup>
      </form>

      {picker === 'cover' ? (
        <MediaPickerDialog
          open
          onOpenChange={(open) => !open && setPicker(null)}
          onSelect={(media) => {
            form.setFieldValue('coverImageUrl', media.url)
            setPicker(null)
          }}
          currentUrl={form.getFieldValue('coverImageUrl')}
          accept="image"
        />
      ) : null}
      {picker === 'pdf' ? (
        <MediaPickerDialog
          open
          onOpenChange={(open) => !open && setPicker(null)}
          onSelect={(media) => {
            form.setFieldValue('pdfUrl', media.url)
            setPicker(null)
          }}
          currentUrl={form.getFieldValue('pdfUrl')}
          accept="document"
        />
      ) : null}
      <AlertDialog open={confirmDelete} onOpenChange={setConfirmDelete}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{copy.deleteTitle}</AlertDialogTitle>
            <AlertDialogDescription>
              {copy.deleteConfirm(certificate?.title ?? '')}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="min-h-11">
              {formCopy.cancel}
            </AlertDialogCancel>
            <AlertDialogAction
              variant="destructive"
              disabled={deleteMutation.isPending}
              onClick={(event) => {
                event.preventDefault()
                void handleDelete()
              }}
            >
              {deleteMutation.isPending ? formCopy.saving : formCopy.delete}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}
