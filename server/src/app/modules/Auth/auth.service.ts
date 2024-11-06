import bcrypt from 'bcryptjs'
import httpStatus from 'http-status'
import jwt, { JwtPayload } from 'jsonwebtoken'
import config from '../../config'
import AppError from '../../errors/AppError'
import { createToken } from '../../utils/verifyJWT'
import { TLoginUser, TRegisterUser } from './auth.interface'
import { USER_ROLE } from '../user/user.const'
import { Connection } from '../connection/connection.model'
import { User } from '../user/user.model'
import { TUser } from '../user/user.interface'

const registerUser = async (payload: TRegisterUser, profilePhoto: string) => {
  // checking if the user is exist
  const user = await User.findOne({ email: payload?.email })

  if (user) {
    throw new AppError(httpStatus.NOT_FOUND, 'This user is already exist!')
  }

  const createConnection = await Connection.create({})

  // make password hash
  const salt = bcrypt.genSaltSync(Number(config.bcrypt_salt_rounds))
  const hash = bcrypt.hashSync(payload.password, salt)

  // add role, profilePhoto and hash password
  payload.role = USER_ROLE.user
  payload.profilePhoto = profilePhoto
  payload.password = hash
  payload.connection = createConnection?._id

  //create new user
  const newUser = await User.create(payload)

  //create token and sent to the  client
  const jwtPayload = {
    _id: newUser?._id.toString(),
    name: newUser?.name,
    email: newUser.email,
    role: newUser?.role,
    profilePhoto: newUser?.profilePhoto,
    isVerified: newUser?.isVerified,
  }

  const accessToken = createToken(
    jwtPayload,
    config.jwt_access_secret as string,
    config.jwt_access_expires_in as string,
  )

  const refreshToken = createToken(
    jwtPayload,
    config.jwt_refresh_secret as string,
    config.jwt_refresh_expires_in as string,
  )

  return {
    accessToken,
    refreshToken,
  }
}
const loginUser = async (payload: TLoginUser) => {
  // checking if the user is exist
  const user = await User.findOne({ email: payload?.email })

  if (!user) {
    throw new AppError(httpStatus.NOT_FOUND, 'This user is not found!')
  }

  const matchPassword = bcrypt.compareSync(payload.password, user.password)

  //checking if the password is correct
  if (!matchPassword)
    throw new AppError(httpStatus.FORBIDDEN, 'Password do not matched')

  //create token and sent to the  client
  const jwtPayload = {
    _id: user?._id.toString(),
    name: user?.name,
    email: user.email,
    role: user?.role,
    profilePhoto: user?.profilePhoto,
    isVerified: user?.isVerified,
  }

  const accessToken = createToken(
    jwtPayload,
    config.jwt_access_secret as string,
    config.jwt_access_expires_in as string,
  )

  const refreshToken = createToken(
    jwtPayload,
    config.jwt_refresh_secret as string,
    config.jwt_refresh_expires_in as string,
  )

  return {
    accessToken,
    refreshToken,
  }
}

const changePassword = async (
  userData: JwtPayload,
  payload: { oldPassword: string; newPassword: string },
) => {
  // checking if the user is exist
  const user = await User.findOne({ email: userData?.email })

  if (!user) {
    throw new AppError(httpStatus.NOT_FOUND, 'This user is not found!')
  }
  const matchPassword = bcrypt.compareSync(payload.oldPassword, user.password)

  //checking if the password is correct
  if (!matchPassword) {
    throw new AppError(httpStatus.FORBIDDEN, 'Password do not matched')
  }

  //hash new password
  const newHashedPassword = await bcrypt.hash(
    payload.newPassword,
    Number(config.bcrypt_salt_rounds),
  )
  await User.findOneAndUpdate(
    {
      email: userData.email,
      role: userData?.role,
    },
    {
      password: newHashedPassword,
      passwordChangedAt: new Date(),
    },
  )
  return null
}

const editProfile = async (payload: any, profilePhoto: any, userId: string) => {
  const updatedData: any = {}

  if (payload.name) {
    updatedData.name = payload.name
  }
  if (payload.address) {
    updatedData.address = payload.address
  }
  if (profilePhoto?.path) {
    updatedData.profilePhoto = profilePhoto.path
  }
  await User.findByIdAndUpdate(userId, updatedData)
  const user = await User.findById(userId)

  const jwtPayload = {
    _id: user?._id.toString(),
    name: user?.name,
    email: user.email,
    role: user?.role,
    profilePhoto: user?.profilePhoto,
    isVerified: user?.isVerified,
  }

  const accessToken = createToken(
    jwtPayload,
    config.jwt_access_secret as string,
    config.jwt_access_expires_in as string,
  )

  const refreshToken = createToken(
    jwtPayload,
    config.jwt_refresh_secret as string,
    config.jwt_refresh_expires_in as string,
  )
  return {
    accessToken,
    refreshToken,
  }
}

const refreshToken = async (token: string) => {
  // checking if the given token is valid
  const decoded = jwt.verify(
    token,
    config.jwt_refresh_secret as string,
  ) as JwtPayload

  const { email, iat } = decoded

  // checking if the user is exist
  const user = await User.findOne({ email: email })

  if (!user) {
    throw new AppError(httpStatus.NOT_FOUND, 'This user is not found!')
  }

  // if (
  //   user.passwordChangedAt &&
  //   User.isJWTIssuedBeforePasswordChanged(user.passwordChangedAt, iat as number)
  // ) {
  //   throw new AppError(httpStatus.UNAUTHORIZED, 'You are not authorized !')
  // }

  const jwtPayload = {
    _id: user?._id.toString(),
    name: user?.name,
    email: user.email,
    role: user?.role,
    profilePhoto: user?.profilePhoto,
    isVerified: user?.isVerified,
  }

  const accessToken = createToken(
    jwtPayload,
    config.jwt_access_secret as string,
    config.jwt_access_expires_in as string,
  )

  return {
    accessToken,
  }
}

export const AuthServices = {
  registerUser,
  loginUser,
  changePassword,
  refreshToken,
  editProfile,
}
