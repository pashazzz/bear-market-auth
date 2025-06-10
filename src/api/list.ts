import { IncomingMessage, ServerResponse } from "node:http"

import { getJsonBody } from '@/utils/reqData'
import { sendError } from "@/services/api"
import { fetchUsers } from '@/services/db'

interface IListBody {
  search?: string
  limit?: number
  offset?: number
}

export default async function List(req: IncomingMessage, res: ServerResponse) {
  // checks
  let body: IListBody
  try {
    body = await getJsonBody(req) as IListBody
  } catch (err) {
    console.error(err)
    return sendError(res, 400, '400 Bad request')
  }
  const search = body?.search ?? undefined
  const limit = body?.limit ?? undefined
  const offset = body?.offset ?? undefined

  res.writeHead(200, { 'Content-Type': 'application/json' })
  res.end(JSON.stringify(fetchUsers({search, limit, offset})))
}