import { NextFunction, Request, Response } from 'express'
import jwt, { JwtPayload } from 'jsonwebtoken'

import ApiError from '../errors/ApiError'
import { User } from '../models/user'
import { dev } from '../config'

interface CustomeRequest extends Request {
  userId?: string
}

// check if logged in
export const isLoggedIn = async (
  request: CustomeRequest,
  response: Response,
  next: NextFunction
) => {
  try {
    const accessToken = request.cookies.access_token
    if (!accessToken) {
      throw ApiError.badRequest(401, 'You are not logged in')
    }

    const decoded = (await jwt.verify(accessToken, dev.app.jwsAccessKey)) as JwtPayload
    if (!decoded) {
      throw ApiError.badRequest(401, 'Invalid access token')
    }

    request.userId = decoded._id
    next()
  } catch (error) {
    next(error)
  }
}

// check if logged out
export const isLoggedOut = async (request: Request, response: Response, next: NextFunction) => {
  try {
    const accessToken = request.cookies.access_token
    if (accessToken) {
      throw ApiError.badRequest(401, 'You are logged in already')
    }

    next()
  } catch (error) {
    next(error)
  }
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

// check if admin
export const isNotAdmin = async (
  request: CustomeRequest,
  response: Response,
  next: NextFunction
) => {
  try {
    const user = await User.findById(request.userId)
    if (user?.isAdmin === false) {
      next()
    } else {
      throw ApiError.badRequest(403, 'Admins can not make orders')
    }
  } catch (error) {
    next(error)
  }
}
