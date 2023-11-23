import { Router } from 'express'

import * as controller from '../controllers/ordersController'

const router = Router()

router.get('/', controller.getAllOrders)

router.post('/', controller.createOrder)

router.get('/:id', controller.getSingleOrder)

router.put('/:id', controller.updateOrder)

router.delete('/:id', controller.deleteOrder)

export default router
