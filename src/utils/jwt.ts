import crypto from 'crypto'

import { IJWTPayload } from '@/interfaces/IJWTPayload'

function base64url(input: string): string {
  return Buffer.from(input)
    .toString('base64')
    .replace(/=/g, '')
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
}

function getSignature(payload: string, secret: string): string {
  return crypto
    .createHmac('sha256', secret)
    .update(payload)
    .digest('base64')
    .replace(/=/g, '')
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
}

export function createJWT(payload: IJWTPayload, secret: string): string {
  const header = {
    alg: 'HS256',
    typ: 'JWT',
  }

  const headerEncoded = base64url(JSON.stringify(header))
  const payloadEncoded = base64url(JSON.stringify(payload))

  const signature = getSignature(`${headerEncoded}.${payloadEncoded}`, secret)

  return `${headerEncoded}.${payloadEncoded}.${signature}`
}

export function verifyJWT(token: string, secret: string): IJWTPayload | null {
  const [header, payload, signature] = token.split('.')

  if (!header || !payload || !signature) {
    return null
  }

  if (header !== base64url(JSON.stringify({ alg: 'HS256', typ: 'JWT' }))) {
    return null
  }

  let payloadDecoded
  try {
    payloadDecoded = JSON.parse(Buffer.from(payload, 'base64').toString())
  } catch (error) {
    return null
  }

  if (payloadDecoded.exp < Date.now() / 1000) {
    return null
  }

  const expectedSignature = getSignature(`${header}.${payload}`, secret)

  if (expectedSignature !== signature) {
    return null
  }

  return payloadDecoded
}