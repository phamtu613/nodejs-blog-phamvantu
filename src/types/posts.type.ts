export const PostStatus = {
  Public: 'Public',
  Destroy: 'Destroy'
} as const
export const UserStatusValues = [PostStatus.Public, PostStatus.Destroy] as const
export type PostStatusType = keyof typeof PostStatus
