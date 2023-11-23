import { Response } from 'express'

import ApiError from '../errors/ApiError'
import { UserDocument, User } from '../models/user'

export const findAllUsers = async (page = 1, limit = 3) => {
  //how many have products
  const countPage = await User.countDocuments()
  //total page
  const totalPage = Math.ceil(countPage / limit)
  if (page > totalPage) {
    page = totalPage
  }
  const skip = (page - 1) * limit

  const allUsersOnPage: UserDocument[] = await User.find()
    .populate('orders')
    .skip(skip)
    .limit(limit)
  return {
    allUsersOnPage,
    totalPage,
    currentPage: page,
  }
}

export const findAllUsersOnPage = async (page = 1, limit = 3) => {
  //how many have products
  const countPage = await User.countDocuments()
  //total page
  const totalPage = Math.ceil(countPage / limit)
  if (page > totalPage) {
    page = totalPage
  }
  const skip = (page - 1) * limit

  // ! Add Query on side Find()
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
