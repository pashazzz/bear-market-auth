import path from 'path'
import { fileURLToPath } from 'url'
import { DatabaseSync } from 'node:sqlite'

import { IUser } from '@/interfaces/IUser'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const dbPath = path.join(__dirname, '..', '..', 'db', 'db.sqlite')

export const db = new DatabaseSync(dbPath)

export const fetchUserById = (id: string) => {
  return db.prepare('SELECT * FROM users WHERE id = ?').get(id)
}

export const fetchUserByEmail = (email: string) => {
  return db.prepare('SELECT * FROM users WHERE email = ?').get(email)
}

export const createUser = (email: string, passHash: string) => {
  const id = crypto.randomUUID()
  const createdAt = new Date().toISOString()
  const updatedAt = createdAt

  try {
    return db.prepare(`INSERT INTO users (id, displayName, email, passHash, roles, createdAt, updatedAt) VALUES ('${id}', '${email}', '${passHash}', '${createdAt}', '${updatedAt}'`).run()
  } catch (error) {
    console.error(error)
    new Error('Failed to create user', { cause: error })
  }
}

export default {
  db,
  fetchUserById,
  fetchUserByEmail,
  createUser,
}