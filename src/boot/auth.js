import { abilitiesPlugin, Can } from '@casl/vue'
import { User } from 'src/helpers'

export default async ({ Vue, ssrContext }) => {
  const user = new User(ssrContext) // create user instance
  Vue.use(abilitiesPlugin, user.createAbility())
  if (user.token) {
    // Set user ID with gtag.js
    Vue.prototype.$ga.config({
      user_id: user.id
    })
  }
  Vue.component('Can', Can)
  Vue.prototype.$user = user
}
