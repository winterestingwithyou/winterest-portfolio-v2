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
  Trash2,
  User,
} from 'lucide-react'
import type { FormEvent } from 'react'
import { useState } from 'react'

import { Button } from '#/components/ui/button'
import { Input } from '#/components/ui/input'
import { userRoles } from '#/db/schema'
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

  const [name, setName] = useState(initialData?.name ?? '')
  const [email, setEmail] = useState(initialData?.email ?? '')
  const [role, setRole] = useState<UserRole>(initialData?.role ?? 'editor')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)

  // Reset password state for edit mode
  const [newPassword, setNewPassword] = useState('')
  const [showNewPassword, setShowNewPassword] = useState(false)
  const [resetSuccess, setResetSuccess] = useState(false)

  const [successMessage, setSuccessMessage] = useState<string | null>(null)

  const isSelf = Boolean(currentUserId && initialData?.id === currentUserId)

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

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setSuccessMessage(null)

    if (!name.trim() || !email.trim()) {
      return
    }

    if (mode === 'create' && password.length < 8) {
      return
    }

    if (mode === 'edit' && initialData?.id) {
      await updateMutation
        .mutateAsync({
          id: initialData.id,
          name: name.trim(),
          email: email.trim().toLowerCase(),
          role,
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
          name: name.trim(),
          email: email.trim().toLowerCase(),
          password,
          role,
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
  }

  const handleResetPassword = async (e: FormEvent) => {
    e.preventDefault()
    if (!initialData?.id) return
    if (newPassword.length < 8) return

    setResetSuccess(false)

    await resetPasswordMutation
      .mutateAsync({ id: initialData.id, newPassword })
      .then(() => {
        setResetSuccess(true)
        setNewPassword('')
      })
      .catch(() => {
        // error displayed from mutation.error
      })
  }

  const handleDelete = async () => {
    if (!initialData?.id) return
    if (isSelf) {
      alert(userCopy.form.selfDeleteWarning)
      return
    }
    if (!confirm(userCopy.form.deleteConfirm)) return

    await deleteMutation
      .mutateAsync(initialData.id)
      .then(() => {
        void navigate({ to: '/dashboard/users' })
      })
      .catch(() => {
        // error displayed from mutation.error
      })
  }

  const roleDescriptions: Record<UserRole, string> = {
    owner: userCopy.roles.ownerDesc,
    admin: userCopy.roles.adminDesc,
    editor: userCopy.roles.editorDesc,
    viewer: userCopy.roles.viewerDesc,
  }

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

        {mode === 'edit' && initialData && (
          <Button
            type="button"
            variant="destructive"
            size="sm"
            onClick={() => void handleDelete()}
            disabled={isDeleting || isSaving || isSelf}
            className="gap-2 bg-red-600 font-semibold text-white hover:bg-red-700 disabled:opacity-50"
            title={isSelf ? userCopy.form.selfDeleteWarning : undefined}
          >
            <Trash2 className="size-4" />
            {isDeleting ? copy.common.delete + '...' : userCopy.form.deleteUser}
          </Button>
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
        onSubmit={(e) => void handleSubmit(e)}
        className="space-y-6 rounded-2xl border border-(--brand-line) bg-card p-6 shadow-sm sm:p-8"
      >
        <div className="border-b border-(--brand-line) pb-4">
          <h2 className="text-lg font-bold text-(--brand-ink)">
            {mode === 'create' ? userCopy.newDescription : userCopy.editDescription}
          </h2>
        </div>

        <div className="grid gap-6 sm:grid-cols-2">
          {/* Name */}
          <div className="space-y-2 sm:col-span-2">
            <label
              htmlFor="user-name"
              className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-(--brand-ink)"
            >
              <User className="size-3.5 text-(--brand-orange)" />
              {userCopy.form.name} <span className="text-red-500">*</span>
            </label>
            <Input
              id="user-name"
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder={userCopy.form.namePlaceholder}
              className="h-11 rounded-xl border-(--brand-line) bg-surface text-sm"
            />
          </div>

          {/* Email */}
          <div className="space-y-2 sm:col-span-2">
            <label
              htmlFor="user-email"
              className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-(--brand-ink)"
            >
              <Mail className="size-3.5 text-(--brand-orange)" />
              {userCopy.form.email} <span className="text-red-500">*</span>
            </label>
            <Input
              id="user-email"
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder={userCopy.form.emailPlaceholder}
              className="h-11 rounded-xl border-(--brand-line) bg-surface text-sm"
            />
          </div>

          {/* Password (Create Mode Only) */}
          {mode === 'create' && (
            <div className="space-y-2 sm:col-span-2">
              <label
                htmlFor="user-password"
                className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-(--brand-ink)"
              >
                <KeyRound className="size-3.5 text-(--brand-orange)" />
                {userCopy.form.password} <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <Input
                  id="user-password"
                  type={showPassword ? 'text' : 'password'}
                  required
                  minLength={8}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder={userCopy.form.passwordPlaceholder}
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
              <p className="text-xs text-(--brand-muted)">
                {userCopy.form.passwordPlaceholder}
              </p>
            </div>
          )}

          {/* Role Selection */}
          <div className="space-y-3 sm:col-span-2">
            <label className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-(--brand-ink)">
              <Shield className="size-3.5 text-(--brand-orange)" />
              {userCopy.form.role} <span className="text-red-500">*</span>
            </label>

            <div className="grid gap-3 sm:grid-cols-2">
              {userRoles.map((r) => {
                const isSelected = role === r
                return (
                  <button
                    key={r}
                    type="button"
                    onClick={() => setRole(r)}
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
          </div>
        </div>

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
          onSubmit={(e) => void handleResetPassword(e)}
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

          <div className="space-y-2">
            <label
              htmlFor="reset-password-input"
              className="text-xs font-bold uppercase tracking-wider text-(--brand-ink)"
            >
              {userCopy.form.newPassword}
            </label>
            <div className="relative">
              <Input
                id="reset-password-input"
                type={showNewPassword ? 'text' : 'password'}
                required
                minLength={8}
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder={userCopy.form.passwordPlaceholder}
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
          </div>

          <div className="flex justify-end pt-2">
            <Button
              type="submit"
              variant="outline"
              disabled={isResettingPassword || !newPassword}
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
