import { NextFunction, Response } from 'express'
import jwt, { TokenExpiredError } from 'jsonwebtoken'

import { dev } from '../config'
import ApiError from '../errors/ApiError'
import { sendEmail } from '../helper/sendEmail'
import { UserDocument, User } from '../models/user'

export const findAllUsers = async () => {
  const countPage = await User.countDocuments()

  const allUsers: UserDocument[] = await User.find({}, { password: 0 }).populate('orders')

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

  const allUsersOnPage: UserDocument[] = await User.find({}, { password: 0 })
    .populate('Products')
    .skip(skip)
    .limit(limit)
  return {
    allUsersOnPage,
    totalPage,
    currentPage: page,
  }
}

export const findUserByID = async (id: string) => {
  const user = await User.findById(id, { password: 0 }).populate('orders')
  if (!user) {
    throw ApiError.badRequest(404, `User with ${id} was not found`)
  }
  return user
}

// search users by name
export const searchUsersByName = async (firstName: string, next: NextFunction) => {
  const searchResult = await User.find({
    $or: [{ firstName: { $regex: firstName } }],
  })

  if (searchResult.length === 0) {
    next(ApiError.badRequest(404, `No results found with the keyword ${firstName}`))
    return
  }
  return searchResult
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

export const findUserAndDelete = async (id: string) => {
  const user = await User.findByIdAndDelete(id)

  if (!user) {
    throw ApiError.badRequest(404, `User with ${id} was not found`)
  }
  return user
}
