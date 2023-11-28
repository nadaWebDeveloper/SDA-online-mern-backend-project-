import express from 'express'
const router = express.Router()

import * as controller from '../controllers/authController'
import { runValidation } from '../validation/runValidation'
import { userRegistrationValidation } from '../validation/userValidation'

//GET --> login by email and password
router.post('/login', controller.login)

//GET --> logout
router.post('/logout', controller.logout)

export default router
