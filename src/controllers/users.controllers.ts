import { Request, Response } from 'express'

// Xử lý logic ở đây sau khi dữ liệu đã được validate ở middleware
export const loginController = (req: Request, res: Response) => {
  const { email, password } = req.body

  if (email === 'admin@gmail.com' && password === '123456') {
    res.json({ message: 'Login successfully' })
  } else {
    res.status(401).json({ message: 'Email or password is incorrect' })
  }
}
