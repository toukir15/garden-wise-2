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

const getFollowersFromDB = async (userId: string, page: number = 1, limit: number = 10) => {
  const currentUser = await User.findById(userId)
  if (!currentUser) {
    throw new AppError(httpStatus.BAD_REQUEST, 'User does not exist!')
  }

  const skip = (page - 1) * limit

  const meta = await Connection.findById(currentUser.connection).select({ followers: 1 })
  const total = meta?.followers?.length ?? 0

  const findFollowers = await Connection.findById(currentUser.connection, {
    followers: { $slice: [skip, limit] },
  }).populate({ path: 'followers', model: 'User', select: 'name email profilePhoto' })

  return {
    followers: findFollowers?.followers ?? [],
    meta: { total, page, limit },
  }
}

const getFollowingsFromDB = async (userId: string, page: number = 1, limit: number = 10) => {
  const currentUser = await User.findById(userId)
  if (!currentUser) {
    throw new AppError(httpStatus.BAD_REQUEST, 'User does not exist!')
  }

  const skip = (page - 1) * limit

  const meta = await Connection.findById(currentUser.connection).select({ followings: 1 })
  const total = meta?.followings?.length ?? 0

  const findFollowings = await Connection.findById(currentUser.connection, {
    followings: { $slice: [skip, limit] },
  }).populate({ path: 'followings', model: 'User', select: 'name email profilePhoto' })

  return {
    followings: findFollowings?.followings ?? [],
    meta: { total, page, limit },
  }
}

const getViewProfileFollowersFromDB = async (userId: string) => {
  //check find user exist or not
  const currentUser = await User.findById(userId)
  if (!currentUser) {
    throw new AppError(httpStatus.BAD_REQUEST, 'User does not exist!')
  }

  const findFollowers = await Connection.findById(currentUser.connection)
    .select({ followers: 1 })
    .populate({
      path: 'followers',
      model: 'User',
      select: 'name email profilePhoto',
    })

  return findFollowers
}

const getViewProfileFollowingsFromDB = async (userId: string) => {
  //check find user exist or not
  const currentUser = await User.findById(userId)
  if (!currentUser) {
    throw new AppError(httpStatus.BAD_REQUEST, 'User does not exist!')
  }

  const findFollowings = await Connection.findById(currentUser.connection)
    .select({ followings: 1 })
    .populate({
      path: 'followings',
      model: 'User',
      select: 'name email profilePhoto',
    })
  return findFollowings
}

export const ConnectionServices = {
  updateFollowConnectionIntoDB,
  updateUnfollowConnectionIntoDB,
  getFollowersFromDB,
  getFollowingsFromDB,
  getViewProfileFollowingsFromDB,
  getViewProfileFollowersFromDB
}
