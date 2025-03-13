import { Request, Response } from 'express'
import { ParamsDictionary } from 'express-serve-static-core'
import { random } from 'lodash'
import { PostType } from '~/models/schemas/Post.schema'
import { LoginReqBody } from '~/models/schemas/requests/User.requests'
import mediaService from '~/services/medias.services'
import postsService from '~/services/posts.services'
import { convertToMarkdown } from '~/utils/crypto'
import { extractImageFromYoast } from '~/utils/handlers'

export const crawPostController = async (req: Request<ParamsDictionary, any, LoginReqBody>, res: Response) => {
  try {
    const url = 'https://phamvantu.com/wp-json/wp/v2/posts?per_page=100&_fields=id,date,slug,title,content, yoast_head'
    const response = await fetch(url)
    if (!response.ok) {
      res.status(response.status).json({
        message: 'Failed to fetch posts',
        error: `HTTP error! status: ${response.status}`
      })
      return
    }
    // Parse dữ liệu JSON trả về
    const posts: any = await response.json()

    // Check for images and upload to server
    for (const post of posts) {
      // Tìm tất cả thẻ <img> trong nội dung bài viết
      const imageTags = post.content.rendered.match(/<img[^>]+>/g)
      if (imageTags) {
        for (const imgTag of imageTags) {
          // Tìm URL ảnh trong `src`
          const srcMatch = imgTag.match(/src="([^">]+)"/)
          if (srcMatch) {
            const originalImageUrl = srcMatch[1] // Lấy URL gốc

            // Upload ảnh chỉ một lần
            const uploadedImageUrl = await mediaService.uploadImageFromUrl(originalImageUrl)

            // Lấy tiêu đề bài viết để làm alt và title
            const postTitle = post.title.rendered || 'Ảnh bài viết'

            // Tạo thẻ <img> mới với src đã thay đổi, alt và title lấy từ tiêu đề bài viết
            const newImgTag = `<img src="${uploadedImageUrl}" alt="${postTitle}" title="${postTitle}" />`

            // Thay thế thẻ cũ bằng thẻ mới
            post.content.rendered = post.content.rendered.replace(imgTag, newImgTag)
          }
        }
      }

      const thumbnail = extractImageFromYoast(post.yoast_head) as string
      const uploadedImageUrl = await mediaService.uploadImageFromUrl(thumbnail)

      const newTitle = post.title.rendered
      const newContent = post.content.rendered

      let markdownContent = convertToMarkdown(newContent)

      markdownContent = markdownContent
        .replace(/\*\*(\s*)(.+?)(\s*)\*\*/g, '**$2**') // Xóa khoảng trắng thừa trong **bold**
        .replace(/\[ \*\*(.+?)\*\* \]/g, '[**$1**]') // Fix lỗi **bold** trong []
        .replace(/(\S)\*\*(.+?)\*\*/g, '$1 **$2**') // Fix lỗi dính chữ trước
        .replace(/\*\*(.+?)\*\*(\S)/g, '**$1** $2') // Fix lỗi dính chữ sau
        .replace(/\*\*\s+([^\s]+)\s+\*\*/g, '**$1**') // Loại bỏ khoảng trắng thừa bên trong
        .replace(/\*\*(\S)/g, '** $1') // Thêm khoảng trắng sau dấu `**` nếu bị dính chữ
        .replace(/(\S)\*\*/g, '$1 **') // Thêm khoảng trắng trước dấu `**` nếu bị dính chữ
        .replace(/\*\*\s+(.+?)\s+\*\*/g, '**$1**')
        .replace(/<h[1-6][^>]*>(.*?)<\/h[1-6]>/gi, (match, content) => {
          const cleanContent = content.replace(/<\/?span[^>]*>/g, '')
          return `\n\n### ${cleanContent}\n\n`
        })

      await postsService.createPost({
        ...post,
        title: newTitle,
        content: markdownContent,
        views: random(0, 100),
        thumbnail: uploadedImageUrl.replace('http://localhost:4000/', '')
      })

      // console.log('Post>>>', post)
    }

    // Trả kết quả về client
    res.json({
      message: 'Crawl ok',
      data: posts
    })
    return
  } catch (error) {
    console.error('Error while fetching posts:', error)
    res.json({
      message: 'Crawl fail'
    })
    return
  }
}

export const createPostController = async (req: Request<ParamsDictionary, any, PostType>, res: Response) => {
  const result = await postsService.createPost(req.body)
  res.json({ message: 'Tạo bài viết thành công', data: result })
  return
}

export const getPostListController = async (req: Request<ParamsDictionary, any, any>, res: Response) => {
  const posts = await postsService.getPostList()
  res.json({ message: 'Lấy danh sách bài viết thành công', data: posts })
  return
}

export const getDetailPostController = async (req: Request<ParamsDictionary, any, any>, res: Response) => {
  const post = await postsService.getPostDetail(req.params.slug)
  if (!post) {
    res.status(400).json({ message: 'Bài viết không tồn tại' })
    return
  }
  res.json({ message: 'Lấy bài viết thành công', data: post })
  return
}

export const updatePostController = async (req: Request<ParamsDictionary, any, PostType>, res: Response) => {
  const result = await postsService.updatePost(req.params.slug, req.body)
  res.json({ message: 'Cập nhật bài viết thành công', data: result })
  return
}

export const searchPostController = async (req: Request<ParamsDictionary, any, any>, res: Response) => {
  const posts = await postsService.searchPost(req.query.q as string)
  res.json({ message: 'Tìm kiếm bài viết thành công', data: posts })
  return
}
