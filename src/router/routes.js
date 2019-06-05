
const routes = [
  {
    path: '/',
    name: 'home',
    redirect: { name: 'orders' },
    component: () => import('layouts/Gom.vue'),
    children: [
      { path: 'orders',
        component: () => import('layouts/Order.vue'),
        children: [
          {
            path: '',
            name: 'orders',
            component: () => import('pages/order/List.vue')
          },
          {
            path: 'order/:id',
            name: 'orderDetails',
            component: () => import('pages/order/Details.vue'),
            props: true
          },
          {
            path: 'order',
            redirect: { name: 'orders' }
          }
        ]
      },
      { path: 'customers', name: 'customers', component: () => import('pages/customers/Customers.vue') }
    ]
  },
  {
    path: '/login',
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
