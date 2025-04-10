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
    const url =
      'https://v0.phamvantu.com/wp-json/wp/v2/posts?per_page=100&_fields=id,date,slug,title,content, yoast_head'
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
      console.log('=== Xử lý bài viết:', post.title.rendered)
      console.log('Nội dung gốc:', post.content.rendered.substring(0, 5000) + '...')

      const thumbnail = extractImageFromYoast(post.yoast_head) as string
      const uploadedImageUrl = await mediaService.uploadImageFromUrl(thumbnail)

      const newTitle = post.title.rendered
      const newContent = post.content.rendered

      // 1. Chuyển sang markdown trước
      let markdownContent = convertToMarkdown(newContent)
      console.log('Content sau khi chuyển markdown:', markdownContent)

      // 2. Xử lý các thẻ img
      const markdownImageTags = markdownContent.match(/<img[^>]+>/g)
      if (markdownImageTags) {
        console.log('Số lượng ảnh tìm thấy trong markdown:', markdownImageTags.length)
        for (const imgTag of markdownImageTags) {
          console.log('Xử lý thẻ img trong markdown:', imgTag)
          const srcMatch = imgTag.match(/src="([^">]+)"/) || imgTag.match(/src='([^'>]+)'/)
          if (srcMatch) {
            const originalImageUrl = srcMatch[1]
            console.log('URL ảnh gốc:', originalImageUrl)

            try {
              const uploadedImageUrl = await mediaService.uploadImageFromUrl(originalImageUrl)
              console.log('URL ảnh sau khi upload:', uploadedImageUrl)

              const postTitle = post.title.rendered || 'Ảnh bài viết'
              const newImgTag = `<img src="${uploadedImageUrl}" alt="${postTitle}" title="${postTitle}" class="img-fluid" />`

              markdownContent = markdownContent.replace(imgTag, newImgTag)
              console.log('Đã thay thế thẻ img thành công')
            } catch (error) {
              console.error('Lỗi khi xử lý ảnh:', error)
            }
          }
        }
      }

      // 3. Xử lý các định dạng markdown khác
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

      console.log('Content cuối cùng:', markdownContent)

      // Build HTML từ markdown
      const content_html = markdownContent
        .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>') // Bold
        .replace(/\*(.*?)\*/g, '<em>$1</em>') // Italic
        .replace(/`(.*?)`/g, '<code>$1</code>') // Inline code
        .replace(/```(\w+)?\n([\s\S]*?)```/g, (_, lang, code) => {
          return `<pre><code class="language-${lang || ''}">${code.trim()}</code></pre>`
        }) // Code block
        .replace(/\[(.*?)\]\((.*?)\)/g, '<a href="$2">$1</a>') // Links
        .replace(/\n\n/g, '</p><p>') // Paragraphs
        .replace(/\n/g, '<br>') // Line breaks
        .replace(/### (.*?)(\n|$)/g, '<h3>$1</h3>') // Headings
        .replace(/## (.*?)(\n|$)/g, '<h2>$1</h2>')
        .replace(/# (.*?)(\n|$)/g, '<h1>$1</h1>')

      // Wrap content in paragraphs
      const finalHtml = `<div class="post-content">${content_html}</div>`

      await postsService.createPost({
        ...post,
        title: newTitle,
        content: markdownContent,
        content_html: finalHtml, // Lưu HTML đã build
        views: random(0, 100),
        thumbnail: uploadedImageUrl.replace(`${process.env.HOST}/`, '')
      })
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
  const originalSlug = req.params.slug
  const encodedSlug = encodeURIComponent(originalSlug).toLowerCase()

  const post = await postsService.getPostDetail(encodedSlug)

  if (!post) {
    res.status(404).json({
      message: 'Bài viết không tồn tại'
    })
  } else {
    res.json({
      message: 'Lấy bài viết thành công',
      data: {
        ...post
      }
    })
  }
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

export const getRandomPostController = async (req: Request<ParamsDictionary, any, any>, res: Response) => {
  const posts = await postsService.getPostRandom()
  res.json({ message: 'Lấy bài viết ngẫu nhiên thành công', data: posts })
  return
}
