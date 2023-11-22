import mongoose, { Document } from 'mongoose'

export type OrderDocument = Document & {
  // name: string
  products: mongoose.Schema.Types.ObjectId[]
  user: mongoose.Schema.Types.ObjectId
}

const orderSchema = new mongoose.Schema(
  {
    products: {
      type: [mongoose.Schema.Types.ObjectId],
      ref: 'Product',
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    // products: {
    //   type: String,
    //   required: true,
    // },
    // user: {
    //   type: String,
    //   required: true,
    // },
  },
  { timestamps: true }
)

export const Order = mongoose.model<OrderDocument>('Orders', orderSchema)
