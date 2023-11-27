import { Response } from 'express'

import ApiError from '../errors/ApiError'
import { IOrder, Order } from '../models/order'

// return all orders using pagenation
export const findAllOrders = async (page: number, limit: number) => {
  const countPage = await Order.countDocuments()
  const totalPage = limit ? Math.ceil(countPage / limit) : 1
  if (page > totalPage) {
    page = totalPage
  }
  const skip = (page - 1) * limit

  const allOrdersOnPage: IOrder[] = await Order.find()
    .populate('products')
    .populate('user')
    .skip(skip)
    .limit(limit)
    .sort({ createdAt: -1 })
  if (allOrdersOnPage.length === 0) {
    throw ApiError.badRequest(404, 'There are no orders found')
  } else {
    return {
      allOrdersOnPage,
      totalPage,
      currentPage: page,
    }
  }
}

// find order by id
export const findOrderById = async (id: string, response: Response) => {
  const singleOrder = await Order.findOne({ _id: id })
  if (!singleOrder) {
    throw ApiError.badRequest(404, `Order is not found with this id: ${id}`)
  } else {
    return singleOrder
  }
}

// find and delete order by id
export const findAndDeleteOrder = async (id: string) => {
  const order = await Order.findOneAndDelete({ _id: id })

  if (!order) {
    throw ApiError.badRequest(404, `No order found with id ${id}`)
  }
}

// find and update order by id
export const findOrderAndUpdated = async (
  id: string,
  response: Response,
  updatedOrder: Request
) => {
  const orderUpdated = await Order.findOneAndUpdate({ _id: id }, updatedOrder, { new: true })
  if (!orderUpdated) {
    response.status(404).json({
      message: `Order is not found with this id: ${id}`,
    })
    return
  }
  return orderUpdated
}

// create new order
export const createNewOrder = async (newOrderInput: IOrder): Promise<IOrder> => {
  const newOrder: IOrder = new Order({
    products: newOrderInput.products,
    user: newOrderInput.user,
  })

  await newOrder.save()

  return newOrder
}
