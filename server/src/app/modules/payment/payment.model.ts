import { model, Schema } from 'mongoose'
import { TPayment } from './payment.interface'

const paymentSchema = new Schema<TPayment>(
  {
    user: { type: Schema.ObjectId, ref: 'User', default: null },
    amount: { type: String, default: null },
  },
  {
    timestamps: true,
  },
)

// Create the model
export const Payment = model('Payment', paymentSchema)
