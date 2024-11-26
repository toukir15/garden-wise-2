import express from 'express'
import { UserControllers } from './user.controller'
import auth from '../../middlewares/auth'
import { USER_ROLE } from './user.const'
const router = express.Router()

router.post('/signup', UserControllers.createUser)
router.get(
  '/follow-suggetion',
  auth(USER_ROLE.user, USER_ROLE.admin),
  UserControllers.getFollowSuggetionUsers,
)
router.get(
  '/:userId',
  auth(USER_ROLE.user, USER_ROLE.admin),
  UserControllers.getUser,
)
// router.get('/:userId', UserControllers.getUsers)
router.post('/:id', UserControllers.updateUser)

export const UserRouter = router
