import mongoose, { Document } from 'mongoose'

// export type OrderDocument = Document & {
//   // name: string
//   products: mongoose.Schema.Types.ObjectId[]
//   user: mongoose.Schema.Types.ObjectId
// }

export interface IOrder extends Document {
  products: mongoose.Schema.Types.ObjectId[]
  user: mongoose.Schema.Types.ObjectId
}

const orderSchema = new mongoose.Schema(
  {
    products: {
      type: [mongoose.Schema.Types.ObjectId],
      ref: 'Products',
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Users',
    },
  },
  { timestamps: true }
)

export const Order = mongoose.model<IOrder>('Orders', orderSchema)
