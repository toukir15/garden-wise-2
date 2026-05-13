import express from 'express'
import auth from '../../middlewares/auth'
import { USER_ROLE } from '../user/user.const'
import { CommentControllers } from './comment.controller'

const router = express.Router()

router.post(
  '/:postId',
  auth(USER_ROLE.user, USER_ROLE.admin),
  CommentControllers.createComment,
)

router.patch(
  '/:commentId',
  auth(USER_ROLE.user, USER_ROLE.admin),
  CommentControllers.updateComment,
)

router.put(
  '/:commentId',
  auth(USER_ROLE.user, USER_ROLE.admin),
  CommentControllers.deleteComment,
)

export const CommentRouter = router
