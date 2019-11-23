import { RouteNames } from 'src/constants/app'

const GlobalGuards = {

  beforeEach (to, from, next) {
    const { $q } = this.app

    const accessToken = $q.cookies.get(process.env.SESSION_TOKEN_COOKIE)
    if (!accessToken && to.name === RouteNames.LOGIN_MAIN) {
      next()
    } else if (!accessToken) {
      next({ name: RouteNames.LOGIN_MAIN })
    } else if (accessToken && to.name === RouteNames.LOGIN_MAIN) {
      next({ path: from.path })
    } else {
      next() // always call next()!
    }
  }
}

export default GlobalGuards
