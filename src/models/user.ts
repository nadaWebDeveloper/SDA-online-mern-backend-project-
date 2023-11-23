import mongoose from 'mongoose'
import bcrypt from 'bcrypt'
export type UserDocument = Document & {
  firstName: string
  lastName: string
  email: string
  password: string
  role: string
  isBanned: boolean
  order: mongoose.Schema.Types.ObjectId[]
}

const userSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: [true, 'firstname is required'],
      trim: true,
      minlength: [3, 'firstname must be at least 3 characters'],
      maxlength: [30, 'firstname must be at most 30 characters'],
    },
    lastName: {
      type: String,
      required: [true, 'lastname is required'],
      trim: true,
      minlength: [3, 'lastname must be at least 3 characters'],
      maxlength: [30, 'lastname must be at most 30 characters'],
    },
    email: {
      type: String,
      required: [true, 'email is required'],
      trim: true,
      unique: true,
      lowercase: true,
      validate: {
        validator: function (value: string) {
          return /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(value)
        },
        message: 'please,enter valid email',
      },
    },
    password: {
      type: String,
      required: [true, 'password is required'],
      trim: true,
      minlength: [8, 'password must be at least 8 characters'],
      set: (password: string) => bcrypt.hashSync(password, 10),
    },

    role: {
      type: String,
      default: 'visitor',
    },

    isBanned: {
      type: Boolean,
      default: false,
    },

    orders: {
      type: [mongoose.Schema.Types.ObjectId],
      ref: 'Orders',
    },
  },
  { timestamps: true }
)

export const User = mongoose.model<UserDocument>('Users', userSchema)
