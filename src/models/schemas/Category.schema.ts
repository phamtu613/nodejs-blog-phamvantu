import { ObjectId } from 'mongodb'

export interface CategoryType {
  _id?: ObjectId
  name: string
  slug: string
  thumbnail?: string
  created_at?: Date
  updated_at?: Date
}

export default class Category {
  _id?: ObjectId
  name: string
  slug: string
  created_at: Date
  updated_at: Date

  constructor(category: CategoryType) {
    const date = new Date()
    this._id = category._id
    this.name = category.name
    this.slug = category.slug
    this.created_at = category.created_at || date
    this.updated_at = category.updated_at || date
  }
}
