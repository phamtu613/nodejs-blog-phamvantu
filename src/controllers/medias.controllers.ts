import { Request, Response } from 'express'
import formidable from 'formidable'
import path from 'path'

export const uploadSingleImageController = async (req: Request, res: Response) => {
  const form = formidable({
    uploadDir: path.resolve('uploads'),
    maxFiles: 1,
    keepExtensions: true,
    maxFileSize: 5 * 1024 * 1024 // 5MB
  })
  form.parse(req, (err, fields, files) => {
    if (err) {
      throw err
    }
    console.log('fields>>>', fields)
    console.log('files>>>', files)
    res.json({
      message: 'Upload image success'
    })
  })
  return
}
