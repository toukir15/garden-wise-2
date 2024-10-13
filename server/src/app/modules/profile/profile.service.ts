import AppError from '../../errors/AppError'
import httpStatus, { BAD_REQUEST } from 'http-status'
import { User } from '../user/user.model'
import { TUser } from '../user/user.interface'
import { connection } from 'mongoose'

const updateMyProfile = async (
  userId: string,
  data: Partial<TUser>,
  profilePhoto: string,
) => {
  const profile = await User.findById(userId)

  if (!profile) {
    throw new AppError(httpStatus.NOT_FOUND, 'User profile does not exixts!')
  }

  if (profilePhoto) {
    data.profilePhoto = profilePhoto
  } else {
    delete data.profilePhoto
  }

  return await User.findByIdAndUpdate(userId, data, { new: true })
}

const myFollowings = async (userId: string) => {
  // check the user exist or not
  const findUser = await User.findById(userId)
  if (!findUser) {
    throw new AppError(BAD_REQUEST, 'User does not exist!')
  }

  const result = await User.findById(findUser?._id)
    .select({ connection: 1 })
    .populate({
      path: 'connection',
      select: { followings: 1 },
      populate: {
        path: 'followings',
        model: 'User',
        select: { _id: 1, name: 1, email: 1, profilePhoto: 1 },
      },
    })

  return result
}
const myFollowers = async (userId: string) => {
  // check the user exist or not
  const findUser = await User.findById(userId)
  if (!findUser) {
    throw new AppError(BAD_REQUEST, 'User does not exist!')
  }

  const result = await User.findById(findUser?._id)
    .select({ connection: 1 })
    .populate({
      path: 'connection',
      select: { followers: 1 },
      populate: {
        path: 'followers',
        model: 'User',
        select: { _id: 1, name: 1, email: 1, profilePhoto: 1 },
      },
    })

  return result
}

export const ProfileServices = {
  updateMyProfile,
  myFollowings,
  myFollowers,
}
