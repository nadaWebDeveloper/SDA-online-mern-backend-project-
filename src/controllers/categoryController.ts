import { Response, Request, NextFunction } from 'express'
import { Category } from '../models/category'
import ApiError from '../errors/ApiError'

//GET ALL categories
export const getAllCategories = async (
  request: Request,
  response: Response,
  next: NextFunction
) => {
  try {
    const categories = await Category.find()
    response.json({ message: 'All categories returned', payload: categories })
  } catch (error) {
    next(error)
  }
}

//GET SINGLE Category
export const getSingleCategory = async (
  request: Request,
  response: Response,
  next: NextFunction
) => {
  try {
    const { id } = request.params
    const category = await Category.findById(id)
    response.json({ message: 'Category is returned', payload: category })
    if (!category) {
      throw next(ApiError.badRequest(404, `No category found with id ${id}`))
    }
  } catch (error) {
    next(error)
  }
}

//CREATE Category
export const createCategory = async (request: Request, response: Response, next: NextFunction) => {
  try {
    const { name } = request.body
    const newCategory = new Category({
      name: name,
    })
    await newCategory.save()
    response.json({ message: 'Category is created' })
  } catch (error) {
    next(error)
  }
}

//DELETE Category
export const deleteCategory = async (request: Request, response: Response, next: NextFunction) => {
  try {
    const { id } = request.params
    const category = await Category.findByIdAndDelete(id)
    response.json({ message: 'Category is deleted', payload: category })
    if (!category) {
      throw next(ApiError.badRequest(404, `Category with id ${id} not found`))
    }
  } catch (error) {
    next(error)
  }
}

//UPDATE Category
export const updateCategory = async (request: Request, response: Response, next: NextFunction) => {
  try {
    const { id } = request.params
    const updatedCategory = request.body
    const category = await Category.findByIdAndUpdate(id, updatedCategory, {
      new: true,
    })
    response.json({ message: 'Category is updated', payload: category })
    if (!category) {
      throw next(ApiError.badRequest(404, `Category with id ${id} not found`))
    }
  } catch (error) {
    next(error)
  }
}
