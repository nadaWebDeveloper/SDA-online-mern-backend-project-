import { NextFunction, Request, Response } from 'express'
import mongoose from 'mongoose'

import ApiError from '../errors/ApiError'
import { IProduct, Product } from '../models/product'
import * as services from '../services/productService'

import {  uploadToCloudinary } from '../helper/cloudinaruHelper'
          


// get all products
export const getAllProducts = async (request: Request, response: Response, next: NextFunction) => {
  try {
    const { allProductOnPage,totalPage, currentPage , totalProduct , limit, page , rangeId , sortName ,searchFilter} = await services.findAllProducts(request)

    response.status(200).json({
      message: `Return all products `,
      allProductOnPage,
      rangeId,
      sortName,
      searchFilter,
      pagination : {
        totalPage, 
        currentPage,
        totalProduct,
        limit,
        page,
      }
    })
  } catch (error) {
    next(error)
  }
}
// get a specific product
export const getSingleProduct = async (
  request: Request,
  response: Response,
  next: NextFunction
) => {
  try {
    const { id } = request.params

    const singleProduct = await services.findProductById(id, next)

    response.status(200).json({
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
// delete a specific product
export const deleteProduct = async (request: Request, response: Response, next: NextFunction) => {
  try {
    const { id } = request.params
    const deletedProduct = await services.findAndDeletedProduct(id, next)
  
    response.status(200).json({
      message: `Delete a single product with ID: ${id}`,
    })
  } catch (error) {
    if (error instanceof mongoose.Error.CastError) {
      if (error.path === '_id' && error.kind === 'ObjectId') {
        next(
          ApiError.badRequest(
            400,
            `Invalid ID format: ID format is Invalid must be 24 characters on schema  feild : ${error.path} : ${error.message}`
          )
        )
      } else {
        next(ApiError.badRequest(400, `Invalid data format. Please check your input`))
      }
    } else {
      console.log(error);
      next(error)
    }
  }
}
// create a new product
export const createProduct = async (request: Request, response: Response, next: NextFunction) => {
  try {
    const newInput = request.body
    const imagePath = request.file && request.file.path
 
  
    const productExist = await services.findIfProductExist(newInput, next)

    const newProduct: IProduct = new Product({
      name: newInput.name,
      price: newInput.price,
      quantity: newInput.quantity,
      sold: newInput.sold,
      description: newInput.description,
      categories: newInput.categories,
    })

    if (imagePath) {
     //to store image on server
     newProduct.image = imagePath
    } else if (!imagePath) {
      next(ApiError.badRequest(400, `No Image added on DBYet!`))
    }

    response.status(201).json({
      message: `Create a single product` ,
      payload:newProduct,
      

    })

    if (newProduct ) {
      //this want to save on cloudinary " image: '/var/folders/fc/8n7zg8d54tzfwsxb770tm_dw0000gn/T/1703172805923-images7.jpeg'"
      //newProduct.image -> to store on cloudinary -> give response(URL)
      const cloudinaryUrl = await uploadToCloudinary(newProduct.image, 'sda-E-Commerce')
      newProduct.image = cloudinaryUrl
     await newProduct.save()
    } else {
      next(ApiError.badRequest(400, `Invalid document`))
    }

  } catch (error) {
    if (error instanceof mongoose.Error.CastError) {
      throw ApiError.badRequest(
        400,
        `Invalid ID format: ID format is Invalid must be 24 characters`
      )
    } else {
      next(error)
    }
  }
}
// update a specific product
export const updateProduct = async (request: Request, response: Response, next: NextFunction) => {
  try {
    const { id } = request.params
   
    const productUpdated = await services.findAndUpdateProduct(id, request,response ,next)

 
  } catch (error) {
    if (error instanceof mongoose.Error.CastError) {
      throw ApiError.badRequest(400, `ID format is Invalid must be 24 characters`)
    } else {
      next(error)
    }
  }
}
