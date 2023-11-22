import mongoose from 'mongoose'

const categorySchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true,
    unique: true,
  },
})
export const Category = mongoose.model('Categories', categorySchema)
