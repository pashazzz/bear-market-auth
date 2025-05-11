import { IncomingMessage, ServerResponse } from "node:http"

export default function login(req: IncomingMessage, res: ServerResponse) {
  res.write('login')
  res.end()
}