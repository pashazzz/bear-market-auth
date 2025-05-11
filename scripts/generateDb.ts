import path from 'path'
import { fileURLToPath } from 'url'
import { DatabaseSync } from 'node:sqlite'

import { users } from '../db/seeds'
import { IUser } from '@/interfaces/IUser'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const dbPath = path.join(__dirname, '..', 'db', 'db.sqlite')

const db = new DatabaseSync(dbPath)

const prepareQuery = (user: IUser) => {
  const { id, username, email, passHash, roles, createdAt, updatedAt } = user
  return `INSERT INTO users (id, username, email, pass_hash, roles, created_at, updated_at) VALUES ('${id}', '${username}', '${email}', '${passHash}', '${roles}', '${createdAt}', '${updatedAt}');`
}

// create table
db.exec(`CREATE TABLE IF NOT EXISTS users (
  id TEXT PRIMARY KEY NOT NULL,
  username TEXT NOT NULL,
  email TEXT NOT NULL,
  pass_hash TEXT NOT NULL,
  roles TEXT NOT NULL,
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL
);`)

// clear table
db.exec(`DELETE FROM users`)

// seed
users.forEach(user => {
  db.exec(prepareQuery(user))
})

db.close()