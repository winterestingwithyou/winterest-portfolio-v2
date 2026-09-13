import { useState } from 'react'
import { GraduationCap, Home, Layers, Sparkles } from 'lucide-react'

import { CmsPageShell } from '#/components/dashboard/cms-page-shell'
import { HomeHeroEducationForm } from '#/features/home/components/form/home-hero-education-form'
import { HomeSectionsCtaForm } from '#/features/home/components/form/home-sections-cta-form'
import { HomeEnthusiasmsManager } from '#/features/home/components/section/home-enthusiasms-manager'
import { getHomeCopy } from '#/features/home/copy'
import { useUpdateHomeConfig } from '#/features/home/hooks'
import { getDefaultHomeConfig } from '#/features/home/validation'
import type {
  EnthusiasmRecord,
  HomeConfigInput,
} from '#/features/home/validation'

type DashboardHomePageProps = {
  initialConfig: HomeConfigInput
  enthusiasms: EnthusiasmRecord[]
}

export function DashboardHomePage({
  initialConfig,
  enthusiasms,
}: DashboardHomePageProps) {
  const homeCopy = getHomeCopy()
  const copy = homeCopy.dashboard

  const [activeTab, setActiveTab] = useState<
    'hero-education' | 'enthusiasms' | 'sections-cta'
  >('hero-education')
  const [locale, setLocale] = useState<'en' | 'id'>('en')
  const [formData, setFormData] = useState<HomeConfigInput>(initialConfig)
  const [statusMessage, setStatusMessage] = useState<string | null>(null)
  const [isError, setIsError] = useState(false)

  const configMutation = useUpdateHomeConfig()

  const handleResetToDefault = () => {
    if (window.confirm(copy.resetConfirm)) {
      setFormData(getDefaultHomeConfig())
      setIsError(false)
      setStatusMessage(copy.resetSuccess)
    }
  }

  const handleSaveAll = () => {
    setStatusMessage(null)
    configMutation.mutate(formData, {
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
      icon={<Home className="size-5" />}
      title={copy.title}
      description={copy.description}
      locale={locale}
      onLocaleChange={setLocale}
      onReset={handleResetToDefault}
      isSaving={configMutation.isPending}
      asForm={false}
      onSave={handleSaveAll}
      saveLabel={copy.saveConfig}
      statusMessage={
        statusMessage ? { text: statusMessage, isError } : undefined
      }
    >
      {/* Tab Switcher - matches Stack and Settings page tab style */}
      <div className="flex items-center gap-1 overflow-x-auto border-b border-(--brand-line) no-scrollbar scroll-smooth w-full min-w-0 max-w-full">
        <button
          type="button"
          onClick={() => setActiveTab('hero-education')}
          className={`flex min-h-[44px] shrink-0 items-center gap-2 border-b-2 px-6 py-3 text-sm font-bold whitespace-nowrap transition-colors cursor-pointer ${
            activeTab === 'hero-education'
              ? 'border-(--brand-orange) text-(--brand-orange-deep) dark:text-(--brand-orange)'
              : 'border-transparent text-(--brand-muted) hover:text-(--brand-ink)'
          }`}
        >
          <GraduationCap className="size-4" />
          <span>{copy.tabs.heroEducation}</span>
        </button>
        <button
          type="button"
          onClick={() => setActiveTab('enthusiasms')}
          className={`flex min-h-[44px] shrink-0 items-center gap-2 border-b-2 px-6 py-3 text-sm font-bold whitespace-nowrap transition-colors cursor-pointer ${
            activeTab === 'enthusiasms'
              ? 'border-(--brand-orange) text-(--brand-orange-deep) dark:text-(--brand-orange)'
              : 'border-transparent text-(--brand-muted) hover:text-(--brand-ink)'
          }`}
        >
          <Sparkles className="size-4" />
          <span>
            {copy.tabs.enthusiasms} ({enthusiasms.length})
          </span>
        </button>
        <button
          type="button"
          onClick={() => setActiveTab('sections-cta')}
          className={`flex min-h-[44px] shrink-0 items-center gap-2 border-b-2 px-6 py-3 text-sm font-bold whitespace-nowrap transition-colors cursor-pointer ${
            activeTab === 'sections-cta'
              ? 'border-(--brand-orange) text-(--brand-orange-deep) dark:text-(--brand-orange)'
              : 'border-transparent text-(--brand-muted) hover:text-(--brand-ink)'
          }`}
        >
          <Layers className="size-4" />
          <span>{copy.tabs.sectionsCta}</span>
        </button>
      </div>

      <div className="w-full min-w-0 max-w-full">
        {activeTab === 'hero-education' && (
          <HomeHeroEducationForm
            locale={locale}
            formData={formData}
            onChange={setFormData}
          />
        )}

        {activeTab === 'enthusiasms' && (
          <HomeEnthusiasmsManager
            locale={locale}
            formData={formData}
            onChange={setFormData}
            enthusiasms={enthusiasms}
          />
        )}

        {activeTab === 'sections-cta' && (
          <HomeSectionsCtaForm
            locale={locale}
            formData={formData}
            onChange={setFormData}
          />
        )}
      </div>
    </CmsPageShell>
  )
}
