import { Router } from 'express'

import * as controller from '../controllers/productsController'

const router = Router()

// GET : /products -> getAllProducts
router.get(`/`, controller.getAllProducts)

//GET: /products/:id -> getSingleProductById -> findProductById
router.get(`/:id`, controller.getSingleProduct)

//GET: /products/:id -> deleteSingleProduct -> findAndDeleted
router.delete(`/:id`, controller.deleteProduct)

//POST : /products -> createSingleProduct -> findIfProductExist
router.post('/', controller.createProduct)

//PUT : /products/:id -> updateSingleProduct -> findAndUpdated
router.put(`/:id`, controller.updateProduct)

export default router
