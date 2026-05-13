import express from 'express'
import auth from '../../middlewares/auth'
import { AuthControllers } from './auth.controller'
import { USER_ROLE } from '../user/user.const'
import { multerUpload } from '../../config/multer.config'
import { parseBody } from '../../middlewares/bodyParser'

const router = express.Router()

router.post(
  '/register',
  multerUpload.single('file'),
  AuthControllers.registerUser,
)
router.post('/login', AuthControllers.loginUser)

router.patch(
  '/change-password',
  auth(USER_ROLE.user, USER_ROLE.admin),
  AuthControllers.changePassword,
)

router.patch(
  '/forget-password',
  auth(USER_ROLE.user, USER_ROLE.admin),
  AuthControllers.forgetPassword,
)

router.post('/send-forget-email', AuthControllers.sendForgetEmail)

router.post(
  '/edit-profile',
  multerUpload.single('profilePhoto'),
  auth(USER_ROLE.user, USER_ROLE.admin),
  parseBody,
  AuthControllers.editProfile,
)

router.post(
  '/refresh-token',
  auth(USER_ROLE.user, USER_ROLE.admin),
  AuthControllers.refreshToken,
)

export const AuthRouter = router
