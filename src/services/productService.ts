import { Response } from "express"

import ApiError from "../errors/ApiError"
import { IFProduct, MProduct } from "../models/product"

export const FindAllProduct = async (page = 1, limit = 3) => {

    //how many have products
    const countPage = await MProduct.countDocuments()
    //total page
    const totalPage = Math.ceil(countPage / limit)
    if(page > totalPage){
       page = totalPage
    }
    const skip = (page - 1) * limit

// ! Add Query on side Find()
const AllProductOnPage: IFProduct[] = await MProduct.find()
.populate('Product').skip(skip).limit(limit)
return  { 
    AllProductOnPage,
   totalPage,
   currentPage: page

  }


}

export const FindProductById = async (ID: string, response: Response)  => {
    const singleProduct = await MProduct.findOne({id: ID})
 if(!singleProduct){
    // next(ApiError.badRequest(`Product is not found with this id: ${ID}`))
    response.status(404).json({
        message: `Product is not found with this id: ${ID}`
    })
    return
    }   
    return singleProduct;
}

export const findAndDeleted = async (ID: string, response: Response) => {
    const deleteSingleProduct = await MProduct.findOneAndDelete({id: ID})
    if(!deleteSingleProduct){
        response.status(404).json({
            message: `Product is not found with this id: ${ID}`
        })
        return
    }
    return deleteSingleProduct
}


export const findIfProductExist = async (newInput: IFProduct, response: Response) => {

    const productExist =  await MProduct.exists({ name: newInput.name})
    if(productExist){
        response.status(409).json({
            message: `Product already exist with this Name: ${productExist}`
        })
        return
    }

    return productExist
}

export const findAndUpdated = async (ID: string, response: Response, updatedProduct: Request) => {
    const productUpdated = await MProduct.findOneAndUpdate({id: ID},updatedProduct, {new: true} )
    if(!productUpdated){
        response.status(404).json({
            message: `Product is not found with this id: ${ID}`
        })
        return
    }
    return productUpdated  
    
}