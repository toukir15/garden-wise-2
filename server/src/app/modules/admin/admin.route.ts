import express from 'express'
import auth from '../../middlewares/auth'
import { USER_ROLE } from '../user/user.const'
import { AdminController } from './admin.controller'
const router = express.Router()

router.get(
  '/user-activity',
  auth(USER_ROLE.user, USER_ROLE.admin),
  AdminController.getUserActivity
)

router.get(
  '/payments',
  auth(USER_ROLE.user, USER_ROLE.admin),
  AdminController.getMonthlyPayments
)

router.get(
  '/users',
  auth(USER_ROLE.user, USER_ROLE.admin),
  AdminController.getUsers
)

router.delete(
  '/:userId',
  auth(USER_ROLE.user, USER_ROLE.admin),
  AdminController.deleteUser
)

router.patch(
  '/:userId',
  auth(USER_ROLE.user, USER_ROLE.admin),
  AdminController.updateUser
)

export const AdminRouter = router
