import mongoose from 'mongoose'


export interface IProduct extends mongoose.Document {
  _id: mongoose.Schema.Types.ObjectId
  name: string
  price: number
  image: string
  quantity: number
  sold: number
  categories: mongoose.Schema.Types.ObjectId[]
  description: string
  createAt?: Date
  updateAt?: Date
}

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Product name is required'],
      trim: true,
      minlength: [3, 'Name must be at least 3 characters'],
      maxlength: [150, 'Name must be at most 150 characters'],
    },
    price: {
      type: Number,
      trim: true,
      required: [true, 'product price is required'],
    },
    categories: {
      type: [mongoose.Schema.Types.ObjectId],
      ref: 'Categories',
      trim: true,
      required: [true, 'Product category is required'],
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
      maxlength: [300, 'Description must be at most 300 characters'],
      trim: true,
    },
    quantity: {
      type: Number,
      default: 0,
    },
    sold: {
      type: Number,
      default: 0,
    },

  },
  { timestamps: true }
)

export const Product = mongoose.model<IProduct>('Products', productSchema)
