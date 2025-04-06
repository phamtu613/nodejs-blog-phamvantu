import { NextFunction, Request, Response } from 'express'
import { ParamsDictionary } from 'express-serve-static-core'
import { ObjectId } from 'mongodb'
import { USERS_MESSAGES } from '~/constants/messages'
import {
  ForgotPasswordReqBody,
  LoginReqBody,
  LogoutReqBody,
  RefreshTokenReqBody,
  RegisterReqBody,
  ResetPasswordReqBody,
  TokenPayload,
  VerifyEmailTokenReqBody,
  VerifyResetPasswordTokenReqBody
} from '~/models/schemas/requests/User.requests'
import User from '~/models/schemas/User.schema'
import databaseService from '~/services/database.services'
import emailService from '~/services/email.services'
import usersService from '~/services/users.services'
import { Role, UserVerifyStatus } from '~/types/users.type'
import { verifyToken } from '~/utils/jwt'

// Xử lý logic ở đây sau khi dữ liệu đã được validate ở middleware
export const loginController = async (req: Request<ParamsDictionary, any, LoginReqBody>, res: Response) => {
  const user = req.user as User
  const user_id = user._id as ObjectId
  const result = await usersService.login({ user_id: user_id.toString(), verify: user.verify, role: user.role })
  res.json({
    message: USERS_MESSAGES.LOGIN_SUCCESS,
    data: {
      ...result,
      account: {
        name: user.name,
        email: user.email,
        role: user.role,
        create_at: user.created_at,
        updated_at: user.updated_at,
        verify: user.verify,
        avatar: user.avatar,
        cover_photo: user.cover_photo,
        id: user_id
      }
    }
  })
  return
}

export const registerController = async (
  req: Request<ParamsDictionary, any, RegisterReqBody>,
  res: Response,
  next: NextFunction
) => {
  let creator

  if (req.body?.access_token) {
    const decoded_access_token = await verifyToken({
      token: req.body?.access_token as any,
      secretOrPublicKey: process.env.JWT_SECRET_ACCESS_TOKEN as string
    })
    creator = decoded_access_token
  }

  req.body.role = Role.User

  if (creator?.role === Role.Admin) {
    // Nếu người tạo là admin thì tạo user có role là Admin luôn
    req.body.role = Role.Admin
  }

  const result = await usersService.register(req.body)

  // Send verification email using template
  const verifyUrl = `${process.env.WEB_APP_URL}/verify-email?email-verify-token=${result.account.email_verify_token}`
  const emailSubject = 'Xác nhận tài khoản blog phamvantu.com'
  const emailVariables = {
    name: req.body.name,
    verifyUrl
  }

  await emailService.sendTemplateMail(req.body.email, emailSubject, 'verify-email', emailVariables)

  res.json({ message: 'Đăng ký thành công', data: result })
  return
}

export const logoutController = async (req: Request<ParamsDictionary, any, LogoutReqBody>, res: Response) => {
  const { refresh_token } = req.body
  const result = await usersService.logout(refresh_token)
  res.json(result)
  return
}

export const refreshTokenController = async (
  req: Request<ParamsDictionary, any, RefreshTokenReqBody>,
  res: Response
) => {
  const { refresh_token } = req.body
  const { user_id, verify, role } = req.decoded_refresh_token as TokenPayload
  const result = await usersService.refreshToken({ user_id, refresh_token, verify, role })
  res.json({
    message: USERS_MESSAGES.REFRESH_TOKEN_SUCCESS,
    result
  })
  return
}

