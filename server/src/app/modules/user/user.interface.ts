import { Types } from 'mongoose'
import { USER_ROLE } from './user.const'

export type TUser = {
  name: string
  email: string
  password: string
  role: 'user' | 'admin'
  profilePhoto: string
  address: string
  conversations?: [Types.ObjectId];
  connection?: Types.ObjectId
  bookmark: Types.ObjectId
  isVerified: boolean
}

export type TUserRole = keyof typeof USER_ROLE
