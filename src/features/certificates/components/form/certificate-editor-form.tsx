import { useForm } from '@tanstack/react-form'
import { useNavigate } from '@tanstack/react-router'
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

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    event.stopPropagation()
    void form.handleSubmit()
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
      <form onSubmit={handleSubmit} className="max-w-3xl">
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
                    <Input
                      id={field.name}
                      name={field.name}
                      type="date"
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
            <form.Field name="expiresAt">
              {(field) => {
                const invalid = !field.state.meta.isValid
                return (
                  <Field data-invalid={invalid}>
                    <FieldLabel htmlFor={field.name}>
                      {formCopy.expiresAt} ({formCopy.optional})
                    </FieldLabel>
                    <Input
                      id={field.name}
                      name={field.name}
                      type="date"
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
                <FieldDescription>{formCopy.selectImage}</FieldDescription>
                <div className="flex flex-wrap items-center gap-3">
                  {field.state.value ? (
                    <img
                      src={field.state.value}
                      alt=""
                      className="size-16 rounded-md border border-(--brand-line) object-cover"
                    />
                  ) : null}
                  <Button
                    type="button"
                    variant="outline"
                    className="min-h-11"
                    onClick={() => setPicker('cover')}
                  >
                    {formCopy.chooseImage}
                  </Button>
                  {field.state.value ? (
                    <Button
                      type="button"
                      variant="ghost"
                      className="min-h-11"
                      onClick={() => field.handleChange('')}
                    >
                      {formCopy.removeImage}
                    </Button>
                  ) : null}
                </div>
              </Field>
            )}
          </form.Field>
          <form.Field name="pdfUrl">
            {(field) => (
              <Field data-invalid={!field.state.meta.isValid}>
                <p className="text-sm font-medium">
                  {formCopy.pdf} ({formCopy.optional})
                </p>
                <FieldDescription>{formCopy.mediaRequired}</FieldDescription>
                <div className="flex flex-wrap items-center gap-3">
                  {field.state.value ? (
                    <a
                      href={field.state.value}
                      target="_blank"
                      rel="noreferrer"
                      className="max-w-full break-all text-sm font-medium text-(--brand-orange-deep) underline underline-offset-4"
                    >
                      {field.state.value}
                    </a>
                  ) : null}
                  <Button
                    type="button"
                    variant="outline"
                    className="min-h-11"
                    onClick={() => setPicker('pdf')}
                  >
                    {field.state.value
                      ? formCopy.choosePdf
                      : formCopy.selectPdf}
                  </Button>
                  {field.state.value ? (
                    <Button
                      type="button"
                      variant="ghost"
                      className="min-h-11"
                      onClick={() => field.handleChange('')}
                    >
                      {formCopy.removePdf}
                    </Button>
                  ) : null}
                </div>
                {field.state.meta.errors.length > 0 ? (
                  <FieldError errors={field.state.meta.errors} />
                ) : null}
              </Field>
            )}
          </form.Field>
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
