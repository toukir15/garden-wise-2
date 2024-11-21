import { Schema, model } from 'mongoose'
import { TBookmark } from './bookmark.interface'

// Define the main post schema
const bookmarkSchema = new Schema<TBookmark>(
  {
    user: { type: Schema.ObjectId, ref: 'User', default: null },
    posts: { type: [Schema.ObjectId], default: [], ref: "Post" },
  },
  {
    timestamps: true,
  },
)

// Create the model
const Bookmark = model('Bookmark', bookmarkSchema)

export default Bookmark
