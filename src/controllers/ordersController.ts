import { NextFunction, Request, Response } from 'express'

import mongoose from 'mongoose'

import ApiError from '../errors/ApiError'
import { IOrder, IOrderProduct, Order } from '../models/order'
import * as services from '../services/orderService'
import { User, UserDocument } from '../models/user'
import { IProduct, Product } from '../models/product'

interface CustomeRequest extends Request {
  userId?: string
}

// get all orders for admin
export const getOrdersForAdmin = async (
  request: Request,
  response: Response,
  next: NextFunction
) => {
  try {
    const limit = Number(request.query.limit) || 0
    const page = Number(request.query.page) || 1

    // return all orders with pagenation feature
    const { allOrdersOnPage, totalPage, currentPage } = await services.findAllOrdersForAdmin(
      page,
      limit
    )

    response.status(200).send({
      message: `Return all orders for the admin`,
      payload: { allOrdersOnPage, totalPage, currentPage },
    })
  } catch (error) {
    next(error)
  }
}

// order placement
export const handleProcessPayment = async (
  request: CustomeRequest,
  response: Response,
  next: NextFunction
) => {
  try {
    const { products, payment } = request.body
    let totalProductPrice: number = 0
    let subtotalSums: number[] = []
    let errors: boolean = false

    if (!products || !payment) {
      throw ApiError.badRequest(404, `Order must contain products and payment data`)
    }
    // updataing the qunatity and sold values of each purchased product and calculating the total price of each product
    const requests = products.map(async (item: IOrderProduct) => {
      try {
        const foundProduct: IProduct | null = await Product.findById(item.product)
        // throw error if product not found or quantity exceeded the maximum limit
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
        console.log('totalProductPrice: ' + totalProductPrice)
        subtotalSums.push(totalProductPrice)
        console.log('subtotalSums in map: ' + subtotalSums)
      } catch (error) {
        next(error)
      }
    })
    // calculate total payment amount
    if (requests) {
      return Promise.all(requests).then(async () => {
        try {
          console.log('subtotalSums after map: ' + subtotalSums)
          const totalOrderPrice =
            subtotalSums.length > 0 &&
            subtotalSums.reduce((firstProductTotal, secondProductTotal) => {
              return firstProductTotal + secondProductTotal
            }, 0)
          console.log('totalOrderPrice after map: ' + totalOrderPrice)

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
              products.map((item: IOrderProduct) => ({
                product: item.product,
                quantity: item.quantity,
              })),
            payment: {
              method: payment.method,
              totalAmount: totalOrderPrice,
            },
            user: request.userId,
          })

          await newOrder.save(function (err, order) {
            if (err) {
              throw ApiError.badRequest(500, 'Process ended unsuccssufully')
            }
          })

          response.status(200).send({
            message: 'Order placed succsussfully',
          })
        } catch (error) {
          next(error)
        }
      })
    } else {
      throw ApiError.badRequest(500, 'Process ended unsuccssufully')
    }

    // let newOrderId
    // await newOrder.save().then((order) => (newOrderId = order._id))

    // const newOrderDataWithId = Order.findById(newOrderId)
    // const buyer: UserDocument | null = await User.findById(request.userId)
    // const previousOrders = buyer?.orders
    // const updatedOrders = previousOrders.push(newOrderDataWithId)
    // await User.findByIdAndUpdate(request.userId, { orders: updatedOrders }, { new: true })
  } catch (error) {
    next(error)
  }
}

// get all orders of a specific user
export const getOrdersForUser = async (
  request: CustomeRequest,
  response: Response,
  next: NextFunction
) => {
  try {
    const userId = request.params.id
    const userOrders = await services.findUserOrders(userId)

    response.status(200).send({
      message: 'Orders are returend',
      payload: userOrders,
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
    const updatedOrderStatus = request.body.status as String

    const updatedOrder = await services.findAndUpdateOrder(id, response, updatedOrderStatus)

    response.status(200).send({
      message: `Updated order status succussfully`,
      payload: updatedOrder,
    })
  } catch (error) {
    if (error instanceof mongoose.Error.CastError) {
      throw ApiError.badRequest(400, `ID format is Invalid must be 24 characters`)
    } else {
      next(error)
    }
  }
}

// ******** payment processing ********
// ? when creatin an order
// totalProductPrice = multiply the quantity of each products with its price
// subtract the quantity of the item form the original quantity
// finalTotalPrice = sum all totalProductPrice(s)
// (optional): add tax

// ? when deleting an order
// add a balance field in the user -> store the returend order price
// reincrease the quantity of each product

// ! last error occured:
// the quantities are subtracted when creating an order but total amount is not calculated
