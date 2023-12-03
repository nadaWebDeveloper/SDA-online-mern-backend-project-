import { NextFunction, Request, Response } from 'express'

import { Category, ICategory } from '../models/category'
import * as services from '../services/categoryService'

// get all categories
export const getAllCategories = async (
  request: Request,
  response: Response,
  next: NextFunction
) => {
  try {
    const limit = Number(request.query.limit) || 0
    const page = Number(request.query.page) || 1
    const search = (request.query.search as string) || ''

    const { allCategoriesOnPage, totalPage, currentPage } = await services.findAllCategories(
      page,
      limit,
      search
    )

    response.status(200).json({
      message: `All categories are returned `,
      payload: {
        allCategoriesOnPage,
        totalPage,
        currentPage,
      },
    })
  } catch (error) {
    next(error)
  }
}

// get a specific category
export const getSingleCategory = async (
  request: Request,
  response: Response,
  next: NextFunction
) => {
  try {
    const { id } = request.params

    const category = await services.findCategoryById(id, next)

    response.status(200).json({
      message: `Single category is returned `,
      payload: category,
    })
  } catch (error) {
    next(error)
  }
}

// delete a specific category
export const deleteCategory = async (request: Request, response: Response, next: NextFunction) => {
  try {
    const { id } = request.params

    const category = await services.findAndDeletedCategory(id, next)

    response.status(200).json({
      message: `Category with ID: ${id} is deleted`,
    })
  } catch (error) {
    next(error)
  }
}

// create a new category
export const createCategory = async (request: Request, response: Response, next: NextFunction) => {
  try {
    const newInput = request.body

    const category = await services.findIfCategoryExist(newInput, next)

    const newProduct: ICategory = new Category({
      name: newInput.name,
    })
    await newProduct.save()

    response.status(201).json({
      message: `New category is created`,
    })
  } catch (error) {
    next(error)
  }
}

// update a specific category
export const updateCategory = async (request: Request, response: Response, next: NextFunction) => {
  try {
    const { id } = request.params
    const updatedCategory = request.body

    const category = await services.findAndUpdateCategory(id, next, updatedCategory)

    response.status(200).json({
      message: `Category with ID: ${id} is updated`,
      payload: category,
    })
  } catch (error) {
    next(error)
  }
}
