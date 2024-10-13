import express from 'express'
import auth from '../../middlewares/auth'
import { multerUpload } from '../../config/multer.config'
import { parseBody } from '../../middlewares/bodyParser'
import { USER_ROLE } from '../user/user.const'
import { ProfileController } from './profile.controller'

const router = express.Router()

router.patch(
  '/',
  auth(USER_ROLE.admin, USER_ROLE.user),
  multerUpload.single('profilePhoto'),
  parseBody,
  ProfileController.updateMyProfile,
)

router.get(
  '/my-followers',
  auth(USER_ROLE.admin, USER_ROLE.user),
  ProfileController.myFollowers,
)

router.get(
  '/my-followings',
  auth(USER_ROLE.admin, USER_ROLE.user),
  ProfileController.myFollowings,
)

export const ProfileRouter = router
