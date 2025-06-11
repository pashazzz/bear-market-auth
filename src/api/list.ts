import { IncomingMessage, ServerResponse } from "node:http"

import { getJsonBody } from '@/utils/reqData'
import { sendError } from "@/services/api"
import { fetchUsers, sql } from '@/services/db'

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

  const users = fetchUsers({search, limit, offset})
  const count = sql(`SELECT COUNT(*) as total FROM users`).get()
  res.writeHead(200, { 'Content-Type': 'application/json' })
  res.end(JSON.stringify({ users, total: count?.total ?? 0 }))
}