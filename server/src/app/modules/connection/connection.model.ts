import { model, Schema } from 'mongoose'
import { TConnection } from './connection.interface'

const connectionSchema = new Schema<TConnection>({
  followers: { type: [Schema.ObjectId], default: [] },
  followings: { type: [Schema.ObjectId], default: [] },
})

export const Connection = model<TConnection>('Connection', connectionSchema)
