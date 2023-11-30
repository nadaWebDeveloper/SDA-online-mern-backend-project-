import jwt from 'jsonwebtoken'

export const generateToken = (payload: object, JWT_SECRET: string, expiresIn = '10m') => {
  return jwt.sign(payload, JWT_SECRET, {
    expiresIn: expiresIn,
  })
}

export const vertifyToken = (token: string, JWT_SECRET: string) => {
  return jwt.verify(token, JWT_SECRET)
}
