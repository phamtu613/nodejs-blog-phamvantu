import { Router } from 'express'
import { postController } from '~/controllers/posts.controllers'
import { registerController } from '~/controllers/users.controllers'
import { registerValidator } from '~/middlewares/users.middlewares'
import { wrapRequestHandler } from '~/utils/handlers'

const postRouter = Router()

postRouter.get('/', postController)

export default postRouter
