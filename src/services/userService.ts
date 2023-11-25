import { NextFunction, Response } from 'express'

import ApiError from '../errors/ApiError'
import { UserDocument, User } from '../models/user'

export const findAllUsers = async () => {
  const countPage = await User.countDocuments()

  const allUsers: UserDocument[] = await User.find().populate('orders')

  return {
    allUsers,
  }
}

export const findAllUsersOnPage = async (page = 1, limit = 3) => {
  const countPage = await User.countDocuments()

  const totalPage = Math.ceil(countPage / limit)
  if (page > totalPage) {
    page = totalPage
  }
  const skip = (page - 1) * limit

  const allUsersOnPage: UserDocument[] = await User.find()
    .populate('Products')
    .skip(skip)
    .limit(limit)
  return {
    allUsersOnPage,
    totalPage,
    currentPage: page,
  }
}

export const isUserEmailExists = async (inputEmail: string, inputId: string | null = null) => {
  const user = await User.exists({ $and: [{ _id: { $ne: inputId } }, { email: inputEmail }] })
  if (user) {
    throw ApiError.badRequest(409, 'This email is already exists')
  }
}
