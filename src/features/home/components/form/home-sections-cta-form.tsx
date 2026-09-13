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
import type { HomeConfigInput } from '#/features/home/validation'

type HomeSectionsCtaFormProps = {
  locale: 'en' | 'id'
  formData: HomeConfigInput
  onChange: (updater: (prev: HomeConfigInput) => HomeConfigInput) => void
}

export function HomeSectionsCtaForm({
  locale,
  formData,
  onChange,
}: HomeSectionsCtaFormProps) {
  return (
    <div className="flex flex-col gap-6">
      {/* 1. Featured Projects Section Header */}
      <Card className="border-(--brand-line) bg-card">
        <CardHeader>
          <CardTitle className="text-base font-bold text-(--brand-ink)">
            1. Seksi Project Unggulan (Featured Projects) (
            {locale.toUpperCase()})
          </CardTitle>
          <CardDescription className="text-xs text-(--brand-muted)">
            Header pembuka untuk daftar project pilihan di beranda.
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-4">
          <FieldGroup className="flex flex-col gap-4">
            <Field>
              <FieldLabel htmlFor="featured-eyebrow">
                Eyebrow ({locale.toUpperCase()})
              </FieldLabel>
              <Input
                id="featured-eyebrow"
                value={
                  locale === 'en'
                    ? formData.featuredEyebrowEn
                    : formData.featuredEyebrowId
                }
                onChange={(e) =>
                  onChange((prev) => ({
                    ...prev,
                    [locale === 'en'
                      ? 'featuredEyebrowEn'
                      : 'featuredEyebrowId']: e.target.value,
                  }))
                }
                placeholder="mis. FEATURED PROJECTS"
              />
            </Field>

            <Field>
              <FieldLabel htmlFor="featured-title">
                Judul Seksi ({locale.toUpperCase()}) *
              </FieldLabel>
              <Input
                id="featured-title"
                required
                value={
                  locale === 'en'
                    ? formData.featuredTitleEn
                    : formData.featuredTitleId
                }
                onChange={(e) =>
                  onChange((prev) => ({
                    ...prev,
                    [locale === 'en' ? 'featuredTitleEn' : 'featuredTitleId']:
                      e.target.value,
                  }))
                }
                placeholder="mis. Project andalanku"
              />
            </Field>

            <Field>
              <FieldLabel htmlFor="featured-description">
                Deskripsi Seksi ({locale.toUpperCase()})
              </FieldLabel>
              <Textarea
                id="featured-description"
                rows={3}
                value={
                  locale === 'en'
                    ? formData.featuredDescriptionEn
                    : formData.featuredDescriptionId
                }
                onChange={(e) =>
                  onChange((prev) => ({
                    ...prev,
                    [locale === 'en'
                      ? 'featuredDescriptionEn'
                      : 'featuredDescriptionId']: e.target.value,
                  }))
                }
                placeholder="mis. Deretan sistem web, developer tools..."
              />
            </Field>
          </FieldGroup>

          <div className="flex items-center justify-between border-t border-(--brand-line) pt-4">
            <div className="flex flex-col gap-0.5">
              <span className="text-xs font-bold text-(--brand-ink)">
                Tampilkan Deskripsi Seksi Project
              </span>
              <span className="text-[11px] text-(--brand-muted)">
                Sembunyikan deskripsi untuk tampilan yang lebih padat.
              </span>
            </div>
            <Switch
              checked={formData.showFeaturedDescription}
              onCheckedChange={(checked) =>
                onChange((prev) => ({
                  ...prev,
                  showFeaturedDescription: checked,
                }))
              }
            />
          </div>
        </CardContent>
      </Card>

      {/* 2. Tech Marquee Section Header */}
      <Card className="border-(--brand-line) bg-card">
        <CardHeader>
          <CardTitle className="text-base font-bold text-(--brand-ink)">
            2. Seksi Marquee Teknologi (Ultimate Tech) ({locale.toUpperCase()})
          </CardTitle>
          <CardDescription className="text-xs text-(--brand-muted)">
            Header pembuka animasi marquee teknologi di beranda.
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-4">
          <FieldGroup className="flex flex-col gap-4">
            <Field>
              <FieldLabel htmlFor="marquee-eyebrow">
                Eyebrow ({locale.toUpperCase()})
              </FieldLabel>
              <Input
                id="marquee-eyebrow"
                value={
                  locale === 'en'
                    ? formData.marqueeEyebrowEn
                    : formData.marqueeEyebrowId
                }
                onChange={(e) =>
                  onChange((prev) => ({
                    ...prev,
                    [locale === 'en' ? 'marqueeEyebrowEn' : 'marqueeEyebrowId']:
                      e.target.value,
                  }))
                }
                placeholder="mis. Ultimate Tech Stack"
              />
            </Field>

            <Field>
              <FieldLabel htmlFor="marquee-title">
                Judul Seksi ({locale.toUpperCase()}) *
              </FieldLabel>
              <Input
                id="marquee-title"
                required
                value={
                  locale === 'en'
                    ? formData.marqueeTitleEn
                    : formData.marqueeTitleId
                }
                onChange={(e) =>
                  onChange((prev) => ({
                    ...prev,
                    [locale === 'en' ? 'marqueeTitleEn' : 'marqueeTitleId']:
                      e.target.value,
                  }))
                }
                placeholder="mis. Tools I actually use."
              />
            </Field>

            <Field>
              <FieldLabel htmlFor="marquee-description">
                Deskripsi Seksi ({locale.toUpperCase()})
              </FieldLabel>
              <Textarea
                id="marquee-description"
                rows={3}
                value={
                  locale === 'en'
                    ? formData.marqueeDescriptionEn
                    : formData.marqueeDescriptionId
                }
                onChange={(e) =>
                  onChange((prev) => ({
                    ...prev,
                    [locale === 'en'
                      ? 'marqueeDescriptionEn'
                      : 'marqueeDescriptionId']: e.target.value,
                  }))
                }
                placeholder="mis. My current go-to stack..."
              />
            </Field>
          </FieldGroup>

          <div className="flex items-center justify-between border-t border-(--brand-line) pt-4">
            <div className="flex flex-col gap-0.5">
              <span className="text-xs font-bold text-(--brand-ink)">
                Tampilkan Deskripsi Marquee
              </span>
              <span className="text-[11px] text-(--brand-muted)">
                Sembunyikan deskripsi di atas deretan kartu marquee.
              </span>
            </div>
            <Switch
              checked={formData.showMarqueeDescription}
              onCheckedChange={(checked) =>
                onChange((prev) => ({
                  ...prev,
                  showMarqueeDescription: checked,
                }))
              }
            />
          </div>
        </CardContent>
      </Card>

      {/* 3. Closing Conversion CTA Banner */}
      <Card className="border-(--brand-line) bg-card">
        <CardHeader>
          <CardTitle className="text-base font-bold text-(--brand-ink)">
            3. Banner CTA Penutup (Conversion Banner) ({locale.toUpperCase()})
          </CardTitle>
          <CardDescription className="text-xs text-(--brand-muted)">
            Kotak oranye di bagian paling bawah beranda yang mengarahkan
            pengunjung ke halaman kontak.
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-4">
          <FieldGroup className="flex flex-col gap-4">
            <Field>
              <FieldLabel htmlFor="cta-command">
                Perintah Terminal Strip
              </FieldLabel>
              <Input
                id="cta-command"
                value={formData.ctaCommand}
                onChange={(e) =>
                  onChange((prev) => ({
                    ...prev,
                    ctaCommand: e.target.value,
                  }))
                }
                placeholder="mis. bun run build"
                className="font-mono text-xs"
              />
            </Field>

            <Field>
              <FieldLabel htmlFor="cta-title">
                Judul Banner ({locale.toUpperCase()}) *
              </FieldLabel>
              <Textarea
                id="cta-title"
                required
                rows={2}
                value={
                  locale === 'en' ? formData.ctaTitleEn : formData.ctaTitleId
                }
                onChange={(e) =>
                  onChange((prev) => ({
                    ...prev,
                    [locale === 'en' ? 'ctaTitleEn' : 'ctaTitleId']:
                      e.target.value,
                  }))
                }
                placeholder="mis. Open to collaborations, side projects, and good conversations..."
              />
            </Field>

            <Field>
              <FieldLabel htmlFor="cta-button">
                Teks Tombol CTA ({locale.toUpperCase()}) *
              </FieldLabel>
              <Input
                id="cta-button"
                required
                value={
                  locale === 'en'
                    ? formData.ctaButtonTextEn
                    : formData.ctaButtonTextId
                }
                onChange={(e) =>
                  onChange((prev) => ({
                    ...prev,
                    [locale === 'en' ? 'ctaButtonTextEn' : 'ctaButtonTextId']:
                      e.target.value,
                  }))
                }
                placeholder="mis. Hubungi saya"
              />
            </Field>
          </FieldGroup>
        </CardContent>
      </Card>
    </div>
  )
}
