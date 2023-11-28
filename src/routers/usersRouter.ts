import express from 'express'

import * as controller from '../controllers/usersController'
import { runValidation } from '../validation/runValidation'
import { userRegistrationValidation } from '../validation/userValidation'
import { isLoggedIn, isLoggedOut } from '../middlewares/authentication'

const router = express.Router()

//GET --> get all users
router.get('/', isLoggedIn, controller.getAllUsers)

// GET --> get a single user by ID
router.get('/:id', isLoggedIn, controller.getSingleUser)

//POST --> register a user
router.post(
  '/register',
  isLoggedOut,
  userRegistrationValidation,
  runValidation,
  controller.registUser
)

//POST --> activate a user
router.post('/activate', controller.activateUser)

//PUT --> update a single user by ID
router.put('/:id', isLoggedIn, controller.updateUser)

//PUT --> ban a single user by ID
router.put('/ban/:id', isLoggedIn, controller.banUser)

//PUT --> unban a single user by ID
router.put('/unban/:id', isLoggedIn, controller.unBanUser)

//PUT --> upgrade single user role to admin
router.put('/admin/:id', isLoggedIn, controller.upgradeUserRole)

//PUT --> downgrade single user role to admin
router.put('/notadmin/:id', isLoggedIn, controller.downgradeUserRole)

//DELETE --> delete a single user by ID
router.delete('/:id', isLoggedIn, controller.deleteUser)

export default router
