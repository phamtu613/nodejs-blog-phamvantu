import { NextFunction, Request, Response } from 'express'
import { checkSchema } from 'express-validator'
import usersService from '~/services/users.services'
import { validate } from '~/utils/validation'

// Dùng để validate dữ liệu trước khi gọi controller
export const loginValidator = (req: Request, res: Response, next: NextFunction) => {
  const { email, password } = req.body

  if (!email || !password) {
    res.status(400).json({ message: 'Vui lòng nhập email và mật khẩu' })
    return
  }
  next()
}

export const registerValidator = validate(
  checkSchema({
    name: {
      notEmpty: true,
      isLength: {
        errorMessage: 'Tên tối đa 100 ký tự',
        options: { min: 1, max: 100 }
      },
      trim: true
    },
    email: {
      notEmpty: true,
      isEmail: true,
      custom: {
        options: async (value) => {
          const isExitEmail = await usersService.checkEmailExist(value)
          if (isExitEmail) {
            throw new Error('Email đã tồn tại')
          }
          return true
        }
      }
    },
    password: {
      notEmpty: true,
      isString: true,
      isLength: {
        errorMessage: 'Mật khẩu phải có ít nhất 6 ký tự',
        options: { min: 6, max: 50 }
      }
    },
    confirmPassword: {
      custom: {
        options: (value, { req }) => {
          if (value !== req.body.password) {
            throw new Error('Mật khẩu không khớp')
          }
          return true
        }
      }
    },
    role: {
      notEmpty: true,
      isIn: {
        errorMessage: 'Vai trò không hợp lệ',
        options: [['Admin', 'User']]
      }
    }
  })
)
