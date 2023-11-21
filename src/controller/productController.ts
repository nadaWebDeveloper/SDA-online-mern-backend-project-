import  { NextFunction, Request, Response } from 'express'
import  * as services from '../services/productService'
import { MProduct, IFProduct } from '../models/product'



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




export const getSingleProductById = async (request: Request, response: Response, next: NextFunction) => {

    try {
        const ID = request.params.id
        const singleProduct = await services.FindProductById(ID,response )  //MProduct.findOne({_id: ID})
        response.json({
            message: `Return a single product `,
            payload: singleProduct
        })
        
    } catch (error) {
        next(error)
    }

}


export const deleteSingleProduct = async (request: Request, response: Response, next: NextFunction) => {
    try {
        const ID = request.params.id
        const ProductsAfterDelete = await services.deleteProductById(ID,response ) 
        response.json({
            message: `Delete a single product with ID: ${ID}`,
        })
    } catch (error) {
        next(error)
    }

}


export const createSingleProduct = async (request: Request, response: Response, next: NextFunction) => {
    try {
        const newInput = request.body
        const productExist = await services.findIfProductExist(newInput , response)
        const newProduct: IFProduct = new MProduct({
            name: newInput.name,
            price: newInput.price,
            image: newInput.image,
            quantity:newInput.quantity,
            sold: newInput.sold,
            description: newInput.description,
        })
        await newProduct.save()
        response.status(201).json({
            message: `Create a single product`,
        })
    } catch (error) {
        next(error)
    }
}