import mongoose from 'mongoose'
export type UserDocument = Document & {
  firstName: string
  lastName: string
  email: string
  password: string
  order: mongoose.Schema.Types.ObjectId[]
}

const userSchema = new mongoose.Schema({
  firstName: {
    type: String,
    required: true,
  },
  lastName: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },

  orders: {
    type: [mongoose.Schema.Types.ObjectId],
    ref: 'Orders',
  },
})

export const User = mongoose.model<UserDocument>('Users', userSchema)