export const verifyEmailTokenController = async (
  req: Request<ParamsDictionary, any, VerifyEmailTokenReqBody>,
  res: Response
) => {
  const { user_id, role } = req.decoded_email_verify_token as TokenPayload
  const user = await databaseService.users.findOne({ _id: new ObjectId(user_id) })
  console.log('user>>>', user)
  if (!user) {
    res.status(404).json({ message: USERS_MESSAGES.USER_NOT_FOUND })
    return
  }
  // Đã verify email rồi
  if (user.email_verify_token === '') {
    res.json({ message: USERS_MESSAGES.EMAIL_ALREADY_VERIFIED })
    return
  }

  const result = await usersService.verifyEmail({ user_id })
  console.log('result>>>', result)

  res.json({ message: USERS_MESSAGES.EMAIL_VERIFICATION_SUCCESS, data: result })
  return
}

export const resendVerifyEmailController = async (req: Request, res: Response) => {
  const { user_id } = req.decoded_authorization as TokenPayload
  const user = await databaseService.users.findOne({ _id: new ObjectId(user_id) })
  if (!user) {
    res.status(404).json({ message: USERS_MESSAGES.USER_NOT_FOUND })
    return
  }
  if (user.verify === UserVerifyStatus.Verified) {
    res.json({ message: USERS_MESSAGES.EMAIL_ALREADY_VERIFIED })
    return
  }
  const result = await usersService.resendEmailVerify({ user_id })

  // Send verification email using template
  const verifyUrl = `${process.env.WEB_APP_URL}/verify-email?email-verify-token=${result.account && result.account.email_verify_token}`
  const emailSubject = 'Xác nhận tài khoản - phamvantu.com'
  const emailVariables = {
    name: user.name,
    verifyUrl
  }
  await emailService.sendTemplateMail(user.email, emailSubject, 'verify-email', emailVariables)
  res.json(result)
}

export const forgotPasswordController = async (
  req: Request<ParamsDictionary, any, ForgotPasswordReqBody>,
  res: Response
) => {
  const { _id, verify } = req.user as User

  const result = await usersService.forgotPassword((_id as ObjectId).toString(), verify)
  console.log('result>>>', result)
  // Send verification email using template
  const forgotPasswordUrl = `${process.env.WEB_APP_URL}/verify-forgot-password?forgot-password-token=${result.account?.forgot_password_token}`
  const emailSubject = 'Lấy lại mật khẩu - phamvantu.com'
  const emailVariables = {
    name: result.account?.name,
    forgotPasswordUrl
  }

  await emailService.sendTemplateMail((result.account as any).email, emailSubject, 'forgot-password', emailVariables)

  // console.log('forgot_password_token>>>', forgot_password_token)

  res.json(result.message)
  return
}

export const verifyResetPasswordTokenController = async (
  req: Request<ParamsDictionary, any, VerifyResetPasswordTokenReqBody>,
  res: Response,
  next: NextFunction
) => {
  res.json({
    message: USERS_MESSAGES.VERIFY_FORGOT_PASSWORD_TOKEN_SUCCESS
  })
}

export const resetPasswordController = async (
  req: Request<ParamsDictionary, any, ResetPasswordReqBody>,
  res: Response,
  next: NextFunction
) => {
  const user_id = (req.decoded_reset_password_token as TokenPayload).user_id
  const { password } = req.body
  const result = await usersService.resetPassword(user_id, password)
  res.json(result)
}

export const userController = async (req: Request, res: Response) => {
  const { user_id } = req.decoded_authorization as TokenPayload
  const user = await usersService.getUser(user_id)
  if (!user) {
    res.status(404).json({ message: USERS_MESSAGES.USER_NOT_FOUND })
    return
  }
  res.json({ data: user })
}

export const updateUserController = async (req: Request, res: Response) => {
  const { user_id } = req.decoded_authorization as TokenPayload
  const { name, cover_photo } = req.body
  const result = await usersService.updateUser(user_id, name, cover_photo)
  res.json(result)
}

export const changePasswordController = async (req: Request, res: Response) => {
  const { user_id } = req.decoded_authorization as TokenPayload
  const { password, new_password } = req.body
  const result = await usersService.changePassword(user_id, password, new_password)
  res.json(result)
}
