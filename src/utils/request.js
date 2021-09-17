import axios from 'axios'
import qs from 'qs'
import { Toast, Dialog } from 'vant'
import router from '@/router'

import { getStorage, getCookie, removeCookie } from '@/utils/cookie'

import { REQUEST_CODES, REQUEST_MESSAGES, REQUEST_TIMEOUT } from '@/constants'

let baseURL = env.api // 环境变量api

if (env.showApiSelect) {
  // 根据api参数动态更改api 用于对接多个后台开发人员 并自测
  baseURL = getStorage('apiUrl') || baseURL
}

const loadingIndictor = {}

const service = axios.create({
  baseURL, // url = base url + request url
  // withCredentials: true, // cookie 可跨域配置，需要服务端支持
  timeout: REQUEST_TIMEOUT, // 请求超时时间
})

// 请求拦截器
service.interceptors.request.use(
  config => {
    if (getCookie('token')) {
      config.headers['Authorization'] = `Bearer ${getCookie('token')}`
    }

    const method = config.method.toLocaleLowerCase()

    config.data = config.data || {}

    if (config.data.custom) {
      config.custom = config.data.custom

      delete config.data.custom
    }

    // 自定义 loading、加载文字、传参数据类型与方式 及 状态码等
    const {
      showLoading = true,
      loadingText = '加载中...',
      contentType,
      inParam,
      apiType,
    } = config.custom || {}

    if (showLoading) {
      loadingIndictor[config.url] = Toast.loading({
        duration: 0,
        forbidClick: true,
        message: loadingText,
      })
    }

    // get: params => query
    // post: data => body
    if (method === 'get') {
      if (inParam) {
        config.params = {
          inParam: config.data,
        }
      } else {
        config.params = config.data
      }

      delete config.data
    } else if (method === 'post') {
      // 默认 application/json
      // https://github.com/axios/axios#using-applicationx-www-form-urlencoded-format
      // https://github.com/axios/axios/blob/6642ca9aa1efae47b1a9d3ce3adc98416318661c/lib/defaults.js#L51

      if (contentType) {
        config.headers['Content-Type'] = contentType

        if (contentType === 'application/x-www-form-urlencoded') {
          config.data = qs.stringify(config.data)
        } else if (contentType === 'multipart/form-data') {
          config.data = config.data.file
        }
      }

      if (inParam) {
        config.data = qs.stringify({
          inParam: JSON.stringify(config.data),
        })
      }
    }

    return config
  },
  error => {
    // 网络请求时，出现错误的情况
    // https://github.com/axios/axios/issues/2509
    // https://github.com/axios/axios/issues/1556

    console.log('request error ', error)
    return Promise.reject(error)
  }
)

// 响应拦截器
service.interceptors.response.use(
  response => {
    if (loadingIndictor[response.config.url]) {
      loadingIndictor[response.config.url].clear()
    }

    let responseData = response.data

    if (typeof responseData === 'string') {
      // 处理某些接口返回为非json字符串时，导致json解析报错
      try {
        responseData = JSON.parse(responseData)
      } catch (error) {
        responseData = {
          msg: responseData,
        }
      }
    }

    const { code: code, msg: message } = responseData

    // 是否指定了返回的状态码
    // 若指定，则将数据透传给业务函数
    // 若未指定，则判断默认状态码 200
    const { successCode: customCode } = response.config.custom || {}

    let successCode = REQUEST_CODES.success

    // 下载流文件（blob）
    if (response.request.responseType === 'blob') return response

    // 指定状态码为 true，将数据透传给业务函数
    // 指定状态码为 其他数值，赋值给 successCode，作后续处理
    if (customCode) {
      if (typeof customCode === 'boolean') return responseData

      if (typeof customCode === 'number') {
        successCode = customCode
      }
    }

    // 处理其他非预期的业务逻辑
    if (Number(code) !== successCode) {
      const isLoginExpired = Number(code) === REQUEST_CODES.loginExpired

      Toast.fail({
        message:
          message ||
          (isLoginExpired
            ? REQUEST_MESSAGES.expired
            : REQUEST_MESSAGES.unknown),
        onClose: () => {
          // 拦截登录信息失效
          if (isLoginExpired) {
            removeCookie('user')

            router.replace({
              name: 'Login',
            })
          }
        },
      })

      return Promise.reject(new Error(message || REQUEST_MESSAGES.unknown))
    }

    return responseData
  },
  error => {
    // 网络请求后，Status Code 不为 2XX 的情况

    console.log('response error', error)
    Toast.fail(error.errMsg || REQUEST_MESSAGES.unknown)
    return Promise.reject(error)
  }
)

export default service
