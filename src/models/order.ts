import mongoose, { Document } from 'mongoose'

export interface IOrder extends Document {
  products: mongoose.Schema.Types.ObjectId[]
  user: mongoose.Schema.Types.ObjectId
  createdAt: Date
  updatedAt: Date
}

const orderSchema = new mongoose.Schema(
  {
    products: {
      type: [mongoose.Schema.Types.ObjectId],
      ref: 'Products',
      required: [true, 'One product at least is required'],
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Users',
      required: [true, 'User is required'],
    },
  },
  { timestamps: true }
)

export const Order = mongoose.model<IOrder>('Orders', orderSchema)
