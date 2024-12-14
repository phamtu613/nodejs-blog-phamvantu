import express, { NextFunction, Response, Request } from 'express'
import { defaultErrorHandler } from '~/middlewares/error.middlewares'
import usersRouter from '~/routes/users.routes'
import databaseService from '~/services/database.services'

const app = express()
const port = 4000

databaseService.connect()

// use là middleware function, nó sẽ chạy trước khi request được xử lý
app.use(express.json())
app.use('/users', usersRouter)

app.use(defaultErrorHandler)

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})
