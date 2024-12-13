import express, { NextFunction, Response, Request } from 'express'
import usersRouter from '~/routes/users.routes'
import databaseService from '~/services/database.services'

const app = express()
const port = 4000

// use là middleware function, nó sẽ chạy trước khi request được xử lý
app.use(express.json())
app.use('/users', usersRouter)
databaseService.connect()

app.use((error: any, req: Request, res: Response, next: NextFunction) => {
  console.log(error)
  res.status(400).json({ message: error.message })
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})
