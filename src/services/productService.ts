import { NextFunction, Response } from "express"

import ApiError from "../errors/ApiError"
import { IProduct, Product } from "../models/product"

export const FindAllProduct = async (page = 1, limit = 3) => {

    //how many have products
    const countPage = await Product.countDocuments()
    //total page
    const totalPage = Math.ceil(countPage / limit)
    if(page > totalPage){
       page = totalPage
    }
    const skip = (page - 1) * limit

// ! Add Query on side Find()
const allProductOnPage: IProduct[] = await Product.find()
.populate('Product').skip(skip).limit(limit)
return  { 
    allProductOnPage,
   totalPage,
   currentPage: page

  }


}

export const FindProductById = async (id: string, next : NextFunction)  => {
    const singleProduct = await Product.findOne({id: id})
 if(!singleProduct){
    throw next(ApiError.badRequest(404,`Product is not found with this id: ${id}`))
    }   
    return singleProduct;
}

export const findAndDeleted = async (id: string,  next : NextFunction) => {
    const deleteSingleProduct = await Product.findOneAndDelete({id: id})
    if(!deleteSingleProduct){
     throw next(ApiError.badRequest(404,`Product is not found with this id: ${id}`))
    }
    return deleteSingleProduct
    // return ProductT.filter((product) => product.id !== id)
    
}


export const findIfProductExist = async (newInput: IProduct,next : NextFunction) => {

    const productExist =  await Product.exists({ name: newInput.name})
    if(productExist){
        throw next(ApiError.badRequest(409,`Product already exist with this Name: ${productExist}`))

    }

    return productExist
}

export const findAndUpdated = async (id: string, next : NextFunction, updatedProduct: Request) => {
    const productUpdated = await Product.findOneAndUpdate({id: id},updatedProduct, {new: true} )
    if(!productUpdated){
        throw next(ApiError.badRequest(404,`Product is not found with this id: ${id}`))
    }
    return productUpdated  
    
}