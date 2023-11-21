import express from 'express'
const router = express.Router()

import { createUser, getAllUsers, getUserById } from '../controllers/users'

router.get('/', getAllUsers)

router.get('/:id', getUserById)

router.post('/', createUser)

export default router
