import mongoose, { Document } from 'mongoose'

export type OrderDocument = Document & {
  // name: string
  products: mongoose.Schema.Types.ObjectId[]
  user: mongoose.Schema.Types.ObjectId[]
}

const orderSchema = new mongoose.Schema({
  // name: {
  //   type: String,
  //   required: true,
  // },
  products: {
    type: [mongoose.Schema.Types.ObjectId],
    ref: 'Product',
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
})

export default mongoose.model<OrderDocument>('Order', orderSchema)
