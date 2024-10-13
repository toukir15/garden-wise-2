import express from 'express'
import { ConnectionController } from './connection.controller'
import auth from '../../middlewares/auth'
import { USER_ROLE } from '../user/user.const'
const router = express.Router()

router.patch(
  '/follow/:followUserId',
  auth(USER_ROLE.user, USER_ROLE.admin),
  ConnectionController.updateFollowConnection,
)

router.patch(
  '/unfollow/:unfollowUserId',
  auth(USER_ROLE.user, USER_ROLE.admin),
  ConnectionController.updateUnfollowConnection,
)

export const ConnectionRouter = router
