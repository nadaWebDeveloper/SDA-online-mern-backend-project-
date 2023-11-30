import { Request, Response, NextFunction } from 'express'

import { dev } from '../config'
import { generateToken } from '../utils/tokenHandle'
import setCookieResponse from '../utils/cookiesRes'
import * as services from '../services/authService'

const login = async (request: Request, response: Response, next: NextFunction) => {
  try {
    const { email, password } = request.body

    const user = await services.isEmailMatch(email)
    await services.isPassworMatch(user, password)
    services.isUserBanned(user)

    const accessToken = generateToken({ _id: user.id }, dev.app.jwsAccessKey, '15m')
    setCookieResponse(response, accessToken)

    response.status(204).json({ message: 'you logged in ' })
  } catch (error) {
    next(error)
  }
}

const logout = async (request: Request, response: Response, next: NextFunction) => {
  try {
    response.status(204).clearCookie('access_token')
    response.status(204).json({ message: 'you logged out ' })
  } catch (error) {
    next(error)
  }
}

export { login, logout }
