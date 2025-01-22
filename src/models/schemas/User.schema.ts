// Dung interface thì nó chỉ kieu dữ liệu
// Dùng class thì vừa đại diện cho kiểu dữ liệu vừa đại diện cho 1 object, vì mình có thể lấy class đó để tạo ra 1 object mới
import { ObjectId } from 'mongodb'
import { Role, RoleType, UserVerifyStatus, UserVerifyStatusType } from '~/types/users.type'

interface UserType {
  _id?: ObjectId
  name?: string
  email: string
  password: string
  avatar?: string
  cover_photo?: string
  role?: RoleType
  created_at?: Date
  updated_at?: Date
  verify?: UserVerifyStatusType
  email_verify_token?: string
  forgot_password_token?: string
}

export default class User {
  // Thuộc tính của class User
  _id?: ObjectId
  name: string
  email: string
  password: string
  avatar: string
  cover_photo: string
  role: RoleType
  created_at: Date
  updated_at: Date
  verify: UserVerifyStatusType
  email_verify_token: string
  forgot_password_token: string

  constructor(user: UserType) {
    const date = new Date()
    this._id = user._id
    this.name = user.name || ''
    this.email = user.email
    this.password = user.password
    this.avatar = user.avatar || ''
    this.cover_photo = user.cover_photo || ''
    this.role = user.role || Role.User
    this.created_at = user.created_at || date
    this.updated_at = user.updated_at || date
    this.verify = user.verify || UserVerifyStatus.Unverified
    this.email_verify_token = user.email_verify_token || ''
    this.forgot_password_token = user.forgot_password_token || ''
  }
}
