import { Router } from 'express'
import {
  changePasswordController,
  forgotPasswordController,
  loginController,
  logoutController,
  refreshTokenController,
  registerController,
  resendVerifyEmailController,
  resetPasswordController,
  updateUserController,
  userController,
  verifyEmailTokenController,
  verifyResetPasswordTokenController
} from '~/controllers/users.controllers'
import {
  accessTokenValidator,
  emailVerifyTokenValidator,
  forgotPasswordValidator,
  loginValidator,
  refreshTokenValidator,
  registerValidator,
  resetPasswordValidator,
  verifyResetPasswordTokenValidator
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
 * Body: { email_verify_token: string }
 */
usersRouter.post('/verify-email', emailVerifyTokenValidator, wrapRequestHandler(verifyEmailTokenController))

/**
 * Description: Resend email verify
 * Path: /resend-email-verify
 * Method: POST
 * Body: {  }
 * Headers: { Authorization: Bearer <accessToken> } // Đăng nhập rồi mới resend được
 */
usersRouter.post('/resend-verify-email', accessTokenValidator, wrapRequestHandler(resendVerifyEmailController))

/**
 * Description: Submit email to reset password
 * Path: /forgot-password
 * Method: POST
 * Body: { email: string }
 */
usersRouter.post('/forgot-password', forgotPasswordValidator, wrapRequestHandler(forgotPasswordController))

/**
 * Description: Verify link in email to reset password
 * Path: /verify-forgot-password-token
 * Method: POST
 * Body: { forgot_password_token: string }
 */
usersRouter.post(
  '/verify-forgot-password-token',
  verifyResetPasswordTokenValidator,
  wrapRequestHandler(verifyResetPasswordTokenController)
)

/**
 * Description: Reset password
 * Path: /reset-password
 * Method: POST
 * Body: { password: string, confirmPassword: string }
 */
usersRouter.post('/reset-password', resetPasswordValidator, wrapRequestHandler(resetPasswordController))
export default usersRouter

/**
 * Description: Get me
 * Path: /me
 * Method: GET
 * Headers: { Authorization: Bearer <accessToken> }
 */
usersRouter.get('/', accessTokenValidator, wrapRequestHandler(userController))

/**
 * Description: Update user
 * Path: /me
 * Method: PUT
 * Headers: { Authorization: Bearer <accessToken> }
 * Body: { name: string }
 */
usersRouter.put('/', accessTokenValidator, wrapRequestHandler(updateUserController))

/**
 * Description: Change password
 * Path: /change-password
 * Method: PUT
 * Headers: { Authorization: Bearer
 * <accessToken> }
 * Body: { password: string, newPassword: string, confirmPassword: string }
 */
usersRouter.put('/change-password', accessTokenValidator, wrapRequestHandler(changePasswordController))
