import cors from 'cors'
import express, { Application, NextFunction, Request, Response } from 'express'
import httpStatus from 'http-status'
import globalErrorHandler from './app/middlewares/globalErrorHandler'
import routes from './app/routes'
import cookieParser from 'cookie-parser'
import notFound from './app/middlewares/notFound'
import config from './app/config'

const app: Application = express()

app.use(
  cors({
    origin: [config.client_url as string],
  }),
)
app.use(cookieParser())

// Parser
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

app.use('/api/v1', routes)

// Testing route
app.get('/', (req: Request, res: Response, next: NextFunction) => {
  res.status(httpStatus.OK).json({
    success: true,
    message: 'Welcome to the GardenWise API',
  })
})

// Global error handler
app.use(globalErrorHandler)

// Handle unmatched routes (404)
// app.use('*', notFound)

export default app
