import bycrypt from 'bcrypt'
import ApiError from '../errors/ApiError'
import { IUser, User } from '../models/user'

export const isEmailMatch = async (inputEmail: string): Promise<IUser> => {
  const user = await User.findOne({ email: inputEmail })

  if (!user) {
    throw ApiError.badRequest(404, 'Their is no match with this email adress')
  }
  return user
}

export const isPassworMatch = async (user: IUser, password: string) => {
  const passwordCompare = await bycrypt.compare(password, user.password)
  if (!passwordCompare) {
    throw ApiError.badRequest(401, 'The password does not match')
  }
}

export const isUserBanned = (user: IUser) => {
  if (user.isBanned) {
    throw ApiError.badRequest(403, 'This user was banned please connecet to xxx@xx.com')
  }
}
