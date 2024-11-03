import { Types } from 'mongoose'

export type TPayment = {
  user: Types.ObjectId
  amount: string
}
