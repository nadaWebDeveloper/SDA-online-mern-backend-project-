import express from 'express'
const router = express.Router()

import * as controller from '../controllers/authController'
import { userRegistrationValidation } from '../validation/userValidation'
import { runValidation } from '../validation/runValidation'

//GET --> login by email and password
router.post('/login', controller.login)

// //GET --> logout
// router.post('/logout', controller.logout)

export default router
