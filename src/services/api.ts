import { ServerResponse } from "node:http"

export function sendError(res: ServerResponse, code: number, message: string) {
  res.statusCode = code
  res.write(message)
  res.end()
}