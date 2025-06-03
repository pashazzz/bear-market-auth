import crypto from 'crypto'
import dotenv from 'dotenv'

dotenv.config()

const createPassHash = (password: string, salt: string) => {
  const passHash = crypto.pbkdf2Sync(password, salt, 100000, 32, 'sha512').toString('hex')
  return passHash
}

interface IUser {
  id: string
  email: string
  salt: string
  passHash?: string
  createdAt: string
  updatedAt: string
}

export const getUsers = () => {
  const users: IUser[] = [
    // password: admin
    {
      "id": "6576e515-85e8-433f-b71c-57834a5f5d77",
      "email": "admin@admin.com",
      "salt": "5ac01d43259f2f817d64295a6e90642d029d0ce84e6feafe51f2949388643c95",
      "createdAt": "2023-01-01T00:00:00.000Z",
      "updatedAt": "2023-01-01T00:00:00.000Z"
    },
    // password: user
    {
      "id": "c907507f-8861-4033-9ef5-4fd3ad3e32e4",
      "email": "user@user.com",
      "salt": "54dc8375c0efaee66603c2c947a9c642a14e1d96d61ded5a89c1f87ee12eb723",
      "createdAt": "2023-01-01T00:00:00.000Z",
      "updatedAt": "2023-01-01T00:00:00.000Z"
    },
    // password: guest
    {
      "id": "e0c5c4a3-8b8c-4b9c-9c9d-4a5b6c7d8e9f",
      "email": "guest@guest.com",
      "salt": "f63fee8ddbb2785a423078b2e1c07a11c9f4512c9b71009f5d3c4fa09acdd1b5",
      "createdAt": "2023-01-01T00:00:00.000Z",
      "updatedAt": "2023-01-01T00:00:00.000Z"
    },
    // password: moderator
    {
      "id": "6385493a-9239-4ac3-84f7-08ed4238544b",
      "email": "moderator@moderator.com",
      "salt": "896eb4fff61e21d5a5f81f7f9217856d0d0e5cbfcffd2e47763ae9bf4cc7b70d",
      "createdAt": "2023-01-01T00:00:00.000Z",
      "updatedAt": "2023-01-01T00:00:00.000Z"
    },
    // password: worker
    {
      "id": "5c6b7d8e-9f0a-4b5c-6a7b-8c9d0e1f2g3h",
      "email": "worker@worker.com",
      "salt": "180dee1c7dc312413eb40315f1555a31a4c3381df62c3cba03cbc49d33cb444f",
      "createdAt": "2023-01-01T00:00:00.000Z",
      "updatedAt": "2023-01-01T00:00:00.000Z"
    }
  ]

  users.forEach(user => {
    const pass = user.email.split('@')[0]
    user.passHash = createPassHash(createPassHash(pass, process.env.BEAR_SALT as string), user.salt + user.createdAt as string)
  })

  return users
}