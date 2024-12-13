import express from 'express'
import { ValidationChain, validationResult } from 'express-validator'
import { RunnableValidationChains } from 'express-validator/lib/middlewares/schema'

// can be reused by many routes
export const validate = (validation: RunnableValidationChains<ValidationChain>) => {
  return async (req: express.Request, res: express.Response, next: express.NextFunction) => {
    // Hàm nãy sẽ check lỗi và đưa vào mảng errors
    await validation.run(req)
    const errors = validationResult(req)
    if (errors.isEmpty()) {
      return next()
    }
    // .mappped() sẽ gộp các lỗi 1 field lại thành 1 object. Còn .array() sẽ gộp các lỗi 1 field lại thành 1 array
    res.status(400).json({ errors: errors.mapped() })
  }
}
