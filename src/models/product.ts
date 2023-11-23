import mongoose, { Document } from 'mongoose'

export interface IProduct extends Document {
  name: string
  price: number
  image: string
  quantity: number
  sold: number
  description: string
  createAt?: string
  updateAt?: string
}

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    index: true,
    required: [true, 'Product name is required'],
    trim: true,
    minlength: [3, 'Name must be at least 3 characters'],
    maxlength: [30, 'Name must be at most 30 characters'],
  },
  price: {
    type: Number,
    required: [true, 'product price is required'],
  },
  categories: {
    // ! will change it later
    type: String,
    // default: [],
  },
  image: {
    type: String,
    required: [true, 'Product image is required'],
    trim: true,
  },
  description: {
    type: String,
    required: [true, 'Product description is required'],
    minlength: [3, 'Description must be at least 3 characters'],
    maxlength: [100, 'Description must be at most 100 characters'],
    trim: true,
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

export const Product = mongoose.model<IProduct>('Products', productSchema)
