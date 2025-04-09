import { Request, Response } from 'express'
import { ParamsDictionary } from 'express-serve-static-core'
import contactsService from '~/services/contacts.services'

export const createContactController = async (req: Request<ParamsDictionary, any>, res: Response) => {
  const result = await contactsService.createContact(req.body)
  res.json({ message: 'Tạo liên hệ thành công', data: result })
  return
}
