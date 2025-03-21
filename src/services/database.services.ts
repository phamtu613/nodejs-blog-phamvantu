import { config } from 'dotenv'
import { Collection, Db, MongoClient } from 'mongodb'
import Category from '~/models/schemas/Category.schema'
import Contact from '~/models/schemas/Contact.schema'
import Post from '~/models/schemas/Post.schema'
import RefreshToken from '~/models/schemas/RefreshToken.schema'
import User from '~/models/schemas/User.schema'

config()

const uri = `mongodb+srv://${process.env.DB_USERNAME}:${process.env.DB_PASSWORD}@blog-pvt-cluster.r7804.mongodb.net/?retryWrites=true&w=majority&appName=blog-pvt-cluster`

class DatabaseService {
  private client: MongoClient
  private db: Db

  constructor() {
    this.client = new MongoClient(uri)
    this.db = this.client.db(process.env.DB_NAME)
  }

  async connect() {
    try {
      // Send a ping to confirm a successful connection
      await this.db.command({ ping: 1 })
      console.log('Pinged your deployment. You successfully connected to MongoDB!')
    } catch (error) {
      console.log('Error trying to ping your deployment:', error)
      throw error
    }
  }

  get users(): Collection<User> {
    return this.db.collection(process.env.USERS_COLLECTION as string)
  }

  get refreshTokens(): Collection<RefreshToken> {
    return this.db.collection(process.env.DB_REFRESH_TOKENS_COLLECTION as string)
  }

  get posts(): Collection<Post> {
    return this.db.collection(process.env.DB_POST_COLLECTION as string)
  }

  get categories(): Collection<Category> {
    return this.db.collection(process.env.DB_CATEGORY_COLLECTION as string)
  }

  get contacts(): Collection<Contact> {
    return this.db.collection(process.env.DB_CONTACT_COLLECTION as string)
  }
}

// Tạo 1 instance object của DatabaseService
const databaseService = new DatabaseService()
export default databaseService
