import express from 'express'
import auth from '../../middlewares/auth'
import { USER_ROLE } from '../user/user.const'
import { BookmarkController } from './bookmark.controller'

const router = express.Router()

router.patch(
  '/:bookmarkId',
  auth(USER_ROLE.user, USER_ROLE.admin),
  BookmarkController.updateBookmark,
)

router.get(
  '/',
  auth(USER_ROLE.user, USER_ROLE.admin),
  BookmarkController.getBookmark,
)


export const BookmarkRouter = router
