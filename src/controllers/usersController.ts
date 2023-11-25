import { Request, Response, NextFunction } from 'express'

import { User, UserDocument } from '../models/user'
import ApiError from '../errors/ApiError'
import * as services from '../services/userService'

const getAllUsers = async (request: Request, response: Response, next: NextFunction) => {
  try {
    const limit = Number(request.query.limit)
    const page = Number(request.query.page)
    if (limit || page) {
      const { allUsersOnPage, totalPage, currentPage } = await services.findAllUsersOnPage(
        page,
        limit
      )

      return response.json({ message: 'users were found', allUsersOnPage, totalPage, currentPage })
    } else {
      const { allUsers } = await services.findAllUsers()
      return response.json({ message: 'Users were found', allUsers })
    }
  } catch (error) {
    next(error)
  }
}

const getSingleUser = async (request: Request, response: Response, next: NextFunction) => {
  try {
    const { id } = request.params
    const user = await User.findById(id).populate('orders')
    if (!user) {
      throw ApiError.badRequest(404, 'User was Not Found')
    }

    response.json({ message: 'User was found', user })
  } catch (error) {
    next(error)
  }
}

const createUser = async (request: Request, response: Response, next: NextFunction) => {
  try {
    const { email } = request.body
    const userExists = await services.isUserEmailExists(email)

    const user = new User(request.body)
    await user.save()

    response.json({ message: 'User was created', user })
  } catch (error) {
    next(error)
  }
}

const updateUser = async (request: Request, response: Response, next: NextFunction) => {
  try {
    const { id } = request.params
    const updatedUser = request.body

    const { email } = request.body
    if (email) {
      const userExists = await services.isUserEmailExists(email, id)
    }

    const user = await User.findByIdAndUpdate(id, updatedUser)

    if (!user) {
      throw ApiError.badRequest(404, 'User was Not Found')
    }

    response.json({ message: 'User was updated', user })
  } catch (error) {
    next(error)
  }
}

const deleteUser = async (request: Request, response: Response, next: NextFunction) => {
  try {
    const { id } = request.params

    const user = await User.findByIdAndDelete(id)

    if (!user) {
      throw ApiError.badRequest(404, 'User was Not Found')
    }

    response.json({ message: 'User was deleted', user })
  } catch (error) {
    next(error)
  }
}

export { getAllUsers, getSingleUser, createUser, updateUser, deleteUser }
