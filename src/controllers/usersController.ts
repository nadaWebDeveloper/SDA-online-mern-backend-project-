import { NextFunction, Request, Response } from 'express'
import { JsonWebTokenError, JwtPayload, TokenExpiredError } from 'jsonwebtoken'
import mongoose, { SortOrder } from 'mongoose'

import { dev } from '../config'
import ApiError from '../errors/ApiError'
import * as services from '../services/userService'
import { sendEmail } from '../utils/sendEmail'
import { generateToken, verifyToken } from '../utils/tokenHandle'

interface CustomeRequest extends Request {
  userId?: string
}

// get all users
export const getAllUsers = async (request: Request, response: Response, next: NextFunction) => {
  try {
    const limit = Number(request.query.limit) || 0
    const page = Number(request.query.page) || 1
    const sort = request.query.sort as SortOrder
    const search = (request.query.search as string) || ''
    const isAdmin = request.query.isAdmin as string
    const isBanned = request.query.isBanned as string

    const { allUsers, totalPage, currentPage } = await services.findAllUsers(
      page,
      limit,
      search,
      sort,
      isAdmin,
      isBanned
    )

    if (allUsers.length) {
      return response.status(200).json({
        message: 'users were found',
        allUsers,
        totalPage,
        currentPage,
      })
    }

    return response.status(200).json({
      message: 'there are no matching results',
    })
  } catch (error) {
    next(error)
  }
}

// get a sing user
export const getSingleUser = async (
  request: CustomeRequest,
  response: Response,
  next: NextFunction
) => {
  try {
    const { id } = request.params

    const user = await services.findUserById(id)

    response.status(200).json({ message: 'User was found', user })
  } catch (error) {
    if (error instanceof mongoose.Error.CastError) {
      next(ApiError.badRequest(400, `ID format is Invalid must be 24 characters`))
    } else {
      next(error)
    }
  }
}

// register a new user
export const registUser = async (request: Request, response: Response, next: NextFunction) => {
  try {
    const { email } = request.body
    const registedUser = request.body

    if (registedUser.isBanned || registedUser.isAdmin) {
      throw ApiError.badRequest(403, 'you do not have permission to ban user or modify its role')
    }

    await services.findIfUserEmailExist(email)
    const token = generateToken(registedUser, String(dev.app.jwtUserActivationKey), '2m')
    const emailData = {
      email: email,
      subject: 'Activate your account',
      html: ` 
    <h1> Hello </h1>
    [${registedUser.firstName}]
    <p>Please activate your account by <a href= 
    "http://localhost:3000/user/activate/${token}">
    click here</a></p>`,
    }
    sendEmail(emailData)

    response.status(200).json({
     message: 'Check your email to activate your account'
     ,token })
  } catch (error) {
    next(error)
  }
}

// activate and create user
export const activateUser = async (request: Request, response: Response, next: NextFunction) => {
  try {
    const { token } = request.body
    if (!token) {
      throw ApiError.badRequest(404,'Please provide a token')
    }

    const decodedUser = verifyToken(token, String(dev.app.jwtUserActivationKey)) as JwtPayload
    if (!decodedUser) {
      throw ApiError.badRequest(401, 'Invalid token')
    }
    const user = await services.createUser(decodedUser)

    response.status(201).json({ message: `User with Name: ${user.firstName} was created` })
  } catch (error) {
    if(error instanceof TokenExpiredError || error instanceof JsonWebTokenError){
     const errorMessage = 
     error instanceof TokenExpiredError
     ? 'Token has expired'
     : 'Invalid token';
     throw ApiError.badRequest(401,errorMessage)
    }else{
      next(error)
    }
  }
}

// update user profile
export const updateUser = async (
  request: CustomeRequest,
  response: Response,
  next: NextFunction
) => {
  try {
    const { id } = request.params
    console.log('id',id);
    const updatedUser = request.body

    if (updatedUser.isBanned || updatedUser.isAdmin) {
      throw ApiError.badRequest(403, 'you do not have permission to ban users or modify thier role')
    }


   response.status(200).json({ message: `User is updated successfully` })
  } catch (error) {
    if (error instanceof mongoose.Error.CastError) {
      next(ApiError.badRequest(400, `ID format is Invalid must be 24 characters`))
    } else {
      next(error)
    }
  }
}
export const updateProfile = async(request: Request, response: Response, next: NextFunction) => {
try {
    const { id } = request.params
      const updatedUser = request.body
  
     const user = await services.findUserAndUpdateProfile(id , updatedUser)
     response.status(200).json({ message: `User is updated successfully` , user})
} catch (error) {
  if (error instanceof mongoose.Error.CastError) {
    next(ApiError.badRequest(400, `ID format is Invalid must be 24 characters`))
  } else {
    next(error)
  }
}

}

