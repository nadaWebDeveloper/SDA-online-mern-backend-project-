import bycrypt from 'bcrypt'
import ApiError from '../errors/ApiError'
import { UserDocument, User } from '../models/user'

export const isEmailMatch = async (inputEmail: string) => {
  const user = await User.findOne({ email: inputEmail })

  if (!user) {
    throw ApiError.badRequest(404, 'Their is no match with this email adress')
  }
  return user
}

export const isPassworMatch = async (user: UserDocument, password: string) => {
  const passwordCompare = await bycrypt.compare(user.password, password)
  if (!passwordCompare) {
    throw ApiError.badRequest(401, 'Their is no match with this password')
  }
}
