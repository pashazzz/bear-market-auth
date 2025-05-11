import { IncomingMessage, ServerResponse } from "node:http"

import readPostData from '@/utils/readPostData'
import { createUser } from '@/services/db'

export default async function create(req: IncomingMessage, res: ServerResponse) {
  const body = await readPostData(req)
  const { email, passHash } = JSON.parse(body as string)
  if (!email || !passHash) {
    res.statusCode = 400
    res.write('400 bad request')
    return res.end()
  }
  
  const result = createUser(email, passHash)
  if (!result) {
    res.statusCode = 500
    res.write('500 internal server error')
    return res.end()
  }

  res.statusCode = 200
  res.write('ok')
  return res.end()
}