const GlobalGuards = {

  beforeEach (to, from, next) {
    const { $q, $axios } = this.app

    const accessToken = $q.cookies.get('access-token')
    if (!accessToken && to.name === 'login') {
      next()
    } else if (!accessToken) {
      next({ name: 'login' })
    } else if (accessToken && to.name === 'login') {
      next({ path: from.path })
    } else if (!$q.cookies.get('csrf-token')) {
      // check for csrf token and request if not existing
      $axios.get('auth/ping').then(() => next()).catch(err => {
        console.error(err)
        next()
      })
    } else {
      next() // always call next()!
    }
  }
}

export default GlobalGuards
