import { IncomingMessage } from "node:http"

export const getJsonBody = async (req: IncomingMessage): Promise<any> => {
  return new Promise((resolve, reject) => {
    let body = ''
    req.on('data', (chunk) => {
      body += chunk
    })

    req.on('end', () => {
      if (!body) {
        reject(new Error('no body'))
      }

      try {
        resolve(JSON.parse(body))
      } catch (error) {
        reject(new Error('invalid json'))
      }
    })
  })
}