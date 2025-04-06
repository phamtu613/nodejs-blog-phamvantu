import { config } from 'dotenv'
import slugify from 'slugify'
import { PostType } from '~/models/schemas/Post.schema'
import databaseService from '~/services/database.services'

config()

class PostsService {
  // PostType
  async createPost(post: any) {
    await databaseService.posts.insertOne({
      title: post.title,
      slug: post.slug || slugify(post.title, { lower: true }),
      thumbnail: post.thumbnail,
      categories: post.categories,
      status: 'Public',
      views: post.views || 0,
      created_at: post.date || new Date(),
      updated_at: new Date(),
      content: post?.content,
      content_html: post?.content_html
    })
  }

  async getPostList() {
    return await databaseService.posts.find().toArray()
  }

  async getPostListByCategory(categoryId: any) {
    console.log('categoryId>>>', categoryId)
    return await databaseService.posts.find({ categories: categoryId.toString() }).toArray()
  }

  async getPostDetail(slug: string) {
    return await databaseService.posts.findOne({ slug })
  }

  async updatePost(slug: string, post: PostType) {
    const updatePostFields = {
      ...post,
      updated_at: new Date()
    }
    if (!post?.thumbnail) {
      delete updatePostFields.thumbnail
    }
    return await databaseService.posts.updateOne(
      {
        slug
      },
      {
        $set: updatePostFields
      }
    )
  }

  async searchPost(query: string) {
    console.log('xxx', query)
    await databaseService.posts.createIndex({ title: 'text', content: 'text' })

    return await databaseService.posts.find({ $text: { $search: query } }).toArray()
  }
}
const postsService = new PostsService()
export default postsService
