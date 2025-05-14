import { IncomingMessage, ServerResponse } from "node:http"

import { getJsonBody } from '@/utils/reqData'
import { createJWT } from '@/utils/jwt'
import { fetchUserByEmail, sql } from '@/services/db'
import { IJWTPayload } from "@/interfaces/IJWTPayload"

interface ILoginBody {
  email: string
  passHash: string
}

export default async function Login(req: IncomingMessage, res: ServerResponse) {
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

  const now = new Date().getTime()
  const oneDay = 1000 * 60 * 60 * 24
  const payload: IJWTPayload = {
    id: user.id as string,
    email: user.email as string,
    iat: new Date().getTime(),
    exp: now + oneDay,
  }

  const token = createJWT(payload, process.env.JWT_SECRET as string)
  const refreshToken = createJWT({...payload, exp: now + oneDay * 30}, process.env.JWT_REFERESH_SECRET as string)

  sql(`UPDATE users SET refreshToken = '${refreshToken}' WHERE id = '${user.id}'`)

  res.writeHead(200, { 'Content-Type': 'application/json' })
  res.end(JSON.stringify({token, refreshToken}))
}