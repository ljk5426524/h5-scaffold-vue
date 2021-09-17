/**
 * nodejs 操作及相关
 */

const fs = require('fs')

/**
 * 判断文件夹是否存在
 * @param {string} path 路径
 */
function getStat(path, isDirectory = true) {
  return new Promise((resolve, reject) => {
    fs.stat(path, (err, stats) => {
      if (err) {
        resolve(false)
      } else {
        resolve(isDirectory ? stats.isDirectory() : true)
      }
    })
  })
}

/**
 * 创建文件夹
 * @param {string} path 文件夹
 */
function mkDir(path) {
  return new Promise((resolve, reject) => {
    fs.mkdir(path, err => {
      if (err) {
        resolve(false)
      } else {
        resolve(true)
      }
    })
  })
}

/**
 * 格式化时间
 * @param {*} date 日期对象
 */
function formatTime(date) {
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
function padZero(str, dig = 2) {
  str = '' + str

  while (str.length < dig) {
    str = '0' + str
  }

  return str
}

module.exports = {
  getStat,
  mkDir,
  formatTime,
}
