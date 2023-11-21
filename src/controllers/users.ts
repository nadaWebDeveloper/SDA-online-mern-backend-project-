import { Request, Response, NextFunction } from 'express'

import { User } from '../models/user'
import ApiError from '../errors/ApiError'

const getAllUsers = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const users = await User.find()

    res.json({ message: 'users were found', users })
  } catch (error) {
    next(error)
  }
}

const getUserById = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const user = await User.findById(req.params.id)
    if (!user) {
      throw ApiError.badRequest('there is no user with this id')
    }

    res.json({ message: 'user was found', user })
  } catch (error) {
    next(error)
  }
}

const createUser = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const user = new User(req.body)
    user.save()

    res.json({ message: 'user was created', user })
  } catch (error) {
    next(error)
  }
}

export { getAllUsers, getUserById, createUser }
