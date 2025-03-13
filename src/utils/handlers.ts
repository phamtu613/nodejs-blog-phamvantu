import { NextFunction, Request, RequestHandler, Response } from 'express'

export const wrapRequestHandler = (func: RequestHandler) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      await func(req, res, next)
    } catch (error) {
      next(error)
    }
  }
}

export const extractImageFromYoast = (yoastHead: string): string | null => {
  const regex = /<meta (?:property|name)="(?:og:image|twitter:image)" content="([^"]+)"/
  const match = yoastHead.match(regex)
  return match ? match[1] : null
}
