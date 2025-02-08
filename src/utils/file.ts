import fs from 'fs'
import path from 'path'
import formidable from 'formidable'
import { Request, Response } from 'express'

export const initFolder = () => {
  const uploadFolderPath = path.resolve('uploads')
  if (!fs.existsSync(uploadFolderPath)) {
    fs.mkdirSync(uploadFolderPath, {
      recursive: true // mục đích là để tạo folder nested, ví dụ uploads/2021/09/01
    })
  }
}

export const handleUploadSingleImage = (req: Request) => {
  const form = formidable({
    uploadDir: path.resolve('uploads'),
    maxFiles: 1,
    keepExtensions: true, // lấy luôn cái đuôi file
    maxFileSize: 5 * 1024 * 1024, // 5MB
    filter: function ({ name, originalFilename, mimetype }) {
      console.log('xxx', { name, originalFilename, mimetype })
      const valid = name == 'image' && Boolean(mimetype?.includes('image/'))
      if (!valid) {
        form.emit('error' as any, new Error('Invalid file type') as any)
      }
      return valid
    }
  })

  return new Promise((resolve, reject) => {
    form.parse(req, (err, fields, files) => {
      if (err) {
        reject(err)
      }
      if (!files.image) {
        return reject(new Error('No file uploaded'))
      }
      resolve(files)
    })
  })
}
