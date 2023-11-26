import mongoose, { Document } from 'mongoose'

export interface ICategory extends Document {
  name: string
}

const categorySchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
})

export const Category = mongoose.model<ICategory>('Products', categorySchema)
