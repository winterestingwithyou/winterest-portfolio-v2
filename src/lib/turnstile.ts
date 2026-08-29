import { env as cfEnv } from 'cloudflare:workers'
import { FetchError, ofetch } from 'ofetch'

export interface TurnstileVerificationOptions {
  token: string | null | undefined
  action?: string
  request?: Request
  remoteip?: string
  secretKey?: string
  expectedHostnames?: string[]
}

export interface TurnstileVerificationResult {
  success: boolean
  error?: string
  errorCodes?: string[]
  hostname?: string
  action?: string
  challengeTs?: string
}

interface CloudflareTurnstileApiResponse {
  success: boolean
  'error-codes'?: string[]
  challenge_ts?: string
  hostname?: string
  action?: string
  cdata?: string
}

const DEFAULT_DEV_SECRET = '1x00000000000000000000000000000000UNASSIGNED'
const SITEVERIFY_URL =
  'https://challenges.cloudflare.com/turnstile/v0/siteverify'

/**
 * Validates a Cloudflare Turnstile token server-side via the official Siteverify API using ofetch.
 */
export async function verifyTurnstileToken(
  options: TurnstileVerificationOptions,
): Promise<TurnstileVerificationResult> {
  const { token, action, request, remoteip, secretKey, expectedHostnames } =
    options

  if (typeof token !== 'string' || !token.trim()) {
    return {
      success: false,
      error: 'Turnstile verification token is missing.',
      errorCodes: ['missing-input-response'],
    }
  }

  if (token.length > 2048) {
    return {
      success: false,
      error: 'Turnstile verification token exceeds maximum permitted length.',
      errorCodes: ['invalid-input-response'],
    }
  }

  const envDict = (typeof cfEnv !== 'undefined' ? cfEnv : {}) as Record<
    string,
    string | undefined
  >
  const effectiveSecret =
    secretKey ||
    envDict.TURNSTILE_SECRET_KEY ||
    process.env.TURNSTILE_SECRET_KEY ||
    DEFAULT_DEV_SECRET

  const rawHostnames =
    expectedHostnames ||
    (
      envDict.TURNSTILE_HOSTNAMES ||
      process.env.TURNSTILE_HOSTNAMES ||
      'localhost,127.0.0.1'
    )
      .split(',')
      .map((h) => h.trim().toLowerCase())
      .filter(Boolean)

  const allowedHostnamesSet = new Set(rawHostnames)

  const clientIp =
    remoteip ||
    request?.headers.get('cf-connecting-ip') ||
    request?.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ||
    undefined

  const bodyParams = new URLSearchParams({
    secret: effectiveSecret,
    response: token,
  })

  if (clientIp) {
    bodyParams.append('remoteip', clientIp)
  }

  try {
    const data = await ofetch<CloudflareTurnstileApiResponse>(SITEVERIFY_URL, {
      method: 'POST',
      body: bodyParams,
      retry: 0,
      timeout: 10_000,
    })

    if (!data.success) {
      return {
        success: false,
        error:
          'Security challenge verification failed. Please refresh and try again.',
        errorCodes: data['error-codes'] || ['verification-failed'],
      }
    }

    // Verify action match if an action was provided and returned
    if (action && data.action && data.action !== action) {
      return {
        success: false,
        error: 'Security challenge action mismatch.',
        errorCodes: ['action-mismatch'],
      }
    }

    // Verify hostname match if hostname was returned and allowed hostnames configured
    if (data.hostname && allowedHostnamesSet.size > 0) {
      const returnedHostname = data.hostname.toLowerCase()
      if (!allowedHostnamesSet.has(returnedHostname)) {
        console.warn(
          `Turnstile hostname mismatch: "${returnedHostname}" not in [${Array.from(allowedHostnamesSet).join(', ')}]`,
        )
        return {
          success: false,
          error: 'Security challenge origin mismatch.',
          errorCodes: ['hostname-mismatch'],
        }
      }
    }

    return {
      success: true,
      hostname: data.hostname,
      action: data.action,
      challengeTs: data.challenge_ts,
    }
  } catch (error) {
    if (error instanceof FetchError && error.status) {
      console.error(
        `Turnstile siteverify responded with HTTP status ${error.status}`,
      )
      return {
        success: false,
        error: 'Security challenge service temporarily unavailable.',
        errorCodes: [`http-${error.status}`],
      }
    }

    console.error('Turnstile verification request failed:', error)
    return {
      success: false,
      error: 'Security challenge verification encountered a network error.',
      errorCodes: ['network-error'],
    }
  }
}
