import { ObjectId } from 'mongodb'
import { PostStatus, PostStatusType } from '~/types/posts.type'

interface PostType {
  _id?: ObjectId
  title: string
  slug: string
  thumbnail?: string
  category: string
  status?: PostStatusType
  created_at?: Date
  updated_at?: Date
}

export default class Post {
  // Thuộc tính của class Post
  _id?: ObjectId
  title: string
  slug: string
  thumbnail: string
  category: string
  status: PostStatusType
  created_at: Date
  updated_at: Date

  constructor(post: PostType) {
    const date = new Date()
    this._id = post._id
    this.title = post.title
    this.slug = post.slug
    this.thumbnail = post.thumbnail || ''
    this.category = post.category
    this.status = post.status || PostStatus.Public
    this.created_at = post.created_at || date
    this.updated_at = post.updated_at || date
  }
}