// block a specific user
export const banUser = async (request: Request, response: Response, next: NextFunction) => {
  try {
    const { id } = request.params

    const user = await services.updateBanStatusById(id, true)

    response.status(200).json({ message: `User: [${user.firstName}] is Blocked` })
  } catch (error) {
    if (error instanceof mongoose.Error.CastError) {
      next(ApiError.badRequest(400, `ID format is Invalid must be 24 characters`))
    } else {
      next(error)
    }
  }
}

// unblock a specific user
export const unBanUser = async (request: Request, response: Response, next: NextFunction) => {
  try {
    const { id } = request.params

    const user = await services.updateBanStatusById(id, false)

    response.status(200).json({ message: `User: [${user.firstName}] is unBlocked` })
  } catch (error) {
    if (error instanceof mongoose.Error.CastError) {
      next(ApiError.badRequest(400, `ID format is Invalid must be 24 characters`))
    } else {
      next(error)
    }
  }
}

// upgrade a specific user to an admin
export const upgradeUserRole = async (request: Request, response: Response, next: NextFunction) => {
  try {
    const { id } = request.params

    const user = await services.updateUserRoleById(id, true)

    response.status(200).json({ message: 'admin permession was granted' })
  } catch (error) {
    if (error instanceof mongoose.Error.CastError) {
      next(ApiError.badRequest(400, `ID format is Invalid must be 24 characters`))
    } else {
      next(error)
    }
  }
}

// downgrade a specific admin to a regular user
export const downgradeUserRole = async (
  request: Request,
  response: Response,
  next: NextFunction
) => {
  try {
    const { id } = request.params

    const user = await services.updateUserRoleById(id, false)

    response.status(200).json({ message: 'admin permession was removed' })
  } catch (error) {
    if (error instanceof mongoose.Error.CastError) {
      next(ApiError.badRequest(400, `ID format is Invalid must be 24 characters`))
    } else {
      next(error)
    }
  }
}

// delete a specific user
export const deleteUser = async (request: Request, response: Response, next: NextFunction) => {
  try {
    const { id } = request.params

    const user = await services.findAndDeleteUser(id)

    response.status(204).json({ message: `User with id: ${id} deleted` })
  } catch (error) {
    if (error instanceof mongoose.Error.CastError) {
      next(ApiError.badRequest(400, 'ID format is Invalid must be 24 characters'))
    } else {
      next(error)
    }
  }
}

// send email to reset user password
export const forgetPassword = async (request: Request, response: Response, next: NextFunction) => {
  try {
    const { email } = request.body

    const user = await services.findSingleUser({ email })

    const token = generateToken({ email }, String(dev.app.jwtResetKey), '2m')

    const emailData = {
      email: email,
      subject: 'Reset The Password',
      html: ` 
    <h1> Hello${user.firstName}</h1>
    <p>Please reset the password by <a href= "http://localhost:3000/user/reset-password/${token}">Reset Password</a></p>`,
    }
    sendEmail(emailData)

    response.status(200).json({ message: 'Check your email to reset the password ', token })
  } catch (error) {
    next(error)
  }
}

// verify token and update user password
export const resetPassword = async (request: Request, response: Response, next: NextFunction) => {
  try {
    const token = request.body.token
    const password = request.body.password

    const decodedData = verifyToken(token, String(dev.app.jwtResetKey)) as JwtPayload

    const updatedUser = await services.findUserAndUpdate(
      { email: decodedData.email },
      { $set: { password: password } }
    )

    response.status(200).json({ message: 'The password was updated successfully' , updatedUser })
  } catch (error) {
    if (error instanceof TokenExpiredError) {
      next(ApiError.badRequest(401, 'Token was expired'))
    } else {
      next(error)
    }
  }
}
