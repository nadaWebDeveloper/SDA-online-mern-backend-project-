import mongoose from 'mongoose'
import jwt from 'jsonwebtoken'
import { Request, Response, NextFunction } from 'express'

import { dev } from '../config'
import ApiError from '../errors/ApiError'
import * as services from '../services/userService'

const getAllUsers = async (request: Request, response: Response, next: NextFunction) => {
  try {
    const limit = Number(request.query.limit) || 0
    const page = Number(request.query.page) || 1
    const search = (request.query.search as string) || ''

    const { allUsers, totalPage, currentPage } = await services.findAllUsers(page, limit, search)

    return response.json({
      message: 'users were found',
      allUsers,
      totalPage,
      currentPage,
    })
  } catch (error) {
    next(error)
  }
}

const getSingleUser = async (request: Request, response: Response, next: NextFunction) => {
  try {
    const { id } = request.params
    const user = await services.findUserByID(id)
    response.json({ message: 'User was found', user })
  } catch (error) {
    if (error instanceof mongoose.Error.CastError) {
      next(ApiError.badRequest(400, 'Id format is not valid'))
    } else {
      next(error)
    }
  }
}

const registUser = async (request: Request, response: Response, next: NextFunction) => {
  try {
    const { email } = request.body
    const registedUser = request.body

    if (registedUser.isBanned || registedUser.isAdmin) {
      throw ApiError.badRequest(403, 'you do not have permission to ban user or modify its role')
    }
    const userExists = await services.isUserEmailExists(email)

    const token = jwt.sign(request.body, dev.app.jwsUserActivationKey, { expiresIn: '1m' })
    services.sendTokenByEmail(email, token)

    response.json({ message: 'Check your email to activate the account ', token })
  } catch (error) {
    if (error instanceof mongoose.Error.CastError) {
      next(ApiError.badRequest(400, `ID format is Invalid must be 24 characters`))
    } else {
      next(error)
    }
  }
}

const activateUser = async (request: Request, response: Response, next: NextFunction) => {
  try {
    const { token } = request.body
    const user = await services.checkTokenAndActivate(token)

    response.status(201).json({ message: 'User was activated ', user })
  } catch (error) {
    next(error)
  }
}

const updateUser = async (request: Request, response: Response, next: NextFunction) => {
  try {
    const { id } = request.params
    const { email } = request.body
    const updatedUser = request.body

    if (updatedUser.isBanned || updatedUser.isAdmin) {
      throw ApiError.badRequest(403, 'you do not have permission to ban user or modify its role')
    }

    const userExists = await services.isUserEmailExists(email, id)

    const user = await services.findUserAndUpdate(id, updatedUser)

    response.json({ message: 'User was updated', user })
  } catch (error) {
    if (error instanceof mongoose.Error.CastError) {
      next(ApiError.badRequest(400, `ID format is Invalid must be 24 characters`))
    } else {
      next(error)
    }
  }
}

const banUser = async (request: Request, response: Response, next: NextFunction) => {
  try {
    const { id } = request.params
    const user = await services.banUserById(id)

    response.json({ message: 'User was banned' })
  } catch (error) {
    if (error instanceof mongoose.Error.CastError) {
      next(ApiError.badRequest(400, `ID format is Invalid must be 24 characters`))
    } else {
      next(error)
    }
  }
}

const unBanUser = async (request: Request, response: Response, next: NextFunction) => {
  try {
    const { id } = request.params
    const user = await services.unBanUserById(id)

    response.json({ message: 'User was Unbanned' })
  } catch (error) {
    if (error instanceof mongoose.Error.CastError) {
      next(ApiError.badRequest(400, `ID format is Invalid must be 24 characters`))
    } else {
      next(error)
    }
  }
}

const upgradeUserRole = async (request: Request, response: Response, next: NextFunction) => {
  try {
    const { id } = request.params
    const user = await services.upgradeUserRoleById(id)

    response.json({ message: 'admin permession was granted' })
  } catch (error) {
    if (error instanceof mongoose.Error.CastError) {
      next(ApiError.badRequest(400, `ID format is Invalid must be 24 characters`))
    } else {
      next(error)
    }
  }
}

const downgradeUserRole = async (request: Request, response: Response, next: NextFunction) => {
  try {
    const { id } = request.params
    const user = await services.downgradeUserRoleById(id)

    response.json({ message: 'admin permession was removed' })
  } catch (error) {
    if (error instanceof mongoose.Error.CastError) {
      next(ApiError.badRequest(400, `ID format is Invalid must be 24 characters`))
    } else {
      next(error)
    }
  }
}

const deleteUser = async (request: Request, response: Response, next: NextFunction) => {
  try {
    const { id } = request.params
    const user = await services.findUserAndDelete(id)

    response.json({ message: 'User was deleted', user })
  } catch (error) {
    if (error instanceof mongoose.Error.CastError) {
      next(ApiError.badRequest(400, 'ID format is Invalid must be 24 characters'))
    } else {
      next(error)
    }
  }
}

export {
  getAllUsers,
  getSingleUser,
  registUser,
  activateUser,
  updateUser,
  banUser,
  upgradeUserRole,
  downgradeUserRole,
  unBanUser,
  deleteUser,
}
