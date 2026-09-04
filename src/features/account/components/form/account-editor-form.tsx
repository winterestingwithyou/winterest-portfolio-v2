import { useForm } from '@tanstack/react-form'
import {
  AlertCircle,
  Calendar,
  CheckCircle2,
  Eye,
  EyeOff,
  Globe,
  Info,
  KeyRound,
  Lock,
  Mail,
  Save,
  Shield,
  ShieldCheck,
  Smartphone,
  Sparkles,
  User,
} from 'lucide-react'
import { useState } from 'react'

import { Badge } from '#/components/ui/badge'
import { Button } from '#/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '#/components/ui/card'
import {
  Field,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
} from '#/components/ui/field'
import { Input } from '#/components/ui/input'
import type { UserRole } from '#/db/schema'
import { getDashboardCopy } from '#/features/dashboard/copy'

import {
  useChangeAccountPassword,
  useUpdateAccountProfile,
} from '#/features/account/hooks'
import type { AccountProfile } from '#/features/account/queries'
import {
  changePasswordSchema,
  updateProfileSchema,
} from '#/features/account/validation'

type AccountTab = 'profile' | 'security' | 'sessions'

type AccountEditorFormProps = {
  profile: AccountProfile
}

export function AccountEditorForm({ profile }: AccountEditorFormProps) {
  const copy = getDashboardCopy()
  const accountCopy = copy.account
  const userCopy = copy.users

  const [activeTab, setActiveTab] = useState<AccountTab>('profile')
  const [profileSuccess, setProfileSuccess] = useState<string | null>(null)
  const [passwordSuccess, setPasswordSuccess] = useState<string | null>(null)

  const [showCurrentPassword, setShowCurrentPassword] = useState(false)
  const [showNewPassword, setShowNewPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)

  const updateProfileMutation = useUpdateAccountProfile()
  const changePasswordMutation = useChangeAccountPassword()

  const isSavingProfile = updateProfileMutation.isPending
  const isChangingPassword = changePasswordMutation.isPending

  const profileError = updateProfileMutation.error?.message ?? null
  const passwordError = changePasswordMutation.error?.message ?? null

  const roleBadges: Record<UserRole, { label: string; className: string }> = {
    owner: {
      label: userCopy.roles.owner,
      className:
        'bg-(--brand-orange-soft) text-(--brand-orange-deep) border-(--brand-orange)/30 font-bold',
    },
    admin: {
      label: userCopy.roles.admin,
      className:
        'bg-purple-50 text-purple-700 border-purple-200 dark:bg-purple-950/40 dark:text-purple-300 dark:border-purple-800 font-bold',
    },
    editor: {
      label: userCopy.roles.editor,
      className:
        'bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-950/40 dark:text-blue-300 dark:border-blue-800 font-bold',
    },
  }

  const roleDescriptions: Record<UserRole, string> = {
    owner: userCopy.roles.ownerDesc,
    admin: userCopy.roles.adminDesc,
    editor: userCopy.roles.editorDesc,
  }

  // Profile Form
  const profileForm = useForm({
    defaultValues: {
      name: profile.name,
      email: profile.email,
    },
    validators: {
      onSubmit: updateProfileSchema,
    },
    onSubmit: async ({ value }) => {
      setProfileSuccess(null)
      try {
        await updateProfileMutation.mutateAsync(value)
        setProfileSuccess(accountCopy.feedback.profileUpdated)
      } catch (err) {
        console.error(err)
      }
    },
  })

  // Password Form
  const passwordForm = useForm({
    defaultValues: {
      currentPassword: '',
      newPassword: '',
      confirmPassword: '',
    },
    validators: {
      onSubmit: changePasswordSchema,
    },
    onSubmit: async ({ value }) => {
      setPasswordSuccess(null)
      try {
        await changePasswordMutation.mutateAsync(value)
        setPasswordSuccess(accountCopy.feedback.passwordChanged)
        passwordForm.reset()
      } catch (err) {
        console.error(err)
      }
    },
  })

  const tabs: Array<{ id: AccountTab; label: string; icon: typeof User }> = [
    { id: 'profile', label: accountCopy.profileTitle, icon: User },
    { id: 'security', label: accountCopy.securityTitle, icon: Lock },
    { id: 'sessions', label: accountCopy.sessionsTitle, icon: ShieldCheck },
  ]

  const createdDate = new Date(profile.createdAt).toLocaleDateString(
    undefined,
    {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    },
  )

  const userInitial = (profile.name[0] || profile.email[0] || 'W').toUpperCase()

  const currentRoleBadge = roleBadges[profile.role]
  const currentRoleDescription = roleDescriptions[profile.role]

  return (
    <div className="mx-auto max-w-4xl space-y-6 pb-12">
      {/* Top Profile Summary Card */}
      <Card className="relative overflow-hidden border-(--brand-line) bg-card p-6 shadow-sm">
        <div className="absolute right-0 top-0 -mr-16 -mt-16 size-48 rounded-full bg-(--brand-orange)/5 blur-3xl" />
        <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-4">
            <div className="flex size-16 shrink-0 items-center justify-center rounded-2xl border border-(--brand-line) bg-linear-to-br from-(--brand-orange-soft) to-orange-100 text-2xl font-extrabold text-(--brand-orange-deep) shadow-[0_4px_16px_var(--brand-orange-soft)] dark:to-orange-950/40">
              {userInitial}
            </div>
            <div className="flex flex-col gap-1">
              <div className="flex flex-wrap items-center gap-2">
                <h2 className="text-xl font-bold tracking-tight text-(--brand-ink)">
                  {profile.name}
                </h2>
                <Badge variant="outline" className={currentRoleBadge.className}>
                  <Sparkles className="size-3" />
                  {currentRoleBadge.label}
                </Badge>
              </div>
              <p className="text-xs text-muted-foreground">{profile.email}</p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3 border-t border-(--brand-line) pt-3 text-xs text-muted-foreground sm:border-t-0 sm:pt-0">
            <div className="flex items-center gap-1.5 rounded-lg border border-(--brand-line) bg-surface-soft px-3 py-1.5">
              <Calendar className="size-3.5 text-(--brand-orange)" />
              <span>
                {accountCopy.form.memberSince}:{' '}
                <strong className="font-semibold text-(--brand-ink)">
                  {createdDate}
                </strong>
              </span>
            </div>
            <div className="flex items-center gap-1.5 rounded-lg border border-(--brand-line) bg-surface-soft px-3 py-1.5">
              <Smartphone className="size-3.5 text-(--brand-orange)" />
              <span>
                {accountCopy.form.activeSessionsCount}:{' '}
                <strong className="font-semibold text-(--brand-ink)">
                  {profile.sessionCount}
                </strong>
              </span>
            </div>
          </div>
        </div>
      </Card>

      {/* Tabs Navigation */}
      <div className="flex items-center gap-1 overflow-x-auto border-b border-(--brand-line) no-scrollbar scroll-smooth">
        {tabs.map((tab) => {
          const Icon = tab.icon
          const isActive = activeTab === tab.id
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => {
                setActiveTab(tab.id)
                setProfileSuccess(null)
                setPasswordSuccess(null)
              }}
              className={`flex min-h-[44px] shrink-0 items-center gap-2 border-b-2 px-4 py-3 text-xs font-semibold whitespace-nowrap transition-colors sm:text-sm ${
                isActive
                  ? 'border-(--brand-orange) text-(--brand-orange-deep) dark:text-(--brand-orange)'
                  : 'border-transparent text-muted-foreground hover:border-muted hover:text-foreground'
              }`}
            >
              <Icon className="size-4" />
              {tab.label}
            </button>
          )
        })}
      </div>

      {/* Tab 1: Profile Information */}
      {activeTab === 'profile' && (
        <Card className="border-(--brand-line) bg-card shadow-sm">
          <CardHeader>
            <CardTitle className="text-base font-bold text-(--brand-ink)">
              {accountCopy.profileTitle}
            </CardTitle>
            <CardDescription className="text-xs">
              {accountCopy.profileDescription}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {profileSuccess && (
              <div className="flex items-center gap-2.5 rounded-lg border border-emerald-200 bg-emerald-50 p-3.5 text-xs text-emerald-900 dark:border-emerald-900/40 dark:bg-emerald-950/30 dark:text-emerald-200">
                <CheckCircle2 className="size-4 shrink-0 text-emerald-600 dark:text-emerald-400" />
                <span className="font-semibold">{profileSuccess}</span>
              </div>
            )}

            {profileError && (
              <div className="flex items-center gap-2.5 rounded-lg border border-red-200 bg-red-50 p-3.5 text-xs text-red-900 dark:border-red-900/40 dark:bg-red-950/30 dark:text-red-200">
                <AlertCircle className="size-4 shrink-0 text-red-600 dark:text-red-400" />
                <span className="font-semibold">{profileError}</span>
              </div>
            )}

            <form
              onSubmit={(e) => {
                e.preventDefault()
                e.stopPropagation()
                void profileForm.handleSubmit()
              }}
              className="space-y-5"
            >
              <FieldGroup className="grid gap-5 sm:grid-cols-2">
                <profileForm.Field
                  name="name"
                  children={(field) => {
                    const isInvalid =
                      field.state.meta.isTouched &&
                      Boolean(field.state.meta.errors.length)
                    return (
                      <Field>
                        <FieldLabel htmlFor={field.name}>
                          {accountCopy.form.name}{' '}
                          <span className="text-red-500">*</span>
                        </FieldLabel>
                        <div className="relative">
                          <User className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                          <Input
                            id={field.name}
                            name={field.name}
                            value={field.state.value}
                            onBlur={field.handleBlur}
                            onChange={(e) => field.handleChange(e.target.value)}
                            placeholder={accountCopy.form.namePlaceholder}
                            aria-invalid={isInvalid}
                            className="pl-9"
                          />
                        </div>
                        {isInvalid && (
                          <FieldError errors={field.state.meta.errors} />
                        )}
                      </Field>
                    )
                  }}
                />

                <profileForm.Field
                  name="email"
                  children={(field) => {
                    const isInvalid =
                      field.state.meta.isTouched &&
                      Boolean(field.state.meta.errors.length)
                    return (
                      <Field>
                        <FieldLabel htmlFor={field.name}>
                          {accountCopy.form.email}{' '}
                          <span className="text-red-500">*</span>
                        </FieldLabel>
                        <div className="relative">
                          <Mail className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                          <Input
                            id={field.name}
                            name={field.name}
                            type="email"
                            value={field.state.value}
                            onBlur={field.handleBlur}
                            onChange={(e) => field.handleChange(e.target.value)}
                            placeholder={accountCopy.form.emailPlaceholder}
                            aria-invalid={isInvalid}
                            className="pl-9"
                          />
                        </div>
                        {isInvalid && (
                          <FieldError errors={field.state.meta.errors} />
                        )}
                      </Field>
                    )
                  }}
                />
              </FieldGroup>

              {/* Readonly Role Card */}
              <div className="rounded-xl border border-(--brand-line) bg-surface-soft/60 p-4">
                <div className="flex items-start gap-3">
                  <div className="mt-0.5 flex size-8 shrink-0 items-center justify-center rounded-lg border border-(--brand-line) bg-card text-(--brand-orange)">
                    <Shield className="size-4" />
                  </div>
                  <div className="flex flex-col gap-1">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-(--brand-ink)">
                        {accountCopy.form.role}:
                      </span>
                      <Badge
                        variant="outline"
                        className={currentRoleBadge.className}
                      >
                        {currentRoleBadge.label}
                      </Badge>
                    </div>
                    <p className="text-xs text-muted-foreground">
                      {currentRoleDescription}
                    </p>
                    <div className="mt-1 flex items-center gap-1.5 text-[0.7rem] text-muted-foreground">
                      <Info className="size-3 shrink-0 text-(--brand-orange)" />
                      <span>{accountCopy.currentRoleNotice}</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex justify-end pt-2">
                <Button
                  type="submit"
                  disabled={isSavingProfile}
                  className="gap-2 bg-(--brand-orange) font-semibold text-white shadow-[0_2px_8px_var(--brand-orange-soft)] hover:bg-(--brand-orange-deep)"
                >
                  <Save className="size-4" />
                  {isSavingProfile
                    ? accountCopy.form.savingProfile
                    : accountCopy.form.saveProfile}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      {/* Tab 2: Security & Password */}
      {activeTab === 'security' && (
        <Card className="border-(--brand-line) bg-card shadow-sm">
          <CardHeader>
            <CardTitle className="text-base font-bold text-(--brand-ink)">
              {accountCopy.securityTitle}
            </CardTitle>
            <CardDescription className="text-xs">
              {accountCopy.securityDescription}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {passwordSuccess && (
              <div className="flex items-center gap-2.5 rounded-lg border border-emerald-200 bg-emerald-50 p-3.5 text-xs text-emerald-900 dark:border-emerald-900/40 dark:bg-emerald-950/30 dark:text-emerald-200">
                <CheckCircle2 className="size-4 shrink-0 text-emerald-600 dark:text-emerald-400" />
                <span className="font-semibold">{passwordSuccess}</span>
              </div>
            )}

            {passwordError && (
              <div className="flex items-center gap-2.5 rounded-lg border border-red-200 bg-red-50 p-3.5 text-xs text-red-900 dark:border-red-900/40 dark:bg-red-950/30 dark:text-red-200">
                <AlertCircle className="size-4 shrink-0 text-red-600 dark:text-red-400" />
                <span className="font-semibold">{passwordError}</span>
              </div>
            )}

            <form
              onSubmit={(e) => {
                e.preventDefault()
                e.stopPropagation()
                void passwordForm.handleSubmit()
              }}
              className="space-y-5"
            >
              <passwordForm.Field
                name="currentPassword"
                children={(field) => {
                  const isInvalid =
                    field.state.meta.isTouched &&
                    Boolean(field.state.meta.errors.length)
                  return (
                    <Field>
                      <FieldLabel htmlFor={field.name}>
                        {accountCopy.form.currentPassword}{' '}
                        <span className="text-red-500">*</span>
                      </FieldLabel>
                      <div className="relative">
                        <KeyRound className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                        <Input
                          id={field.name}
                          name={field.name}
                          type={showCurrentPassword ? 'text' : 'password'}
                          value={field.state.value}
                          onBlur={field.handleBlur}
                          onChange={(e) => field.handleChange(e.target.value)}
                          placeholder={
                            accountCopy.form.currentPasswordPlaceholder
                          }
                          aria-invalid={isInvalid}
                          className="pl-9 pr-10"
                        />
                        <button
                          type="button"
                          onClick={() =>
                            setShowCurrentPassword((prev) => !prev)
                          }
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                          tabIndex={-1}
                        >
                          {showCurrentPassword ? (
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

              <FieldGroup className="grid gap-5 sm:grid-cols-2">
                <passwordForm.Field
                  name="newPassword"
                  children={(field) => {
                    const isInvalid =
                      field.state.meta.isTouched &&
                      Boolean(field.state.meta.errors.length)
                    return (
                      <Field>
                        <FieldLabel htmlFor={field.name}>
                          {accountCopy.form.newPassword}{' '}
                          <span className="text-red-500">*</span>
                        </FieldLabel>
                        <div className="relative">
                          <Lock className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                          <Input
                            id={field.name}
                            name={field.name}
                            type={showNewPassword ? 'text' : 'password'}
                            value={field.state.value}
                            onBlur={field.handleBlur}
                            onChange={(e) => field.handleChange(e.target.value)}
                            placeholder={
                              accountCopy.form.newPasswordPlaceholder
                            }
                            aria-invalid={isInvalid}
                            className="pl-9 pr-10"
                          />
                          <button
                            type="button"
                            onClick={() => setShowNewPassword((prev) => !prev)}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                            tabIndex={-1}
                          >
                            {showNewPassword ? (
                              <EyeOff className="size-4" />
                            ) : (
                              <Eye className="size-4" />
                            )}
                          </button>
                        </div>
                        <FieldDescription>
                          {accountCopy.form.newPasswordPlaceholder}
                        </FieldDescription>
                        {isInvalid && (
                          <FieldError errors={field.state.meta.errors} />
                        )}
                      </Field>
                    )
                  }}
                />

                <passwordForm.Field
                  name="confirmPassword"
                  children={(field) => {
                    const isInvalid =
                      field.state.meta.isTouched &&
                      Boolean(field.state.meta.errors.length)
                    return (
                      <Field>
                        <FieldLabel htmlFor={field.name}>
                          {accountCopy.form.confirmPassword}{' '}
                          <span className="text-red-500">*</span>
                        </FieldLabel>
                        <div className="relative">
                          <Lock className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                          <Input
                            id={field.name}
                            name={field.name}
                            type={showConfirmPassword ? 'text' : 'password'}
                            value={field.state.value}
                            onBlur={field.handleBlur}
                            onChange={(e) => field.handleChange(e.target.value)}
                            placeholder={
                              accountCopy.form.confirmPasswordPlaceholder
                            }
                            aria-invalid={isInvalid}
                            className="pl-9 pr-10"
                          />
                          <button
                            type="button"
                            onClick={() =>
                              setShowConfirmPassword((prev) => !prev)
                            }
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                            tabIndex={-1}
                          >
                            {showConfirmPassword ? (
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
                  disabled={isChangingPassword}
                  className="gap-2 bg-(--brand-orange) font-semibold text-white shadow-[0_2px_8px_var(--brand-orange-soft)] hover:bg-(--brand-orange-deep)"
                >
                  <KeyRound className="size-4" />
                  {isChangingPassword
                    ? accountCopy.form.updatingPassword
                    : accountCopy.form.updatePassword}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      {/* Tab 3: Active Sessions Information */}
      {activeTab === 'sessions' && (
        <Card className="border-(--brand-line) bg-card shadow-sm">
          <CardHeader>
            <CardTitle className="text-base font-bold text-(--brand-ink)">
              {accountCopy.sessionsTitle}
            </CardTitle>
            <CardDescription className="text-xs">
              {accountCopy.sessionsDescription}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between rounded-xl border border-(--brand-line) bg-surface-soft p-4">
              <div className="flex items-center gap-3">
                <div className="flex size-10 items-center justify-center rounded-xl border border-(--brand-line) bg-card text-(--brand-orange)">
                  <Globe className="size-5" />
                </div>
                <div className="flex flex-col gap-0.5">
                  <span className="text-xs font-bold text-(--brand-ink)">
                    {accountCopy.sessions.currentSessionTitle}
                  </span>
                  <span className="text-[0.7rem] text-muted-foreground">
                    {accountCopy.sessions.currentSessionDesc}
                  </span>
                </div>
              </div>
              <Badge
                variant="outline"
                className="border-emerald-200 bg-emerald-50 font-bold text-emerald-700 dark:border-emerald-800 dark:bg-emerald-950/40 dark:text-emerald-300"
              >
                {accountCopy.sessions.activeBadge}
              </Badge>
            </div>

            <div className="space-y-2 rounded-xl border border-(--brand-line) bg-card p-4 text-xs text-muted-foreground">
              <div className="flex items-center gap-2 font-bold text-(--brand-ink)">
                <Shield className="size-4 text-(--brand-orange)" />
                <span>{accountCopy.sessions.securityTipsTitle}</span>
              </div>
              <ul className="list-inside list-disc space-y-1 text-muted-foreground">
                <li>{accountCopy.sessions.securityTip1}</li>
                <li>{accountCopy.sessions.securityTip2}</li>
                <li>{accountCopy.sessions.securityTip3}</li>
              </ul>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
