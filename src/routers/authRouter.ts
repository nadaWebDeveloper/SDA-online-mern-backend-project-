import express from 'express'
const router = express.Router()

import * as controller from '../controllers/authController'
import { runValidation } from '../validation/runValidation'
import { userLoginValidation } from '../validation/userValidation'
import { isLoggedIn, isLoggedOut } from '../middlewares/authentication'

//GET --> login by email and password
router.post('/login', isLoggedOut, userLoginValidation, runValidation, controller.login)

//GET --> logout
router.post('/logout', isLoggedIn, controller.logout)

export default router
