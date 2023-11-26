import { NextFunction, Request, Response } from 'express'

import mongoose from 'mongoose'

import ApiError from '../errors/ApiError'
import { IOrder, Order } from '../models/order'
import * as services from '../services/orderService'

// get all orders
export const getAllOrders = async (request: Request, response: Response, next: NextFunction) => {
  try {
    const limit = Number(request.query.limit)
    const page = Number(request.query.page)

    // return all orders with pagenation feature
    if (limit || page) {
      const { allOrdersOnPage, totalPage, currentPage } = await services.findAllOrdersOnPage(
        page,
        limit
      )

      response.status(200).send({
        message: `Orders were found`,
        payload: { allOrdersOnPage, totalPage, currentPage },
      })
    } else {
      // return all orders
      const { allOrders } = await services.findAllOrders()
      return response.json({ message: 'Orders were found', allOrders })
    }
  } catch (error) {
    next(error)
  }
}

// get a single order
export const getSingleOrder = async (request: Request, response: Response, next: NextFunction) => {
  try {
    const { id } = request.params

    // find an order by its id
    const singleOrder: IOrder | undefined = await services.findOrderById(id, response)

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
    const newOrder: IOrder = new Order({
      products: newOrderInput.products,
      user: newOrderInput.user,
    })
    await newOrder.save()
    response.status(201).send({
      message: `Order is created`,
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

    // check if order exist
    const isOrderExist = await services.findOrderById(id, response)

    const order = await Order.findOneAndDelete({ _id: id })
    response.status(200).send({
      message: `Deleted order with id ${id}`,
      payload: {},
    })
  } catch (error) {
    if (error instanceof mongoose.Error.CastError) {
      throw ApiError.badRequest(400, `ID format is Invalid must be 24 characters`)
    } else {
      next(error)
    }
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
