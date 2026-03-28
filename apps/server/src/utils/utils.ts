import { randomBytes } from 'crypto'
import { SignJWT } from 'jose'

export class ApiError extends Error {
  statusCode: number

  constructor(statusCode: number, message: string) {
    super(message)

    this.statusCode = statusCode

    Error.captureStackTrace(this, this.constructor)
  }
}

export function signAccessToken(payload: {
  userId: string
  accountType: string
}) {
  return new SignJWT(payload)
    .setProtectedHeader({ alg: 'HS256' })
    .setSubject(payload.userId.toString())
    .setIssuedAt()
    .setExpirationTime('15m')
    .sign(new TextEncoder().encode(process.env.JWT_SECRET))
}

export function generateRawRefreshToken() {
  return randomBytes(64).toString('hex') // 128 characters
}
