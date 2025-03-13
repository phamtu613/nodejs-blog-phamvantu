import { Router } from 'express'
import { getAccountListController } from '~/controllers/accounts.controllers'
import { wrapRequestHandler } from '~/utils/handlers'

const accountsRouter = Router()

/**
 * Description: Get list accounts
 * Path: /accounts
 * Method: GET
 */
accountsRouter.get('/', wrapRequestHandler(getAccountListController))

export default accountsRouter
