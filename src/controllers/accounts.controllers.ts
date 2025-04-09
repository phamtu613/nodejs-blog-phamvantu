import { Request, Response } from 'express'
import { ParamsDictionary } from 'express-serve-static-core'
import { LoginReqBody } from '~/models/schemas/requests/User.requests'
import usersService from '~/services/users.services'

export const getAccountListController = async (req: Request<ParamsDictionary, any, LoginReqBody>, res: Response) => {
  try {
    const accounts = await usersService.getAccountList()
    res.json({
      message: 'Get list account successfully',
      data: accounts
    })
    return
  } catch (error) {
    console.error('Error while fetching account list:', error)
    res.json({
      message: 'Get account list fail'
    })
    return
  }
}
