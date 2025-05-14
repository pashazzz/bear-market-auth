import { IncomingMessage, ServerResponse } from "node:http"

import { getJsonBody } from '@/utils/reqData'
import { createJWT, verifyJWT, getPayload } from '@/utils/jwt'
import { fetchUserById } from '@/services/db'
import { sendError } from "@/services/api"
import { IJWTPayload } from "@/interfaces/IJWTPayload"

interface IRefreshBody {
  refreshToken: string
}

export default async function Refresh(req: IncomingMessage, res: ServerResponse) {
  let body: IRefreshBody
  try {
    body = await getJsonBody(req) as IRefreshBody
  } catch (err) {
    console.error(err)
    return sendError(res, 400, '400 Bad request')
  }

  const { refreshToken } = body
  if (!refreshToken) {
    return sendError(res, 400, '400 Bad request')
  }

  const recievedPayload = verifyJWT(refreshToken, process.env.JWT_REFERESH_SECRET as string);
  if (!recievedPayload) {
    return sendError(res, 400, '400 Invalid token')
  }

  const user = fetchUserById(recievedPayload.id)
  if (!user || user.refreshToken === null || user.refreshToken !== refreshToken) {
    return sendError(res, 400, '400 Invalid token')
  }

  const payload: IJWTPayload = getPayload({id: user.id as string, email: user.email as string})
  const token = createJWT(payload, process.env.JWT_SECRET as string)

  res.writeHead(200, { 'Content-Type': 'application/json' })
  res.end(JSON.stringify({ token }))

}