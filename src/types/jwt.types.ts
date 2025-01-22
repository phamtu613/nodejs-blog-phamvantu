import { RoleType } from '~/types/users.type'

export const TokenType = {
  ForgotPasswordToken: 'ForgotPasswordToken',
  AccessToken: 'AccessToken',
  RefreshToken: 'RefreshToken',
  EmailVerifyToken: 'EmailVerifyToken'
} as const

export const TokenTypeValues = [TokenType.ForgotPasswordToken, TokenType.AccessToken, TokenType.RefreshToken] as const

export type TokenType = keyof typeof TokenType

export interface TokenPayload {
  userId: number
  role: RoleType
  tokenType: TokenType
  exp: number
  iat: number
}
