import { Request, Response } from 'express'
import { USERS_MESSAGES } from '~/constants/messages'
import mediaService from '~/services/medias.services'

export const uploadSingleImageController = async (req: Request, res: Response) => {
  const url = await mediaService.handleUploadSingleImage(req)
  res.json({
    message: USERS_MESSAGES.UPLOAD_SUCCESS,
    result: url
  })
  return
}
