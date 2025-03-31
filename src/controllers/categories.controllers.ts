import { Request, Response } from 'express'
import { ParamsDictionary } from 'express-serve-static-core'
import { CategoryType } from '~/models/schemas/Category.schema'
import categoriesService from '~/services/categories.services'
import postsService from '~/services/posts.services'

export const createCategoryController = async (req: Request<ParamsDictionary, any, CategoryType>, res: Response) => {
  const result = await categoriesService.createCategory(req.body)
  res.json({ message: 'Tạo danh mục thành công', data: result })
  return
}

export const getCategoryListController = async (req: Request<ParamsDictionary, any, any>, res: Response) => {
  const categories = await categoriesService.getCategoryList()
  res.json({ message: 'Lấy danh sách danh mục thành công', data: categories })
  return
}

export const getCategoryDetailController = async (req: Request<ParamsDictionary, any, any>, res: Response) => {
  console.log('>>>', req.params.slug)
  const category = await categoriesService.getCategoryDetail(req.params.slug)
  // get all posts of category

  let posts

  if (category?._id) {
    const posts = await postsService.getPostListByCategory(category?._id as any)
  }
  res.json({
    message: 'Lấy danh mục thành công',
    data: {
      ...category,
      posts: posts ?? []
    }
  })
  return
}

export const updateCategoryController = async (req: Request<ParamsDictionary, any, CategoryType>, res: Response) => {
  const result = await categoriesService.updateCategory(req.params.id, req.body)
  res.json({ message: 'Cập nhật danh mục thành công', data: result })
  return
}

export const deleteCategoryController = async (req: Request<ParamsDictionary, any, any>, res: Response) => {
  const result = await categoriesService.deleteCategory(req.params.id)
  res.json({ message: 'Xóa danh mục thành công', data: result })
  return
}
