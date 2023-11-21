import mongoose from 'mongoose'

export interface IFProduct extends Document {
  name: string,
  price: number,
  image: string,
  quantity:number,
  sold: number,
  description: string,
  createAt?: string,
  updateAt?: string
}

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    index: true,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  categories: {  // ! will change it later
    type: String,
    default: [],
  },
  image: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  quantity: {
    type: Number,
    default: 1,
  },
  sold: {
    type: Number,
    default: 0,
  },
})

export const MProduct = mongoose.model<IFProduct>('Product', productSchema)
