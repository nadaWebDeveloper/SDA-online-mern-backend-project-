import { NextFunction, Request, Response } from 'express'

import mongoose from 'mongoose'
import ApiError from '../errors/ApiError'
import { IOrder, IOrderPayment, IOrderProduct, Order } from '../models/order'
import { IProduct, Product } from '../models/product'
import { User } from '../models/user'

interface CustomeRequest extends Request {
  userId?: string
}

// return all orders using pagenation
export const findAllOrdersForAdmin = async (page: number, limit: number, next: NextFunction) => {
  try {
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
    } else return allOrdersOnPage
  } catch (error) {
    if (error instanceof mongoose.Error.CastError) {
      next(ApiError.badRequest(400, `ID format is Invalid must be 24 characters`))
    } else {
      next(error)
    }
  }
}

// find order by id
export const findUserOrders = async (request: CustomeRequest, next: NextFunction) => {
  try {
    const userOrders = await Order.find({ user: request.userId })
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
  } catch (error) {
    if (error instanceof mongoose.Error.CastError) {
      next(ApiError.badRequest(400, `ID format is Invalid must be 24 characters`))
    } else {
      next(error)
    }
  }
}

// find and delete order by id
export const findAndDeleteOrder = async (id: string, next: NextFunction): Promise<void> => {
  try {
    const order: IOrder | null = await Order.findOneAndDelete({ _id: id })

    if (!order) {
      throw ApiError.badRequest(404, `No order found with id ${id}`)
    }

    order?.products.map(async (item: IOrderProduct) => {
      const foundProduct: any = await Product.findById(item.product)

      if (!foundProduct) {
        throw ApiError.badRequest(404, `Product is not found with this id: ${item.product}`)
      }

      const updatedQuantityValue = foundProduct.quantity + item.quantity
      const updatedSoldValue = foundProduct.sold - item.quantity

      const updatedProduct = await Product.findByIdAndUpdate(
        foundProduct._id,
        { quantity: updatedQuantityValue, sold: updatedSoldValue },
        { new: true }
      )

      if (!updatedProduct) {
        throw ApiError.badRequest(
          500,
          `Process of updating product ${item.product} ended unsuccssufully`
        )
      }
    })
    const foundUser: any = await User.findById(order?.user)
    const updatedBalance = foundUser.balance + order?.payment.totalAmount
    const updatedUser = await User.findOneAndUpdate(
      { _id: order?.user },
      { balance: updatedBalance },
      {
        new: true,
      }
    )

    if (!updatedUser) {
      throw ApiError.badRequest(500, `Process of updating user ${order?.user} ended unsuccssufully`)
    }
  } catch (error) {
    if (error instanceof mongoose.Error.CastError) {
      next(ApiError.badRequest(400, `ID format is Invalid must be 24 characters`))
    } else {
      next(error)
    }
  }
}

// find and update order by id
export const findAndUpdateOrder = async (
  id: string,
  response: Response,
  updatedOrderStatus: String,
  next: NextFunction
): Promise<
  | (IOrder & {
      _id: mongoose.Types.ObjectId
    })
  | undefined
> => {
  try {
    if (
      updatedOrderStatus.toLocaleLowerCase() !== 'pending' &&
      updatedOrderStatus.toLocaleLowerCase() !== 'shipping' &&
      updatedOrderStatus.toLocaleLowerCase() !== 'shipped' &&
      updatedOrderStatus.toLocaleLowerCase() !== 'delivered' &&
      updatedOrderStatus.toLocaleLowerCase() !== 'canceled'
    ) {
      throw ApiError.badRequest(500, 'Invalid status')
    } else {
      // update order status
      const updatedOrder = await Order.findOneAndUpdate(
        { _id: id },
        { status: updatedOrderStatus.toLocaleLowerCase() },
        { new: true }
      )

      if (!updatedOrder) {
        throw ApiError.badRequest(500, 'Updating process ended unsuccussfully')
      }
      //   response.status(200).send({
      //     message: `Updated order status succussfully`,
      //     payload: updatedOrder,
      //   })
      return updatedOrder
    }
  } catch (error) {
    if (error instanceof mongoose.Error.CastError) {
      next(ApiError.badRequest(400, `ID format is Invalid must be 24 characters`))
    } else {
      next(error)
    }
  }
}

// find and update product
export const findAndUpdateProducts = async (
  products: IProduct[],
  subtotalSums: number[],
  totalProductPrice: number,
  next: NextFunction
) => {
  try {
    const updateProductsData = products.map(async (item: any) => {
      const foundProduct: IProduct | null = await Product.findById(item.product)

      if (!foundProduct) {
        throw ApiError.badRequest(404, `Product is not found with this id: ${item.product}`)
      } else if (foundProduct.quantity < item.quantity) {
        throw ApiError.badRequest(
          500,
          `Quantity of product ${item.product} has exceeded the maximum limit`
        )
      }
      // update each product quantity and sold value
      const updatedQuantityValue = foundProduct.quantity - item.quantity
      const updatedSoldValue = foundProduct.sold + item.quantity
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
      // calculate total product price
      totalProductPrice = foundProduct?.price && foundProduct.price * item.quantity
      subtotalSums.push(totalProductPrice)
    })
    return updateProductsData
  } catch (error) {
    next(error)
  }
}

// handle payment total amount and payment method
export const handlePayment = async (
  request: CustomeRequest,
  subtotalSums: number[],
  payment: IOrderPayment,
  products: IProduct[],
  next: NextFunction
): Promise<void> => {
  try {
    const totalOrderPrice =
      subtotalSums.length > 0 &&
      subtotalSums.reduce((firstProductTotal, secondProductTotal) => {
        return firstProductTotal + secondProductTotal
      }, 0)

    // check payment method value
    if (
      payment.method.toLocaleLowerCase() !== 'cash-on-delivery' &&
      payment.method.toLocaleLowerCase() !== 'credit-card' &&
      payment.method.toLocaleLowerCase() !== 'apple-pay' &&
      payment.method.toLocaleLowerCase() !== 'stc-pay'
    ) {
      throw ApiError.badRequest(500, 'Invalid method')
    }
    // create a new order
    const newOrder: IOrder = new Order({
      products:
        products.length > 0 &&
        products.map((item: any) => ({
          product: item.product,
          quantity: item.quantity,
        })),
      payment: {
        method: payment.method,
        totalAmount: totalOrderPrice,
      },
      user: request.userId,
    })

    await newOrder.save(function (error, order) {
      if (error) {
        throw ApiError.badRequest(500, 'Process ended unsuccssufully')
      }
    })
  } catch (error) {
    next(error)
  }
}
