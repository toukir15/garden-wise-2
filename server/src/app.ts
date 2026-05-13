import cors from 'cors'
import express, { Application, NextFunction, Request, Response } from 'express'
import httpStatus from 'http-status'
import globalErrorHandler from './app/middlewares/globalErrorHandler'
import routes from './app/routes'
import cookieParser from 'cookie-parser'
import notFound from './app/middlewares/notFound'
import config from './app/config'
import bodyParser from 'body-parser'
import Stripe from 'stripe'
import AppError from './app/errors/AppError'
import { User } from './app/modules/user/user.model'
import { Payment } from './app/modules/payment/payment.model'
const stripe = new Stripe(config.stripe_cli as string)

const app: Application = express()

app.use(
  cors({
    origin: [config.client_url as string],
    credentials: true,
  }),
)

app.options('*', cors())

app.use(cookieParser())

// Parser
app.use(express.urlencoded({ extended: true }))

app.use('/api/v1', express.json(), routes)

// Testing route
app.get('/', (req: Request, res: Response, next: NextFunction) => {
  res.status(httpStatus.OK).json({
    success: true,
    message: 'Welcome to the GardenWise API',
  })
})

app.post(
  '/webhook',
  bodyParser.raw({ type: 'application/json' }),
  async (req, res) => {
    const sig = req.headers['stripe-signature'] as string
    let event: Stripe.Event
    try {
      event = stripe.webhooks.constructEvent(
        req.body,
        sig,
        config.stripe_endpoint_secret as string,
      )
    } catch (err) {
      throw new AppError(httpStatus.BAD_REQUEST, 'Webhook Error')
    }

    // Handle the event
    if (event.type === 'checkout.session.completed') {
      const session = event.data.object as Stripe.Checkout.Session

      const userId = session.metadata!.user
      try {
        // update slot status
        await User.findByIdAndUpdate(userId, {
          isVerified: true,
        })

        await Payment.create({ user: userId, amount: '5.00' })
      } catch (err: any) {
        throw new AppError(httpStatus.BAD_REQUEST, err.message)
      }
    } else {
      console.log(`Unhandled event type ${event.type}`)
    }

    // Return a response to acknowledge receipt of the event
    res.json({ received: true })
  },
)

// Global error handler
app.use(globalErrorHandler)

// Handle unmatched routes (404)
// app.use('*', notFound)

export default app
