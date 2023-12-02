import { Request, Response } from 'express'

import ApiError from '../errors/ApiError'
import { IOrder, IOrderProduct, Order } from '../models/order'
import { IProduct, Product } from '../models/product'
import { User, IUser } from '../models/user'

// return all orders using pagenation
export const findAllOrdersForAdmin = async (page: number, limit: number) => {
  const countPage = await Order.countDocuments()
  const totalPage = limit ? Math.ceil(countPage / limit) : 1
  if (page > totalPage) {
    page = totalPage
  }
  const skip = (page - 1) * limit

  const allOrdersOnPage: IOrder[] = await Order.find()
    .populate({
      path: 'products',
      populate: {
        path: 'product',
        select: 'name price description',
      },
    })
    .populate('user', 'firstName lastName email')
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
export const findUserOrders = async (userId: string) => {
  const userOrders = await Order.find({ user: userId })
    .populate({
      path: 'products',
      populate: {
        path: 'product',
        select: 'name price description',
      },
    })
    .populate('user', 'firstName lastName email')

  if (userOrders.length === 0) {
    throw ApiError.badRequest(404, 'This user has no orders yet')
  }
  return userOrders
}

// find and delete order by id
export const findAndDeleteOrder = async (id: string) => {
  const order = await Order.findOneAndDelete({ _id: id })
  if (!order) {
    throw ApiError.badRequest(404, `No order found with id ${id}`)
  }
  order?.products.map(async (item: IOrderProduct) => {
    const foundProduct: IProduct | null = await Product.findById(item.product)
    if (!foundProduct) {
      throw ApiError.badRequest(404, `Product is not found with this id: ${item.product}`)
    }
    const updatedQuantityValue = foundProduct.quantity + item.quantity
    const updatedSoldValue = foundProduct.sold - item.quantity
    const updatedProduct = await Product.findByIdAndUpdate(
      foundProduct._id,
      { quantity: updatedQuantityValue, sold: updatedSoldValue },
      {
        new: true,
      }
    )
    if (!updatedProduct) {
      throw ApiError.badRequest(
        500,
        `Process of updating product ${item.product} ended unsuccssufully`
      )
    }
  })
  const foundUser: any = await User.findById(order.user)
  const updatedBalance = foundUser.balance + order.payment.totalAmount
  const updatedUser = await User.findOneAndUpdate(
    { _id: order.user },
    { balance: updatedBalance },
    {
      new: true,
    }
  )
  if (!updatedUser) {
    throw ApiError.badRequest(500, `Process of updating user ${order.user} ended unsuccssufully`)
  }
}

// find and update order by id
export const findAndUpdateOrder = async (
  id: string,
  response: Response,
  updatedOrderStatus: String
) => {
  if (
    updatedOrderStatus.toLocaleLowerCase() !== 'pending' &&
    updatedOrderStatus.toLocaleLowerCase() !== 'shipping' &&
    updatedOrderStatus.toLocaleLowerCase() !== 'shipped' &&
    updatedOrderStatus.toLocaleLowerCase() !== 'delivered' &&
    updatedOrderStatus.toLocaleLowerCase() !== 'canceled'
  ) {
    throw ApiError.badRequest(500, 'Invalid status')
  }
  // update order status
  const updatedOrder = await Order.findOneAndUpdate(
    { _id: id },
    { status: updatedOrderStatus.toLocaleLowerCase() },
    {
      new: true,
    }
  )

  if (!updatedOrder) {
    throw ApiError.badRequest(500, 'Updating process ended unsuccussfully')
  }
  return updatedOrder
}

// create new order
export const createNewOrder = async (newOrderInput: IOrder): Promise<IOrder> => {
  if (!newOrderInput.user || !newOrderInput.products) {
    throw ApiError.badRequest(404, `Order must contain products and user data`)
  }
  const newOrder: IOrder = new Order({
    products: newOrderInput.products,
    user: newOrderInput.user,
  })

  await newOrder.save()

  return newOrder
}
