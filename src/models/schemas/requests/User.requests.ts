import { JwtPayload } from 'jsonwebtoken'
import { TokenType } from '~/types/jwt.types'
import { RoleType } from '~/types/users.type'

export interface LoginReqBody {
  email: string
  password: string
}
export interface RegisterReqBody {
  name: string
  email: string
  password: string
  confirm_password: string
  access_token?: string
  role?: RoleType
}

export interface LogoutReqBody {
  refresh_token: string
}
export interface TokenPayload extends JwtPayload {
  user_id: string
  token_type: TokenType
}

export interface RefreshTokenReqBody {
  refresh_token: string
}

export interface VerifyEmailTokenReqBody {
  email_verify_token: string
}

export interface ForgotPasswordReqBody {
  email: string
}

export interface VerifyResetPasswordTokenReqBody {
  forgot_password_token: string
}

export interface ResetPasswordReqBody {
  password: string
  confirmPassword: string
  forgot_password_token: string
}
