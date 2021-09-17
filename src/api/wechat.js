import request from '@/utils/request'

/**
 * 微信
 * for wechat
 */

// 微信签名
export function getWxSignature(data) {
  return request({
    url: '/wx/getSignature',
    method: 'get',
    data,
  })
}

// 获取微信用户信息
export function getWxUserInfo(data) {
  return request({
    url: '/wx/getUserInfo',
    method: 'get',
    data,
  })
}
