import { Request } from 'express'
import path from 'path'
import sharp from 'sharp'
import { UPLOAD_DIR } from '~/constants/dir'
import { getNameFromFullname, handleUploadSingleImage } from '~/utils/file'
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
      ? `${process.env.HOST}/medias/${newName}.webp`
      : `http://localhost:${process.env.PORT}/medias/${newName}.webp`
  }
}

const mediaService = new MediaService()
export default mediaService
