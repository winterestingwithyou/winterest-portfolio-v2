import { z } from 'zod'

export const contactSchema = z.object({
  name: z.string().trim().min(1, 'Nama wajib diisi.'),
  email: z.string().trim().email('Format email tidak valid.'),
  subject: z.string().trim(),
  message: z.string().trim().min(10, 'Pesan minimal 10 karakter.'),
  turnstileToken: z.string(),
})

export type ContactInput = z.infer<typeof contactSchema>
