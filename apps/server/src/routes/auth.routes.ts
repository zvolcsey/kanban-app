import { Router } from 'express'
import { validate } from '../middleware/middleware'
import { signupSchema } from '@kanban-app/shared'
import {
  signupHandler,
  login,
  loginDemoUser,
  refreshToken,
  logout,
  getMe,
} from '../controller/auth.controller'

const router = Router()

router.post('/signup', validate(signupSchema), signupHandler)
router.post('/login', login)
router.post('/login/demo', loginDemoUser)
router.post('/refresh', refreshToken)
router.post('/logout', logout)
router.get('/me', getMe)

export default router
