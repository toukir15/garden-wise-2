import httpStatus from 'http-status'
import config from '../../config'
import sendResponse from '../../utils/sendResponse'
import { catchAsync } from '../../utils/catchAsync'
import { AuthServices } from './auth.service'

const registerUser = catchAsync(async (req, res) => {
  const userData = JSON.parse(req.body.data)
  const profilePhoto = req.file!?.path
  const result = await AuthServices.registerUser(userData, profilePhoto)
  const { refreshToken, accessToken } = result
  res.cookie('refreshToken', refreshToken, {
    secure: config.NODE_ENV === 'production',
    httpOnly: true,
  })
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'User registered in successfully!',
    data: {
      accessToken,
      refreshToken,
    },
  })
})

const loginUser = catchAsync(async (req, res) => {
  const result = await AuthServices.loginUser(req.body)
  const { refreshToken, accessToken, _id } = result

  res.cookie('refreshToken', refreshToken, {
    secure: config.NODE_ENV === 'production',
    httpOnly: true,
  })

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'User logged in successfully!',
    data: {
      _id,
      accessToken,
      refreshToken,
    },
  })
})

const changePassword = catchAsync(async (req, res) => {
  const { ...passwordData } = req.body
  const result = await AuthServices.changePassword(req.user, passwordData)
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Password updated successfully!',
    data: result,
  })
})

const forgetPassword = catchAsync(async (req, res) => {
  const { ...passwordData } = req.body
  const result = await AuthServices.forgetPassword(req.user, passwordData)
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Password updated successfully!',
    data: result,
  })
})

const sendForgetEmail = catchAsync(async (req, res) => {
  const result = await AuthServices.sendForgetEmail(req.body.email)
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Send forget email successfully!',
    data: result,
  })
})

const editProfile = catchAsync(async (req, res) => {
  const data = req.body
  const userId = req.user._id
  const profilePhoto = req.file
  const result = await AuthServices.editProfile(data, profilePhoto, userId)
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Edit profile successfully!',
    data: result,
  })
})

const refreshToken = catchAsync(async (req, res) => {
  const result = await AuthServices.refreshToken(req.user.email)

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Access token retrieved successfully!',
    data: result,
  })
})

export const AuthControllers = {
  registerUser,
  loginUser,
  changePassword,
  refreshToken,
  editProfile,
  sendForgetEmail,
  forgetPassword,
}
