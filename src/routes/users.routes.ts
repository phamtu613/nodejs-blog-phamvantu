import { Router } from 'express'
import {
  loginController,
  logoutController,
  refreshTokenController,
  registerController
} from '~/controllers/users.controllers'
import {
  accessTokenValidator,
  loginValidator,
  refreshTokenValidator,
  registerValidator
} from '~/middlewares/users.middlewares'
import { wrapRequestHandler } from '~/utils/handlers'

const usersRouter = Router()

usersRouter.post('/login', loginValidator, wrapRequestHandler(loginController))

/**
 * Description: Register a new user
 * Path: /register
 * Method: POST
 * Body: { name: string, email: string, password: string, confirmPassword: string, role: string }
 */
// validate(registerValidator) // validate có nhiệm vụ check lỗi registerValidator nếu trong registerValidator thì function trong validate sẽ xuất lỗi luôn
usersRouter.post('/register', registerValidator, wrapRequestHandler(registerController))

/**
 * Description: Logout a user
 * Path: /logout
 * Method: POST
 * Body: { refreshToken: string }
 * Headers: { Authorization: Bearer <accessToken> }
 */
usersRouter.post('/logout', accessTokenValidator, refreshTokenValidator, wrapRequestHandler(logoutController))

/**
 * Description: Refresh access token
 * Path: /refresh-token
 * Method: POST
 * Headers: { Authorization: Bearer <refresh token> }
 */
usersRouter.post('/refresh-token', refreshTokenValidator, wrapRequestHandler(refreshTokenController))

/**
 * Description: Verify email when user click on the link in email
 * Path: /verify-email
 * Method: POST
 * Body: { email_verification_token: string }
 */
usersRouter.post('/verify-email', refreshTokenValidator, wrapRequestHandler(refreshTokenController))
export default usersRouter
