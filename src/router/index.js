import Vue from 'vue'
import VueRouter from 'vue-router'

import routes from './routes'
import GlobalGuards from './guards'

Vue.use(VueRouter)

/*
 * If not building with SSR mode, you can
 * directly export the Router instantiation
 */

export default function (/* { store, ssrContext } */) {
  const Router = new VueRouter({
    scrollBehavior: (to, from, savedPosition) => {
      if (savedPosition) {
        /* Delay the response so that scrolling
        seems smooth */
        return new Promise((resolve, reject) => {
          setTimeout(() => {
            resolve(savedPosition)
          }, 300)
        })
      } else {
        return { x: 0, y: 0 }
      }
    },
    routes,

    // Leave these as is and change from quasar.conf.js instead!
    // quasar.conf.js -> build -> vueRouterMode
    // quasar.conf.js -> build -> publicPath
    mode: process.env.VUE_ROUTER_MODE,
    base: process.env.VUE_ROUTER_BASE
  })

  // Bind to Router to execute functionality for each router instance
  Router.beforeEach(GlobalGuards.beforeEach.bind(Router))
  return Router
}
