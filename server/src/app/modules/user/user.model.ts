import { Schema, model, models } from 'mongoose'
import { TUser } from './user.interface'

const userSchema = new Schema<TUser>(
  {
    name: { type: String, required: true },
    email: { type: String, unique: 1, required: true },
    password: { type: String, required: true },
    role: { type: String, enum: ['admin', 'user'], default: 'user' },
    profilePhoto: {
      type: String,
      default:
        'https://i.pinimg.com/736x/0d/64/98/0d64989794b1a4c9d89bff571d3d5842.jpg',
    },
    address: { type: String },
    connection: { type: Schema.ObjectId, default: null, ref: 'Connection' },
    bookmark: { type: [Schema.ObjectId], default: [], ref: 'Post' },
    isVerified: { type: Boolean, default: false },
  },
  { timestamps: true },
)

// Use models.User to check if the User model exists, and only define it if it doesn't
export const User = models.User || model<TUser>('User', userSchema)
