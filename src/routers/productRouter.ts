import { Router } from 'express'

import * as controller from '../controllers/productsController'
import { productValidation } from '../validation/productsValidation'
import { runValidation } from '../validation/runValidation'
import { isLoggedIn } from '../middlewares/authentication'

const router = Router()

// GET : /products -> getAllProducts
router.get(`/`, controller.getAllProducts)

//GET: /products/:id -> getSingleProductById -> findProductById
router.get(`/:id`, controller.getSingleProduct)

//DELETE: /products/:id -> deleteSingleProduct -> findAndDeleted
router.delete(`/:id`, isLoggedIn, controller.deleteProduct)

//POST : /products -> createSingleProduct -> findIfProductExist
router.post('/', isLoggedIn, productValidation, runValidation, controller.createProduct)

//PUT : /products/:id -> updateSingleProduct -> findAndUpdated
router.put(`/:id`, isLoggedIn, productValidation, runValidation, controller.updateProduct)

export default router
