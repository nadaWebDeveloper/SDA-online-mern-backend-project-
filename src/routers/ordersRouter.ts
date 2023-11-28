import { Router } from 'express'

import * as controller from '../controllers/ordersController'
import { isLoggedIn } from '../middlewares/authentication'

const router = Router()

//GET --> get all orders
router.get('/', isLoggedIn, controller.getAllOrders)

//POST --> create an order
router.post('/', isLoggedIn, controller.createOrder)

//GET --> get a single order by ID
router.get('/:id', isLoggedIn, controller.getSingleOrder)

//DELETE --> delete a single order by ID
router.delete('/:id', isLoggedIn, controller.deleteOrder)

//PUT --> update a single order by ID
router.put('/:id', isLoggedIn, controller.updateOrder)

export default router
