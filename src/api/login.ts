import { IncomingMessage, ServerResponse } from "node:http"
import * as crypto from 'node:crypto'

import { getJsonBody } from '@/utils/reqData'
import { createJWT, getPayload } from '@/utils/jwt'
import { fetchUserByEmail, sql } from '@/services/db'
import { sendError } from "@/services/api"
import { IJWTPayload } from "@/interfaces/IJWTPayload"

interface ILoginBody {
  email: string
  pHash: string
}

export default async function Login(req: IncomingMessage, res: ServerResponse) {
  // checks
  let body: ILoginBody | null
  try {
    body = await getJsonBody(req) as ILoginBody | null
  } catch (err) {
    console.error(err)
    return sendError(res, 400, '400 Bad request')
  }
  if (!body) {
    return sendError(res, 400, '400 Bad request')
  }

  const { email, pHash } = body
  if (!email || !pHash) {
    console.log('!email || !pHash', !email, !pHash)
    return sendError(res, 400, '400 Bad request')
  }

  const user = fetchUserByEmail(email)
  if (!user) {
    return sendError(res, 401, '401 Unauthorized')
  }
  const passHash = crypto.pbkdf2Sync(pHash, user.salt as string + user.createdAt as string, 100000, 32, 'sha512').toString('hex')

  if (passHash !== user.passHash as string) {
    return sendError(res, 401, '401 Unauthorized')
  }

  // create tokens
  const oneMonthLater = new Date().getTime() + 1000 * 60 * 60 * 24 * 30
  const payload: IJWTPayload = getPayload({id: user.id as string, email: user.email as string})

  const token = createJWT(payload, process.env.JWT_SECRET as string)
  const refreshToken = createJWT({...payload, exp: oneMonthLater}, process.env.JWT_REFERESH_SECRET as string)

  sql(`UPDATE users SET refreshToken = '${refreshToken}' WHERE id = '${user.id}'`)

  res.writeHead(200, { 'Content-Type': 'application/json' })
  res.end(JSON.stringify({token, refreshToken}))
}