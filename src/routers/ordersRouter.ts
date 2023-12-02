import { Router } from 'express'

import * as controller from '../controllers/ordersController'
import { isAdmin, isLoggedIn, isNotAdmin } from '../middlewares/authentication'

const router = Router()

//GET --> get all user orders
router.get('/:id([0-9a-fA-F]{24})', isLoggedIn, controller.getOrdersForUser)

//GET --> get all orders for an admin
router.get('/all-orders', isLoggedIn, isAdmin, controller.getOrdersForAdmin)

//GET --> create an order
router.post('/process-payment', isLoggedIn, isNotAdmin, controller.handleProcessPayment)

//DELETE --> delete a single order by ID
router.delete('/:id', isLoggedIn, isAdmin, controller.deleteOrder)

//PUT --> update a single order by ID
router.put('/:id', isLoggedIn, isAdmin, controller.updateOrder)

export default router
