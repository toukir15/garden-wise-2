import httpStatus from 'http-status'
import { User } from './user.model'
import config from '../../config'
import { TUser } from './user.interface'
import bcrypt from 'bcryptjs'
import AppError from '../../errors/AppError'
import { Connection } from '../connection/connection.model'

const createUserIntoDB = async (payload: TUser) => {
  // check user is exist or not
  const isUserExist = await User.findOne({ email: payload.email })
  if (isUserExist) {
    throw new AppError(httpStatus.BAD_REQUEST, 'User is already exist')
  }

  // make password hash
  const salt = bcrypt.genSaltSync(Number(config.bcrypt_salt_rounds))
  const hash = bcrypt.hashSync(payload.password, salt)
  if (!hash) {
    throw new AppError(httpStatus.CONFLICT, 'Conflict with user credantial')
  }
  payload.password = hash
  const result = await User.create(payload)
  return result
}

const getFollowSuggetionUsersFromDB = async (userId: string) => {
  // Find the user by ID
  const findUser = await User.findById(userId)

  if (!findUser) {
    throw new AppError(httpStatus.BAD_REQUEST, 'User not found')
  }

  // Find the connection by ID
  const findConnection = await Connection.findById(findUser.connection)
  if (!findConnection) {
    throw new AppError(httpStatus.BAD_REQUEST, 'Connection not found')
  }

  // Ensure followers and followings are arrays to avoid undefined values
  const followers = findConnection.followers || []
  const followings = findConnection.followings || []

  // Fetch users that are NOT in the followers and followings arrays
  const usersNotConnected = await User.find({
    _id: { $nin: [...followers, ...followings, userId] },
  })

  // Return the result
  return usersNotConnected
}

const updateUserIntoDB = async (id: string) => {
  const result = await User.findByIdAndUpdate(
    id,
    { role: 'admin' },
    { new: true },
  )
  return result
}

export const UserServices = {
  createUserIntoDB,
  getFollowSuggetionUsersFromDB,
  updateUserIntoDB,
}
