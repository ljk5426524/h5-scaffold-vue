/**
 * 工具类，一些常用方法
 */

/**
 * uuid
 * @param {*} long 长度
 */
export function uuid(long = 32) {
  let uuid = ''

  for (let i = 0; i < long; i++) {
    let random = (Math.random() * 16) | 0
    if (i === 8 || i === 12 || i === 16 || i === 20) {
      uuid += '-'
    }
    uuid += (i === 12 ? 4 : i === 16 ? (random & 3) | 8 : random).toString(16)
  }

  return uuid
}

/**
 * 运行环境判断
 */
export function env() {
  const detect = function(agent) {
    const ua = navigator.userAgent.toLowerCase()

    return ua.indexOf(agent) !== -1
  }

  return {
    ios: detect('iphone') || detect('ipad') || detect('ipod'),
    android: detect('android'),
    wechat: detect('micromessenger'),
  }
}

/**
 * 格式化时间
 * @param {*} date 日期对象
 */
export function formatTime(date) {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  const hour = date.getHours()
  const minute = date.getMinutes()
  const second = date.getSeconds()

  return (
    [year, month, day].map(item => padZero(item)).join('/') +
    ' ' +
    [hour, minute, second].map(item => padZero(item)).join(':')
  )
}

/**
 * 补零
 * @param {*} str 字符串
 * @param {*} dig 位数
 */
export function padZero(str, dig = 2) {
  str = '' + str

  while (str.length < dig) {
    str = '0' + str
  }

  return str
}

/**
 * 小数点格式化
 * @param {*} value 原值
 * @param {*} digit 位数
 */
export function formatterNumber(value, digit = 2) {
  value = value.replace(/[^\d.]/g, '') // 清除"数字"和"."以外的字符
  value = value.replace(/^\./g, '') // 验证第一个字符是数字而不是字符
  value = value.replace(/\.{2,}/g, '.') // 只保留第一个.清除多余的
  value = value
    .replace('.', '$#$')
    .replace(/\./g, '')
    .replace('$#$', '.')
  value = value.replace(
    new RegExp('^(\\-)*(\\d+)\\.(\\d{' + digit + '}).*$'),
    '$1$2.$3'
  ) // 小数点后面 digit 位

  return value
}

/**
 * 富文本转文本
 * @param {*} html
 */
export function htmlToText(html = '') {
  return html
    .replace(/<style([\s\S]*?)<\/style>/gi, '')
    .replace(/<script([\s\S]*?)<\/script>/gi, '')
    .replace(/<\/div>/gi, '\n')
    .replace(/<\/li>/gi, '\n')
    .replace(/<li>/gi, '  *  ')
    .replace(/<\/ul>/gi, '\n')
    .replace(/<\/p>/gi, '\n')
    .replace(/<br\s*\/?>/gi, '\n')
    .replace(/<[^>]+>/gi, '')
}

/**
 * 深拷贝
 * @param {*} origin 源对象
 */
export function deepCopy(origin) {
  // Basic data types or aviod `null` to `{}`
  if (typeof origin !== 'object' || origin === null) {
    return origin
  }

  let copy = Array.isArray(origin) ? [] : {}

  for (let prop in origin) {
    if (origin.hasOwnProperty(prop)) {
      copy[prop] =
        typeof origin[prop] === 'object' ? deepCopy(origin[prop]) : origin[prop]
    }
  }

  return copy
}

/**
 * 取文件名
 * @param {*} fileName 文件名
 * @param {*} length 长度
 */
export function formatFileName(fileName = '', length = 12) {
  const dotLastIndex = fileName.lastIndexOf('.')
  let filePrefix = ''
  let fileExtension = ''
  let newFileName = fileName

  if (dotLastIndex !== -1) {
    filePrefix = fileName.substr(0, dotLastIndex)
    fileExtension = fileName.substr(dotLastIndex, fileName.length)

    newFileName =
      (filePrefix.length > length
        ? filePrefix.substr(0, length) + '...'
        : filePrefix) + fileExtension
  }

  return newFileName
}

/**
 * 节流
 * @param {*} fn 触发函数
 * @param {*} delay 定时触发时间
 */
export function throttle(fn, delay) {
  let previous = +new Date()

  return function() {
    const now = +new Date()

    if (now - previous >= delay) {
      previous = now
      fn()
    }
  }
}

/**
 * 防抖
 * @param {*} fn 触发函数
 * @param {*} delay 延迟触发时间
 */
export function debounce(fn, delay) {
  clearTimeout(fn.timer)
  fn.timer = setTimeout(fn, delay)
}

/**
 * 下载文件
 * @param {*} params 返回对象
 */
export function downloadBlob(params) {
  let { response, fileName, isConvertToCn = true } = params

  if (!response) {
    throw Error('"response" is not defined')
  }

  let blob
  const isBlob = response instanceof Blob

  // response can be response or response.data(blob)
  if (!isBlob) {
    const type = response.headers['content-type']
    const disposition = response.headers['content-disposition']
    blob = new Blob([response.data], {
      type: type || 'application/octet-stream',
    })
    // you can use custom download file name like xx.xlsx(file name + suffix name)
    // or you can get download file name from backend
    // But by default, files downloaded by firefox and ie do not have a suffix name
    // So, you must get download file name and suffix name from backend(access attribute content-disposition)
    if (!fileName) {
      // console.log('fileName', fileName, disposition, )
      if (disposition && disposition.indexOf('attachment') !== -1) {
        const fileNameRegex = /filename[^;=\n]*=((['"]).*?\2|[^;\n]*)/
        const matches = fileNameRegex.exec(disposition)

        if (matches !== null && matches[1])
          fileName = matches[1].replace(/['"]/g, '')
      }
    }
  } else {
    blob = response

    if (!fileName) {
      throw Error('You must define a downloaded file name')
    }
  }

  // Converting to Chinese(if need)
  if (isConvertToCn) {
    fileName = decodeURI(fileName)
  }

  // chrome firefox: navigator.msSaveBlob => undefined
  // ie: navigator.msSaveBlob => function
  // or you can use navigator.msSaveOrOpenBlob(In the download prompt box, will contain "open" and "save" option)
  if (typeof navigator.msSaveBlob !== 'undefined') {
    // IE workaround for "HTML7007: One or more blob URLs were
    // revoked by closing the blob for which they were created.
    // These URLs will no longer resolve as the data backing the URL has been freed."
    navigator.msSaveBlob(blob, fileName)
  } else {
    const URL = window.URL || window.webkitURL
    const downloadUrl = URL.createObjectURL(blob)
    const downloadLink = document.createElement('a')

    // use HTML5 a[download] attribute to specify fileName
    // ie and safari doesn't support this yet
    // chrome firefox: typeof downloadLink.download => 'string'
    // ie safari: typeof downloadLink.download => 'undefined'
    if (typeof downloadLink.download === 'undefined') {
      window.open(downloadUrl)
    } else {
      downloadLink.href = downloadUrl
      downloadLink.download = fileName
      document.body.appendChild(downloadLink)
      downloadLink.click()
      document.body.removeChild(downloadLink)
      window.URL.revokeObjectURL(downloadUrl)
    }
  }
}
