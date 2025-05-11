import { IncomingMessage, ServerResponse } from "node:http"

import logger from "@/middlewares/logger"
import login from "@/api/login"

interface IRouter {
  [key: string]: (req: IncomingMessage, res: ServerResponse) => void
}

export default function router(req: IncomingMessage, res: ServerResponse) {
  logger(req, res, () => {})

  const routes: IRouter = {
    '/login': login,
  }

  if (!routes[req.url as string]) {
    res.statusCode = 404
    res.end()
    return
  }
  routes[req.url as string](req, res)
}