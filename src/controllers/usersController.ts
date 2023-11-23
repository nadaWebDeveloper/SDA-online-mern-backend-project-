import { Request, Response, NextFunction } from 'express'

import { User } from '../models/user'
import ApiError from '../errors/ApiError'
import * as services from '../services/userService'

 export const getAllUsers = async (request: Request, response: Response, next: NextFunction) => {
  try {
    const limit = Number(request.query.limit)
    const page = Number(request.query.page)
    const { allUsersOnPage, totalPage, currentPage } = await services.findAllUsers(page, limit)

    response.json({ message: 'users were found', allUsersOnPage, totalPage, currentPage })
  } catch (error) {
    next(error)
  }
}

 export const getSingleUser = async (request: Request, response: Response, next: NextFunction) => {
  try {
    const { id } = request.params
    const user = await User.findById(id).populate('orders')
    if (!user) {
      throw ApiError.badRequest(404, 'User was Not Found')
    }

    response.json({ message: 'user was found', user })
  } catch (error) {
    next(error)
  }
}

 export const createUser = async (request: Request, response: Response, next: NextFunction) => {
  try {
    const user = new User(request.body)
    await user.save()

    response.json({ message: 'user was created', user })
  } catch (error) {
    next(error)
  }
}

 export const updateUser = async (request: Request, response: Response, next: NextFunction) => {
  try {
    const { id } = request.params
    const updatedUser = request.body

    const user = await User.findByIdAndUpdate(id, updatedUser)

    if (!user) {
      throw ApiError.badRequest(404, 'User was Not Found')
    }

    response.json({ message: 'user was updated', user })
  } catch (error) {
    next(error)
  }
}

 export const deleteUser = async (request: Request, response: Response, next: NextFunction) => {
  try {
    const { id } = request.params

    const user = await User.findByIdAndDelete(id)

    if (!user) {
      throw ApiError.badRequest(404, 'User was Not Found')
    }

    response.json({ message: 'user was updated', user })
  } catch (error) {
    next(error)
  }
}
