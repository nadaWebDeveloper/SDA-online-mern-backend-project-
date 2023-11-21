import { Router } from "express";

import * as controller from "../controller/productController";

 const router = Router()

 // GET : /products -> getAllProducts
 router.get(`/` , controller.getAllProducts )

 //GET: /products/:id -> getSingleProductById -> FindProductById
 router.get(`/:id`, controller.getSingleProductById )

 //GET: /products/:id -> deleteSingleProduct -> findAndDeleted
router.delete(`/:id`, controller.deleteSingleProduct)

//POST : /products -> createSingleProduct -> findIfProductExist
router.post('/' ,controller.createSingleProduct)

//PUT : /products/:id -> updateSingleProduct -> findAndUpdated
router.put(`/:id`, controller.updateSingleProduct)


 export default router