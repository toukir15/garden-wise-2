import express from 'express'
import { PostRouter } from '../modules/posts/post.route'
import { ConnectionRouter } from '../modules/connection/connection.route'
import { UserRouter } from '../modules/user/user.route'
import { AuthRouter } from '../modules/Auth/auth.route'
import { PaymentRouter } from '../modules/payment/payment.route'
import { DashboardRoute } from '../modules/dashboard/dashboard.route'
import { CommentRouter } from '../modules/comment/comment.route'

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
  {
    path: '/admin',
    route: DashboardRoute,
  },
  {
    path: '/posts',
    route: PostRouter,
  },
  {
    path: '/comments',
    route: CommentRouter,
  },
  {
    path: '/connections',
    route: ConnectionRouter,
  },
  {
    path: '/payments',
    route: PaymentRouter,
  },
]

moduleRoutes.forEach(route => router.use(route.path, route.route))
export default router
