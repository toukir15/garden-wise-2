import { catchAsync } from '../../utils/catchAsync'
import sendResponse from '../../utils/sendResponse'
import httpStatus from 'http-status'
import { ProfileServices } from './profile.service'

const updateMyProfile = catchAsync(async (req, res) => {
  const result = await ProfileServices.updateMyProfile(
    req.user?._id,
    req.body,
    req.file!.path,
  )

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: 'Profile updated successfully',
    data: result,
  })
})

const myFollowings = catchAsync(async (req, res) => {
  const userId = req.user?._id
  const result = await ProfileServices.myFollowings(userId)

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: 'My followings retrive successfully!',
    data: result,
  })
})

const myFollowers = catchAsync(async (req, res) => {
  const userId = req.user?._id
  const result = await ProfileServices.myFollowers(userId)

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: 'My followers retrive successfully!',
    data: result,
  })
})

export const ProfileController = {
  updateMyProfile,
  myFollowings,
  myFollowers,
}
