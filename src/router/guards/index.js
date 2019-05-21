import { LocalStorage } from 'quasar'

const GlobalGuards = {
  beforeEach (to, from, next) {
    let atk = LocalStorage.getItem('atk')
    if (!atk && to.name === 'login') {
      next()
    } else if (!atk) {
      next({ name: 'login' })
    } else if (atk && to.name === 'login') {
      next({ path: from.path })
    } else {
      next() // always call next()!
    }
  }
}

export default GlobalGuards
