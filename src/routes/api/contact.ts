import { createFileRoute } from '@tanstack/react-router'
import { env as cfEnv } from 'cloudflare:workers'
import { Resend } from 'resend'

import { contactSchema } from '#/features/contact/validation'
import { siteProfile } from '#/features/portfolio/data'
import { verifyTurnstileToken } from '#/lib/turnstile'

export const Route = createFileRoute('/api/contact')({
  server: {
    handlers: {
      POST: async ({ request }) => {
        try {
          const body = await request.json()
          const payload =
            typeof body === 'object' && body !== null
              ? { subject: '', turnstileToken: '', ...body }
              : body
          const validation = contactSchema.safeParse(payload)

          if (!validation.success) {
            const firstError =
              validation.error.issues[0]?.message || 'Invalid input data.'
            return Response.json({ error: firstError }, { status: 400 })
          }

          const { name, email, subject, message, turnstileToken } = validation.data

          // Canonical Turnstile verification
          const verification = await verifyTurnstileToken({
            token:
              turnstileToken ||
              request.headers.get('cf-turnstile-response') ||
              '',
            action: 'contact',
            request,
          })

          if (!verification.success) {
            return Response.json(
              { error: verification.error || 'Security challenge failed.' },
              { status: 403 },
            )
          }

          // Retrieve API key from Cloudflare Workers bindings or process environment
          const envDict = (typeof cfEnv !== 'undefined' ? cfEnv : {}) as Record<
            string,
            string | undefined
          >
          const resendApiKey =
            envDict.RESEND_API_KEY || process.env.RESEND_API_KEY

          if (!resendApiKey) {
            console.error('RESEND_API_KEY is not configured in environment.')
            return Response.json(
              {
                error:
                  'Email service is currently unconfigured. Please contact via social media.',
              },
              { status: 500 },
            )
          }

          const fromEmail =
            envDict.RESEND_FROM_EMAIL ||
            process.env.RESEND_FROM_EMAIL ||
            'Winterest Portfolio <onboarding@resend.dev>'
          const toEmail =
            envDict.RESEND_TO_EMAIL ||
            process.env.RESEND_TO_EMAIL ||
            siteProfile.contactEmail

          const mailSubject = subject
            ? `[Portfolio Contact] ${subject}`
            : `[Portfolio Contact] Message from ${name}`

          const resend = new Resend(resendApiKey)

          const htmlContent = `
            <!DOCTYPE html>
            <html>
              <head>
                <meta charset="utf-8">
                <style>
                  body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; color: #1c1c1c; line-height: 1.6; padding: 20px; }
                  .container { max-width: 600px; margin: 0 auto; border: 1px solid #eaeaea; rounded-radius: 12px; padding: 24px; background: #ffffff; }
                  .header { border-bottom: 2px solid #f48120; padding-bottom: 12px; margin-bottom: 20px; }
                  .header h2 { margin: 0; color: #f48120; font-size: 20px; }
                  .field { margin-bottom: 16px; }
                  .field-label { font-size: 12px; font-weight: bold; text-transform: uppercase; color: #666666; margin-bottom: 4px; }
                  .field-value { font-size: 15px; background: #f9f9f9; padding: 10px 14px; border-radius: 8px; border: 1px solid #eeeeee; }
                  .message-box { white-space: pre-wrap; font-size: 15px; background: #fafafa; padding: 16px; border-radius: 8px; border-left: 4px solid #f48120; }
                  .footer { font-size: 12px; color: #888888; margin-top: 24px; border-top: 1px solid #eeeeee; padding-top: 12px; text-align: center; }
                </style>
              </head>
              <body>
                <div class="container">
                  <div class="header">
                    <h2>New Message from Winterest Portfolio</h2>
                  </div>
                  <div class="field">
                    <div class="field-label">Sender Name</div>
                    <div class="field-value">${escapeHtml(name)}</div>
                  </div>
                  <div class="field">
                    <div class="field-label">Sender Email</div>
                    <div class="field-value"><a href="mailto:${escapeHtml(email)}">${escapeHtml(email)}</a></div>
                  </div>
                  ${
                    subject
                      ? `
                  <div class="field">
                    <div class="field-label">Subject</div>
                    <div class="field-value">${escapeHtml(subject)}</div>
                  </div>`
                      : ''
                  }
                  <div class="field">
                    <div class="field-label">Message</div>
                    <div class="message-box">${escapeHtml(message)}</div>
                  </div>
                  <div class="footer">
                    Sent via Winterest Personal Portfolio Contact Form
                  </div>
                </div>
              </body>
            </html>
          `

          const emailResult = await resend.emails.send({
            from: fromEmail,
            to: [toEmail],
            replyTo: email,
            subject: mailSubject,
            html: htmlContent,
          })

          if (emailResult.error) {
            console.error('Resend API error:', emailResult.error)
            return Response.json(
              { error: emailResult.error.message || 'Failed to send email.' },
              { status: 500 },
            )
          }

          return Response.json({
            success: true,
            id: emailResult.data.id,
          })
        } catch (error) {
          console.error('Contact API endpoint error:', error)
          return Response.json(
            { error: 'An unexpected error occurred while sending message.' },
            { status: 500 },
          )
        }
      },
    },
  },
})

function escapeHtml(str: string): string {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;')
}
