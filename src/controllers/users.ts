import { Request, Response, NextFunction } from 'express'

import { User } from '../models/user'
import ApiError from '../errors/ApiError'

const getAllUsers = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const users = await User.find()

    res.json({ message: 'users were found', users })
  } catch (error: any) {
    next(error)
  }
}

const getUserById = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const user = await User.findById(req.params.id)
    if (!user) {
      throw ApiError.badRequest('User was Not Found')
    }

    res.json({ message: 'user was found', user })
  } catch (error) {
    next(error)
  }
}

const createUser = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const user = new User(req.body)
    await user.save()

    res.json({ message: 'user was created', user })
  } catch (error) {
    next(error)
  }
}

const updateUser = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const id = req.params.id
    const updatedUser = req.body

    const user = await User.findByIdAndUpdate(id, updatedUser)

    if (!user) {
      throw ApiError.badRequest('User was Not Found')
    }

    res.json({ message: 'user was updated', user })
  } catch (error: any) {
    next(error)
  }
}

const deleteUser = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const id = req.params.id

    const user = await User.findByIdAndDelete(id)

    if (!user) {
      throw ApiError.badRequest('User was Not Found')
    }

    res.json({ message: 'user was updated', user })
  } catch (error) {
    next(error)
  }
}

export { getAllUsers, getUserById, createUser, updateUser, deleteUser }
