import { Response, Request, NextFunction } from 'express'
import mongoose from 'mongoose'

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
    if (!category) {
      throw next(ApiError.badRequest(404, `No category found with id ${id}`))
    }
    response.json({ message: 'Category is returned', payload: category })
  } catch (error) {
    if(error instanceof mongoose.Error.CastError){
      next(ApiError.badRequest(400,`ID format is Invalid must be 24 characters`))
    
    }else{
      next(error)
    
    } 
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
    if(error instanceof mongoose.Error.CastError){
      next(ApiError.badRequest(400,`ID format is Invalid must be 24 characters`))
    
    }else{
      next(error)
    
    }
  }
}

//DELETE Category
export const deleteCategory = async (request: Request, response: Response, next: NextFunction) => {
  try {
    const { id } = request.params

    const category = await Category.findByIdAndDelete(id)
    if (!category) {
      throw next(ApiError.badRequest(404, `Category with id ${id} not found`))
    }
    response.json({ message: 'Category is deleted', payload: category })
  } catch (error) {
    if(error instanceof mongoose.Error.CastError){
      next(ApiError.badRequest(400,`ID format is Invalid must be 24 characters`))
    
    }else{
      next(error)
    
    } 
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
    if (!category) {
      throw next(ApiError.badRequest(404, `Category with id ${id} not found`))
    }
    response.json({ message: 'Category is updated', payload: category })
  } catch (error) {
    if(error instanceof mongoose.Error.CastError){
      next(ApiError.badRequest(400,`ID format is Invalid must be 24 characters`))
    
    }else{
      next(error)
    
    } 
  }
}

// search categories
export const searchCategories = async (
  request: Request,
  response: Response,
  next: NextFunction
) => {
  try {
    const { name } = request.params

    // search categoreis by name
    const searchResult = await Category.find({
      $or: [{ name: { $regex: name } }],
    })

    if (searchResult.length === 0) {
      throw next(ApiError.badRequest(404, `No results found with the keyword ${name}`))
    }

    response.status(200).send({
      message: `Results found`,
      payload: searchResult,
    })
  } catch (error) {
    next(error)
  }
}
