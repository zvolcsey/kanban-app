import { Request, Response } from 'express'

export function signup(_req: Request, res: Response) {
  res.status(201).json({ message: 'User signed up successfully' })
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
