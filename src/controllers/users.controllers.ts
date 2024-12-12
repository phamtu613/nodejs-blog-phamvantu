import { Request, Response } from 'express'
import usersService from '~/services/users.services'

// Xử lý logic ở đây sau khi dữ liệu đã được validate ở middleware
export const loginController = (req: Request, res: Response) => {
  const { email, password } = req.body

  if (email === 'admin@gmail.com' && password === '123456') {
    res.json({ message: 'Login successfully' })
  } else {
    res.status(401).json({ message: 'Email or password is incorrect' })
  }
}

export const registerController = async (req: Request, res: Response) => {
  const { email, password } = req.body
  try {
    const result = await usersService.register({ email, password })
    res.json({ message: 'Register successfully', data: result })
    return
  } catch (error) {
    console.log(error)
    res.status(400).json({ message: 'Register fail', error })
    return
  }
}
