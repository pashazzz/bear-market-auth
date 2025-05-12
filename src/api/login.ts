import { IncomingMessage, ServerResponse } from "node:http"

import { getJsonBody } from '@/utils/reqData'
import { createJWT } from '@/utils/jwt'
import { fetchUserByEmail } from '@/services/db'
import { IJWTPayload } from "@/interfaces/IJWTPayload"

interface ILoginBody {
  email: string
  passHash: string
}

export default async function login(req: IncomingMessage, res: ServerResponse) {
  let body: ILoginBody
  try {
    body = await getJsonBody(req) as ILoginBody
  } catch (error) {
    res.statusCode = 400
    res.write('400 bad request')
    return res.end()
  }

  const { email, passHash } = body
  if (!email || !passHash) {
    res.statusCode = 400
    res.write('400 bad request')
    return res.end()
  }

  const user = fetchUserByEmail(email)
  if (!user || user.passHash !== passHash) {
    res.statusCode = 401
    res.write('401 unauthorized')
    return res.end()
  }

  const payload: IJWTPayload = {
    id: user.id as string,
    email: user.email as string,
    iat: new Date().getTime(),
    exp: new Date().getTime() + 1000 * 60 * 60 * 24 * 7, // 1 week
  }
  const secret = process.env.JWT_SECRET as string

  const token = createJWT(payload, secret)

  res.setHeader('Set-Cookie', `token=${token}`)
  res.writeHead(200, { 'Content-Type': 'application/json' })
  res.end(JSON.stringify(token))
}