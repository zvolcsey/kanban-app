import { z } from 'zod'

// Schemas
export const signupSchema = z.object({
  username: z
    .string()
    .min(3, 'Username must be at least 3 characters long')
    .max(30, 'Username must be at most 30 characters long')
    .regex(
      /^[a-zA-Z0-9_]+$/,
      'Username can only contain letters, numbers, and underscores',
    ),
  password: z
    .string()
    .min(8, 'Password must be at least 8 characters long')
    .max(64, 'Password must be at most 64 characters long'),
})

// Inferred types
export type SignupInput = z.infer<typeof signupSchema>

// Shared entity types
export type PublicUser = {
  id: string
  username: string
  bio: string | null
  accountType: 'USER' | 'DEMO'
  createdAt: string
  updatedAt: string
}

// Response types
export type SignupResponse = {
  success: true
  message: string
  data: {
    user: PublicUser
  }
  token: string
}
