import { Types } from 'mongoose'

export type TConnection = {
  followers?: [Types.ObjectId]
  followings?: [Types.ObjectId]
}
