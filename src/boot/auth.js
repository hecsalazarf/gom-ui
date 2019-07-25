import { abilitiesPlugin, Can } from '@casl/vue'
import { User } from 'src/helpers'

export default async ({ Vue, ssrContext }) => {
  const user = new User(ssrContext) // create user instance
  if (user.token) {
    /*
    * If token exists, user has already logged in and CASL instance
    * can be created with the corresponding ability
    */
    Vue.use(abilitiesPlugin, user.createAbility())
  } else {
    /* Otherwise, create CASL instance without ability */
    Vue.use(abilitiesPlugin)
  }
  Vue.component('Can', Can)
  Vue.prototype.$user = user
}
