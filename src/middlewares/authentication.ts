import { NextFunction, Request, Response } from 'express'
import ApiError from '../errors/ApiError'
import { User } from '../models/user'

interface CustomeRequest extends Request {
  userId?: string
}

// check if admin
export const isAdmin = async (request: CustomeRequest, response: Response, next: NextFunction) => {
  try {
    const user = await User.findById(request.userId)
    if (user?.isAdmin) {
      next()
    } else {
      throw ApiError.badRequest(403, 'You are not an admin')
    }
  } catch (error) {
    next(error)
  }
}

// create cookies
// get user data and find if it matches the database based on his id recieved from the token (get request.userId)
// add isAdmin middleware to the users, products, categoreies and orders necessery routes
