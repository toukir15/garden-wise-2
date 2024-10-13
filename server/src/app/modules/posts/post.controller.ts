import httpStatus from 'http-status'
import sendResponse from '../../utils/sendResponse'
import { catchAsync } from '../../utils/catchAsync'
import { PostServices } from './post.service'

const createPost = catchAsync(async (req, res) => {
  const post = JSON.parse(req.body.data)
  const files = req.files as Express.Multer.File[]
  const userId = req.user?._id
  const postImages = files?.map(file => file.path)
  const result = await PostServices.createPostIntoDB(post, postImages, userId)

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Created post successfully!',
    data: result,
  })
})

const createSharePost = catchAsync(async (req, res) => {
  const postId = req.params.postId
  const userId = req.user?._id
  const data = req.body
  const result = await PostServices.createSharePostIntoDB(postId, userId, data)

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Created post successfully!',
    data: result,
  })
})

const getPosts = catchAsync(async (req, res) => {
  const result = await PostServices.getPostsFromDB()
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Posts retrive successfully!',
    data: result,
  })
})

const getPost = catchAsync(async (req, res) => {
  const postId = req.params.postId
  const result = await PostServices.getPostFromDB(postId)
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Post retrive successfully!',
    data: result,
  })
})

const createComment = catchAsync(async (req, res) => {
  const data = req.body
  const postId = req.params.postId
  const userId = req.user?._id
  const result = await PostServices.createCommentIntoDB(data, postId, userId)

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Created comment successfully!',
    data: result,
  })
})

const createCommentReply = catchAsync(async (req, res) => {
  const data = req.body
  const commentId = req.params.commentId
  const userId = req.user?._id
  const result = await PostServices.createCommentReplyIntoDB(
    data,
    commentId,
    userId,
  )

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Created comment reply successfully!',
    data: result,
  })
})

const updateUpvote = catchAsync(async (req, res) => {
  const voteId = req.params.voteId
  const userId = req.user?._id
  const result = await PostServices.updateUpvoteIntoDB(userId, voteId)

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Upvoted comment successfully!',
    data: result,
  })
})

const updateDownvote = catchAsync(async (req, res) => {
  const voteId = req.params.voteId
  const userId = req.user?._id
  const result = await PostServices.updateDownvoteIntoDB(userId, voteId)

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Downvote comment successfully!',
    data: result,
  })
})

export const PostControllers = {
  createPost,
  createComment,
  createCommentReply,
  updateUpvote,
  updateDownvote,
  getPosts,
  createSharePost,
  getPost,
}
