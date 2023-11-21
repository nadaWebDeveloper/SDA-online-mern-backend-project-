import mongoose from 'mongoose'

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

export const Product = mongoose.model('Product', productSchema)
