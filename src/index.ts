import cors from 'cors'
import express, { ErrorRequestHandler } from 'express'
import { defaultErrorHandler } from '~/middlewares/error.middlewares'
import mediasRouter from '~/routes/medias.routes'
import postRouter from '~/routes/posts.routes'
import usersRouter from '~/routes/users.routes'
import databaseService from '~/services/database.services'
import { initFolder } from '~/utils/file'

const app = express()
const port = process.env.PORT || 4000

import { config } from 'dotenv'
import path from 'path'
import { UPLOAD_DIR } from '~/constants/dir'
import accountsRouter from '~/routes/accounts.routes'
import categoriesRouter from '~/routes/categories.routes'
import contactsRouter from '~/routes/contacts.routes'
config()

databaseService.connect()

// use là middleware function, nó sẽ chạy trước khi request được xử lý
app.use(
  cors({
    origin: [process.env.WEB_APP_URL as string, process.env.HOST as string], // Allow both development and production domains
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
app.use('/accounts', accountsRouter)
app.use('/categories', categoriesRouter)
app.use('/contacts', contactsRouter)
app.use('/static', express.static(path.resolve(UPLOAD_DIR)))

app.use(defaultErrorHandler as ErrorRequestHandler)

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})
