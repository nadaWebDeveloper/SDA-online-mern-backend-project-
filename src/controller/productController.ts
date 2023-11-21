import  { NextFunction, Request, Response } from 'express'
import  * as services from '../services/productService'



 // * GET : /products -> getAllProducts
 export const getAllProducts = async (request: Request, response: Response, next: NextFunction) => {

    try {

        const limit = Number(request.query.limit) 
        let page = Number(request.query.page) 
        const {AllProductOnPage, totalPage ,currentPage} = await services.FindAllProduct(page, limit)    

        response.json({
            message: `Return all products `,
            payload : { 
           AllProductOnPage,
              totalPage,
               currentPage
            }
        })
        
    } catch (error) {
        next(error)
    }
}