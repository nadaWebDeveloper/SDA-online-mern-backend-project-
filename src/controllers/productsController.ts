import { NextFunction, Request, Response } from 'express'
import mongoose from 'mongoose'
import fs from 'fs/promises'

import path from 'path'

import * as services from '../services/productService'
import { Product, IProduct } from '../models/product'
import ApiError from '../errors/ApiError'

// * GET : /products -> getAllProducts
export const getAllProducts = async (request: Request, response: Response, next: NextFunction) => {
  try {
    const products = await services.findAllProduct(request)

    response.json({
      message: `Return all products `,
      payload: {
        products,
      },
    })
  } catch (error) {
      next(error)
}}
  
export const getSingleProduct = async (
  request: Request,
  response: Response,
  next: NextFunction
) => {
  try {
    const { id } = request.params

    const singleProduct = await services.findProductById(id, next)

    response.json({
      message: `Return a single product `,
      payload: singleProduct,
    })
  } catch (error) {
    if (error instanceof mongoose.Error.CastError) {
      next(ApiError.badRequest(400, `ID format is Invalid must be 24 characters`))
    } else {
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
    if (error instanceof mongoose.Error.CastError) {
      if (error.path === '_id' && error.kind === 'ObjectId') {
        next(ApiError.badRequest(400, `Invalid ID format: ID format is Invalid must be 24 characters on schema  feild : ${ error.path} : ${error.message}`))
      } else {
        next(ApiError.badRequest(400, `Invalid data format. Please check your input`))

      }
    }
     else {
      next(error)
    }
  }
}

export const createProduct = async (request: Request, response: Response, next: NextFunction) => {
  try {

    const newInput = request.body
    const imagePath =  request.file?.path
    console.log("imagePath: ",imagePath);

    const productExist = await services.findIfProductExist(newInput, next)
    const newProduct: IProduct = new Product({
      name: newInput.name,
      price: newInput.price,
      quantity: newInput.quantity,
      sold: newInput.sold,
      // image: imagePath,
      description: newInput.description,
      categories: newInput.categories,
    })
    if(imagePath){
      newProduct.image = imagePath
      console.log("newProduct: ",newProduct.image);
    }
    if(newProduct){
      await newProduct.save()
    }else{
      next(ApiError.badRequest(400, `Invalid document`))

    }
    response.status(201).json({
      message: `Create a single product`,
    })
  
  } catch (error) {
    if (error instanceof mongoose.Error.CastError) {
      throw(ApiError.badRequest(400, `Invalid ID format: ID format is Invalid must be 24 characters`))
    }

  else {
      next(error)
    }
  }
}

export const updateProduct = async (request: Request, response: Response, next: NextFunction) => {
  try {
    const { id } = request.params
    const updatedProduct = request.body

    const newProduct: IProduct = new Product({
      updatedProduct
    })


    let imgUrl = ''
   if (request.file?.path && updatedProduct) {
  //  const nameImage = request.file.filename
   const newImage =  request.file?.path
  //  console.log("newImage: ",newImage);
   imgUrl = `public/images/imageProduct/${newImage}`
    updatedProduct.image= imgUrl
    //check product have image
    const productInfo = await Product.findById(id)
    const productImage = productInfo?.image
    console.log('productImage: ',productImage);
    if(productImage){
     try{
        fs.unlink(productImage)
        console.log('File deleted successfully');
      } catch (error) {
        throw(ApiError.badRequest(400, `Error deleting file:${error}`))
      }
    }
   else if(!productImage){
     try{
      const productUpdated = await services.findAndUpdated(id,request ,next, updatedProduct)

      const imagePath =  request.file?.path
console.log(imagePath);
      // newProduct.image = imagePath
      // await newProduct.save()
    } catch (error) {
      throw(ApiError.badRequest(400, `Error Adding file:${error}`))
    }
  }
   
   }

const productUpdated = await services.findAndUpdated(id,request ,next, updatedProduct)


    response.json({
      message: `Update a single product`,
      payload: productUpdated,
    })
  } catch (error) {
    if (error instanceof mongoose.Error.CastError) {
      throw ApiError.badRequest(400, `ID format is Invalid must be 24 characters`)
    } else {
      next(error)
      console.log("error: ",error);
    }
  }
}

