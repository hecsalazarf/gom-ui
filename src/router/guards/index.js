const GlobalGuards = {

  beforeEach (to, from, next) {
    const { $q } = this.app

    const accessToken = $q.cookies.get(process.env.SESSION_TOKEN_COOKIE)
    if (!accessToken && to.name === 'login') {
      next()
    } else if (!accessToken) {
      next({ name: 'login' })
    } else if (accessToken && to.name === 'login') {
      next({ path: from.path })
    } else {
      next() // always call next()!
    }
  }
}

export default GlobalGuards
