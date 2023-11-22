import express from 'express'
const router = express.Router()

import * as controller from '../controllers/usersController'

router.get('/', controller.getAllUsers)

router.get('/:id', controller.getSingleUser)

router.post('/', controller.createUser)

router.put('/:id', controller.updateUser)

router.delete('/:id', controller.deleteUser)

export default router
