# Bear Market Auth service
## Overview
Bear Market is a project aimed at exploring various technologies under a common theme — trading bear cards. It includes multiple frontend and backend implementations.

This part of the Bear Market project is an authentication service built with Node.js, featuring a built-in web server and an SQLite database.

## Getting Started

### Prerequisites
- TypeScript must be installed globally or as a project dependency.

### Setup
Run the following command to initialize the project:
```bash
yarn run init
```
This command performs the following steps:
- `yarn run db:generate` - Generates and seeds the SQLite database.
- `yarn run gen:keypair` - Generates cryptographic key pairs used for JWT verification.

#### mTLS Verification
This service, like all internal services, requires mutual TLS (mTLS) verification for secure communication. This means that for any internal communication, both the client and server must present valid SSL certificates issued by a trusted Certificate Authority (CA). In our current setup, this CA is self-signed.

Certificates can be sourced in two ways:
1. Manually generated for this service and any other services it will communicate with.
2. Obtained from Bear Market's internal CA service, "TeddyTrust".

For this service to operate correctly with mTLS, the following files must be placed in the `/secrets/` directory:
- `auth-cert.pem`: The SSL certificate for this service, signed by the trusted CA.
- `auth-key.pem`: The private key corresponding to `auth-cert.pem` (used to create the certificate).
- `ca-cert.pem`: The public certificate of the trusted CA. This is used to verify the certificates presented by other services.

### Database
The project uses SQLite, which is natively supported in Node.js starting from version 22.5.0.

### Password Handling
This service only accepts password hashes. To ensure compatibility across different frontends and backends, all components should use a unified secret key or salt for hashing passwords.

