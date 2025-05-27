export interface IUser {
  id: string
  email: string
  salt: string
  passHash: string
  refreshToken?: string
  createdAt: string
  updatedAt: string
}