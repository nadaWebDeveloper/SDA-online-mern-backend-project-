import { Router } from 'express'

import * as controller from '../controllers/ordersController'

const router = Router()

//GET --> get all orders
router.get('/', controller.getAllOrders)

//POST --> create an order
router.post('/', controller.createOrder)

//GET --> get a single order by ID
router.get('/:id', controller.getSingleOrder)

//DELETE --> delete a single order by ID
router.delete('/:id', controller.deleteOrder)

//PUT --> update a single order by ID
router.put('/:id', controller.updateOrder)

export default router
