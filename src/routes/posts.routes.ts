import { Router } from 'express'
import {
  crawPostController,
  createPostController,
  getDetailPostController,
  getPostListController,
  getRandomPostController,
  searchPostController,
  updatePostController
} from '~/controllers/posts.controllers'
import { createValidator } from '~/middlewares/posts.middlewares'
import { wrapRequestHandler } from '~/utils/handlers'

const postRouter = Router()

postRouter.get('/craw', crawPostController)

postRouter.post('/', createValidator, wrapRequestHandler(createPostController))

postRouter.get('/', wrapRequestHandler(getPostListController))

// search post
postRouter.get('/search', wrapRequestHandler(searchPostController))

// get random post
postRouter.get('/random', wrapRequestHandler(getRandomPostController))

// get detail post
postRouter.get('/:slug', wrapRequestHandler(getDetailPostController))

// update post
postRouter.put('/:slug', wrapRequestHandler(updatePostController))

export default postRouter
