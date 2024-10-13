import { Schema, model } from 'mongoose'
import { TPost } from './post.interface'

// Define the schema for the sub-document `post`
const postSchema = new Schema(
  {
    user: { type: Schema.ObjectId, required: true, ref: 'User' },
    description: { type: String, required: true },
    images: { type: [String], required: true, default: [] },
    comments: { type: [Schema.ObjectId], ref: 'Comment', default: [] },
    votes: { type: Schema.ObjectId, ref: 'Vote', default: null },
    share: { type: [String], default: [] },
    isPremium: { type: Boolean, default: false },
    category: { type: String, required: true },
  },
  { timestamps: true },
)

// Define the main post schema
const postMainSchema = new Schema<TPost>(
  {
    sharedUser: { type: Schema.ObjectId, ref: 'User', default: null },
    description: { type: String, default: null },
    votes: { type: Schema.ObjectId, ref: 'Vote', default: null },
    isShared: { type: Boolean, default: false },
    comments: { type: [Schema.ObjectId], ref: 'Comment', default: [] },
    share: { type: [String], default: [] },
    post: { type: postSchema, required: true },
  },
  {
    timestamps: true,
  },
)

// Create the model
const Post = model('Post', postMainSchema)

export default Post
