import express, { NextFunction, Request, Response } from 'express'
import dotenv from 'dotenv'
import cors from 'cors'
import cookieParser from 'cookie-parser'
import helmet from 'helmet'
import morgan from 'morgan'
import { pool } from './db'

import authRouter from './routes/auth.routes'
import { errorHandler } from './middleware/middleware'
import { ApiError } from './utils/utils'

dotenv.config()

const app = express()

app.use(helmet())
app.use(morgan('dev'))

app.use(
  cors({
    origin: process.env.CORS_ORIGIN || 'http://localhost:5173',
    methods: ['GET', 'POST', 'PATCH', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true,
  }),
)

app.use(express.json())
app.use(cookieParser())

app.get('/api/health', async (_req: Request, res: Response) => {
  try {
    await pool.query('SELECT 1')
    res.json({ status: 'ok', db: 'connection successful' })
  } catch (error) {
    console.error('Database connection error:', error)
    res.status(500).json({ status: 'error', db: 'connection failed' })
  }
})

// Routes
app.use('/api/v1/auth', authRouter)

// 404 Handler
app.use((req: Request, _res: Response, next: NextFunction) => {
  const error = new ApiError(
    404,
    `Route ${req.method} ${req.originalUrl} not found`,
  )
  next(error)
})

// Global Error Handler
app.use(errorHandler)

export default app
