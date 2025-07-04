import { IncomingMessage, ServerResponse } from "node:http"

import { getJsonBody } from '@/utils/reqData'
import { createJWT, getPayload } from '@/utils/jwt'
import { sendError } from "@/services/api"
import { createUser, sql } from '@/services/db'
import { IJWTPayload } from "@/interfaces/IJWTPayload"

interface ICreateBody {
  email: string
  pHash: string
}

export default async function create(req: IncomingMessage, res: ServerResponse) {
  // checks
  let body: ICreateBody | null
  try {
    body = await getJsonBody(req) as ICreateBody | null
  } catch (err) {
    console.error(err)
    return sendError(res, 400, '400 Bad request')
  }

  if (!body) {
    return sendError(res, 400, '400 Bad request')
  }

  const { email, pHash } = body
  if (!email || !pHash) {
    return sendError(res, 400, '400 Bad request')
  }
  
  // try to create user
  let result: { id: string, email: string } | Error
  try {
    result = createUser(email, pHash)
  } catch (err) {
    console.error(err)
    return sendError(res, 500, '500 Internal server error')
  }
  if (!result || result instanceof Error) {
    if (result instanceof Error && result.message === 'User already exists') {
      return sendError(res, 409, '409 User already exists')
    }
    return sendError(res, 500, result.message)
  }

  // create tokens
  const oneMonthLater = new Date().getTime() + 1000 * 60 * 60 * 24 * 30
  const payload: IJWTPayload = getPayload({id: result.id, email: result.email})

  const token = createJWT(payload, process.env.JWT_SECRET as string)
  const refreshToken = createJWT({...payload, exp: oneMonthLater}, process.env.JWT_REFERESH_SECRET as string)

  sql(`UPDATE users SET refreshToken = '${refreshToken}' WHERE id = '${result.id}'`).run()

  res.writeHead(200, { 'Content-Type': 'application/json' })
  res.end(JSON.stringify({token, refreshToken}))
}