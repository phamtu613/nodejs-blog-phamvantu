import { Router } from 'express'
import { getAccountListController } from '~/controllers/accounts.controllers'
import {
  createCategoryController,
  getCategoryDetailController,
  getCategoryListController,
  updateCategoryController
} from '~/controllers/categories.controllers'
import { wrapRequestHandler } from '~/utils/handlers'

const categoriesRouter = Router()

/**
 * Description: Get list categories
 * Path: /categories
 * Method: GET
 */
categoriesRouter.get('/', wrapRequestHandler(getCategoryListController))

/**
 * Description: Create a new category
 * Path: /categories
 * Method: POST
 * Request body: {
 *   name: string
 * }
 */
categoriesRouter.post('/', wrapRequestHandler(createCategoryController))

/**
 * Description: Get detail of a category
 * Path: /categories/:slug
 * Method: GET
 * Request params: {
 *  slug: string
 * }
 */
categoriesRouter.get('/:slug', wrapRequestHandler(getCategoryDetailController))

/**
 * Description: Update a category
 * Path: /categories/:slug
 * Method: PUT
 * Request params: {
 *  slug: string
 * }
 */
categoriesRouter.put('/:id', wrapRequestHandler(updateCategoryController))

export default categoriesRouter
