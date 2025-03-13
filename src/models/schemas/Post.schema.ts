import { ObjectId } from 'mongodb'
import { PostStatus, PostStatusType } from '~/types/posts.type'

export interface PostType {
  _id?: ObjectId
  title: string
  slug: string
  content: string
  thumbnail?: string
  categories: ObjectId[]
  status: PostStatusType
  views: number
  created_at?: Date
  updated_at?: Date
}

export default class Post {
  // Thuộc tính của class Post
  _id?: ObjectId
  title: string
  slug: string
  content: string
  thumbnail?: string
  categories: ObjectId[]
  status: PostStatusType
  views: number
  created_at: Date
  updated_at: Date

  constructor(post: PostType) {
    const date = new Date()
    this._id = post._id
    this.title = post.title
    this.slug = post.slug
    this.content = post.content
    this.thumbnail = post.thumbnail || ''
    this.categories = post.categories ?? []
    this.status = post.status || PostStatus.Public
    this.views = post.views || 1
    this.created_at = post.created_at || date
    this.updated_at = post.updated_at || date
  }
}
