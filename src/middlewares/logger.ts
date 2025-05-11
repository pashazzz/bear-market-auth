import { IncomingMessage, ServerResponse } from "node:http"

export default function logger(req: IncomingMessage, res: ServerResponse, next: () => void) {
  console.log(req.method, req.url)

  next()
}