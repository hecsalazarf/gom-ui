import { Cookies } from 'quasar'

const USER_ID = Symbol('userId')
class Auth {
  get userId () {
    if (!this[USER_ID]) {
      let access = Cookies.get('access-token')
      const index = access.indexOf('.')
      access = access.slice(index + 1)
      this[USER_ID] = JSON.parse(atob(access)).sub
    }
    return this[USER_ID]
  }
}

export default Auth
