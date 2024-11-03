/* eslint-disable no-unused-vars */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { NextFunction, Request, Response } from 'express'
import { catchAsync } from '../../utils/catchAsync'
import httpStatus from 'http-status'
import { PaymentService } from './payment.service'
import sendResponse from '../../utils/sendResponse'

const createPaymentSession = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const userId = req.user._id
    const result = await PaymentService.createPaymentSession(userId)
    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: 'Create seassion in successfully',
      data: result,
    })
  },
)

export const PaymentController = {
  createPaymentSession,
}
