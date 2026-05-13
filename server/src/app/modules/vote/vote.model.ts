import { model, Schema } from 'mongoose'
import { TVote } from './vote.interface'

const voteSchema = new Schema<TVote>({
  upvote: { type: [String], default: [] },
  downvote: { type: [String], default: [] },
})

export const Vote = model<TVote>('Vote', voteSchema)
