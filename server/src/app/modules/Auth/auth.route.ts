import express from 'express'
import auth from '../../middlewares/auth'
import validateRequest, {
  validateRequestCookies,
} from '../../middlewares/validateRequest'
import { AuthControllers } from './auth.controller'
import { AuthValidation } from './auth.validation'
import { USER_ROLE } from '../user/user.const'
import { multerUpload } from '../../config/multer.config'
import { parseBody } from '../../middlewares/bodyParser'

const router = express.Router()

router.post(
  '/register',
  multerUpload.single('file'),
  // validateRequest(AuthValidation.registerValidationSchema),
  AuthControllers.registerUser,
)
router.post(
  '/login',
  // validateRequest(AuthValidation.loginValidationSchema),
  AuthControllers.loginUser,
)

router.patch(
  '/change-password',
  auth(USER_ROLE.user, USER_ROLE.admin),
  // validateRequest(AuthValidation.changePasswordValidationSchema),
  AuthControllers.changePassword,
)

router.post(
  '/forget-password',
  auth(USER_ROLE.user, USER_ROLE.admin),
  // validateRequest(AuthValidation.changePasswordValidationSchema),
  AuthControllers.forgetPassword,
)

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
