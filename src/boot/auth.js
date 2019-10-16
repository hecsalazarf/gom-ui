import { abilitiesPlugin, Can } from '@casl/vue'
import { User } from 'src/helpers'

export default async ({ Vue, ssrContext }) => {
  const user = new User(ssrContext) // create user instance
  if (user.token) {
    // If token exists, user has already logged in and a CASL instance
    // can be created with the corresponding ability
    Vue.use(abilitiesPlugin, user.createAbility())
    // Set user ID with gtag.js
    Vue.prototype.$ga.config({
      user_id: user.id
    })
  } else {
    // Otherwise, create CASL instance without ability
    Vue.use(abilitiesPlugin)
  }
  Vue.component('Can', Can)
  Vue.prototype.$user = user
}
