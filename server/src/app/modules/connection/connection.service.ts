import httpStatus from 'http-status'
import AppError from '../../errors/AppError'
import { User } from '../user/user.model'
import { Connection } from './connection.model'

const updateFollowConnectionIntoDB = async (
  followUserId: string,
  userId: string,
) => {
  //check find user exist or not
  const currentUser = await User.findById(userId)
  if (!currentUser) {
    throw new AppError(httpStatus.BAD_REQUEST, 'User does not exist!')
  }

  //check following user exist or not
  const followUser = await User.findById(followUserId)
  if (!followUser) {
    throw new AppError(httpStatus.BAD_REQUEST, 'User does not exist!')
  }

  //check already follow or not
  const currentUserConnection = await Connection.findOne({
    _id: currentUser.connection,
    followings: { $in: [followUser?._id] },
  })
  const followUserConnection = await Connection.findOne({
    _id: followUser.connection,
    followers: { $in: [currentUser?._id] },
  })

  if (currentUserConnection || followUserConnection) {
    throw new AppError(httpStatus.BAD_REQUEST, 'You already follow this user')
  }

  // update following user connection
  await Connection.findByIdAndUpdate(followUser.connection, {
    $push: { followers: currentUser?._id },
  })
  // update follow user connection
  await Connection.findByIdAndUpdate(currentUser.connection, {
    $push: { followings: followUser?._id },
  })
}

const updateUnfollowConnectionIntoDB = async (
  unfollowUserId: string,
  userId: string,
) => {
  //check find user exist or not
  const currentUser = await User.findById(userId)
  if (!currentUser) {
    throw new AppError(httpStatus.BAD_REQUEST, 'User does not exist!')
  }

  //check following user exist or not
  const unfollowUser = await User.findById(unfollowUserId)
  if (!unfollowUser) {
    throw new AppError(httpStatus.BAD_REQUEST, 'User does not exist!')
  }

  //check already follow or not
  const currentUserConnection = await Connection.findOne({
    _id: currentUser.connection,
    followings: { $in: [unfollowUser?._id] },
  })
  const unfollowUserConnection = await Connection.findOne({
    _id: unfollowUser.connection,
    followers: { $in: [currentUser?._id] },
  })

  if (currentUserConnection || unfollowUserConnection) {
    // update following user connection
    await Connection.findByIdAndUpdate(unfollowUser.connection, {
      $pull: { followers: currentUser?._id },
    })
    // update follow user connection
    await Connection.findByIdAndUpdate(currentUser.connection, {
      $pull: { followings: unfollowUser?._id },
    })
  } else {
    throw new AppError(httpStatus.BAD_REQUEST, 'You already unfollow this user')
  }
}

export const ConnectionServices = {
  updateFollowConnectionIntoDB,
  updateUnfollowConnectionIntoDB,
}
