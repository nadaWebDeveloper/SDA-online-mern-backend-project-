import { NextFunction } from 'express'

import ApiError from '../errors/ApiError'
import { ICategory, Category } from '../models/category'

export const findAllCategories = async (page = 1, limit = 3) => {
  //how many have categories
  const countPage = await Category.countDocuments()
  //total page
  const totalPage = Math.ceil(countPage / limit)
  if (page > totalPage) {
    page = totalPage
  }
  const skip = (page - 1) * limit

  const allCategoriesOnPage: ICategory[] = await Category.find().skip(skip).limit(limit)
  return {
    allCategoriesOnPage,
    totalPage,
    currentPage: page,
  }
}

export const findCategoryById = async (id: string, next: NextFunction) => {
  const singleCategory = await Category.findOne({ _id: id })
  if (!singleCategory) {
    next(ApiError.badRequest(404, `Category is not found with this id: ${id}`))
    return
  }
  return singleCategory
}

export const findAndDeleted = async (id: string, next: NextFunction) => {
  const deleteSingleCategory = await Category.findOneAndDelete({ _id: id })
  if (!deleteSingleCategory) {
    next(ApiError.badRequest(404, `Category is not found with this id: ${id}`))
    return
  }
  return deleteSingleCategory
}

export const findIfCategoryExist = async (newInput: ICategory, next: NextFunction) => {
  const name = newInput.name
  const categoryExist = await Category.exists({ name: name })
  if (categoryExist) {
    return next(ApiError.badRequest(409, `Category already exist with this Name: ${name}`))
  }
  return categoryExist
}

export const findAndUpdated = async (id: string, next: NextFunction, updatedProduct: Request) => {
  const categoryUpdated = await Category.findOneAndUpdate({ _id: id }, updatedProduct, {
    new: true,
  })
  if (!categoryUpdated) {
    next(ApiError.badRequest(404, `Category is not found with this id: ${id}`))
    return
  }
  return categoryUpdated
}
