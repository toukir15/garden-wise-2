import { Types } from 'mongoose'

export type TBookmark = {
  user: Types.ObjectId
  posts?: Types.ObjectId[]
}
