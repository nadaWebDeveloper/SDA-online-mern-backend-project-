import { Router } from 'express'

import * as controller from '../controllers/productsController'
import { productValidation } from '../validation/productsValidation'
import { runValidation } from '../validation/runValidation'
import { isAdmin, isLoggedIn } from '../middlewares/authentication'
import { upload } from '../middlewares/uploadFile'


const router = Router()

// GET : /products -> getAllProducts
router.get(`/`, controller.getAllProducts)

//GET: /products/:id -> getSingleProductById -> findProductById
router.get(`/:id`, controller.getSingleProduct)

//DELETE: /products/:id -> deleteSingleProduct -> findAndDeleted
router.delete(`/:id`, isLoggedIn, isAdmin, controller.deleteProduct)

//POST : /products -> createSingleProduct -> findIfProductExist
router.post('/', isLoggedIn, isAdmin, productValidation, runValidation, upload.single('image'),controller.createProduct)

//PUT : /products/:id -> updateSingleProduct -> findAndUpdated
router.put(`/:id`, isLoggedIn, isAdmin, productValidation, runValidation, upload.single('image'), controller.updateProduct)

export default router
