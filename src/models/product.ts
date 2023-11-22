import mongoose, { Document } from 'mongoose'

export interface IProduct extends Document {
  name: string
  price: number
  image: string
  quantity: number
  sold: number
  description: string
  category: mongoose.Schema.Types.ObjectId
  createAt?: string
  updateAt?: string
}

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    index: true,
    required: [true, 'Product name is required'],
    trim: true,
    minlength: [3, 'name must be at least 3 characters'],
    maxlength: [30, 'name must be at most 30 characters'],
  },
  price: {
    type: Number,
    required: [true, 'Product price is required'],
  },
  category: {
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Categories' ,
    required: [true , 'Product category is required'] ,
  },
  image: {
    type: String,
    required: [true, 'Product image is required'],
    trim: true,
  },
  description: {
    type: String,
    required: [true, 'Product description is required'],
    minlength: [3, 'description must be at least 3 characters'],
    maxlength: [100, 'description must be at most 100 characters'],
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

