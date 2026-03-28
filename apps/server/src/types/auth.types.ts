export type SanitizedUser = {
  id: string
  username: string
  bio: string | null
  accountType: 'USER' | 'DEMO'
  createdAt: Date
  updatedAt: Date
}

export type SignupServiceProps = {
  username: string
  password: string
}

export type SignupServiceResponse = {
  accessToken: string
  refreshToken: string
  user: SanitizedUser
}
