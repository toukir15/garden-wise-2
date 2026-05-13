import httpStatus from "http-status"
import { catchAsync } from "../../utils/catchAsync"
import sendResponse from "../../utils/sendResponse"
import { CommentServices } from "./comment.service"

const createComment = catchAsync(async (req, res) => {
    const data = req.body
    const postId = req.params.postId
    const userId = req.user?._id
    const result = await CommentServices.createCommentIntoDB(data, postId, userId)
  
    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: 'Created comment successfully!',
      data: result,
    })
  })

const updateComment = catchAsync(async (req, res) => {
    const data = req.body
    const commentId = req.params.commentId
    const result = await CommentServices.updateCommentIntoDB(data, commentId)
  
    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: 'Update comment successfully!',
      data: result,
    })
  })

const deleteComment = catchAsync(async (req, res) => {
    const commentId = req.params.commentId
    const postId = req.body.postId
    const result = await CommentServices.deleteCommentFromDB(commentId, postId)
  
    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: 'Delete comment successfully!',
      data: result,
    })
  })

export const CommentControllers = {
 createComment,
 updateComment,
 deleteComment
}
