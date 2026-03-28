import { Request, Response, NextFunction } from 'express'
import * as z from 'zod'
import { ApiError } from '../utils/utils'

// Middleware to validate request bodies against Zod schemas
export function validate(schema: z.ZodTypeAny) {
  return (req: Request, _res: Response, next: NextFunction) => {
    try {
      req.body = schema.parse(req.body)
      next()
    } catch (error) {
      next(error)
    }
  }
}

// Middleware to handle errors
export const errorHandler = (
  err: Error,
  _req: Request,
  res: Response,
  _next: NextFunction,
) => {
  console.error(`[Error]: ${err.message}`)

  if (err instanceof z.ZodError) {
    return res.status(422).json({
      success: false,
      message: 'Validation Failed',
      errors: err.issues.map((issue) => ({
        path: issue.path[0],
        message: issue.message,
      })),
      ...(process.env.NODE_ENV === 'development' && { stack: err.stack }),
    })
  }

  if (err instanceof ApiError) {
    return res.status(err.statusCode).json({
      error: {
        success: false,
        message: err.message,
        errors: null,
        ...(process.env.NODE_ENV === 'development' && { stack: err.stack }),
      },
    })
  }

  return res.status(500).json({
    error: {
      success: false,
      message: 'Internal Server Error',
      errors: null,
      ...(process.env.NODE_ENV === 'development' && { stack: err.stack }),
    },
  })
}
