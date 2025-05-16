import path from 'path'
import { fileURLToPath } from 'url'
import { DatabaseSync } from 'node:sqlite'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const dbFilename = process.env.NODE_ENV === 'test' ? 'test.sqlite' : 'auth.sqlite'
const dbPath = path.join(__dirname, '..', '..', 'db', dbFilename)

export const db = new DatabaseSync(dbPath)

export const sql = (sql: string) => {
  return db.prepare(sql).run()
}

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
    db.prepare(`INSERT
      INTO users (id, email, passHash, createdAt, updatedAt)
      VALUES ('${id}', '${email}', '${passHash}', '${createdAt}', '${updatedAt}')`).run()
  } catch (error) {
    if ((error as Error).message === 'UNIQUE constraint failed: users.email') {
      return new Error('User already exists', { cause: error })
    }
    return new Error('Failed to create user', { cause: error })
  }
  return {id, email}
}

export default {
  db,
  fetchUserById,
  fetchUserByEmail,
  createUser,
}