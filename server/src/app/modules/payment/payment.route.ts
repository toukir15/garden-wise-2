import express from 'express'
import { PaymentController } from './payment.controller'
import auth from '../../middlewares/auth'
import { USER_ROLE } from '../user/user.const'
const router = express.Router()

router.post(
  '/create-payment',
  auth(USER_ROLE.user, USER_ROLE.admin),
  PaymentController.createPaymentSession,
)

export const PaymentRouter = router
