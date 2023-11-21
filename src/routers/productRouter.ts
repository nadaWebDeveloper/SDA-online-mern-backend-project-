import { Router } from "express";

import * as controller from "../controller/productController";

 const router = Router()

 // * GET : /products -> getAllProducts
 router.get(`/` , controller.getAllProducts )

 //GET: /products/:id -> getSingleProductById -> FindProductById
 router.get(`/:id`, controller.getSingleProductById )

 //GET: /products/:id -> deleteSingleProduct -> deleteProductById
router.delete(`/:id`, controller.deleteSingleProduct)


 export default router