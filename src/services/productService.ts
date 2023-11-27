import { NextFunction, Request } from 'express'

import ApiError from '../errors/ApiError'
import { IProduct, Product } from '../models/product'

export const findAllProduct = async (request: Request) => {
  const limit = Number(request.query.limit) || 3
  let page = Number(request.query.page) || 1
  const search = (request.query.search as string) || ''
  const { rangeId } = request.query || { $gte: 0 }

  let priceFilter = { $gte: 0, $lte: Number.MAX_SAFE_INTEGER }

  // serach products
  const searchRegularExpression = new RegExp('.*' + search + '.*', 'i')
  const searchFilter = {
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

  //how many have products
  const countPage = await Product.countDocuments()

  //total page
  const totalPage = Math.ceil(countPage / limit)
  if (page > totalPage) {
    page = totalPage
  }
  const skip = (page - 1) * limit

  // return results
  const allProductOnPage: IProduct[] = await Product.find({
    $and: [searchFilter, { price: priceFilter }],
  })
    .populate('categories')
    .skip(skip)
    .limit(limit)

  if (allProductOnPage.length === 0) {
    throw ApiError.badRequest(404, 'No matching results')
  }
  return {
    allProductOnPage,
    totalPage,
    currentPage: page,
  }
}

export const findProductById = async (id: string, next: NextFunction) => {
  const singleProduct = await Product.findOne({ _id: id })
  if (!singleProduct) {
    throw ApiError.badRequest(404, `Product is not found with this id: ${id}`)
  }
  return singleProduct
}

export const findAndDeleted = async (id: string, next: NextFunction) => {
  const deleteSingleProduct = await Product.findOneAndDelete({ _id: id })
  if (!deleteSingleProduct) {
    throw ApiError.badRequest(404, `Product is not found with this id: ${id}`)
  }
  return deleteSingleProduct
}

export const findIfProductExist = async (newInput: IProduct, next: NextFunction) => {
  const nameInput = newInput.name
  const productExist = await Product.exists({ name: nameInput })
  if (productExist) {
    throw ApiError.badRequest(409, `Product already exist with this Name: ${nameInput}`)
  }
  return productExist
}

export const findAndUpdated = async (id: string, next: NextFunction, updatedProduct: Request) => {
  const productUpdated = await Product.findByIdAndUpdate(id, updatedProduct, {
    new: true,
    runValidators: true,
  })
  if (!productUpdated) {
    throw ApiError.badRequest(404, `Product is not found with this id: ${id}`)
  }
  return productUpdated
}
