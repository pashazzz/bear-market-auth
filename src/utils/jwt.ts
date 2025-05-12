import crypto from 'crypto'

import { IJWTPayload } from '@/interfaces/IJWTPayload'

function base64url(input: string): string {
  return Buffer.from(input)
    .toString('base64')
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

  const data = `${headerEncoded}.${payloadEncoded}`

  const signature = crypto
    .createHmac('sha256', secret)
    .update(data)
    .digest('base64')
    .replace(/=/g, '')
    .replace(/\+/g, '-')
    .replace(/\//g, '_')

  return `${data}.${signature}`
}