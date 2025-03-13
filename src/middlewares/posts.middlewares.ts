import { checkSchema } from 'express-validator'
import { validate } from '~/utils/validation'

export const createValidator = validate(checkSchema({}, ['body']))
