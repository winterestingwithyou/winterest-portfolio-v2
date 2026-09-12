import { Plus, Trash2 } from 'lucide-react'

import { Button } from '#/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '#/components/ui/card'
import { Field, FieldGroup, FieldLabel } from '#/components/ui/field'
import { Input } from '#/components/ui/input'
import { Switch } from '#/components/ui/switch'
import { Textarea } from '#/components/ui/textarea'
import type { HomeConfigInput, StatItem } from '#/features/home/validation'

type HomeHeroStatsFormProps = {
  locale: 'en' | 'id'
  formData: HomeConfigInput
  onChange: (updater: (prev: HomeConfigInput) => HomeConfigInput) => void
}

export function HomeHeroStatsForm({
  locale,
  formData,
  onChange,
}: HomeHeroStatsFormProps) {
  const handleStatChange = (
    index: number,
    field: keyof StatItem,
    val: string,
  ) => {
    onChange((prev) => {
      const nextStats = [...prev.stats]
      if (nextStats[index]) {
        nextStats[index] = {
          ...nextStats[index],
          [field]: val,
        }
      }
      return { ...prev, stats: nextStats }
    })
  }

  const handleAddStat = () => {
    if (formData.stats.length >= 4) return
    onChange((prev) => ({
      ...prev,
      stats: [
        ...prev.stats,
        {
          labelEn: 'Metric',
          labelId: 'Metrik',
          value: '10+',
        },
      ],
    }))
  }

  const handleRemoveStat = (index: number) => {
    onChange((prev) => ({
      ...prev,
      stats: prev.stats.filter((_, idx) => idx !== index),
    }))
  }

  return (
    <div className="flex flex-col gap-6">
      {/* 1. Hero Introduction Copy */}
      <Card className="border-(--brand-line) bg-card">
        <CardHeader>
          <CardTitle className="text-base font-bold text-(--brand-ink)">
            Pengenalan Hero ({locale.toUpperCase()})
          </CardTitle>
          <CardDescription className="text-xs text-(--brand-muted)">
            Teks utama yang pertama kali dilihat pengunjung di bagian paling
            atas beranda.
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-4">
          <FieldGroup className="flex flex-col gap-4">
            <Field>
              <FieldLabel htmlFor="hero-eyebrow">
                Eyebrow ({locale.toUpperCase()})
              </FieldLabel>
              <Input
                id="hero-eyebrow"
                value={
                  locale === 'en'
                    ? formData.heroEyebrowEn
                    : formData.heroEyebrowId
                }
                onChange={(e) =>
                  onChange((prev) => ({
                    ...prev,
                    [locale === 'en' ? 'heroEyebrowEn' : 'heroEyebrowId']:
                      e.target.value,
                  }))
                }
                placeholder="mis. M. Adam Yudistira — Winterest"
              />
            </Field>

            <Field>
              <FieldLabel htmlFor="hero-title">
                Judul Utama ({locale.toUpperCase()}) *
              </FieldLabel>
              <Input
                id="hero-title"
                required
                value={
                  locale === 'en' ? formData.heroTitleEn : formData.heroTitleId
                }
                onChange={(e) =>
                  onChange((prev) => ({
                    ...prev,
                    [locale === 'en' ? 'heroTitleEn' : 'heroTitleId']:
                      e.target.value,
                  }))
                }
                placeholder="mis. Fresh Graduate of Computer Science..."
              />
            </Field>

            <Field>
              <FieldLabel htmlFor="hero-intro">
                Paragraf Pembuka ({locale.toUpperCase()})
              </FieldLabel>
              <Textarea
                id="hero-intro"
                rows={3}
                value={
                  locale === 'en' ? formData.heroIntroEn : formData.heroIntroId
                }
                onChange={(e) =>
                  onChange((prev) => ({
                    ...prev,
                    [locale === 'en' ? 'heroIntroEn' : 'heroIntroId']:
                      e.target.value,
                  }))
                }
                placeholder="mis. Halo, aku Adam. Juga biasa dipanggil Winterest..."
              />
            </Field>

            <Field>
              <FieldLabel htmlFor="hero-intro-suffix">
                Teks Penutup Pembuka ({locale.toUpperCase()})
              </FieldLabel>
              <Input
                id="hero-intro-suffix"
                value={
                  locale === 'en'
                    ? formData.heroIntroSuffixEn
                    : formData.heroIntroSuffixId
                }
                onChange={(e) =>
                  onChange((prev) => ({
                    ...prev,
                    [locale === 'en'
                      ? 'heroIntroSuffixEn'
                      : 'heroIntroSuffixId']: e.target.value,
                  }))
                }
                placeholder="mis. Semua tentangku ada disini!"
              />
            </Field>
          </FieldGroup>
        </CardContent>
      </Card>

      {/* 2. Portfolio Metric Cards (Stats) */}
      <Card className="border-(--brand-line) bg-card">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-base font-bold text-(--brand-ink)">
                Kartu Metrik & Statistik Hero (Maks. 4)
              </CardTitle>
              <CardDescription className="text-xs text-(--brand-muted) mt-0.5">
                Kartu kecil di bawah tombol CTA pada hero untuk menampilkan data
                pencapaian.
              </CardDescription>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold text-(--brand-ink)">
                Tampilkan Metrik
              </span>
              <Switch
                checked={formData.showStats}
                onCheckedChange={(checked) =>
                  onChange((prev) => ({ ...prev, showStats: checked }))
                }
              />
            </div>
          </div>
        </CardHeader>
        <CardContent className="flex flex-col gap-4">
          <div className="flex flex-col gap-3">
            {formData.stats.map((stat, idx) => (
              <div
                key={idx}
                className="flex items-center gap-3 rounded-xl border border-(--brand-line) bg-surface-soft/40 p-3"
              >
                <div className="flex items-center justify-center size-7 rounded-lg bg-(--brand-orange-soft) text-(--brand-orange-deep) font-bold text-xs shrink-0">
                  {idx + 1}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 flex-1">
                  <Input
                    value={locale === 'en' ? stat.labelEn : stat.labelId}
                    onChange={(e) =>
                      handleStatChange(
                        idx,
                        locale === 'en' ? 'labelEn' : 'labelId',
                        e.target.value,
                      )
                    }
                    placeholder={`Label (${locale.toUpperCase()})`}
                    className="text-xs"
                  />
                  <Input
                    value={stat.value}
                    onChange={(e) =>
                      handleStatChange(idx, 'value', e.target.value)
                    }
                    placeholder="Nilai / Angka (mis. 25+)"
                    className="text-xs"
                  />
                </div>

                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  onClick={() => handleRemoveStat(idx)}
                  className="text-red-500 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-950/30 size-8 shrink-0"
                >
                  <Trash2 className="size-4" />
                </Button>
              </div>
            ))}
          </div>

          {formData.stats.length < 4 && (
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={handleAddStat}
              className="flex items-center justify-center gap-2 border-dashed border-(--brand-line) text-xs text-muted-foreground hover:text-foreground hover:border-(--brand-orange)"
            >
              <Plus className="size-3.5" />
              Tambah Kartu Metrik ({formData.stats.length}/4)
            </Button>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
