import { config } from 'dotenv'
import { ObjectId } from 'mongodb'
import { USERS_MESSAGES } from '~/constants/messages'
import { ErrorWithStatus } from '~/models/Errors'
import RefreshToken from '~/models/schemas/RefreshToken.schema'
import { RegisterReqBody } from '~/models/schemas/requests/User.requests'
import User from '~/models/schemas/User.schema'
import databaseService from '~/services/database.services'
import { TokenType } from '~/types/jwt.types'
import { Role, RoleType, UserVerifyStatus, UserVerifyStatusType } from '~/types/users.type'
import { hashPassword } from '~/utils/crypto'
import { signToken } from '~/utils/jwt'

config()

class UsersService {
  private signAccessToken({
    user_id,
    verify,
    role
  }: {
    user_id: string
    verify: UserVerifyStatusType
    role: RoleType
  }) {
    return signToken({
      payload: {
        user_id,
        token_type: TokenType.AccessToken,
        verify,
        role
      },
      privateKey: process.env.JWT_SECRET_ACCESS_TOKEN as string,
      options: {
        expiresIn: process.env.ACCESS_TOKEN_EXPIRES_IN
      }
    })
  }

  private signRefreshToken({
    user_id,
    verify,
    role
  }: {
    user_id: string
    verify: UserVerifyStatusType
    role: RoleType
  }) {
    return signToken({
      payload: {
        user_id,
        token_type: TokenType.RefreshToken,
        verify,
        role
      },
      privateKey: process.env.JWT_SECRET_REFRESH_TOKEN as string,
      options: {
        expiresIn: process.env.REFRESH_TOKEN_EXPIRES_IN
      }
    })
  }

  private signAccessAndRefreshToken({
    user_id,
    verify,
    role
  }: {
    user_id: string
    verify: UserVerifyStatusType
    role: RoleType
  }) {
    return Promise.all([
      this.signAccessToken({ user_id, verify, role }),
      this.signRefreshToken({ user_id, verify, role })
    ])
  }

  private signEmailVerifyToken({ user_id, verify }: { user_id: string; verify: UserVerifyStatusType }) {
    return signToken({
      payload: {
        user_id,
        token_type: TokenType.EmailVerifyToken,
        verify
      },
      privateKey: process.env.JWT_SECRET_EMAIL_VERIFY_TOKEN as string,
      options: {
        expiresIn: process.env.EMAIL_VERIFY_TOKEN_EXPIRES_IN
      }
    })
  }

  private signForgotPasswordToken({ user_id, verify }: { user_id: string; verify: UserVerifyStatusType }) {
    return signToken({
      payload: {
        user_id,
        token_type: TokenType.ForgotPasswordToken,
        verify
      },
      privateKey: process.env.JWT_SECRET_FORGOT_PASSWORD_TOKEN as string,
      options: {
        expiresIn: process.env.FORGOT_PASSWORD_TOKEN_EXPIRES_IN
      }
    })
  }

  async login({ user_id, verify, role }: { user_id: string; verify: UserVerifyStatusType; role: RoleType }) {
    const [access_token, refresh_token] = await this.signAccessAndRefreshToken({
      user_id,
      verify,
      role
    })
    await databaseService.refreshTokens.insertOne(
      new RefreshToken({ user_id: new ObjectId(user_id), token: refresh_token })
    )
    return {
      access_token,
      refresh_token
    }
  }

  async register(payload: RegisterReqBody) {
    const user_id = new ObjectId()
    const emailVerifyToken = await this.signEmailVerifyToken({
      user_id: user_id.toString(),
      verify: UserVerifyStatus.Unverified
    })
    await databaseService.users.insertOne(
      new User({
        ...payload,
        _id: user_id,
        email_verify_token: emailVerifyToken,
        password: hashPassword(payload.password)
      })
    )
    const [access_token, refresh_token] = await this.signAccessAndRefreshToken({
      user_id: user_id.toString(),
      verify: UserVerifyStatus.Unverified,
      role: payload?.role || Role.User
    })

    await databaseService.refreshTokens.insertOne(
      new RefreshToken({ user_id: new ObjectId(user_id), token: refresh_token })
    )
    return {
      access_token,
      refresh_token,
      account: {
        name: payload.name,
        email: payload.email,
        role: payload?.role || Role.User,
        created_at: new Date(),
        updated_at: new Date(),
        verify: UserVerifyStatus.Unverified,
        avatar: '',
        cover_photo: '',
        id: user_id,
        email_verify_token: emailVerifyToken
      }
    }
  }

  async checkEmailExist(email: string) {
    const user = await databaseService.users.findOne({ email })
    return Boolean(user)
  }

