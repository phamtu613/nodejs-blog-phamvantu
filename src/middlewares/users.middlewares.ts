import { NextFunction, Request, Response } from 'express'

// Dùng để validate dữ liệu trước khi gọi controller
export const loginValidator = (req: Request, res: Response, next: NextFunction) => {
  const { email, password } = req.body

  if (!email || !password) {
    res.status(400).json({ message: 'Email and password are required' })
    return
  }
  next()
}
