import { createRouter, createWebHashHistory } from 'vue-router'
import { useUserStore } from '@/stores/user'

const routes = [
  {
    path: '/login',
    name: 'Login',
    component: () => import('@/views/Login.vue'),
    meta: { title: '登录' }
  },
  {
    path: '/',
    component: () => import('@/views/Layout.vue'),
    redirect: '/dashboard',
    meta: { requiresAuth: true },
    children: [
      {
        path: 'dashboard',
        name: 'Dashboard',
        component: () => import('@/views/Dashboard.vue'),
        meta: { title: '仪表盘' }
      },
      {
        path: 'news',
        name: 'NewsList',
        component: () => import('@/views/news/List.vue'),
        meta: { title: '新闻管理' }
      },
      {
        path: 'news/create',
        name: 'NewsCreate',
        component: () => import('@/views/news/Edit.vue'),
        meta: { title: '新增新闻' }
      },
      {
        path: 'news/edit/:id',
        name: 'NewsEdit',
        component: () => import('@/views/news/Edit.vue'),
        meta: { title: '编辑新闻' }
      },
      {
        path: 'cases',
        name: 'CasesList',
        component: () => import('@/views/cases/List.vue'),
        meta: { title: '案例管理' }
      },
      {
        path: 'cases/create',
        name: 'CasesCreate',
        component: () => import('@/views/cases/Edit.vue'),
        meta: { title: '新增案例' }
      },
      {
        path: 'cases/edit/:id',
        name: 'CasesEdit',
        component: () => import('@/views/cases/Edit.vue'),
        meta: { title: '编辑案例' }
      },
      {
        path: 'contacts',
        name: 'Contacts',
        component: () => import('@/views/Contacts.vue'),
        meta: { title: '咨询记录' }
      }
    ]
  }
]

const router = createRouter({
  history: createWebHashHistory(),
  routes
})

// 路由守卫
router.beforeEach((to, from, next) => {
  const userStore = useUserStore()
  
  // 设置页面标题
  document.title = to.meta.title ? `${to.meta.title} - 工程造价管理后台` : '工程造价管理后台'

  // 检查是否需要登录
  if (to.meta.requiresAuth && !userStore.isLoggedIn) {
    next('/login')
  } else if (to.path === '/login' && userStore.isLoggedIn) {
    next('/')
  } else {
    next()
  }
})

export default router
