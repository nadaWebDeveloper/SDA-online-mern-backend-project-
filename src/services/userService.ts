import { SortOrder } from 'mongoose'
import { JwtPayload } from 'jsonwebtoken'

import ApiError from '../errors/ApiError'
import { IUser, User } from '../models/user'

type UsersPaginationType = {
  allUsers: IUser[]
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

  // const allUsers = search
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

export const findSingleUser = async (filter: object): Promise<IUser> => {
  const user = await User.findOne(filter, {
    password: 0,
  }).populate('orders')
  if (!user) {
    throw ApiError.badRequest(404, `User was not found`)
  }
  return user
}

export const isUserEmailExists = async (inputEmail: string, inputId: string | null = null) => {
  const user = await User.exists({ $and: [{ _id: { $ne: inputId } }, { email: inputEmail }] })

  if (user) {
    throw ApiError.badRequest(409, 'This email is already exists')
  }
}

export const createUser = async (newUser: JwtPayload): Promise<IUser> => {
  const user = new User(newUser)
  await user.save()
  return user
}

export const findUserAndUpdate = async (
  filter: object,
  inputUser: IUser | object
): Promise<IUser> => {
  const user = await User.findOneAndUpdate(filter, inputUser, { new: true })
  if (!user) {
    throw ApiError.badRequest(404, 'User was Not Found')
  }
  return user
}

export const updateUserRoleById = async (id: string, isAdmin: boolean): Promise<IUser> => {
  const update = { isAdmin: isAdmin }
  const user = await User.findByIdAndUpdate(id, update, { new: true })

  if (!user) {
    throw ApiError.badRequest(404, 'User was not found')
  }

  return user
}
export const updateBanStatusById = async (id: string, isBanned: boolean): Promise<IUser> => {
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
