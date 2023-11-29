import jwt, { TokenExpiredError } from 'jsonwebtoken'

import { dev } from '../config'
import ApiError from '../errors/ApiError'
import { sendEmail } from '../helper/sendEmail'
import { UserDocument, User } from '../models/user'
import { SortOrder } from 'mongoose'

export const findAllUsers = async (
  page: number,
  limit: number,
  search: string,
  sort: SortOrder,
  isAdmin: string,
  isBanned: string
) => {
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
  //   ? await User.find({ searchFilter }, { password: 0, orders: 0 })
  //       .populate('orders')
  //       .skip(skip)
  //       .limit(limit)
  //   : await User.find({}, { password: 0, orders: 0 })
  //       .populate('orders')
  //       .skip(skip)
  //       .limit(limit)
  //       .sort(sort ? { firstName: sortOrder, lastName: sortOrder } : '')

  const allUsers: UserDocument[] = await User.find(
    { $and: [filters, searchFilter] },
    {
      password: 0,
      orders: 0,
    }
  )
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

export const findUserByID = async (id: string) => {
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

    const decodedUser = jwt.verify(token, dev.app.jwsUserActivationKey)

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

export const findUserAndUpdate = async (id: string, inputUser: UserDocument) => {
  const user = await User.findByIdAndUpdate(id, inputUser, { new: true })
  if (!user) {
    throw ApiError.badRequest(404, 'User was Not Found')
  }
  return user
}

export const banUserById = async (id: string) => {
  const user = await User.findByIdAndUpdate(id, { isBanned: true }, { new: true })
  if (!user) {
    throw ApiError.badRequest(404, 'User was not found')
  }
  return user
}

export const unBanUserById = async (id: string) => {
  const user = await User.findByIdAndUpdate(id, { isBanned: false }, { new: true })
  if (!user) {
    throw ApiError.badRequest(404, 'User was not found')
  }
}

export const upgradeUserRoleById = async (id: string) => {
  const user = await User.findByIdAndUpdate(id, { isAdmin: true }, { new: true })
  if (!user) {
    throw ApiError.badRequest(404, 'User was not found')
  }
  return user
}

export const downgradeUserRoleById = async (id: string) => {
  const user = await User.findByIdAndUpdate(id, { isAdmin: false }, { new: true })
  if (!user) {
    throw ApiError.badRequest(404, 'User was not found')
  }
}

export const findUserAndDelete = async (id: string) => {
  const user = await User.findByIdAndDelete(id)

  if (!user) {
    throw ApiError.badRequest(404, `User with ${id} was not found`)
  }
}
