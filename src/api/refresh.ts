import { IncomingMessage, ServerResponse } from "node:http"

import { getJsonBody } from '@/utils/reqData'
import { createJWT, verifyJWT } from '@/utils/jwt'
import { fetchUserById, sql } from '@/services/db'
import { IJWTPayload } from "@/interfaces/IJWTPayload"

interface IRefreshBody {
  refreshToken: string
}

export default async function Refresh(req: IncomingMessage, res: ServerResponse) {
  let body: IRefreshBody
  try {
    body = await getJsonBody(req) as IRefreshBody
  } catch (error) {
    res.statusCode = 400
    res.write('400 bad request')
    return res.end()
  }

  const { refreshToken } = body
  if (!refreshToken) {
    res.statusCode = 400
    res.write('400 bad request')
    return res.end()
  }

  const recievedPayload = verifyJWT(refreshToken, process.env.JWT_REFERESH_SECRET as string);
  if (!recievedPayload) {
    res.statusCode = 400
    res.write('400 Invalid token')
    return res.end()
  }

  const user = fetchUserById(recievedPayload.id)
  if (!user || user.refreshToken === null || user.refreshToken !== refreshToken) {
    res.statusCode = 400
    res.write('400 Mismatch')
    return res.end()
  }

  const now = new Date().getTime()
  const oneDay = 1000 * 60 * 60 * 24
  const payload: IJWTPayload = {
    id: user.id as string,
    email: user.email as string,
    iat: new Date().getTime(),
    exp: now + oneDay,
  }
  const token = createJWT(payload, process.env.JWT_SECRET as string)

  res.writeHead(200, { 'Content-Type': 'application/json' })
  res.end(JSON.stringify({ token }))

}