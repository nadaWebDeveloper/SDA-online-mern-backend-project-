import { Request, Response, NextFunction } from 'express'
import * as services from '../services/authService'

const login = async (request: Request, response: Response, next: NextFunction) => {
  try {
    const { email, password } = request.body
    const user = await services.isEmailMatch(email)
    await services.isPassworMatch(user, password)

    response.json({ message: 'you are logged in ' })
  } catch (error) {
    next(error)
  }
}

export { login }
