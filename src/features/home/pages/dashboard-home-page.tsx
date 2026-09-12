import { useState } from 'react'
import { Home, Layers, RotateCcw, Save, Sparkles, User } from 'lucide-react'

import { Button } from '#/components/ui/button'
import { LanguageSwitcherPill } from '#/components/ui/language-switcher-pill'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '#/components/ui/tabs'
import { HomeHeroStatsForm } from '#/features/home/components/form/home-hero-stats-form'
import { HomeSectionsCtaForm } from '#/features/home/components/form/home-sections-cta-form'
import { HomeEnthusiasmsManager } from '#/features/home/components/section/home-enthusiasms-manager'
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
  const [activeTab, setActiveTab] = useState('hero-stats')
  const [locale, setLocale] = useState<'en' | 'id'>('en')
  const [formData, setFormData] = useState<HomeConfigInput>(initialConfig)
  const [statusMessage, setStatusMessage] = useState<string | null>(null)

  const configMutation = useUpdateHomeConfig()

  const handleResetToDefault = () => {
    if (
      window.confirm(
        'Reset semua teks ke default copywriting? Perubahan belum tersimpan akan diganti.',
      )
    ) {
      setFormData(getDefaultHomeConfig())
      setStatusMessage(
        'Konfigurasi telah direset ke default. Klik "Simpan Konfigurasi" untuk menerapkan.',
      )
    }
  }

  const handleSaveAll = () => {
    setStatusMessage(null)
    configMutation.mutate(formData, {
      onSuccess: () => {
        setStatusMessage('Konfigurasi beranda berhasil disimpan.')
        setTimeout(() => setStatusMessage(null), 4000)
      },
      onError: (err) => {
        setStatusMessage(
          err instanceof Error ? err.message : 'Gagal menyimpan konfigurasi.',
        )
      },
    })
  }

  return (
    <div className="flex flex-col gap-6 max-w-5xl">
      {/* Top Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-(--brand-line) pb-5">
        <div>
          <h1 className="text-2xl font-bold text-(--brand-ink) tracking-tight flex items-center gap-2.5">
            <Home className="size-6 text-(--brand-orange)" />
            Pengaturan Konten: Beranda (Home)
          </h1>
          <p className="text-sm text-(--brand-muted) mt-1">
            Kelola teks hero, kartu metrik, fokus keahlian, seksi project dan
            marquee, serta CTA penutup.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <LanguageSwitcherPill activeLocale={locale} onChange={setLocale} />

          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={handleResetToDefault}
            className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground"
          >
            <RotateCcw className="size-3.5" />
            Reset Default
          </Button>

          <Button
            type="button"
            size="sm"
            onClick={handleSaveAll}
            disabled={configMutation.isPending}
            className="flex items-center gap-1.5 bg-(--brand-orange) font-bold text-white hover:brightness-105"
          >
            <Save className="size-3.5" />
            {configMutation.isPending ? 'Menyimpan...' : 'Simpan Konfigurasi'}
          </Button>
        </div>
      </div>

      {statusMessage && (
        <div
          className={`p-3.5 text-xs font-semibold rounded-lg border ${
            configMutation.isError
              ? 'border-red-500/30 bg-red-50 text-red-700 dark:bg-red-950/30 dark:text-red-400'
              : 'border-green-500/30 bg-green-50 text-green-800 dark:bg-green-950/30 dark:text-green-300'
          }`}
        >
          {statusMessage}
        </div>
      )}

      {/* 3 Modular Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-3 max-w-lg mb-2">
          <TabsTrigger
            value="hero-stats"
            className="flex items-center gap-2 text-xs font-semibold"
          >
            <User className="size-3.5" />
            Hero dan Metrik
          </TabsTrigger>
          <TabsTrigger
            value="enthusiasms"
            className="flex items-center gap-2 text-xs font-semibold"
          >
            <Sparkles className="size-3.5" />
            Bidang Minat ({enthusiasms.length})
          </TabsTrigger>
          <TabsTrigger
            value="sections-cta"
            className="flex items-center gap-2 text-xs font-semibold"
          >
            <Layers className="size-3.5" />
            Seksi dan CTA
          </TabsTrigger>
        </TabsList>

        <TabsContent value="hero-stats" className="mt-4">
          <HomeHeroStatsForm
            locale={locale}
            formData={formData}
            onChange={setFormData}
          />
        </TabsContent>

        <TabsContent value="enthusiasms" className="mt-4">
          <HomeEnthusiasmsManager
            locale={locale}
            formData={formData}
            onChange={setFormData}
            enthusiasms={enthusiasms}
          />
        </TabsContent>

        <TabsContent value="sections-cta" className="mt-4">
          <HomeSectionsCtaForm
            locale={locale}
            formData={formData}
            onChange={setFormData}
          />
        </TabsContent>
      </Tabs>
    </div>
  )
}
