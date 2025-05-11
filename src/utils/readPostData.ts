import { IncomingMessage } from "node:http"

export default function readPostData (req: IncomingMessage) {
  return new Promise((resolve, reject) => {
    let body = ''
    req.on('data', (chunk) => {
      body += chunk
    })
    req.on('end', () => {
      resolve(body)
    })
  })
}