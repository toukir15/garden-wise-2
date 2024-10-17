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

router.get(
  '/followers',
  auth(USER_ROLE.user, USER_ROLE.admin),
  ConnectionController.getFollowers,
)

router.get(
  '/followings',
  auth(USER_ROLE.user, USER_ROLE.admin),
  ConnectionController.getFollowings,
)

export const ConnectionRouter = router
