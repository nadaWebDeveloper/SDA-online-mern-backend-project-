import { SortOrder } from 'mongoose'
import { TokenExpiredError } from 'jsonwebtoken'

import { dev } from '../config'
import ApiError from '../errors/ApiError'
import { sendEmail } from '../utils/sendEmail'
import { vertifyToken } from '../utils/tokenHandle'
import { UserDocument, User } from '../models/user'

type UsersPaginationType = {
  allUsers: UserDocument[]
  totalPage: number
  currentPage: number
}

export const findAllUsers = async (
  page: number,
  limit: number,
  search: string,
  sort: SortOrder,
  isAdmin: string,
  isBanned: string
): Promise<UsersPaginationType> => {
  const searchRegularExpression = new RegExp('.*' + search + '.*', 'i')
  const searchFilter = {
    $or: [
      { firstName: { $regex: searchRegularExpression } },
      { lastName: { $regex: searchRegularExpression } },
      { email: { $regex: searchRegularExpression } },
    ],
  }

  const roleFilter = isAdmin ? { isAdmin: isAdmin } : {}

  const bannedUsersFilter = isBanned ? { isBanned: isBanned } : {}
  const filters = { $and: [roleFilter, bannedUsersFilter, searchFilter] }
  const countPage = await User.countDocuments()
  const totalPage = limit ? Math.ceil(countPage / limit) : 1
  if (page > totalPage) {
    page = totalPage
  }
  const skip = (page - 1) * limit

  // const allUsers: UserDocument[] = search
  //   ? await User.find({ searchFilter }, { password: 0})
  //       .populate('orders')
  //       .skip(skip)
  //       .limit(limit)
  //   : await User.find({}, { password: 0, orders: 0 })
  //       .populate('orders')
  //       .skip(skip)
  //       .limit(limit)
  //       .sort({ firstName: sort, lastName: sort })

  const allUsers = await User.find(filters, {
    password: 0,
  })
    .populate('orders')
    .skip(skip)
    .limit(limit)
    .sort({ firstName: sort, lastName: sort })

  return {
    allUsers,
    totalPage,
    currentPage: page,
  }
}

export const findUserByID = async (id: string): Promise<UserDocument> => {
  const user = await User.findById(id).populate('orders')
  if (!user) {
    throw ApiError.badRequest(404, `User with ${id} was not found`)
  }
  return user
}

export const isUserEmailExists = async (inputEmail: string, inputId: string | null = null) => {
  const user = await User.exists({ $and: [{ _id: { $ne: inputId } }, { email: inputEmail }] })

  if (user) {
    throw ApiError.badRequest(409, 'This email is already exists')
  }
}

export const sendTokenByEmail = (email: string, token: string) => {
  const emailData = {
    email: email,
    subject: 'Activate your account',
    html: ` 
  <h1> Hello</h1>
  <p>Please activate your account by <a href= "http://127.0.0.1:5050/users/activate/${token}">click here</a></p>`,
  }

  sendEmail(emailData)
}

export const checkTokenAndActivate = async (token: string) => {
  try {
    if (!token) {
      throw ApiError.badRequest(404, 'Token was not provided')
    }

    const decodedUser = vertifyToken(token, dev.app.jwsUserActivationKey)

    if (!decodedUser) {
      throw ApiError.badRequest(401, 'Token was invalid')
    }
    const user = new User(decodedUser)
    await user.save()
    return user
  } catch (error) {
    if (error instanceof TokenExpiredError) {
      throw ApiError.badRequest(401, 'Token was expired')
    } else {
      throw error
    }
  }
}

export const findUserAndUpdate = async (
  id: string,
  inputUser: UserDocument
): Promise<UserDocument> => {
  const user = await User.findByIdAndUpdate(id, inputUser, { new: true })
  if (!user) {
    throw ApiError.badRequest(404, 'User was Not Found')
  }
  return user
}

export const updateUserRoleById = async (id: string, isAdmin: boolean): Promise<UserDocument> => {
  const update = { isAdmin: isAdmin }
  const user = await User.findByIdAndUpdate(id, update, { new: true })

  if (!user) {
    throw ApiError.badRequest(404, 'User was not found')
  }

  return user
}
export const updateBanStatusById = async (id: string, isBanned: boolean): Promise<UserDocument> => {
  const update = { isBanned: isBanned }
  const user = await User.findByIdAndUpdate(id, update, { new: true })

  if (!user) {
    throw ApiError.badRequest(404, 'User was not found')
  }

  return user
}
export const findUserAndDelete = async (id: string) => {
  const user = await User.findByIdAndDelete(id)

  if (!user) {
    throw ApiError.badRequest(404, `User with ${id} was not found`)
  }
}
