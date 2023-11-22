import { Response } from 'express'

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

  // ! Add Query on side Find()
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

export const findProductById = async (id: string, response: Response) => {
  const singleProduct = await Product.findOne({ _id: id })
  if (!singleProduct) {
    // next(ApiError.badRequest(`Product is not found with this id: ${ID}`))
    response.status(404).json({
      message: `Product is not found with this id: ${id}`,
    })
    return
  }
  return singleProduct
}

export const findAndDeleted = async (id: string, response: Response) => {
  const deleteSingleProduct = await Product.findOneAndDelete({ _id: id })
  if (!deleteSingleProduct) {
    response.status(404).json({
      message: `Product is not found with this id: ${id}`,
    })
    return
  }
  return deleteSingleProduct
}

export const findIfProductExist = async (newInput: IProduct, response: Response) => {
  const productExist = await Product.exists({ name: newInput.name })
  if (productExist) {
    response.status(409).json({
      message: `Product already exist with this Name: ${productExist}`,
    })
    return
  }

  return productExist
}

export const findAndUpdated = async (id: string, response: Response, updatedProduct: Request) => {
  const productUpdated = await Product.findOneAndUpdate({ _id: id }, updatedProduct, { new: true })
  if (!productUpdated) {
    response.status(404).json({
      message: `Product is not found with this id: ${id}`,
    })
    return
  }
  return productUpdated
}
