import { useState } from 'react'
import { Award, GraduationCap, Home, Layers, Sparkles } from 'lucide-react'

import { CmsPageShell } from '#/components/dashboard/cms-page-shell'
import { getCertificateCopy } from '#/features/certificates/copy'
import { HomeCertificatesForm } from '#/features/home/components/form/home-certificates-form'
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
import { useUpdatePageContent } from '#/features/portfolio/page-content-hooks'
import { getDefaultCertificatesPageConfig } from '#/features/portfolio/page-content-schemas'
import type { CertificatesPageConfig } from '#/features/portfolio/page-content-schemas'

type DashboardHomePageProps = {
  initialConfig: HomeConfigInput
  enthusiasms: EnthusiasmRecord[]
  certificatesPageContent: CertificatesPageConfig
}

export function DashboardHomePage({
  initialConfig,
  enthusiasms,
  certificatesPageContent,
}: DashboardHomePageProps) {
  const homeCopy = getHomeCopy()
  const copy = homeCopy.dashboard
  const certificateContentCopy = getCertificateCopy().dashboard.pageContent

  const [activeTab, setActiveTab] = useState<
    'hero-education' | 'enthusiasms' | 'sections-cta' | 'certificates'
  >('hero-education')
  const [locale, setLocale] = useState<'en' | 'id'>('en')
  const [formData, setFormData] = useState<HomeConfigInput>(initialConfig)
  const [certificatesFormData, setCertificatesFormData] =
    useState<CertificatesPageConfig>(certificatesPageContent)
  const [statusMessage, setStatusMessage] = useState<string | null>(null)
  const [isError, setIsError] = useState(false)

  const configMutation = useUpdateHomeConfig()
  const certificatesMutation =
    useUpdatePageContent<CertificatesPageConfig>('certificates')

  const handleResetToDefault = () => {
    if (activeTab === 'certificates') {
      if (window.confirm(certificateContentCopy.homeResetConfirm)) {
        const defaults = getDefaultCertificatesPageConfig()
        setCertificatesFormData((current) => ({
          ...current,
          homeEyebrowEn: defaults.homeEyebrowEn,
          homeEyebrowId: defaults.homeEyebrowId,
          homeTitleEn: defaults.homeTitleEn,
          homeTitleId: defaults.homeTitleId,
          homeDescriptionEn: defaults.homeDescriptionEn,
          homeDescriptionId: defaults.homeDescriptionId,
          showHomeDescription: defaults.showHomeDescription,
        }))
        setIsError(false)
        setStatusMessage(certificateContentCopy.homeResetSuccess)
      }
      return
    }

    if (window.confirm(copy.resetConfirm)) {
      setFormData(getDefaultHomeConfig())
      setIsError(false)
      setStatusMessage(copy.resetSuccess)
    }
  }

  const handleSaveAll = () => {
    setStatusMessage(null)
    if (activeTab === 'certificates') {
      certificatesMutation.mutate(certificatesFormData, {
        onSuccess: () => {
          setIsError(false)
          setStatusMessage(certificateContentCopy.saveHomeSuccess)
          setTimeout(() => setStatusMessage(null), 4000)
        },
        onError: (error) => {
          setIsError(true)
          setStatusMessage(
            error instanceof Error
              ? error.message
              : certificateContentCopy.saveHomeError,
          )
        },
      })
      return
    }

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
      isSaving={configMutation.isPending || certificatesMutation.isPending}
      asForm={false}
      onSave={handleSaveAll}
      saveLabel={
        activeTab === 'certificates'
          ? certificateContentCopy.saveHomeContent
          : copy.saveConfig
      }
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
        <button
          type="button"
          onClick={() => setActiveTab('certificates')}
          className={`flex min-h-11 shrink-0 items-center gap-2 border-b-2 px-6 py-3 text-sm font-bold whitespace-nowrap transition-colors cursor-pointer ${
            activeTab === 'certificates'
              ? 'border-(--brand-orange) text-(--brand-orange-deep) dark:text-(--brand-orange)'
              : 'border-transparent text-(--brand-muted) hover:text-(--brand-ink)'
          }`}
        >
          <Award className="size-4" />
          <span>{copy.tabs.certificates}</span>
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

        {activeTab === 'certificates' && (
          <HomeCertificatesForm
            locale={locale}
            formData={certificatesFormData}
            onChange={setCertificatesFormData}
          />
        )}
      </div>
    </CmsPageShell>
  )
}
