import { Cookies } from 'quasar'
import { Ability } from '@casl/ability'

const TOKEN = Symbol('token')

class UserHelper {
  constructor (ssrContext) {
    this.cookies = process.env.SERVER // check for SSR rendering
      ? Cookies.parseSSR(ssrContext) // SSR mode
      : Cookies // otherwise we're on client
  }

  get token () {
    if (!this[TOKEN] && this.cookies.has(process.env.SESSION_TOKEN_COOKIE)) {
      const token = this.cookies.get(process.env.SESSION_TOKEN_COOKIE) // get token from cookie
      const payload = token.slice(token.indexOf('.') + 1) // get the payload only
      if (process.env.SERVER) {
        /* On SSR decode token using Node buffer */
        this[TOKEN] = JSON.parse(Buffer.from(payload, 'base64').toString('ascii'))
      } else {
        /* On CSR decode token using atob */
        this[TOKEN] = JSON.parse(atob(payload))
      }
    }
    return this[TOKEN]
  }

  set token (value) {
    this[TOKEN] = value
  }

  // get info () {
  //   if (!this[INFO] && this.cookies.has('id-token')) {
  //     const info = this.cookies.get('id-token') // get token from cookie
  //     const payload = info.slice(info.indexOf('.') + 1, info.lastIndexOf('.')) // get the payload only
  //     if (process.env.SERVER) {
  //       /* On SSR decode token using Node buffer */
  //       this[INFO] = JSON.parse(Buffer.from(payload, 'base64').toString('ascii'))
  //     } else {
  //       /* On CSR decode token using atob */
  //       this[INFO] = JSON.parse(atob(payload))
  //     }
  //   }
  //   return this[INFO]
  // }

  // set info (value) {
  //   this[INFO] = value
  // }

  get id () {
    if (!this.token) {
      return undefined
    }
    return this.token.sub
  }

  get seller () {
    if (!this.token) {
      return undefined
    }
    return this.token.seller
  }

  createAbility () {
    if (!this.token) {
      return undefined
    }
    /* Create rules based on permissions retrieved from token */
    const rules = this.token.permissions.map(permission => {
      const defs = permission.split(':')
      return {
        actions: defs[0],
        subject: defs[1]
      }
    })
    return new Ability(rules) // create ability with rules
  }

  clear () {
    this.token = null
    this.info = null
  }
}

export const User = UserHelper
