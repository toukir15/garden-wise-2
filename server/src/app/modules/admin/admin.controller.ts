/* eslint-disable no-unused-vars */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { NextFunction, Request, Response } from 'express'
import { catchAsync } from '../../utils/catchAsync'
import httpStatus from 'http-status'
import sendResponse from '../../utils/sendResponse'
import { AdminService } from './admin.service'

const getUserActivity = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const result = await AdminService.getUserActivityFromDB()
    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: 'User activity retrive successfully',
      data: result,
    })
  },
)

const getMonthlyPayments = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const result = await AdminService.getMonthlyPaymentsFromDB()
    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: 'Payments retrive successfully',
      data: result,
    })
  },
)

const getUsers = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const userId = req.user._id
    const result = await AdminService.getUsersFromDB(userId)
    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: 'Users retrive successfully',
      data: result,
    })
  },
)

const deleteUser = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const userId = req.params.userId
    const result = await AdminService.deleteUserFromDB(userId)
    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: 'User deleted successfully',
      data: result,
    })
  },
)

const updateUser = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const userId = req.params.userId
    const result = await AdminService.updateUserIntoDB(userId)
    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: 'User make admin successfully',
      data: result,
    })
  },
)


export const AdminController = {
    getUserActivity,
    getMonthlyPayments,
    getUsers,
    updateUser,
    deleteUser
}
