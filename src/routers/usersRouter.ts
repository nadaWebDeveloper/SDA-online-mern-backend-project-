import express from 'express'

import * as controller from '../controllers/usersController'
import { runValidation } from '../validation/runValidation'
import {
  userForgetPasswordValidation,
  userRegistrationValidation,
  userResetPasswordValidation,
} from '../validation/userValidation'
import { isAdmin, isLoggedIn, isLoggedOut } from '../middlewares/authentication'

const router = express.Router()

//GET --> get all users
router.get('/', isLoggedIn, isAdmin, controller.getAllUsers)

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
router.put('/ban/:id', isLoggedIn, isAdmin, controller.banUser)

//PUT --> unban a single user by ID
router.put('/unban/:id', isLoggedIn, isAdmin, controller.unBanUser)

//PUT --> upgrade single user role to admin
router.put('/admin/:id', isLoggedIn, isAdmin, controller.upgradeUserRole)

//PUT --> downgrade single admin role to user
router.put('/notadmin/:id', isLoggedIn, isAdmin, controller.downgradeUserRole)

//DELETE --> delete a single user by ID
router.delete('/:id', isLoggedIn, isAdmin, controller.deleteUser)

//POST --> send reset email when forget password
router.post(
  '/forget-password',
  isLoggedOut,
  userForgetPasswordValidation,
  runValidation,
  controller.forgetPassword
)

//POST --> reset password
router.post(
  '/reset-password',
  isLoggedOut,
  userResetPasswordValidation,
  runValidation,
  controller.resetPassword
)

export default router
