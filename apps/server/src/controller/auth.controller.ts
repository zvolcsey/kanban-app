import { Request, Response, NextFunction } from 'express'
import { signupService } from '../services/auth.service'
import { SignupInput, SignupResponse } from '@kanban-app/shared'

export async function signupHandler(
  req: Request<SignupInput>,
  res: Response<SignupResponse>,
  next: NextFunction,
) {
  try {
    const { username, password } = req.body

    const { accessToken, user } = await signupService({ username, password })

    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    })

    res.status(201).json({
      success: true,
      message: 'User registered successfully',
      data: {
        user: {
          ...user,
          createdAt: user.createdAt.toISOString(),
          updatedAt: user.updatedAt.toISOString(),
        },
      },
      token: accessToken,
    })
  } catch (error) {
    next(error)
  }
}

export function login(_req: Request, res: Response) {
  res.status(200).json({ message: 'User logged in successfully' })
}

export function loginDemoUser(_req: Request, res: Response) {
  res.status(200).json({ message: 'Demo user logged in successfully' })
}

export function refreshToken(_req: Request, res: Response) {
  res.status(200).json({ message: 'Token refreshed successfully' })
}

export function logout(_req: Request, res: Response) {
  res.status(200).json({ message: 'User logged out successfully' })
}

export function getMe(_req: Request, res: Response) {
  res.status(200).json({ message: 'User info retrieved successfully' })
}
