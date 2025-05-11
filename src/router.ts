import { IncomingMessage, ServerResponse } from "node:http"

import logger from "@/middlewares/logger"

import login from "@/api/login"
import create from "@/api/create"

interface IRouter {
  [key: string]: {
    method: string
    action: (req: IncomingMessage, res: ServerResponse) => void
  }
}

export default function router(req: IncomingMessage, res: ServerResponse) {
  logger(req, res, () => {})

  const routes: IRouter = {
    '/login': {
      method: 'POST',
      action: login,
    },
    '/create': {
      method: 'POST',
      action: create,
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