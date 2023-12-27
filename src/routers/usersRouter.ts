import express from 'express'

import * as controller from '../controllers/usersController'

import { isAdmin, isLoggedIn, isLoggedOut } from '../middlewares/authentication'

import { runValidation } from '../validation/runValidation'
import * as validation from '../validation/userValidation'

const router = express.Router()

//GET --> get all users
 router.get('/', isLoggedIn, isAdmin, controller.getAllUsers)
//GET --> get a single user by ID
// router.get('/profile', isLoggedIn, controller.getSingleUser)
router.get('/profile/:id', isLoggedIn, controller.getSingleUser)
//POST --> register a user
router.post(
  '/register',
  isLoggedOut,
  validation.userRegistrationValidation,
  runValidation,
  controller.registUser
)
//POST --> activate a user
router.post('/activate', controller.activateUser)
//PUT --> update a single user by ID
router.put('/editProfile/:id',isLoggedIn,validation.userUpdatenValidation,runValidation,controller.updateProfile)
//PUT --> ban a single user by ID
router.put('/ban/:id', isLoggedIn, isAdmin, controller.banUser)
//PUT --> unban a single user by ID
router.put('/unban/:id', isLoggedIn, isAdmin, controller.unBanUser)
//PUT --> upgrade single user role to admin
router.put('/adminRole/:id', isLoggedIn, isAdmin, controller.upgradeUserRole)
//PUT --> downgrade single admin role to user
router.put('/notadmin/:id', isLoggedIn, isAdmin, controller.downgradeUserRole)
//DELETE --> delete a single user by ID
router.delete('/:id', isLoggedIn, isAdmin, controller.deleteUser)

//POST --> send reset email when forget password
router.post(
  '/forget-password',
  isLoggedOut,
  validation.userForgetPasswordValidation,
  runValidation,
  controller.forgetPassword
)
//POST --> reset password
router.put(
  '/reset-password',
  isLoggedOut,
  validation.userResetPasswordValidation,
  runValidation,
  controller.resetPassword
)

export default router
