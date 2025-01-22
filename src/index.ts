import express, { NextFunction, Response, Request, ErrorRequestHandler } from 'express'
import { defaultErrorHandler } from '~/middlewares/error.middlewares'
import usersRouter from '~/routes/users.routes'
import databaseService from '~/services/database.services'
import cors from 'cors'
import { method } from 'lodash'
import mediasRouter from '~/routes/medias.routes'

const app = express()
const port = 4000

databaseService.connect()

// use là middleware function, nó sẽ chạy trước khi request được xử lý
app.use(
  cors({
    origin: 'http://localhost:3000', // Thay bằng URL của frontend (Next.js)
    methods: 'GET,POST,PUT,DELETE', // Cho phép các method HTTP
    credentials: true // Nếu bạn cần gửi cookie
  })
)
app.use(express.json())
app.use('/users', usersRouter)
app.use('/medias', mediasRouter)

app.use(defaultErrorHandler as ErrorRequestHandler)

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})
