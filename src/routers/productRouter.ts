import { Router } from "express";
import * as controller from "../controller/productController";
// import * as controller from

 const router = Router()
 
 // * GET : /products -> getAllProducts
 router.get('/' , controller.getAllProducts )


 export default router