
export const ROOT_LOGIN = 'rootLogin'

const routes = [
  {
    path: '/',
    name: 'home',
    redirect: { name: 'orders' },
    component: () => import('layouts/Home.vue'),
    children: [
      { path: 'orders',
        component: () => import('layouts/TransitionPage.vue'),
        children: [
          {
            path: '',
            name: 'orders',
            component: () => import('pages/order/List.vue')
          },
          {
            path: 'id/:id',
            name: 'orderDetails',
            component: () => import('pages/order/Details.vue'),
            props: true
          },
          {
            path: 'new',
            name: 'newOrder',
            component: () => import('pages/order/New.vue')
          },
          {
            path: 'id',
            redirect: { name: 'orders' }
          }
        ]
      },
      { path: 'customers',
        component: () => import('layouts/TransitionPage.vue'),
        children: [
          {
            path: '',
            name: 'customers',
            component: () => import('pages/customer/List.vue')
          },
          {
            path: 'id/:id',
            name: 'customerDetails',
            component: () => import('pages/customer/Details.vue'),
            props: true
          },
          {
            path: 'id/',
            redirect: { name: 'customers' }
          }
        ]
      }
    ]
  },
  {
    path: '/login',
    meta: {
      name: ROOT_LOGIN, // name is placed in meta to avoid warning "the default child route will not be rendered"
      refQuery: 'ref'
    },
    component: () => import('layouts/Simple.vue'),
    children: [
      {
        path: '',
        name: 'login',
        component: () => import('pages/Login.vue')
      }
    ]
  }
]

// Always leave this as last one
if (process.env.MODE !== 'ssr') {
  routes.push({
    path: '*',
    component: () => import('pages/Error404.vue')
  })
}

export default routes
