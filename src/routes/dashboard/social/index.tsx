import { createFileRoute } from '@tanstack/react-router'

import { SocialPage } from '#/features/social/pages/social-page'

export const Route = createFileRoute('/dashboard/social/')({
  component: SocialPage,
})
