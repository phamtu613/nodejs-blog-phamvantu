import { NextFunction, Request, Response } from 'express'
import { checkSchema } from 'express-validator'
import { UserRole } from '~/constants/enums'
import { USERS_MESSAGES } from '~/constants/messages'
import { ErrorWithStatus } from '~/models/Errors'
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

const validRoles = Object.values(UserRole).filter((value) => typeof value === 'number')

export const registerValidator = validate(
  checkSchema({
    name: {
      notEmpty: {
        errorMessage: USERS_MESSAGES.NAME_IS_REQUIRED
      },
      isString: {
        errorMessage: USERS_MESSAGES.NAME_MUST_BE_A_STRING
      },
      isLength: {
        errorMessage: USERS_MESSAGES.NAME_LENGTH_MUST_BE_FROM_1_TO_100,
        options: { min: 1, max: 100 }
      },
      trim: true
    },
    email: {
      notEmpty: {
        errorMessage: USERS_MESSAGES.EMAIL_IS_REQUIRED
      },
      isEmail: {
        errorMessage: USERS_MESSAGES.EMAIL_IS_INVALID
      },
      custom: {
        options: async (value) => {
          const isExitEmail = await usersService.checkEmailExist(value)
          if (isExitEmail) {
            // throw new Error('Email đã tồn tại')
            throw new ErrorWithStatus({ message: USERS_MESSAGES.EMAIL_ALREADY_EXISTS, status: 401 })
          }
          return true
        }
      }
    },
    password: {
      notEmpty: true,
      isString: true,
      isLength: {
        errorMessage: USERS_MESSAGES.PASSWORD_LENGTH_MUST_BE_FROM_6_TO_50,
        options: { min: 6, max: 50 }
      }
    },
    confirmPassword: {
      custom: {
        options: (value, { req }) => {
          if (value !== req.body.password) {
            throw new Error(USERS_MESSAGES.CONFIRM_PASSWORD_MUST_BE_THE_SAME_AS_PASSWORD)
          }
          return true
        }
      }
    },
    role: {
      isIn: {
        errorMessage: USERS_MESSAGES.ROLE_IS_INVALID,
        options: [validRoles]
      }
    }
  })
)
