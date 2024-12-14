import express from 'express'
import { ValidationChain, validationResult } from 'express-validator'
import { RunnableValidationChains } from 'express-validator/lib/middlewares/schema'
import HTTP_STATUS from '~/constants/httpStatus'
import { EntityError, ErrorWithStatus } from '~/models/Errors'

// can be reused by many routes
export const validate = (validation: RunnableValidationChains<ValidationChain>) => {
  return async (req: express.Request, res: express.Response, next: express.NextFunction) => {
    // Hàm nãy sẽ check lỗi và đưa vào mảng errors
    await validation.run(req)
    const errors = validationResult(req)
    // Không có lỗi thì next tiếp tục request
    if (errors.isEmpty()) {
      return next()
    }

    // .mappped() sẽ gộp các lỗi 1 field lại thành 1 object. Còn .array() sẽ gộp các lỗi 1 field lại thành 1 array
    const errorsObject = errors.mapped()

    const entityError = new EntityError({ errors: {} })

    for (const key in errorsObject) {
      // Trả về lỗi không phải là lỗi do validate (422)
      const { msg } = errorsObject[key]
      if (msg instanceof ErrorWithStatus && msg.status !== HTTP_STATUS.UNPROCESSABLE_ENTITY) {
        return next(msg)
      }

      // Nếu chạy tới chỗ này thì lỗi là lỗi validate (422) rồi
      entityError.errors[key] = errorsObject[key]
    }

    next(entityError)
  }
}
