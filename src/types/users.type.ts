export const Role = {
  User: 'User',
  Admin: 'Admin'
} as const
export const RoleValues = [Role.User, Role.Admin] as const
export type RoleType = keyof typeof Role

export const UserVerifyStatus = {
  Verified: 'Verified',
  Unverified: 'Unverified',
  Banned: 'Banned'
} as const
export const UserStatusValues = [UserVerifyStatus.Verified, UserVerifyStatus.Unverified] as const
export type UserVerifyStatusType = keyof typeof UserVerifyStatus
