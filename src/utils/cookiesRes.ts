import { Response } from 'express'
const setCookieResponse = (response: Response, accessToken: string) => {
  response.cookie('accessToken', accessToken, {
    maxAge: 5 * 60 * 1000,
    httpOnly: true,
    sameSite: 'none',
  })
}

export default setCookieResponse
