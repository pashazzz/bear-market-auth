export interface IUser {
  id: string
  email: string
  passHash: string
  refreshToken?: string
  createdAt: string
  updatedAt: string
}