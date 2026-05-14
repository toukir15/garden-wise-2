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

const getFollowSuggetionUsersFromDB = async (userId: string, page: number = 1, limit: number = 10) => {
  const findUser = await User.findById(userId)
  if (!findUser) throw new AppError(httpStatus.BAD_REQUEST, 'User not found')

  const findConnection = await Connection.findById(findUser.connection)
  if (!findConnection) throw new AppError(httpStatus.BAD_REQUEST, 'Connection not found')

  const followings = findConnection.followings || []
  const skip = (page - 1) * limit

  const query = { _id: { $nin: [...followings, userId] } }
  const total = await User.countDocuments(query)
  const users = await User.find(query).skip(skip).limit(limit)

  return { users, meta: { total, page, limit } }
}

const getUsersFromDB = async () => {
  const result = await User.find()
  return result
}
const getUserFromDB = async (userId: string) => {
  // Find the user by ID
  const findUser = await User.findById(userId)

  if (!findUser) {
    throw new AppError(httpStatus.BAD_REQUEST, 'User not found')
  }

  const result = await User.findById(userId)
  return result
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
  getUserFromDB,
  getUsersFromDB
}
