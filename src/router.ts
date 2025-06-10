import { IncomingMessage, ServerResponse } from "node:http"

import logger from "@/middlewares/logger"
import mtlsValidate from "@/middlewares/mtls"

import Login from "@/api/login"
import Refresh from "@/api/refresh"
import Create from "@/api/create"
import List from "@/api/list"

interface IRouter {
  [key: string]: {
    method: string
    action: (req: IncomingMessage, res: ServerResponse) => void
  }
}

export default function router(req: IncomingMessage, res: ServerResponse) {
  logger(req, res, () => {})
  mtlsValidate(req, res, () => {})

  const routes: IRouter = {
    '/login': {
      method: 'POST',
      action: Login,
    },
    '/refresh': {
      method: 'POST',
      action: Refresh,
    },
    '/create': {
      method: 'POST',
      action: Create,
    },
    '/list': {
      method: 'POST',
      action: List,
    },
  }

  if (!routes[req.url as string]) {
    res.statusCode = 404
    res.write('404 not found')
    res.end()
    return
  }
  if (req.method !== routes[req.url as string].method) {
    res.statusCode = 405
    res.write('405 method not allowed')
    res.end()
    return
  }

  routes[req.url as string].action(req, res)
}