import { Router } from 'express'
import { getAccountListController } from '~/controllers/accounts.controllers'
import {
  createCategoryController,
  getCategoryDetailController,
  getCategoryListController
} from '~/controllers/categories.controllers'
import { createContactController } from '~/controllers/contacts.controllers'
import { wrapRequestHandler } from '~/utils/handlers'

const contactsRouter = Router()

/**
 * Description: Add a new contact
 * Path: /contacts
 * Method: POST
 */
contactsRouter.post('/', wrapRequestHandler(createContactController))
export default contactsRouter
