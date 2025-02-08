import { Request, Response } from 'express'
import mediaService from '~/services/medias.services'
import { handleUploadSingleImage } from '~/utils/file'

export const uploadSingleImageController = async (req: Request, res: Response) => {
  const result = await mediaService.handleUploadSingleImage(req)
  res.json({
    result: result
  })
  return
}
