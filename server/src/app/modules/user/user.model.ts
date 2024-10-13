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
        'https://drive.google.com/file/d/1fyV7dYxPaXT9vDfhXpc_tKwYMIMdmVZD/view?usp=sharing',
    },
    address: { type: String },
    connection: { type: Schema.ObjectId, default: null, ref: 'Connection' },
  },
  { timestamps: true },
)

// Use models.User to check if the User model exists, and only define it if it doesn't
export const User = models.User || model<TUser>('User', userSchema)
