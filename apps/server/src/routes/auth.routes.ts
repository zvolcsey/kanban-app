import { Router } from 'express'
import {
  signup,
  login,
  loginDemoUser,
  refreshToken,
  logout,
  getMe,
} from '../controller/auth.controller'

const router = Router()

router.post('/signup', signup)
router.post('/login', login)
router.post('/login/demo', loginDemoUser)
router.post('/refresh', refreshToken)
router.post('/logout', logout)
router.get('/me', getMe)

export default router
