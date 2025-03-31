import { Request } from 'express'
import formidable, { File } from 'formidable'
import fs from 'fs'
import { UPLOAD_TEMP_DIR } from '~/constants/dir'

export const initFolder = () => {
  if (!fs.existsSync(UPLOAD_TEMP_DIR)) {
    fs.mkdirSync(UPLOAD_TEMP_DIR, {
      recursive: true // mục đích là để tạo folder nested, ví dụ uploads/2021/09/01
    })
  }
}

export const handleUploadSingleImage = (req: Request) => {
  const form = formidable({
    uploadDir: UPLOAD_TEMP_DIR,
    maxFiles: 1,
    keepExtensions: true, // lấy luôn cái đuôi file
    maxFileSize: 5 * 1024 * 1024, // 5MB
    filter: function ({ name, originalFilename, mimetype }) {
      const valid = name == 'image' && Boolean(mimetype?.includes('image/'))
      if (!valid) {
        form.emit('error' as any, new Error('Invalid file type') as any)
      }
      return valid
    }
  })

  return new Promise<File>((resolve, reject) => {
    form.parse(req, (err, fields, files) => {
      if (err) {
        reject(err)
      }
      if (!files.image) {
        return reject(new Error('No file uploaded'))
      }
      resolve(files.image[0])
    })
  })
}

export const getNameFromFullname = (fullname: string) => {
  const nameArr = fullname.split('.')
  nameArr.pop()
  return nameArr.join('')
}

export const downloadImage = async (imageUrl: string, outputPath: string) => {
  try {
    console.log('Bắt đầu tải ảnh từ URL:', imageUrl)

    // Xử lý URL WordPress
    const cleanUrl = imageUrl.replace(/-\d+x\d+\./g, '.') // Loại bỏ kích thước trong URL WordPress

    const response = await fetch(cleanUrl, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
        'Accept': 'image/webp,image/apng,image/*,*/*;q=0.8',
        'Accept-Language': 'en-US,en;q=0.9',
        'Referer': 'https://v0.phamvantu.com/'
      }
    })

    if (!response.ok) {
      throw new Error(`Không thể tải ảnh từ URL: ${cleanUrl}, Status: ${response.status}`)
    }

    const buffer = Buffer.from(await response.arrayBuffer())
    fs.writeFileSync(outputPath, buffer)
    console.log('Đã tải ảnh thành công vào:', outputPath)
  } catch (error) {
    console.error('Lỗi khi tải ảnh:', error)
    throw error
  }
}
