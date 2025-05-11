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
  const { id, displayName, email, passHash, roles, createdAt, updatedAt } = user
  return `INSERT INTO users (id, displayName, email, passHash, roles, createdAt, updatedAt) VALUES ('${id}', '${displayName}', '${email}', '${passHash}', '${roles}', '${createdAt}', '${updatedAt}');`
}

// drop table
db.exec(`DROP TABLE IF EXISTS users`)

// create table
db.exec(`CREATE TABLE users (
  id TEXT PRIMARY KEY NOT NULL,
  displayName TEXT,
  email TEXT NOT NULL UNIQUE,
  passHash TEXT NOT NULL,
  roles TEXT NOT NULL,
  createdAt TEXT NOT NULL,
  updatedAt TEXT NOT NULL
);`)

// seed
users.forEach(user => {
  db.exec(prepareQuery(user))
})

db.close()