import { prisma } from '../lib/prisma'
import argon2 from 'argon2'
import crypto from 'crypto'
import {
  ApiError,
  generateRawRefreshToken,
  signAccessToken,
} from '../utils/utils'
import type {
  SignupServiceProps,
  SignupServiceResponse,
} from '../types/auth.types'

export async function signupService({
  username,
  password,
}: SignupServiceProps): Promise<SignupServiceResponse> {
  // Check if user exists
  const userExists = await prisma.user.findUnique({ where: { username } })
  if (userExists) {
    throw new ApiError(409, 'Username already exists')
  }

  // Hash the password
  const hashedPassword = await argon2.hash(password)

  // Create the user
  const user = await prisma.user.create({
    data: {
      username,
      passwordHash: hashedPassword,
    },
  })

  // Issue JWT token
  const accessToken = await signAccessToken({
    userId: user.id,
    accountType: user.accountType,
  })

  // Generate and store refresh token
  const rawRefreshToken = generateRawRefreshToken()
  const hashedRefreshToken = crypto
    .createHash('sha256')
    .update(rawRefreshToken)
    .digest('hex')

  await prisma.refreshToken.create({
    data: {
      tokenHash: hashedRefreshToken,
      userId: user.id,
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days
    },
  })

  // Return user data and token
  return {
    accessToken,
    refreshToken: rawRefreshToken,
    user: {
      id: user.id,
      username: user.username,
      bio: user.bio,
      accountType: user.accountType,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    },
  }
}
