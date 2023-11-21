import express from 'express'
const router = express.Router()

import ApiError from '../errors/ApiError'
import { User } from '../models/user'

router.get('/', async (_, res) => {
  const users = await User.find()
  console.log('products:', users)
  res.json({ message: 'users are found', users })
})

export default router
