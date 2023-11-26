import { Router } from 'express'

import * as controller from '../controllers/productsController'
import { productValidation } from '../validation/productsValidation'
import { runValidation } from '../validation/runValidation'

const router = Router()

// GET : /products -> getAllProducts
router.get(`/`, controller.getAllProducts)

//GET: /products/:id -> getSingleProductById -> FindProductById
router.get(`/:id`, controller.getSingleProduct)

//GET: /products/:id -> deleteSingleProduct -> findAndDeleted
router.delete(`/:id`, controller.deleteProduct)

//POST : /products -> createSingleProduct -> findIfProductExist
router.post('/', productValidation, runValidation, controller.createProduct)

//PUT : /products/:id -> updateSingleProduct -> findAndUpdated
router.put(`/:id`, productValidation, runValidation, controller.updateProduct)

export default router
