import { Router } from 'express'
import {
  createOrder,
  deleteOrderById,
  getAllOrders,
  getOrderById,
  updateOrderById,
} from '../controllers/ordersControllers'

const router = Router()

router.get('/', getAllOrders)
router.post('/', createOrder)
router.get('/:id', getOrderById)
router.put('/:id', updateOrderById)
router.delete('/:id', deleteOrderById)

export default router
