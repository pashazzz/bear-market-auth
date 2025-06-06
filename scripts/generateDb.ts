import path from 'path'
import { fileURLToPath } from 'url'
import { DatabaseSync } from 'node:sqlite'

import { getUsers } from '../db/seeds'
import { IUser } from '@/interfaces/IUser'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const dbFilename = process.env.NODE_ENV === 'test' ? 'test.sqlite' : 'auth.sqlite'
const dbPath = path.join(__dirname, '..', 'db', dbFilename)

const db = new DatabaseSync(dbPath)

const prepareQuery = (user: IUser) => {
  const { id, email, salt, passHash, createdAt, updatedAt } = user
  return `INSERT INTO users (id, email, salt, passHash, createdAt, updatedAt) VALUES ('${id}', '${email}', '${salt}', '${passHash}', '${createdAt}', '${updatedAt}');`
}

// drop table
db.exec(`DROP TABLE IF EXISTS users`)

// create table
db.exec(`CREATE TABLE users (
  id TEXT PRIMARY KEY NOT NULL,
  email TEXT NOT NULL UNIQUE,
  salt TEXT NOT NULL,
  passHash TEXT NOT NULL,
  refreshToken TEXT NULL,
  createdAt TEXT NOT NULL,
  updatedAt TEXT NOT NULL
);`)

// seed
getUsers().forEach(user => {
  db.exec(prepareQuery({...user, passHash: user!.passHash as string}))
})

db.close()