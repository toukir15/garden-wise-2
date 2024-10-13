import { Types } from 'mongoose'
import { USER_ROLE } from '../user/user.const'

export type TLoginUser = {
  email: string
  password: string
}

export type TRegisterUser = {
  name: string
  email: string
  password: string
  profilePhoto: string
  connection: Types.ObjectId
  role: keyof typeof USER_ROLE
}
