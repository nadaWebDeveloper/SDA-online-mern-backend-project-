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
  console.log('password', password)
  console.log('user password', user.password)
  const passwordCompare = await bycrypt.compare(user.password, password)
  console.log(passwordCompare)
  if (!passwordCompare) {
    throw ApiError.badRequest(401, 'The password does not match')
  }
}

export const isBanned = (user: UserDocument) => {
  if (user.isBanned) {
    throw ApiError.badRequest(403, 'This user was banned please connecet to 111@abd.com')
  }
}
