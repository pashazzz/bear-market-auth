import { IncomingMessage, ServerResponse } from "node:http"

import { getJsonBody } from '@/utils/reqData'
import { createUser } from '@/services/db'

interface ICreateBody {
  email: string
  passHash: string
}

export default async function create(req: IncomingMessage, res: ServerResponse) {
  let body: ICreateBody
  try {
    body = await getJsonBody(req) as ICreateBody
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