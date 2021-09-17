import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

export const constantRoutes = [
  {
    path: '/',
    redirect: '/home',
  },

  {
    path: '/home',
    component: () => import('@/views/home'),
    name: 'Home',
    meta: { title: '首页' },
  },

  {
    path: '/post/:id',
    component: () => import('@/views/post'),
    name: 'Post',
    meta: { title: '详情' },
  },

  {
    path: '/post/:id/comment-list',
    component: () => import('@/views/comment-list'),
    name: 'CommentList',
    meta: { title: '评论列表页' },
  },

  {
    path: '/no-found',
    component: () => import('@/views/no-found'),
    name: 'NoFound',
    meta: { title: '未找到页面' },
  },

  { path: '*', redirect: '/no-found' },
]

const createRouter = () =>
  new Router({
    base: env.routerPath,
    mode: 'history', // require service support
    scrollBehavior: () => ({ y: 0 }),
    routes: constantRoutes,
  })

const router = createRouter()

export function resetRouter() {
  const newRouter = createRouter()
  router.matcher = newRouter.matcher // reset router
}

export default router
