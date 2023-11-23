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
      required: [true, 'One porduct at least is required'],
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
