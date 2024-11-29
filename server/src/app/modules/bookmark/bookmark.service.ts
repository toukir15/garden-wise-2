import { Types } from 'mongoose'
import Bookmark from './bookmark.model'
import AppError from '../../errors/AppError'
import httpStatus from 'http-status'

const updateBookmarkIntoDB = async (bookmarkId: string, postId: string) => {
  // Fetch the bookmark to check if the postId already exists
  const bookmark = await Bookmark.findById(bookmarkId)

  if (!bookmark) {
    throw new Error('Bookmark not found')
  }

  // Check if the postId already exists in the posts array
  const covertedPostId = new Types.ObjectId(postId)
  const postExists = bookmark.posts!.includes(covertedPostId)

  // Update the bookmark based on whether the post exists
  const result = await Bookmark.findByIdAndUpdate(
    bookmarkId,
    postExists
      ? { $pull: { posts: postId } }
      : { $addToSet: { posts: postId } },
    { new: true },
  )
  return result
}

const getBookmarkFromDB = async (bookmarkId: string) => {
  const findBookmark = await Bookmark.findById(bookmarkId)
  if (!findBookmark) {
    throw new AppError(httpStatus.BAD_REQUEST, 'Bookmark is not found!')
  }

  const result = await Bookmark.findById(bookmarkId)
    .populate({
      path: 'posts',
      populate: [
        {
          path: 'sharedUser',
          model: 'User',
          select: 'name profilePhoto',
        },
        {
          path: 'votes',
          model: 'Vote',
          select: 'upvote downvote',
        },
        {
          path: 'comments',
          model: 'Comment',
          select: 'text votes replies user createdAt',
          populate: [
            {
              path: 'user',
              model: 'User',
              select: 'name profilePhoto',
            },
            {
              path: 'replies.commentReplyUser',
              model: 'User',
              select: 'name profilePhoto',
            },
            {
              path: 'replies.replyTo',
              model: 'User',
              select: 'name',
            },
            {
              path: 'votes',
              model: 'Vote',
              select: 'upvote downvote',
            },
            {
              path: 'replies.votes',
              model: 'Vote',
              select: 'upvote downvote',
            },
          ],
        },
        {
          path: 'post.user',
          model: 'User',
          select: 'name profilePhoto',
        },
        {
          path: 'post.comments',
          model: 'Comment',
          select: 'text user votes replies createdAt',
          populate: [
            {
              path: 'user',
              model: 'User',
              select: 'name profilePhoto',
            },
            {
              path: 'replies.commentReplyUser',
              model: 'User',
              select: 'name profilePhoto',
            },
            {
              path: 'replies.replyTo',
              model: 'User',
              select: 'name',
            },
            {
              path: 'votes',
              model: 'Vote',
              select: 'upvote downvote',
            },
            {
              path: 'replies.votes',
              model: 'Vote',
              select: 'upvote downvote',
            },
          ],
        },
        {
          path: 'post.votes',
          model: 'Vote',
          select: 'upvote downvote',
        },
      ],
    })
    .exec()

  if (!result || !result.posts) {
    throw new AppError(httpStatus.NOT_FOUND, 'No posts found for this bookmark')
  }

  // Reverse the posts array and return
  result.posts.reverse() // Reverse the array in-place
  return result
}

export const BookmarkServices = {
  updateBookmarkIntoDB,
  getBookmarkFromDB,
}
