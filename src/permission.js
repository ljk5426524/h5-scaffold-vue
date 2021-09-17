import Cookies from 'js-cookie'

import router from '@/router'

import { getPageTitle } from '@/utils/project'
import { getCookieJSON } from '@/utils/cookie'

// 登录后置白名单
const whiteList = ['/login', '/register', '/home', '/']

router.beforeEach(async (to, from, next) => {
  document.title = getPageTitle(to.meta.title)

  // const user = getCookieJSON('user') || {}
  // const isLogged = user.loginToken

  const isLogged = true

  // 未登录，非登录页或注册页，需跳转至登录页
  // 已登录，登录页需跳转至首页
  if (!isLogged) {
    if (whiteList.includes(to.path)) {
      next()
    } else {
      next('/login')

      document.title = getPageTitle(from.meta.title)
    }
  } else {
    if (to.path === '/login') {
      next({ path: '/' })
    } else {
      next()
    }
  }
})

router.afterEach((to, from) => {
  // 在 全局后置钩子 中处理，是因为组件内可能需要设置动态标题
  document.title = getPageTitle(to.meta.title)
})
