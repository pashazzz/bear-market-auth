import { IncomingMessage, ServerResponse } from "node:http"

import readPostData from '@/utils/readPostData'
import { fetchUserByEmail } from '@/services/db'

export default async function login(req: IncomingMessage, res: ServerResponse) {
  const body = await readPostData(req)
  const { email, passHash } = JSON.parse(body as string)
  if (!email || !passHash) {
    res.statusCode = 400
    res.write('400 bad request')
    return res.end()
  }

  const user = fetchUserByEmail(email)
  if (!user) {
    res.statusCode = 401
    res.write('401 unauthorized')
    return res.end()
  }

  res.statusCode = 200
  res.write('ok')
  res.end()
}