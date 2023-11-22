import { NextFunction, Request, Response } from 'express'
import { Order } from '../models/order'
import ApiError from '../errors/ApiError'

export const getAllOrders = async (request: Request, response: Response, next: NextFunction) => {
  try {
    const orders = await Order.find()
    if (orders.length === 0) {
      throw next(ApiError.badRequest(404, 'There are no orders found'))
    }
    response.status(200).send({
      message: `Reutrn all orders`,
      payload: orders,
    })
  } catch (error) {
    next(error)
  }
}

export const getSingleOrder = async (request: Request, response: Response, next: NextFunction) => {
  try {
    const { id } = request.params
    const order = await Order.findById({ _id: id })
    if (!order) {
      throw next(ApiError.badRequest(404, `No order found with id ${id}`))
    }
    response.status(200).send({
      message: `Reutrn an order with id ${id}`,
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

export const deleteOrder = async (request: Request, response: Response, next: NextFunction) => {
  try {
    const { id } = request.params
    const orderExist = await Order.exists({ _id: id })
    if (!orderExist) {
      throw next(ApiError.badRequest(404, `Order with id ${id} not found`))
    }
    const order = await Order.findOneAndDelete({ _id: id })
    response.status(200).send({
      message: `Deleted order with id ${id}`,
      payload: {},
    })
  } catch (error) {
    next(error)
  }
}

export const updateOrder = async (request: Request, response: Response, next: NextFunction) => {
  try {
    const { id } = request.params
    const order = await Order.findOneAndUpdate({ _id: id }, request.body, {
      new: true,
    })
    if (!order) {
      throw next(ApiError.badRequest(404, `Order with id ${id} not found`))
    }
    response.status(200).send({
      message: `Updated order with id ${id}`,
      payload: order,
    })
  } catch (error) {
    next(error)
  }
}
