import { IncomingMessage, ServerResponse } from "node:http"
import { TLSSocket } from "node:tls"

export default function mtlsValidate(req: IncomingMessage, res: ServerResponse, next: () => void) {
  const socket = req.socket as TLSSocket
  const clientCert = socket.getPeerCertificate()
  if (socket.authorized) {
    console.log('Client authorized:', clientCert.subject.CN)
    return next()
    // res.writeHead(200)
    // res.end(`Hello ${clientCert.subject.CN}, your certificate was issued by ${clientCert.issuer.CN}!\n`)
  }
  if (clientCert && Object.keys(clientCert).length) {
    console.warn('Client presented an unauthorized certificate:', clientCert.subject.CN)
    res.writeHead(403)
    res.end(`Client certificate unauthorized. Issuer: ${clientCert.issuer.CN}, Error: ${socket.authorizationError}\n`)
    return
  }
  console.warn('Client did not provide a certificate.');
  res.writeHead(401);
  res.end('Client certificate required.\n');
  return
}