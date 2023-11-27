import { NextFunction, Request, Response } from 'express'

import mongoose from 'mongoose'

import ApiError from '../errors/ApiError'
import { IOrder, Order } from '../models/order'
import * as services from '../services/orderService'

// get all orders
export const getAllOrders = async (request: Request, response: Response, next: NextFunction) => {
  try {
    const limit = Number(request.query.limit) || 0
    const page = Number(request.query.page) || 1

    // return all orders with pagenation feature
    const { allOrdersOnPage, totalPage, currentPage } = await services.findAllOrders(page, limit)

    response.status(200).send({
      message: `Orders were found`,
      payload: { allOrdersOnPage, totalPage, currentPage },
    })
  } catch (error) {
    next(error)
  }
}

// get a single order
export const getSingleOrder = async (request: Request, response: Response, next: NextFunction) => {
  try {
    const { id } = request.params

    // find an order by its id
    const singleOrder: IOrder = await services.findOrderById(id, response)

    response.status(200).send({
      message: `Reutrn an order with id ${id}`,
      payload: singleOrder,
    })
  } catch (error) {
    if (error instanceof mongoose.Error.CastError) {
      throw ApiError.badRequest(400, `ID format is Invalid must be 24 characters`)
    } else {
      next(error)
    }
  }
}

// create a new order
export const createOrder = async (request: Request, response: Response, next: NextFunction) => {
  try {
    const newOrderInput = request.body
    const newOrder = await services.createNewOrder(newOrderInput)

    response.status(201).send({
      message: 'Order is created',
      payload: newOrder,
    })
  } catch (error) {
    next(error)
  }
}

// delete an order by id
export const deleteOrder = async (request: Request, response: Response, next: NextFunction) => {
  try {
    const { id } = request.params

    await services.findAndDeleteOrder(id)

    response.status(200).send({
      message: `Deleted order with id ${id}`,
      payload: {},
    })
  } catch (error) {
    if (error instanceof mongoose.Error.CastError) {
      throw next(ApiError.badRequest(400, 'Id format is not valid'))
    }
    next(error)
  }
}

// update an order by id
export const updateOrder = async (request: Request, response: Response, next: NextFunction) => {
  try {
    const { id } = request.params
    const updatedOrder = request.body

    // update order if it exists
    const order: IOrder | undefined = await services.findOrderAndUpdated(id, response, updatedOrder)

    response.status(200).send({
      message: `Updated order with id ${id}`,
      payload: order,
    })
  } catch (error) {
    if (error instanceof mongoose.Error.CastError) {
      throw ApiError.badRequest(400, `ID format is Invalid must be 24 characters`)
    } else {
      next(error)
    }
  }
}
