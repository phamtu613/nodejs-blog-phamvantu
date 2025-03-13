import { config } from 'dotenv'
import slugify from 'slugify'
import { CategoryType } from '~/models/schemas/Category.schema'
import databaseService from '~/services/database.services'

config()

class CategoriesService {
  async createCategory(category: any) {
    console.log(category)
    await databaseService.categories.insertOne({
      name: category.name,
      slug: slugify(category.name, { lower: true }),
      created_at: new Date(),
      updated_at: new Date()
    })
  }

  async getCategoryList() {
    return await databaseService.categories.find().toArray()
  }

  async getCategoryDetail(slug: string) {
    return await databaseService.categories.findOne({ slug })
  }

  async updateCategory(id: string, category: CategoryType) {
    // Logic to update a category
  }

  async deleteCategory(id: string) {
    // Logic to delete a category
  }
}

const categoriesService = new CategoriesService()
export default categoriesService
