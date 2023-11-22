import  { NextFunction, Request, Response } from 'express'

import  * as services from '../services/productService'
import { Product, IProduct } from '../models/product'



 export const getAllProducts = async (request: Request, response: Response, next: NextFunction) => {

    try {

        const limit = Number(request.query.limit) 
        const page = Number(request.query.page) 
        const {allProductOnPage, totalPage ,currentPage} = await services.FindAllProduct(page, limit)    

        response.json({
            message: `Return all products `,
            payload : { 
           allProductOnPage,
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
        const {id} = request.params
        const singleProduct = await services.FindProductById(id , next)  //MProduct.findOne({_id: ID})
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
        const {id} = request.params
        const deletedProduct = await services.findAndDeleted(id,next ) 
        response.json({
            message: `Delete a single product with ID: ${id}`,
        })
    } catch (error) {
        next(error)
    }

}


export const createSingleProduct = async (request: Request, response: Response, next: NextFunction) => {
    try {
        const newInput = request.body
        const productExist = await services.findIfProductExist(newInput , next)
        const newProduct: IProduct = new Product({
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


export const updateSingleProduct = async (request: Request, response: Response, next: NextFunction) => {
    try {
        const {id} = request.params
        const updatedProduct = request.body
        const productUpdated = await services.findAndUpdated(id,next ,updatedProduct)

        response.json({
            message: `Update a single product`,
            payload: productUpdated
        })
    } catch (error) {
        next(error)
    }

}