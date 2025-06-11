import path from 'path'
import { fileURLToPath } from 'url'
import * as crypto from 'node:crypto'
import { DatabaseSync } from 'node:sqlite'

import { IUserDTO, UserDTO } from '@/interfaces/IUser'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const dbFilename = process.env.NODE_ENV === 'test' ? 'test.sqlite' : 'auth.sqlite'
const dbPath = path.join(__dirname, '..', '..', 'db', dbFilename)

export const db = new DatabaseSync(dbPath)

export const sql = (sql: string) => {
  return db.prepare(sql)
}

interface IFetchUsersProps {
  search?: string
  limit?: number
  offset?: number
}

export const fetchUsers = ({search, limit, offset}: IFetchUsersProps): IUserDTO[] => {
  let conds = ''
  conds += search ? `WHERE email LIKE '%${search}%'` : ''
  if (!limit) {
    limit = 30
  }
  conds += limit ? `LIMIT ${limit}` : ''
  conds += offset ? `OFFSET ${offset}` : ''

  const fields = Object.keys(UserDTO).map(prop => `users.${prop}`)
  return db.prepare(`SELECT ${fields.join(', ')} FROM users ${conds}`).all() as unknown as IUserDTO[]
}

export const fetchUserById = (id: string) => {
  return db.prepare('SELECT * FROM users WHERE id = ?').get(id)
}

export const fetchUserByEmail = (email: string) => {
  return db.prepare('SELECT * FROM users WHERE email = ?').get(email)
}

export const createUser = (email: string, pHash: string) => {
  const id = crypto.randomUUID()
  const createdAt = new Date().toISOString()
  const updatedAt = createdAt
  const salt = crypto.randomBytes(32).toString('hex')
  const passHash = crypto.pbkdf2Sync(pHash, salt + createdAt, 100000, 32, 'sha512').toString('hex')

  try {
    db.prepare(`INSERT
      INTO users (id, email, salt, passHash, createdAt, updatedAt)
      VALUES ('${id}', '${email}', '${salt}', '${passHash}', '${createdAt}', '${updatedAt}')`).run()
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