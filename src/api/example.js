import request from '@/utils/request'

/**
 * custom: Custom request and response. It contains the following properties
 * showLoading: Is display loading indicator? default is `true`
 * loadingText: Loading indicator. text default is `加载中...`
 * inParam: params is need to be wrapped by `inParam`? default is `false`
 * successCode: custom the return successCode code(Boolean or Number). default is `200`
 * contentType: Post request method dataType
 */

/**
 * 例子
 * example
 */

/**
 * get，普通请求
 * @param {*} data
 */
export function getPostList(data) {
  return request({
    url: '/post/list',
    method: 'get',
    data,
  })
}

/**
 * get，自定义 loading 展示状态或展示内容（showLoading 优先级高于 loadingText，注释代码供演示）
 * @param {*} data
 */
export function getPostById(data) {
  return request({
    url: '/post/detail',
    method: 'get',
    data: {
      ...data,
      custom: {
        // 自定义 loading 内容
        loadingText: 'loading...',

        // 或不展示 loading
        // showLoading: false,
      },
    },
  })
}

/**
 * get，自定义通过 inParam 传参（不建议）
 * 以及是否透传数据或成功状态码
 * @param {*} data
 */
export function getCommentListById(data) {
  return request({
    url: '/post/comments',
    method: 'get',
    data: {
      ...data,
      custom: {
        inParam: true,

        // 透传数据
        successCode: true,

        // 或自定义成功状态码
        // successCode: 204,
      },
    },
  })
}

/**
 * post，json提交（默认）
 * @param {*} data
 */
export function addPost(data) {
  return request({
    url: '/post/add',
    method: 'post',
    data,
  })
}

/**
 * post，表单提交
 * @param {*} data
 */
export function addPost2(data) {
  return request({
    url: '/post/add',
    method: 'post',
    data: {
      ...data,
      custom: {
        contentType: 'application/x-www-form-urlencoded',
      },
    },
  })
}

/**
 * 下载文件
 * @param {*} data
 */
export function downloadFile(data) {
  return request({
    url: '/file/download',
    method: 'get',
    responseType: 'blob',
    data,
  })
}

/**
 * 导入文件（一般通过 element upload 组件）
 * @param {*} data
 */
export function exportFile(data) {
  return request({
    url: '/file/upload',
    method: 'post',
    responseType: 'blob',
    data,
  })
}
