export interface IUser {
  id: string
  email: string
  salt: string
  passHash: string
  refreshToken?: string
  createdAt: string
  updatedAt: string
}

export interface IUserDTO {
  id: string
  email: string
  refreshToken?: string
  createdAt: string
  updatedAt: string
}

export const UserDTO: IUserDTO = {
  id: '',
  email: '',
  refreshToken: '',
  createdAt: '',
  updatedAt: '',
}