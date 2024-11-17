import { BAD_REQUEST } from 'http-status'
import AppError from '../../errors/AppError'
import Post from '../posts/post.model'
import { TComments } from './comment.interface'
import { User } from '../user/user.model'
import { Vote } from '../vote/vote.model'
import { Comment } from './comment.model'

const createCommentIntoDB = async (
  payload: TComments,
  postId: string,
  userId: string,
) => {
  // find user exist or not
  const user = await User.findById(userId)
  if (!user) {
    throw new AppError(BAD_REQUEST, "User doesn't exist!")
  }

  // find post
  const findPost = await Post.findById(postId)
  if (!findPost) {
    throw new AppError(BAD_REQUEST, 'Post no longer available!')
  }

  // create votes
  const createVotes = await Vote.create({})
  if (createVotes?._id) {
    payload.votes = createVotes?._id
  }

  // set user id
  payload.user = user?._id

  const result = await Comment.create(payload)
  //   update post coment id
  if (findPost.isShared) {
    await Post.findByIdAndUpdate(postId, {
      $push: { comments: result?._id },
    })
  } else {
    await Post.findByIdAndUpdate(postId, {
      $push: { 'post.comments': result?._id },
    })
  }
  return result
}

const updateCommentIntoDB = async (payload: TComments, commentId: string) => {

  const findComment = await Comment.findById(commentId)
  if (!findComment) {
    throw new AppError(BAD_REQUEST, 'Comment no longer available!')
  }

  const result = await Comment.findByIdAndUpdate(commentId, payload, {
    new: true,
  })
  return result
}

const deleteCommentFromDB = async (commentId: string, postId: string) => {
  const findPost = await Post.findById(postId)
  if (!findPost) {
    throw new AppError(BAD_REQUEST, 'Post no longer available!')
  }
  const findComment = await Comment.findById(commentId)
  if (!findComment) {
    throw new AppError(BAD_REQUEST, 'Comment no longer available!')
  }

  if (findPost.isShared) {
    await Post.findByIdAndUpdate(postId, { $pull: { comments: commentId } })
  } else {
    await Post.findByIdAndUpdate(postId, {
      $pull: { 'post.comments': commentId },
    })
  }

  const result = await Comment.findByIdAndDelete(commentId)
  return result
}

export const CommentServices = {
  createCommentIntoDB,
  updateCommentIntoDB,
  deleteCommentFromDB,
}
