import { NextFunction, Request, Response } from 'express'
import mongoose from 'mongoose'


import * as services from '../services/productService'
import { Product, IProduct } from '../models/product'
import ApiError from '../errors/ApiError'

// * GET : /products -> getAllProducts
export const getAllProducts = async (request: Request, response: Response, next: NextFunction) => {
  try {
    const  products  = await services.findAllProduct(request)
    response.json({
      message: `Return all products `,
      payload: {
        products
      },
    })
  } catch (error) {
    next(error)
  }
}

export const getSingleProduct = async (request: Request, response: Response, next: NextFunction) => {
  try {
    const { id } = request.params

    const singleProduct = await services.findProductById(id, next) 
    response.json({
      message: `Return a single product `,
      payload: singleProduct,
    })
  } catch (error) {
if(error instanceof mongoose.Error.CastError){
  next(ApiError.badRequest(400,`ID format is Invalid must be 24 characters`))
}else{
  next(error)
}  
}
}

export const deleteProduct = async (request: Request, response: Response, next: NextFunction) => {
  try {
    const { id } = request.params
    const deletedProduct = await services.findAndDeleted(id, next)
    response.json({
      message: `Delete a single product with ID: ${id}`,
    })
  } catch (error) {
    if(error instanceof mongoose.Error.CastError){
      next(ApiError.badRequest(400,`ID format is Invalid must be 24 characters`))
    
    }else{
      next(error)
    
    } 
  }
}

export const createProduct = async (request: Request, response: Response, next: NextFunction) => {
  try {
    const newInput = request.body
    const productExist = await services.findIfProductExist(newInput, next)
    const newProduct: IProduct = new Product({
      name: newInput.name,
      price: newInput.price,
      image: newInput.image,
      quantity: newInput.quantity,
      sold: newInput.sold,
      description: newInput.description,
      category: newInput.category
    })
    await newProduct.save()
    response.status(201).json({
      message: `Create a single product`,
    })
  } catch (error) {
    if(error instanceof mongoose.Error.CastError){
      next(ApiError.badRequest(400,`ID format is Invalid must be 24 characters`))
    
    }else{
      next(error)
    
    }   }
}

export const updateProduct = async (request: Request, response: Response, next: NextFunction) => {
  try {
    const { id } = request.params
    const updatedProduct = request.body
    const productUpdated = await services.findAndUpdated(id, next, updatedProduct)

    response.json({
      message: `Update a single product`,
      payload: productUpdated,
    })
  } catch (error) {
    if(error instanceof mongoose.Error.CastError){
      next(ApiError.badRequest(400,`ID format is Invalid must be 24 characters`))
    
    }else{
      next(error)
    } 
  }
}

export const sortProductByDate = async (request: Request, response: Response, next: NextFunction) => {
 
  try {
    const { sortBy } = request.query;
    let sortOption = {};

    if (sortBy) {
      // Set the sorting option based on the query parameter
      sortOption = { sortBy: 1 }; // 1 for ascending, -1 for descending
    }

    const products = await Product.find().sort(sortOption);
    response.json(products);
  } catch (error) {
    next(error) 
}
}

