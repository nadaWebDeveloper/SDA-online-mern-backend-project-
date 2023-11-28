import jwt from 'jsonwebtoken'
import { Request, Response, NextFunction } from 'express'

import { dev } from '../config'
import * as services from '../services/authService'

const login = async (request: Request, response: Response, next: NextFunction) => {
  try {
    const { email, password } = request.body

    const user = await services.isEmailMatch(email)
    await services.isPassworMatch(user, password)
    services.isUserBanned(user)

    const accessToken = jwt.sign({ _id: user.id }, dev.app.jwsAccessKey, {
      expiresIn: '1m',
    })
    response.cookie('access_token', accessToken, {
      maxAge: 5 * 60 * 1000,
      httpOnly: true,
      sameSite: 'none',
    })
    response.json({ message: 'you logged in ' })
  } catch (error) {
    next(error)
  }
}

const logout = async (request: Request, response: Response, next: NextFunction) => {
  try {
    response.clearCookie('access_token')
    response.json({ message: 'you logged out ' })
  } catch (error) {
    next(error)
  }
}

export { login, logout }
