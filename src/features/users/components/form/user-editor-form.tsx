import { useForm } from '@tanstack/react-form'
import { Link, useNavigate } from '@tanstack/react-router'
import {
  AlertCircle,
  ArrowLeft,
  CheckCircle2,
  Eye,
  EyeOff,
  KeyRound,
  Mail,
  Save,
  Shield,
  ShieldAlert,
  Trash2,
  User,
} from 'lucide-react'
import { useState } from 'react'
import { z } from 'zod'

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
  FieldError,
  FieldGroup,
  FieldLabel,
} from '#/components/ui/field'
import { Input } from '#/components/ui/input'
import type { UserRole } from '#/db/schema'
import { getDashboardCopy } from '#/features/dashboard/copy'
import {
  useCreateUser,
  useDeleteUser,
  useResetPassword,
  useUpdateUser,
} from '#/features/users/hooks'
import type { UserRecord } from '#/features/users/queries'

type UserEditorFormProps = {
  mode: 'create' | 'edit'
  initialData?: UserRecord | null
  currentUserId?: string
}

export function UserEditorForm({
  mode,
  initialData,
  currentUserId,
}: UserEditorFormProps) {
  const navigate = useNavigate()
  const copy = getDashboardCopy()
  const userCopy = copy.users

  const [showPassword, setShowPassword] = useState(false)
  const [showNewPassword, setShowNewPassword] = useState(false)
  const [resetSuccess, setResetSuccess] = useState(false)
  const [successMessage, setSuccessMessage] = useState<string | null>(null)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)

  const isSelf = Boolean(currentUserId && initialData?.id === currentUserId)
  const isOwner = initialData?.role === 'owner'

  const createMutation = useCreateUser()
  const updateMutation = useUpdateUser()
  const deleteMutation = useDeleteUser()
  const resetPasswordMutation = useResetPassword()

  const isSaving = createMutation.isPending || updateMutation.isPending
  const isDeleting = deleteMutation.isPending
  const isResettingPassword = resetPasswordMutation.isPending

  const saveError =
    (mode === 'create' ? createMutation.error : updateMutation.error)
      ?.message ?? null
  const deleteError = deleteMutation.error?.message ?? null
  const resetError = resetPasswordMutation.error?.message ?? null

  const roleDescriptions: Record<UserRole, string> = {
    owner: userCopy.roles.ownerDesc,
    admin: userCopy.roles.adminDesc,
    editor: userCopy.roles.editorDesc,
  }

  const userFormSchema = z.object({
    name: z.string().min(1, `${userCopy.form.name} wajib diisi.`),
    email: z.string().email('Format email tidak valid.'),
    role: z.enum(['owner', 'admin', 'editor'] as const),
    password: z.string().refine(
      (val) => {
        if (mode === 'create') {
          return val.length >= 8
        }
        return true
      },
      { message: 'Password minimal 8 karakter.' },
    ),
  })

  const form = useForm({
    defaultValues: {
      name: initialData?.name ?? '',
      email: initialData?.email ?? '',
      role: initialData?.role ?? 'editor',
      password: '',
    },
    validators: {
      onSubmit: userFormSchema,
    },
    onSubmit: async ({ value }) => {
      setSuccessMessage(null)

      if (mode === 'edit' && initialData?.id) {
        await updateMutation
          .mutateAsync({
            id: initialData.id,
            name: value.name.trim(),
            email: value.email.trim().toLowerCase(),
            role: value.role,
          })
          .then(() => {
            setSuccessMessage(userCopy.feedback.updated)
            setTimeout(() => {
              void navigate({ to: '/dashboard/users' })
            }, 700)
          })
          .catch(() => {
            // error displayed from mutation.error
          })
      } else {
        await createMutation
          .mutateAsync({
            name: value.name.trim(),
            email: value.email.trim().toLowerCase(),
            password: value.password,
            role: value.role,
          })
          .then(() => {
            setSuccessMessage(userCopy.feedback.created)
            setTimeout(() => {
              void navigate({ to: '/dashboard/users' })
            }, 700)
          })
          .catch(() => {
            // error displayed from mutation.error
          })
      }
    },
  })

  const resetPasswordSchema = z.object({
    newPassword: z.string().min(8, 'Password baru minimal 8 karakter.'),
  })

  const resetForm = useForm({
    defaultValues: {
      newPassword: '',
    },
    validators: {
      onSubmit: resetPasswordSchema,
    },
    onSubmit: async ({ value }) => {
      if (!initialData?.id) return
      setResetSuccess(false)

      await resetPasswordMutation
        .mutateAsync({ id: initialData.id, password: value.newPassword })
        .then(() => {
          setResetSuccess(true)
          resetForm.reset()
        })
        .catch(() => {
          // error displayed from mutation.error
        })
    },
  })

  const handleDelete = async () => {
    if (!initialData?.id || isOwner || isSelf) return

    await deleteMutation
      .mutateAsync(initialData.id)
      .then(() => {
        setIsDeleteDialogOpen(false)
        void navigate({ to: '/dashboard/users' })
      })
      .catch(() => {
        setIsDeleteDialogOpen(false)
      })
  }

  const availableRoles: UserRole[] = isOwner ? ['owner'] : ['admin', 'editor']

  return (
    <div className="mx-auto max-w-3xl space-y-8 pb-12">
      {/* Top action bar */}
      <div className="flex items-center justify-between">
        <Button
          variant="outline"
          size="sm"
          asChild
          className="gap-2 border-(--brand-line) font-semibold text-(--brand-ink) hover:bg-surface-soft"
        >
          <Link to="/dashboard/users">
            <ArrowLeft className="size-4" />
            {copy.common.back}
          </Link>
        </Button>

        {mode === 'edit' && initialData && !isOwner && (
          <>
            <Button
              type="button"
              variant="destructive"
              size="sm"
              onClick={() => setIsDeleteDialogOpen(true)}
              disabled={isDeleting || isSaving || isSelf}
              className="gap-2 bg-red-600 font-semibold text-white hover:bg-red-700 disabled:opacity-50"
              title={isSelf ? userCopy.form.selfDeleteWarning : undefined}
            >
              <Trash2 className="size-4" />
              {isDeleting
                ? copy.common.delete + '...'
                : userCopy.form.deleteUser}
            </Button>

            <AlertDialog
              open={isDeleteDialogOpen}
              onOpenChange={setIsDeleteDialogOpen}
            >
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>
                    {userCopy.form.deleteUser}
                  </AlertDialogTitle>
                  <AlertDialogDescription>
                    {userCopy.form.deleteConfirm}
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel disabled={isDeleting}>
                    {copy.common.cancel}
                  </AlertDialogCancel>
                  <AlertDialogAction
                    variant="destructive"
                    disabled={isDeleting}
                    onClick={(e) => {
                      e.preventDefault()
                      void handleDelete()
                    }}
                  >
                    {isDeleting ? copy.common.saving : userCopy.form.deleteUser}
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </>
        )}
      </div>

      {/* Alerts */}
      {(saveError ?? deleteError) && (
        <div className="flex items-center gap-3 rounded-xl border border-red-500/20 bg-red-500/10 p-4 text-sm font-medium text-red-600 dark:text-red-400">
          <AlertCircle className="size-5 shrink-0" />
          <span>{saveError ?? deleteError}</span>
        </div>
      )}

      {successMessage && (
        <div className="flex items-center gap-3 rounded-xl border border-emerald-500/20 bg-emerald-500/10 p-4 text-sm font-medium text-emerald-600 dark:text-emerald-400">
          <CheckCircle2 className="size-5 shrink-0" />
          <span>{successMessage}</span>
        </div>
      )}

      {/* Main Profile & Role Form */}
      <form
        onSubmit={(e) => {
          e.preventDefault()
          e.stopPropagation()
          void form.handleSubmit()
        }}
        className="space-y-6 rounded-2xl border border-(--brand-line) bg-card p-6 shadow-sm sm:p-8"
      >
        <div className="border-b border-(--brand-line) pb-4">
          <h2 className="text-lg font-bold text-(--brand-ink)">
            {mode === 'create'
              ? userCopy.newDescription
              : userCopy.editDescription}
          </h2>
        </div>

        <FieldGroup>
          <div className="grid gap-6 sm:grid-cols-2">
            {/* Name */}
            <div className="sm:col-span-2">
              <form.Field
                name="name"
                children={(field) => {
                  const isInvalid =
                    field.state.meta.isTouched && !field.state.meta.isValid
                  return (
                    <Field data-invalid={isInvalid}>
                      <FieldLabel
                        htmlFor={field.name}
                        className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-(--brand-ink)"
                      >
                        <User className="size-3.5 text-(--brand-orange)" />
                        {userCopy.form.name}{' '}
                        <span className="text-red-500">*</span>
                      </FieldLabel>
                      <Input
                        id={field.name}
                        name={field.name}
                        value={field.state.value}
                        onBlur={field.handleBlur}
                        onChange={(e) => field.handleChange(e.target.value)}
                        placeholder={userCopy.form.namePlaceholder}
                        aria-invalid={isInvalid}
                        className="h-11 rounded-xl border-(--brand-line) bg-surface text-sm"
                      />
                      {isInvalid && (
                        <FieldError errors={field.state.meta.errors} />
                      )}
                    </Field>
                  )
                }}
              />
            </div>

            {/* Email */}
            <div className="sm:col-span-2">
              <form.Field
                name="email"
                children={(field) => {
                  const isInvalid =
                    field.state.meta.isTouched && !field.state.meta.isValid
                  return (
                    <Field data-invalid={isInvalid}>
                      <FieldLabel
                        htmlFor={field.name}
                        className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-(--brand-ink)"
                      >
                        <Mail className="size-3.5 text-(--brand-orange)" />
                        {userCopy.form.email}{' '}
                        <span className="text-red-500">*</span>
                      </FieldLabel>
                      <Input
                        id={field.name}
                        name={field.name}
                        type="email"
                        value={field.state.value}
                        onBlur={field.handleBlur}
                        onChange={(e) => field.handleChange(e.target.value)}
                        placeholder={userCopy.form.emailPlaceholder}
                        aria-invalid={isInvalid}
                        className="h-11 rounded-xl border-(--brand-line) bg-surface text-sm"
                      />
                      {isInvalid && (
                        <FieldError errors={field.state.meta.errors} />
                      )}
                    </Field>
                  )
                }}
              />
            </div>

            {/* Password (Create Mode Only) */}
            {mode === 'create' && (
              <div className="sm:col-span-2">
                <form.Field
                  name="password"
                  children={(field) => {
                    const isInvalid =
                      field.state.meta.isTouched && !field.state.meta.isValid
                    return (
                      <Field data-invalid={isInvalid}>
                        <FieldLabel
                          htmlFor={field.name}
                          className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-(--brand-ink)"
                        >
                          <KeyRound className="size-3.5 text-(--brand-orange)" />
                          {userCopy.form.password}{' '}
                          <span className="text-red-500">*</span>
                        </FieldLabel>
                        <div className="relative">
                          <Input
                            id={field.name}
                            name={field.name}
                            type={showPassword ? 'text' : 'password'}
                            value={field.state.value}
                            onBlur={field.handleBlur}
                            onChange={(e) => field.handleChange(e.target.value)}
                            placeholder={userCopy.form.passwordPlaceholder}
                            aria-invalid={isInvalid}
                            className="h-11 rounded-xl border-(--brand-line) bg-surface pr-10 text-sm"
                          />
                          <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute inset-y-0 right-0 flex items-center pr-3 text-(--brand-muted) hover:text-(--brand-ink)"
                            tabIndex={-1}
                          >
                            {showPassword ? (
                              <EyeOff className="size-4" />
                            ) : (
                              <Eye className="size-4" />
                            )}
                          </button>
                        </div>
                        {isInvalid && (
                          <FieldError errors={field.state.meta.errors} />
                        )}
                      </Field>
                    )
                  }}
                />
              </div>
            )}

            {/* Role Selection */}
            <div className="sm:col-span-2">
              <form.Field
                name="role"
                children={(field) => (
                  <Field>
                    <FieldLabel className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-(--brand-ink)">
                      <Shield className="size-3.5 text-(--brand-orange)" />
                      {userCopy.form.role}{' '}
                      <span className="text-red-500">*</span>
                    </FieldLabel>

                    {isOwner ? (
                      <div className="mt-1 rounded-xl border border-(--brand-orange)/40 bg-(--brand-orange-soft)/30 p-4">
                        <div className="flex items-center gap-2">
                          <ShieldAlert className="size-4 text-(--brand-orange-deep)" />
                          <span className="text-xs font-black uppercase tracking-wide text-(--brand-orange-deep)">
                            {userCopy.roles.owner}
                          </span>
                        </div>
                        <p className="mt-1.5 text-xs text-(--brand-muted)">
                          {roleDescriptions.owner}
                        </p>
                        <p className="mt-2 text-[0.7rem] font-semibold text-(--brand-orange-deep)">
                          Role Owner bersifat tetap untuk akun utama portfolio
                          ini dan tidak dapat diubah.
                        </p>
                      </div>
                    ) : (
                      <div className="grid gap-3 sm:grid-cols-2 pt-1">
                        {availableRoles.map((r) => {
                          const isSelected = field.state.value === r
                          return (
                            <button
                              key={r}
                              type="button"
                              onClick={() => field.handleChange(r)}
                              className={`flex flex-col items-start rounded-xl border p-3.5 text-left transition ${
                                isSelected
                                  ? 'border-(--brand-orange) bg-(--brand-orange-soft)/30 shadow-xs'
                                  : 'border-(--brand-line) bg-surface hover:border-(--brand-orange)/50 hover:bg-surface-soft'
                              }`}
                            >
                              <div className="flex w-full items-center justify-between">
                                <span className="text-xs font-extrabold uppercase tracking-wide text-(--brand-ink)">
                                  {userCopy.roles[r]}
                                </span>
                                {isSelected && (
                                  <span className="size-2 rounded-full bg-(--brand-orange)" />
                                )}
                              </div>
                              <p className="mt-1 text-[0.75rem] leading-relaxed text-(--brand-muted)">
                                {roleDescriptions[r]}
                              </p>
                            </button>
                          )
                        })}
                      </div>
                    )}
                  </Field>
                )}
              />
            </div>
          </div>
        </FieldGroup>

        {/* Submit */}
        <div className="flex justify-end pt-4">
          <Button
            type="submit"
            disabled={isSaving}
            className="gap-2 rounded-xl bg-linear-to-r from-(--brand-orange) to-(--brand-orange-deep) px-6 py-2.5 font-bold text-white shadow-md hover:opacity-90 disabled:opacity-50"
          >
            <Save className="size-4" />
            {isSaving
              ? copy.common.saving
              : mode === 'create'
                ? userCopy.form.createUser
                : userCopy.form.saveChanges}
          </Button>
        </div>
      </form>

      {/* Reset Password Card (Edit Mode Only) */}
      {mode === 'edit' && initialData && (
        <form
          onSubmit={(e) => {
            e.preventDefault()
            e.stopPropagation()
            void resetForm.handleSubmit()
          }}
          className="space-y-4 rounded-2xl border border-(--brand-line) bg-card p-6 shadow-sm sm:p-8"
        >
          <div className="border-b border-(--brand-line) pb-4">
            <h3 className="flex items-center gap-2 text-base font-bold text-(--brand-ink)">
              <KeyRound className="size-4 text-(--brand-orange)" />
              {userCopy.resetPasswordTitle}
            </h3>
            <p className="mt-1 text-xs text-(--brand-muted)">
              {userCopy.resetPasswordDescription}
            </p>
          </div>

          {resetError && (
            <div className="flex items-center gap-2 rounded-lg border border-red-500/20 bg-red-500/10 p-3 text-xs font-medium text-red-600 dark:text-red-400">
              <AlertCircle className="size-4 shrink-0" />
              <span>{resetError}</span>
            </div>
          )}

          {resetSuccess && (
            <div className="flex items-center gap-2 rounded-lg border border-emerald-500/20 bg-emerald-500/10 p-3 text-xs font-medium text-emerald-600 dark:text-emerald-400">
              <CheckCircle2 className="size-4 shrink-0" />
              <span>{userCopy.feedback.passwordReset}</span>
            </div>
          )}

          <FieldGroup>
            <resetForm.Field
              name="newPassword"
              children={(field) => {
                const isInvalid =
                  field.state.meta.isTouched && !field.state.meta.isValid
                return (
                  <Field data-invalid={isInvalid}>
                    <FieldLabel
                      htmlFor={field.name}
                      className="text-xs font-bold uppercase tracking-wider text-(--brand-ink)"
                    >
                      {userCopy.form.newPassword}
                    </FieldLabel>
                    <div className="relative">
                      <Input
                        id={field.name}
                        name={field.name}
                        type={showNewPassword ? 'text' : 'password'}
                        value={field.state.value}
                        onBlur={field.handleBlur}
                        onChange={(e) => field.handleChange(e.target.value)}
                        placeholder={userCopy.form.passwordPlaceholder}
                        aria-invalid={isInvalid}
                        className="h-11 rounded-xl border-(--brand-line) bg-surface pr-10 text-sm"
                      />
                      <button
                        type="button"
                        onClick={() => setShowNewPassword(!showNewPassword)}
                        className="absolute inset-y-0 right-0 flex items-center pr-3 text-(--brand-muted) hover:text-(--brand-ink)"
                        tabIndex={-1}
                      >
                        {showNewPassword ? (
                          <EyeOff className="size-4" />
                        ) : (
                          <Eye className="size-4" />
                        )}
                      </button>
                    </div>
                    {isInvalid && (
                      <FieldError errors={field.state.meta.errors} />
                    )}
                  </Field>
                )
              }}
            />
          </FieldGroup>

          <div className="flex justify-end pt-2">
            <Button
              type="submit"
              variant="outline"
              disabled={isResettingPassword}
              className="gap-2 border-(--brand-line) font-bold text-(--brand-ink) hover:bg-surface-soft disabled:opacity-50"
            >
              <KeyRound className="size-4" />
              {isResettingPassword
                ? userCopy.form.resettingPassword
                : userCopy.form.resetPasswordButton}
            </Button>
          </div>
        </form>
      )}
    </div>
  )
}
