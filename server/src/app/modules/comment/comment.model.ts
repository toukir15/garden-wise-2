import { model, Schema } from 'mongoose'
import { TComments, TReply } from './comment.interface'

// Define the Reply schema
const ReplySchema = new Schema<TReply>(
  {
    commentReplyUser: { type: Schema.ObjectId, required: true },
    votes: { type: Schema.ObjectId, required: true },
    replyTo: { type: Schema.ObjectId, required: true },
    text: { type: String, required: true },
  },
  {
    timestamps: true,
  },
)

// Define the Comment schema
const CommentSchema = new Schema<TComments>(
  {
    user: { type: Schema.ObjectId, ref: 'User', required: true },
    votes: { type: Schema.ObjectId, required: true },
    text: { type: String, required: true },
    replies: { type: [ReplySchema], default: [] },
  },
  { timestamps: true },
)

// Create the model
export const Comment = model('Comment', CommentSchema)
