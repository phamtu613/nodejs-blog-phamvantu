import { Request, Response } from 'express'
import { ParamsDictionary } from 'express-serve-static-core'
import { LoginReqBody } from '~/models/schemas/requests/User.requests'

export const postController = async (req: Request<ParamsDictionary, any, LoginReqBody>, res: Response) => {
  try {
    const url = 'https://phamvantu.com/wp-json/wp/v2/posts?per_page=2&_fields=id,date,slug,title,content'
    const response = await fetch(url)
    if (!response.ok) {
      res.status(response.status).json({
        message: 'Failed to fetch posts',
        error: `HTTP error! status: ${response.status}`
      })
      return
    }
    // Parse dữ liệu JSON trả về
    const posts = await response.json()

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
  // res.json({
  //   message: 'Crawl ok'
  // })
  // return
}
