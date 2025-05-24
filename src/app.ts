import { createServer } from 'node:https'
import { readFileSync } from 'node:fs'
import path from 'path'
import { fileURLToPath } from 'url'
import dotenv from 'dotenv'

import router from '@/router'

dotenv.config()
const __dirname = path.dirname(fileURLToPath(import.meta.url))

const server = createServer({
  key: readFileSync(path.join(__dirname, '..', 'secrets', 'auth-key.pem')),
  cert: readFileSync(path.join(__dirname, '..', 'secrets', 'auth-cert.pem')),
  ca: readFileSync(path.join(__dirname, '..', 'secrets', 'ca-cert.pem')),
  requestCert: true,
  rejectUnauthorized: true,
})

server.on('error', (err) => console.error(err));

server.on('request', router)

const port = process.env.PORT || 3030
server.listen(port, () => {
  console.log(`Listening on port ${port}`)
})