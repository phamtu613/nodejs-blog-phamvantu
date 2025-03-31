import { Request } from 'express'
import path from 'path'
import sharp from 'sharp'
import { UPLOAD_DIR } from '~/constants/dir'
import { getNameFromFullname, handleUploadSingleImage, downloadImage } from '~/utils/file'
import fs from 'fs'
import { isProduction } from '~/constants/config'
import { config } from 'dotenv'
config()

class MediaService {
  async handleUploadSingleImage(req: Request) {
    const file = await handleUploadSingleImage(req)
    const newName = getNameFromFullname(file.newFilename)
    const newPath = path.resolve(UPLOAD_DIR, `${newName}.webp`)
    await sharp(file.filepath).webp().toFile(newPath)
    fs.unlinkSync(file.filepath)
    return isProduction
      ? `${process.env.HOST}/static/${newName}.webp`
      : `http://localhost:${process.env.PORT}/static/${newName}.webp`
  }

  async uploadImageFromUrl(imageUrl: string) {
    try {
      console.log('Starting image upload from URL:', imageUrl)
      const newName = getNameFromFullname(path.basename(imageUrl))
      const tempPath = path.resolve(UPLOAD_DIR, `${newName}-temp`)
      const finalPath = path.resolve(UPLOAD_DIR, `${newName}.webp`)

      await downloadImage(imageUrl, tempPath)
      console.log('Image downloaded successfully')

      const tempWebpPath = path.resolve(UPLOAD_DIR, `${newName}-temp.webp`)
      await sharp(tempPath).webp().toFile(tempWebpPath)
      console.log('Image converted to WebP')

      fs.renameSync(tempWebpPath, finalPath)
      fs.unlinkSync(tempPath)

      const finalUrl = isProduction
        ? `${process.env.HOST}/static/${newName}.webp`
        : `http://localhost:${process.env.PORT}/static/${newName}.webp`

      console.log('Final image URL:', finalUrl)
      return finalUrl
    } catch (error) {
      console.error('Error uploading image from URL:', error)
      throw error
    }
  }
}

const mediaService = new MediaService()
export default mediaService
