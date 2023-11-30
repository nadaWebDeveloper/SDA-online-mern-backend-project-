import { Router } from 'express'

import * as controller from '../controllers/ordersController'
import { isAdmin, isLoggedIn } from '../middlewares/authentication'

const router = Router()

//GET --> get all orders
router.get('/', isLoggedIn, isAdmin, controller.getAllOrders)

//GET --> get all orders by user ID

//POST --> create an order
router.post('/', isLoggedIn, controller.createOrder)

//GET --> get a single order by ID
router.get('/:id', isLoggedIn, controller.getSingleOrder)

//DELETE --> delete a single order by ID
router.delete('/:id', isLoggedIn, isAdmin, controller.deleteOrder)

//PUT --> update a single order by ID
router.put('/:id', isLoggedIn, isAdmin, controller.updateOrder)

export default router
