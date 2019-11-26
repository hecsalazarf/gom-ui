import { RouteNames } from 'src/constants/app'

const routes = [
  {
    path: '/',
    name: RouteNames.HOME,
    redirect: { name: RouteNames.ORDER_LIST },
    component: () => import('layouts/Home.vue'),
    children: [
      {
        path: 'orders',
        component: () => import('layouts/TransitionPage.vue'),
        children: [
          {
            path: '',
            name: RouteNames.ORDER_LIST,
            component: () => import('pages/order/List.vue')
          },
          {
            path: 'id/:id',
            name: RouteNames.ORDER_DETAILS,
            component: () => import('pages/order/Details.vue'),
            props: true
          },
          {
            path: 'new',
            name: RouteNames.ORDER_NEW,
            component: () => import('pages/order/New.vue')
          },
          {
            path: 'id',
            redirect: { name: 'orders' }
          }
        ]
      },
      {
        path: 'customers',
        component: () => import('layouts/TransitionPage.vue'),
        children: [
          {
            path: '',
            name: RouteNames.CUSTOMER_LIST,
            component: () => import('pages/customer/List.vue')
          },
          {
            path: 'id/:id',
            name: RouteNames.CUSTOMER_DETAILS,
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
      name: RouteNames.LOGIN_ROOT, // name is placed in meta to avoid warning "the default child route will not be rendered"
      refQuery: 'shid'
    },
    component: () => import('layouts/Simple.vue'),
    children: [
      {
        path: '',
        name: RouteNames.LOGIN_MAIN,
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
