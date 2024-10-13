import express from 'express'
import { PostRouter } from '../modules/posts/post.route'
import { ConnectionRouter } from '../modules/connection/connection.route'
import { UserRouter } from '../modules/user/user.route'
import { AuthRouter } from '../modules/Auth/auth.route'
import { ProfileRouter } from '../modules/profile/profile.route'

const router = express.Router()

const moduleRoutes = [
  {
    path: '/auth',
    route: AuthRouter,
  },
  {
    path: '/users',
    route: UserRouter,
  },
  // {
  //   path: '/profile',
  //   route: ProfileRouter,
  // },
  {
    path: '/posts',
    route: PostRouter,
  },
  {
    path: '/connections',
    route: ConnectionRouter,
  },
]

moduleRoutes.forEach(route => router.use(route.path, route.route))
export default router
