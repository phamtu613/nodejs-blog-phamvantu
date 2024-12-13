import User from '~/models/schemas/User.schema'
import databaseService from '~/services/database.services'

class UsersService {
  async register(payload: { email: string; password: string; name: string }) {
    const { email, password, name } = payload
    const result = await databaseService.users.insertOne(
      new User({
        email,
        password,
        name
      })
    )
    return result
  }

  async checkEmailExist(email: string) {
    const user = await databaseService.users.findOne({ email })
    console.log('user>>>>', user)
    return Boolean(user)
  }
}

const usersService = new UsersService()
export default usersService