  async logout(refresh_token: string) {
    const result = await databaseService.refreshTokens.deleteOne({ token: refresh_token })
    return {
      message: USERS_MESSAGES.LOGOUT_SUCCESS
    }
  }
  async refreshToken({
    user_id,
    verify,
    refresh_token,
    role = Role.User
  }: {
    user_id: string
    verify: UserVerifyStatusType
    refresh_token: string
    role: RoleType
  }) {
    const [new_access_token, new_refresh_token] = await Promise.all([
      this.signAccessToken({ user_id, verify, role }),
      this.signRefreshToken({ user_id, verify, role }),
      databaseService.refreshTokens.deleteOne({ token: refresh_token })
    ])
    return {
      access_token: new_access_token,
      refresh_token: new_refresh_token
    }
  }

  async verifyEmail({ user_id }: { user_id: string }) {
    console.log('user_id>>> eeeee', user_id)
    // Dùng new Date() thì thời gian tạo giá trị
    // $currentDate: { updated_at: true } thì thời gian mà MongoDB cập nhật giá trị, hoặc chuyển thành mảng [{$set: { updated_at: '$$NOW' }}]
    const [token] = await Promise.all([
      this.signAccessAndRefreshToken({ user_id, verify: UserVerifyStatus.Verified, role: Role.User }),
      databaseService.users.updateOne(
        { _id: new ObjectId(user_id) },
        {
          $set: { verify: UserVerifyStatus.Verified, email_verify_token: '' },
          $currentDate: { updated_at: true }
        }
      )
    ])

    const [access_token, refresh_token] = token

    return {
      access_token,
      refresh_token
    }
  }

  async resendEmailVerify({ user_id }: { user_id: string }) {
    // Gui email lai cho user
    const emailVerifyToken = await this.signEmailVerifyToken({
      user_id,
      verify: UserVerifyStatus.Unverified
    })
    console.log('emailVerifyToken>>>', emailVerifyToken)
    await databaseService.users.updateOne(
      { _id: new ObjectId(user_id) },
      {
        $set: { email_verify_token: emailVerifyToken },
        $currentDate: { updated_at: true }
      }
    )
    const account = await databaseService.users.findOne({ _id: new ObjectId(user_id) })
    const message = USERS_MESSAGES.RESEND_EMAIL_VERIFY_SUCCESS
    return {
      message,
      account
    }
  }

  async forgotPassword(user_id: string, verify: UserVerifyStatusType) {
    const forgot_password_token = await this.signForgotPasswordToken({ user_id, verify })
    await databaseService.users.updateOne(
      { _id: new ObjectId(user_id) },
      {
        $set: { forgot_password_token },
        $currentDate: { updated_at: true }
      }
    )
    const account = await databaseService.users.findOne({ _id: new ObjectId(user_id) })
    // Gui email cho user kèm link reset password: http://localhost:3000/forgot-password?token=forgot_password_token

    return {
      message: USERS_MESSAGES.CHECK_EMAIL_TO_RESET_PASSWORD,
      account
    }
  }

  async resetPassword(user_id: string, password: string) {
    await databaseService.users.updateOne(
      { _id: new ObjectId(user_id) },
      {
        $set: { password: hashPassword(password), forgot_password_token: '' },
        $currentDate: { updated_at: true }
      }
    )
    return {
      message: USERS_MESSAGES.RESET_PASSWORD_SUCCESS
    }
  }

  async getUser(user_id: string) {
    const user = await databaseService.users.findOne(
      { _id: new ObjectId(user_id) },
      {
        projection: {
          password: 0,
          email_verify_token: 0,
          forgot_password_token: 0
        }
      }
    )
    return {
      ...user
    }
  }

  async updateUser(user_id: string, name: string, cover_photo: string) {
    // if has name update name and no update name
    const updateFields: Record<string, any> = {}
    if (name) {
      updateFields.name = name
    }
    if (cover_photo) {
      updateFields.cover_photo = cover_photo
    }
    await databaseService.users.updateOne(
      { _id: new ObjectId(user_id) },
      {
        $set: updateFields,
        $currentDate: { updated_at: true }
      }
    )
    return {
      message: 'Cập nhật tài khoản thành công'
    }
  }

  async changePassword(user_id: string, current_password: string, new_password: string) {
    const user = await databaseService.users.findOne({ _id: new ObjectId(user_id) })
    if (!user) {
      return {
        message: USERS_MESSAGES.USER_NOT_FOUND
      }
    }
    if (!user.password) {
      return {
        message: USERS_MESSAGES.USER_NOT_FOUND
      }
    }
    if (user.password !== hashPassword(current_password)) {
      throw new ErrorWithStatus({
        message: 'Mật khẩu hiện tại không chính xác',
        status: 400
      })
    }
    await databaseService.users.updateOne(
      { _id: new ObjectId(user_id) },
      {
        $set: { password: hashPassword(new_password) },
        $currentDate: { updated_at: true }
      }
    )
    return {
      message: 'Đổi mật khẩu thành công'
    }
  }

  // Admin
  async getAccountList() {
    const users = await databaseService.users
      .find({}, { projection: { password: 0, email_verify_token: 0, forgot_password_token: 0 } })
      .toArray()
    return users
  }
}

const usersService = new UsersService()
export default usersService
