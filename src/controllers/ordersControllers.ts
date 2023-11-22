import { NextFunction, Request, Response } from 'express'
import { Order } from '../models/order'
import ApiError from '../errors/ApiError'

export const getAllOrders = async (request: Request, response: Response, next: NextFunction) => {
  try {
    const orders = await Order.find()
    if (orders.length === 0) {
      // throw ApiError.badRequest('There are no orders found')
      response.status(404).json({
        message: 'There are no orders found',
      })
      return
    }
    response.status(200).send({
      message: `Reutrn all orders`,
      payload: orders,
    })
  } catch (error) {
    next(error)
  }
}

export const getOrderById = async (request: Request, response: Response, next: NextFunction) => {
  try {
    const order = await Order.findById({ _id: request.params.id })
    if (!order) {
      // throw ApiError.badRequest(`No order found with id ${request.params.id}`)
      response.status(404).json({
        message: `No order found with id ${request.params.id}`,
      })
      return
    }
    response.status(200).send({
      message: `Reutrn an order with id ${request.params.id}`,
      payload: order,
    })
  } catch (error) {
    next(error)
  }
}

export const createOrder = async (request: Request, response: Response, next: NextFunction) => {
  try {
    const { products, user } = request.body
    const newOrder = new Order({
      products: products,
      user: user,
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

export const deleteOrderById = async (request: Request, response: Response, next: NextFunction) => {
  try {
    const orderExist = await Order.exists({ _id: request.params.id })
    if (!orderExist) {
      // throw ApiError.badRequest(`Order with id ${request.params.id} not found`)
      response.status(404).json({
        message: `Order with id ${request.params.id} not found`,
      })
      return
    }
    const order = await Order.findOneAndDelete({ _id: request.params.id })
    response.status(200).send({
      message: `Deleted order with id ${request.params.id}`,
      payload: {},
    })
  } catch (error) {
    next(error)
  }
}

export const updateOrderById = async (request: Request, response: Response, next: NextFunction) => {
  try {
    const orderExist = await Order.exists({ _id: request.params.id })
    if (!orderExist) {
      // throw ApiError.badRequest(`Order with id ${request.params.id} not found`)
      response.status(404).json({
        message: `Order with id ${request.params.id} not found`,
      })
      return
    }
    const order = await Order.findOneAndUpdate({ _id: request.params.id }, request.body, {
      new: true,
    })
    if (!order) {
      // throw ApiError.badRequest(`Error something went wrong`)
      response.status(404).json({
        message: `Error something went wrong`,
      })
      return
    }
    response.status(200).send({
      message: `Updated order with id ${request.params.id}`,
      payload: order,
    })
  } catch (error) {
    next(error)
  }
}
