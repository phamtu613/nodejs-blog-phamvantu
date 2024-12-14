import { NextFunction, Request, Response } from 'express'
import usersService from '~/services/users.services'
import { ParamsDictionary } from 'express-serve-static-core'
import { RegisterReqBody } from '~/models/schemas/requests/User.requests'

// Xử lý logic ở đây sau khi dữ liệu đã được validate ở middleware
export const loginController = (req: Request, res: Response) => {
  const { email, password } = req.body

  if (email === 'admin@gmail.com' && password === '123456') {
    res.json({ message: 'Login successfully hihi' })
  } else {
    res.status(401).json({ message: 'Email or password is incorrect' })
  }
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
