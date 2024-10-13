import httpStatus from 'http-status'
import sendResponse from '../../utils/sendResponse'
import { catchAsync } from '../../utils/catchAsync'
import { ConnectionServices } from './connection.service'

const updateFollowConnection = catchAsync(async (req, res) => {
  const followUserId = req.params.followUserId
  const userId = req.user?._id

  const result = await ConnectionServices.updateFollowConnectionIntoDB(
    followUserId,
    userId,
  )
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Update follow connection successfully!',
    data: result,
  })
})

const updateUnfollowConnection = catchAsync(async (req, res) => {
  const unfollowUserId = req.params.unfollowUserId
  const userId = req.user?._id

  const result = await ConnectionServices.updateUnfollowConnectionIntoDB(
    unfollowUserId,
    userId,
  )
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Update unfollow connection successfully!',
    data: result,
  })
})

export const ConnectionController = {
  updateFollowConnection,
  updateUnfollowConnection,
}
