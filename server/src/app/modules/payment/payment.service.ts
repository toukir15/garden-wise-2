import Stripe from 'stripe'
import httpStatus from 'http-status'
import config from '../../config'
import AppError from '../../errors/AppError'
import { User } from '../user/user.model'
const stripe = new Stripe(config.stripe_cli as string)

const createPaymentSession = async (userId: string) => {

  const findUser = await User.findById(userId)
  if (!findUser) {
    throw new AppError(httpStatus.BAD_REQUEST, 'User does not exist')
  }

  // // Step 1: Create a Product
  const product = await stripe.products.create({
    name: `${findUser.name}, verify your profile to unlock exclusive premium content!`,
    description: `Hi ${findUser.name}, it's time to verify your profile and gain access to a world of premium content! 
Unlock exclusive features, enjoy personalized experiences, and never miss out on our top-tier offerings. 
Verify now to take advantage of all the benefits waiting for you!`,
  })
  // // Step 2: Create a Price
  const price = await stripe.prices.create({
    unit_amount: 500,
    currency: 'usd',
    product: product.id,
  })
  // // Step 3: Create a Checkout Session
  const session = await stripe.checkout.sessions.create({
    mode: 'payment',
    line_items: [
      {
        price: price.id,
        quantity: 1,
      },
    ],
    customer_email: findUser.email,
    metadata: {
      user: String(findUser._id),
    },
    success_url: `${config.success_url}`,
    cancel_url: config.client_url,
  })
  return session
}

export const PaymentService = {
  createPaymentSession,
}
