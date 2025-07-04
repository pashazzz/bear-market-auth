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
  // checks
  let body: IRefreshBody | null
  try {
    body = await getJsonBody(req) as IRefreshBody | null
  } catch (err) {
    console.error(err)
    return sendError(res, 400, '400 Bad request')
  }
  if (!body) {
    return sendError(res, 400, '400 Bad request')
  }

  const { refreshToken } = body
  if (!refreshToken) {
    console.error('!refreshToken', !refreshToken)
    return sendError(res, 400, '400 Bad request')
  }

  const recievedPayload = verifyJWT(refreshToken, process.env.JWT_REFERESH_SECRET as string);
  if (!recievedPayload) {
    console.error('!recievedPayload', !recievedPayload)
    return sendError(res, 400, '400 Invalid token')
  }

  const user = fetchUserById(recievedPayload.id)
  if (!user || user.refreshToken === null || user.refreshToken !== refreshToken) {
    console.error('!user || user.refreshToken === null || user.refreshToken !== refreshToken', user)
    return sendError(res, 400, '400 Invalid token')
  }

  // create tokens
  const payload: IJWTPayload = getPayload({id: user.id as string, email: user.email as string})
  const token = createJWT(payload, process.env.JWT_SECRET as string)

  res.writeHead(200, { 'Content-Type': 'application/json' })
  res.end(JSON.stringify({ token }))

}