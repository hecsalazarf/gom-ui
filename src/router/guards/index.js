import { Cookies } from 'quasar'
import axios from 'axios'

const GlobalGuards = {
  beforeEach (to, from, next) {
    const accessToken = Cookies.get('access-token')
    if (!accessToken && to.name === 'login') {
      next()
    } else if (!accessToken) {
      next({ name: 'login' })
    } else if (accessToken && to.name === 'login') {
      next({ path: from.path })
    } else if (!Cookies.get('csrf-token')) {
      // check for csrf token and request if not existing
      axios.get('auth/ping').then(() => next()).catch(err => {
        console.error(err)
        next()
      })
    } else {
      next() // always call next()!
    }
  }
}

export default GlobalGuards
