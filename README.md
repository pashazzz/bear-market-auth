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
- `yarn run gen:certs` - Generates TLS certificates, or use your own if preferred.

## Database
The project uses SQLite, which is natively supported in Node.js starting from version 22.5.0.

## Password Handling
This service only accepts password hashes. To ensure compatibility across different frontends and backends, all components should use a unified secret key or salt for hashing passwords.
