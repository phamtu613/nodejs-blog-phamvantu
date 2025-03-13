import { ObjectId } from 'mongodb'

export interface ContactType {
  _id?: ObjectId
  name: string
  phone?: string
  email?: string
  content: string
  created_at?: Date
  updated_at?: Date
}

export default class Contact {
  _id?: ObjectId
  name: string
  phone?: string
  email?: string
  content: string
  created_at: Date
  updated_at: Date

  constructor(contact: ContactType) {
    const date = new Date()
    this._id = contact._id
    this.name = contact.name
    this.phone = contact.phone
    this.email = contact.email
    this.content = contact.content
    this.created_at = contact.created_at || date
    this.updated_at = contact.updated_at || date
  }
}
