import express from 'express'
const router = express.Router()

import * as controller from '../controllers/usersController'
import { userRegistrationValidation } from '../validation/userValidation'
import { runValidation } from '../validation/runValidation'

router.get('/', controller.getAllUsers)

router.get('/:id', controller.getSingleUser)

router.post('/', userRegistrationValidation, runValidation, controller.createUser)

router.put('/:id', controller.updateUser)

router.delete('/:id', controller.deleteUser)

export default router
