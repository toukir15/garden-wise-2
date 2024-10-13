import express from 'express'
import auth from '../../middlewares/auth'
import validateRequest, {
  validateRequestCookies,
} from '../../middlewares/validateRequest'
import { AuthControllers } from './auth.controller'
import { AuthValidation } from './auth.validation'
import { USER_ROLE } from '../user/user.const'
import { multerUpload } from '../../config/multer.config'

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

router.post(
  '/change-password',
  // auth(USER_ROLE.USER as st, USER_ROLE.ADMIN),
  validateRequest(AuthValidation.changePasswordValidationSchema),
  AuthControllers.changePassword,
)

router.post(
  '/refresh-token',
  validateRequestCookies(AuthValidation.refreshTokenValidationSchema),
  AuthControllers.refreshToken,
)

export const AuthRouter = router
