
import { NextFunction, Request, Response } from 'express'
import { catchAsync } from '../../utils/catchAsync'
import httpStatus from 'http-status'
import sendResponse from '../../utils/sendResponse'
import { BookmarkServices } from './bookmark.service'

const updateBookmark = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const bookmarkId = req.params.bookmarkId
    const postId = req.body.postId
    const result = await BookmarkServices.updateBookmarkIntoDB(bookmarkId, postId)
    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: 'Save post successfully',
      data: result,
    })
  },
)

const getBookmark = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const bookmarkId = req.user.bookmark
    const page = Number(req.query.page) || 1
    const { data, meta } = await BookmarkServices.getBookmarkFromDB(bookmarkId, page)
    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: 'Bookmark retrive successfully',
      data,
      meta,
    })
  },
)

export const BookmarkController = {
    updateBookmark,
    getBookmark
}
