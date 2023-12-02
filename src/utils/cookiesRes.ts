import { Response } from 'express'
const setCookieResponse = (response: Response, accessToken: string) => {
  response.cookie('access_token', accessToken, {
    maxAge: 15 * 60 * 1000,
    httpOnly: true,
    sameSite: 'none',
  })
}

export default setCookieResponse
