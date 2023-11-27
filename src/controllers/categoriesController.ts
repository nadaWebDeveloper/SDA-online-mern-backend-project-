import { NextFunction, Request, Response } from 'express'

import * as services from '../services/categoryService'
import { Category, ICategory } from '../models/category'

// GET -> get all categories
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

    response.json({
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

export const getSingleCategory = async (
  request: Request,
  response: Response,
  next: NextFunction
) => {
  try {
    const { id } = request.params
    const category = await services.findCategoryById(id, next)
    response.json({
      message: `Single category is returned `,
      payload: category,
    })
  } catch (error) {
    next(error)
  }
}

export const deleteCategory = async (request: Request, response: Response, next: NextFunction) => {
  try {
    const { id } = request.params
    const category = await services.findAndDeleted(id, next)
    response.json({
      message: `Category with ID: ${id} is deleted`,
    })
  } catch (error) {
    next(error)
  }
}

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

export const updateCategory = async (request: Request, response: Response, next: NextFunction) => {
  try {
    const { id } = request.params
    const updatedCategory = request.body
    const category = await services.findAndUpdated(id, next, updatedCategory)

    response.json({
      message: `Category with ID: ${id} is updated`,
      payload: category,
    })
  } catch (error) {
    next(error)
  }
}
