import express from 'express'
import { UserValidations } from './user.validation'
import { UserControllers } from './user.controller'
const router = express.Router()

router.post('/signup', UserControllers.createUser)
router.get('/', UserControllers.getUsers)
router.post('/:id', UserControllers.updateUser)

export const UserRouter = router
