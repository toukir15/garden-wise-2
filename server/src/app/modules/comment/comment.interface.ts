import { Types } from 'mongoose'

export type TReply = {
  commentReplyUser: Types.ObjectId
  replyTo: Types.ObjectId
  votes: Types.ObjectId
  text: string
}

export type TComments = {
  user: Types.ObjectId
  text: string
  votes: Types.ObjectId
  replies: TReply[]
}
