import { Types } from 'mongoose'

export type TVote = {
  upvote: [Types.ObjectId]
  downvote: [Types.ObjectId]
}
