import { NextFunction, Request, Response } from 'express'
import usersService from '~/services/users.services'
import { ParamsDictionary } from 'express-serve-static-core'
import {
  LogoutReqBody,
  RefreshTokenReqBody,
  RegisterReqBody,
  TokenPayload
} from '~/models/schemas/requests/User.requests'
import User from '~/models/schemas/User.schema'
import { ObjectId } from 'mongodb'
import { USERS_MESSAGES } from '~/constants/messages'
import databaseService from '~/services/database.services'

// Xử lý logic ở đây sau khi dữ liệu đã được validate ở middleware
export const loginController = async (req: Request, res: Response) => {
  const user = req.user as User
  const user_id = user._id as ObjectId
  const result = await usersService.login({ user_id: user_id.toString(), verify: user.verify })
  res.json({
    message: USERS_MESSAGES.LOGIN_SUCCESS,
    data: result
  })
  return
}

export const registerController = async (
  req: Request<ParamsDictionary, any, RegisterReqBody>,
  res: Response,
  next: NextFunction
) => {
  const result = await usersService.register(req.body)
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
  const { user_id, verify } = req.decoded_refresh_token as TokenPayload
  const result = await usersService.refreshToken({ user_id, refresh_token, verify })
  res.json({
    message: USERS_MESSAGES.REFRESH_TOKEN_SUCCESS,
    result
  })
  return
}

export const emailVerifyTokenController = async (req: any, res: Response) => {
  const { user_id } = req.decoded_email_verify_token as TokenPayload
  console.log('user_id>>>', user_id)
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
