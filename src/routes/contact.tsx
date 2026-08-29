import { createFileRoute } from '@tanstack/react-router'

import { ContactPage } from '#/features/contact/pages/contact-page'

export const Route = createFileRoute('/contact')({
  component: ContactPage,
})
