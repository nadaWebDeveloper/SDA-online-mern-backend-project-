import { NextFunction, Request , Response } from 'express'
import mongoose from 'mongoose'

import ApiError from '../errors/ApiError'
import { IProduct, Product } from '../models/product'
import { deleteImage } from '../helper/deleteImageHelper'
import { deleteImageFromCloudinary, uploadToCloudinary, valueWithOutExtension } from '../helper/cloudinaruHelper'

// return all products using pagination
export const findAllProducts = async (request: Request) => {
  const limit = Number(request.query.limit) || 0
  let page = Number(request.query.page) || 1
  const search = (request.query.search as string) || ''
  const { rangeId } = request.query || { $gte: 0 }
  //sort 
  const sortName  = String(request.query.sortName) || 'price'
  let sortOption: Record<string, any>= {}
  let sortNum =request.query.sortNum || 1
  const skipField = {__v: 0, updateAt: 0}

  let priceFilter = { $gte: 0, $lte: Number.MAX_SAFE_INTEGER }

  // search products
  const searchRegularExpression = new RegExp('.*' + search + '.*', 'i')
  const searchFilter = {
    // name:{$en : 'nada'}, //return all name product except which hold same this value
    $or: [
      { name: { $regex: searchRegularExpression } },
      { description: { $regex: searchRegularExpression } },
    ],
  }

  //filter products by price
  if (rangeId) {
    switch (rangeId) {
      case 'range0':
        priceFilter = { $gte: 0, $lte: Number.MAX_SAFE_INTEGER }
        break
      case 'range1':
        priceFilter = { $gte: 0, $lte: 99 }
        break
      case 'range2':
        priceFilter = { $gte: 100, $lte: 199 }
        break
      case 'range3':
        priceFilter = { $gte: 200, $lte: 399 }
        break
      case 'range4':
        priceFilter = { $gte: 400, $lte: 699 }
        break
      case 'range5':
        priceFilter = { $gte: 1000, $lte: Number.MAX_SAFE_INTEGER }
        break
      default:
        throw ApiError.badRequest(404, 'Invalid range')
    }
  }

  //sort http://localhost:5050/products?sortName=name&sortNum=1
  //http://localhost:5050/products?sortName=createAt&sortNum=1
  sortNum?  -1 :1
  sortOption[sortName]=   sortNum;
  //how many have products
  const countPage = await Product.countDocuments()

  //total page
  const totalPage = limit ? Math.ceil(countPage / limit) : 1
  if (page > totalPage) {
    page = totalPage
  }
  const skip = (page - 1) * limit

  // return results
  const allProductOnPage: IProduct[] = await Product.find({
    $and: [searchFilter, { price: priceFilter }],
  },skipField)
    .populate('categories')
    .skip(skip)
    .limit(limit)
    .sort(sortOption) 
 

  
  if (allProductOnPage.length === 0 ) {
    throw ApiError.badRequest(404, 'No matching results')
  }

  const totalProduct = allProductOnPage.length
  return {
    allProductOnPage,
    totalPage,
    totalProduct,
    currentPage: page,
    limit,
    page,
    rangeId,
    sortName,
    searchFilter
  }
}
// find order by id
export const findProductById = async (id: string, next: NextFunction) => {
  const singleProduct = await Product.findOne({ _id: id })
  if (!singleProduct) {
    throw ApiError.badRequest(404, `Product is not found with this id: ${id}`)
  }
  return singleProduct
}
// find and delete product by id
export const findAndDeletedProduct = async (id: string, next: NextFunction) => {

   //check if product exist or not
   const product = await Product.findById({_id: id })
   console.log('product exist',product);
   if(!product){
    throw ApiError.badRequest(404, `Product is not found`)
   }

      //if product has image then delete it from cloudinary
      if(product && product.image){
         const publicID = await valueWithOutExtension(product.image)
        const deleteSingleProduct = await Product.findOneAndDelete({ _id: id })

        if (!deleteSingleProduct) {
          throw ApiError.badRequest(404, `Product is not found with this id: ${id}`)
        }
       
    if(publicID){
         await deleteImageFromCloudinary(`sda-E-Commerce/${publicID}`)
         return deleteSingleProduct
        }


         }

   

}
//check entered product is exist on DB or not when a create new product
export const findIfProductExist = async (newInput: IProduct, next: NextFunction) => {
  const nameInput = newInput.name
  const productExist = await Product.exists({ name: nameInput })
  if (productExist) {
    throw ApiError.badRequest(409, `Product already exist with this Name: ${nameInput}`)
  }
  return productExist
}

// find and update product by id
export const findAndUpdateProduct = async (id: string,request: Request,response: Response , next: NextFunction) => {
 
try {

  const fields = ['categories', 'description', 'name' ,'price', 'quantity' , 'sold', 'image']
  const updated: Record<string, unknown> = {}
  const productExist = await Product.findById(id)
  console.log('productExist',productExist);
  if (!productExist) {
    throw ApiError.badRequest(404, `Product is not found`)
  }

    for (const key in request.body){
      if(fields.includes(key)){
        updated[key] = request.body[key]
      }else{
        throw ApiError.badRequest(400, ` ${key} can not be updated`)
      }
    }

    const image = request.file?.path 
    if(image){
      const cloudinaryURL = await uploadToCloudinary(image, 'sda-E-Commerce')
      updated.image = cloudinaryURL
    }
     const productUpdated = await Product.findByIdAndUpdate(id, updated, {
      new: true,
    })
    if (!productUpdated) {
      throw ApiError.badRequest(404, `Product is not found with this id: ${id}`)
    }
    
    response.status(200).json({
      message: `Update a single product`,
       payload: productUpdated,
    })

    //delete image from cloudinary
    if(productExist?.image){
      const publicID = await valueWithOutExtension(productExist.image)
      await deleteImageFromCloudinary(`sda-E-Commerce/${publicID}`)
    }

     //return productUpdated
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
