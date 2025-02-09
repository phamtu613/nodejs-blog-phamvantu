import cors from 'cors'
import express, { ErrorRequestHandler } from 'express'
import { defaultErrorHandler } from '~/middlewares/error.middlewares'
import mediasRouter from '~/routes/medias.routes'
import postRouter from '~/routes/posts.routes'
import usersRouter from '~/routes/users.routes'
import databaseService from '~/services/database.services'
import { initFolder } from '~/utils/file'
import argv from 'minimist'

const app = express()
const port = process.env.PORT || 4000

import { isProduction } from '~/constants/config'
import { config } from 'dotenv'
config()

databaseService.connect()

// use là middleware function, nó sẽ chạy trước khi request được xử lý
app.use(
  cors({
    origin: 'http://localhost:3000', // Thay bằng URL của frontend (Next.js)
    methods: 'GET,POST,PUT,DELETE', // Cho phép các method HTTP
    credentials: true // Nếu bạn cần gửi cookie
  })
)

// Tạo folder upload
initFolder()

app.use(express.json())
app.use('/users', usersRouter)
app.use('/medias', mediasRouter)
app.use('/posts', postRouter)

app.use(defaultErrorHandler as ErrorRequestHandler)

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})
