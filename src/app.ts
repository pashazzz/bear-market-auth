import { createServer } from 'node:https'
import { readFileSync } from 'node:fs'
import path from 'path'
import { fileURLToPath } from 'url'

import router from '@/router'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

const server = createServer({
  key: readFileSync(path.join(__dirname, '..', 'secrets', 'localhost-privkey.pem')),
  cert: readFileSync(path.join(__dirname, '..', 'secrets', 'localhost-cert.pem')),
})

server.on('error', (err) => console.error(err));

server.on('request', router)

const port = process.env.PORT || 3030
server.listen(port, () => {
  console.log(`Listening on port ${port}`)
})