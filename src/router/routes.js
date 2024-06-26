const routes = [
  {
    path: '/',
    component: () => import('components/Layout.vue'),
    children: [
      {path: '', component: () => import('components/IndexPage.vue')},
      {path: 'game', component: () => import('components/GamePage.vue')},
      {path: 'error', component: () => import('components/ErrorNotFound.vue')},
    ]
  },
  {
    path: '/',
    component: () => import('components/Layout.vue'),
    children: [
      {path: 'logout', component: () => import('components/IndexPage.vue')},
    ]
  },
  {
    path: '/:catchAll(.*)*',
    component: () => import('components/Layout.vue'),
    children: [
      {path: '', component: () => import('components/ErrorNotFound.vue')}
    ]
  }
]

export default routes
