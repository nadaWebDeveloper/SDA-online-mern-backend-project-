import { Request, Response, NextFunction } from 'express'

import { dev } from '../config'
import setCookieResponse from '../utils/cookiesRes'
import { generateToken } from '../utils/tokenHandle'
import * as services from '../services/authService'

const login = async (request: Request, response: Response, next: NextFunction) => {
  try {
    const { email, password } = request.body

    const user = await services.isEmailMatch(email)
    await services.isPassworMatch(user, password)
    services.isUserBanned(user)

    const accessToken = generateToken({ _id: user.id }, dev.app.jwtAccessKey, '15m')
    setCookieResponse(response, accessToken)

    response.status(200).json({ message: `you logged in as ${user.isAdmin ? 'Admin' : ''}` })
  } catch (error) {
    next(error)
  }
}

const logout = async (request: Request, response: Response, next: NextFunction) => {
  try {
    response.status(200).clearCookie('access_token')
    response.status(200).json({ message: 'you logged out ' })
  } catch (error) {
    next(error)
  }
}

export { login, logout }
