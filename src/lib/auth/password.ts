const HASH_VERSION = 'pbkdf2-v1'
const HASH_ALGORITHM = 'SHA-256'
const HASH_ITERATIONS = 120_000
const SALT_BYTES = 16
const KEY_BYTES = 32

const encoder = new TextEncoder()

export async function hashPassword(password: string): Promise<string> {
  const salt = crypto.getRandomValues(new Uint8Array(SALT_BYTES))
  const key = await derivePasswordKey(password, salt, HASH_ITERATIONS)

  return [
    HASH_VERSION,
    HASH_ITERATIONS.toString(),
    base64UrlEncode(salt),
    base64UrlEncode(key),
  ].join('$')
}

export async function verifyPassword({
  hash,
  password,
}: {
  hash: string
  password: string
}): Promise<boolean> {
  const [version, iterationsValue, saltValue, keyValue] = hash.split('$')

  if (version !== HASH_VERSION || !iterationsValue || !saltValue || !keyValue) {
    return false
  }

  const iterations = Number(iterationsValue)

  if (!Number.isSafeInteger(iterations) || iterations < 1) {
    return false
  }

  const salt = base64UrlDecode(saltValue)
  const expected = base64UrlDecode(keyValue)
  const actual = await derivePasswordKey(password, salt, iterations)

  return timingSafeEqual(actual, expected)
}

async function derivePasswordKey(
  password: string,
  salt: Uint8Array,
  iterations: number,
): Promise<Uint8Array> {
  const passwordBytes = toArrayBufferBytes(encoder.encode(password))
  const saltBytes = toArrayBufferBytes(salt)
  const baseKey = await crypto.subtle.importKey(
    'raw',
    passwordBytes,
    'PBKDF2',
    false,
    ['deriveBits'],
  )
  const bits = await crypto.subtle.deriveBits(
    {
      name: 'PBKDF2',
      hash: HASH_ALGORITHM,
      salt: saltBytes,
      iterations,
    },
    baseKey,
    KEY_BYTES * 8,
  )

  return new Uint8Array(bits)
}

function toArrayBufferBytes(bytes: Uint8Array): Uint8Array<ArrayBuffer> {
  const copy = new Uint8Array(bytes.byteLength)
  copy.set(bytes)
  return copy
}

function timingSafeEqual(actual: Uint8Array, expected: Uint8Array): boolean {
  if (actual.byteLength !== expected.byteLength) {
    return false
  }

  let diff = 0

  for (let index = 0; index < actual.byteLength; index += 1) {
    diff |= actual[index] ^ expected[index]
  }

  return diff === 0
}

function base64UrlEncode(bytes: Uint8Array): string {
  let binary = ''

  for (const byte of bytes) {
    binary += String.fromCharCode(byte)
  }

  return btoa(binary)
    .replaceAll('+', '-')
    .replaceAll('/', '_')
    .replace(/=+$/, '')
}

function base64UrlDecode(value: string): Uint8Array {
  const normalized = value.replaceAll('-', '+').replaceAll('_', '/')
  const padded = normalized.padEnd(
    normalized.length + ((4 - (normalized.length % 4)) % 4),
    '=',
  )
  const binary = atob(padded)
  const bytes = new Uint8Array(binary.length)

  for (let index = 0; index < binary.length; index += 1) {
    bytes[index] = binary.charCodeAt(index)
  }

  return bytes
}
