export const USERS_MESSAGES = {
  VALIDATION_ERROR: 'Lỗi dữ liệu',
  NAME_IS_REQUIRED: 'Tên không được để trống',
  NAME_MUST_BE_A_STRING: 'Tên phải là chuỗi',
  NAME_LENGTH_MUST_BE_FROM_1_TO_100: 'Tên phải từ 1 đến 100 ký tự',
  EMAIL_ALREADY_EXISTS: 'Email đã tồn tại',
  EMAIL_IS_REQUIRED: 'Email không được để trống',
  EMAIL_IS_INVALID: 'Email không hợp lệ',
  PASSWORD_IS_REQUIRED: 'Mật khẩu không được để trống',
  PASSWORD_MUST_BE_A_STRING: 'Mật khẩu phải là chuỗi',
  PASSWORD_LENGTH_MUST_BE_FROM_6_TO_50: 'Mật khẩu phải có ít nhất 6 ký tự',
  CONFIRM_PASSWORD_IS_REQUIRED: 'Xác nhận mật khẩu không được để trống',
  CONFIRM_PASSWORD_MUST_BE_A_STRING: 'Xác nhận mật khẩu phải là chuỗi',
  CONFIRM_PASSWORD_LENGTH_MUST_BE_FROM_6_TO_50: 'Xác nhận mật khẩu phải có ít nhất 6 ký tự',
  CONFIRM_PASSWORD_MUST_BE_THE_SAME_AS_PASSWORD: 'Xác nhận mật khẩu phải giống mật khẩu',
  ROLE_IS_INVALID: 'Vai trò không hợp lệ',
  USER_NOT_FOUND: 'Người dùng không tồn tại',
  LOGIN_SUCCESS: 'Đăng nhập thành công',
  EMAIL_OR_PASSWORD_IS_INCORRECT: 'Email hoặc mật khẩu không chính xác',
  ACCESS_TOKEN_IS_REQUIRED: 'Accesstoken không được để trống',
  LOGOUT_SUCCESS: 'Đăng xuất thành công',
  REFRESH_TOKEN_IS_REQUIRED: 'Refreshtoken không được để trống',
  USED_REFRESH_TOKEN_OR_NOT_EXIST: 'Refreshtoken đã được sử dụng hoặc không tồn tại',
  REFRESH_TOKEN_SUCCESS: 'Làm mới accesstoken thành công'
} as const
