import express, { Request, Response } from 'express'
import { pool } from './db'

import authRouter from './routes/auth.routes'

const app = express()

app.use(express.json())

app.get('/api/health', async (_req: Request, res: Response) => {
  try {
    await pool.query('SELECT 1')
    res.json({ status: 'ok', db: 'connection successful' })
  } catch (error) {
    console.error('Database connection error:', error)
    res.status(500).json({ status: 'error', db: 'connection failed' })
  }
})

app.use('/api/auth', authRouter)

export default app
