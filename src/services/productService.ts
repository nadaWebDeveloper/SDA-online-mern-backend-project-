import { NextFunction } from 'express'

import ApiError from '../errors/ApiError'
import { IProduct, Product } from '../models/product'

export const findAllProduct = async (page = 1, limit = 3) => {
  //how many have products
  const countPage = await Product.countDocuments()
  //total page
  const totalPage = Math.ceil(countPage / limit)
  if (page > totalPage) {
    page = totalPage
  }
  const skip = (page - 1) * limit

  const allProductOnPage: IProduct[] = await Product.find()
    .populate('Products')
    .skip(skip)
    .limit(limit)
  return {
    allProductOnPage,
    totalPage,
    currentPage: page,
  }
}

export const findProductById = async (id: string, next: NextFunction) => {
  const singleProduct = await Product.findOne({ _id: id })
  if (!singleProduct) {
    next(ApiError.badRequest(404, `Product is not found with this id: ${id}`))
    return
  }
  return singleProduct
}

export const findAndDeleted = async (id: string, next: NextFunction) => {
  const deleteSingleProduct = await Product.findOneAndDelete({ _id: id })
  if (!deleteSingleProduct) {
    next(ApiError.badRequest(404, `Product is not found with this id: ${id}`))
    return
  }
  return deleteSingleProduct
}

export const findIfProductExist = async (newInput: IProduct, next: NextFunction) => {
  const name = newInput.name
  const productExist = await Product.exists({ name: name })
  if (productExist) {
    return next(ApiError.badRequest(409, `Product already exist with this Name: ${name}`))
  }
  return productExist
}

export const findAndUpdated = async (id: string, next: NextFunction, updatedProduct: Request) => {
  const productUpdated = await Product.findOneAndUpdate({ _id: id }, updatedProduct, { new: true })
  if (!productUpdated) {
    next(ApiError.badRequest(404, `Product is not found with this id: ${id}`))
    return
  }
  return productUpdated
}

// search products by name
export const searchProductsByName = async (name: string, next: NextFunction) => {
  const searchResult = await Product.find({
    $or: [{ name: { $regex: name } }],
  })

  if (searchResult.length === 0) {
    next(ApiError.badRequest(404, `No results found with the keyword ${name}`))
    return
  }
  return searchResult
}
