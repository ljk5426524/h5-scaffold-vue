import wx from 'weixin-js-sdk'
import qs from 'qs'

import * as api from '../api/'

/**
 * 网页授权
 * 该功能为网页授权获取用户基本信息
 * 该功能生效的前提：
 * 1. 经过微信认证的服务号（订阅号不支持）
 * 2. 登录微信公众平台进入 设置-公众号设置-功能设置 里填写 “网页授权域名”
 * 详细文档见：https://developers.weixin.qq.com/doc/offiaccount/OA_Web_Apps/Wechat_webpage_authorization.html
 */
export function wxLogin(callback) {
  const appid = '微信公众号appid'
  const url = encodeURIComponent(location.href)
  const weixinAuth = `https://open.weixin.qq.com/connect/oauth2/authorize?appid=${appid}&redirect_uri=${url}&response_type=code&scope=snsapi_userinfo#wechat_redirect`

  const { code } = qs.parse(location.search, {
    ignoreQueryPrefix: true,
  })

  // 有 code 则直接通过接口获取微信用户信息
  // 没有，则先通过网页授权回调域名获取 code
  if (code) {
    api
      .getWxUserInfo({
        code,
      })
      .then(response => {
        typeof callback === 'function' && callback(response)
      })
  } else {
    location.href = weixinAuth
  }
}

/**
 * 微信jssdk签名
 * 该功能为使用微信提供的JS-SDK，网页开发者可借助微信高效地使用拍照、选图、语音、位置等手机系统的能力，同时可以直接使用微信分享、扫一扫、卡券、支付等微信特有的能力，为微信用户提供更优质的网页体验。
 * 该功能生效的前提：
 * 1. 订阅号、服务号均支持（微信卡券、支付除外，它们需要经过微信认证的服务号）
 * 1. 登录微信公众平台进入 设置-公众号设置-功能设置 里填写 “JS接口安全域名”
 * 2. 再进入 开发-基本配置-公众号开发信息 里配置后台接口服务器（取、存access_token程序所在的服务器）的ip白名单（未配置会导致签名失败的问题）
 * 签名算法见：https://developers.weixin.qq.com/doc/offiaccount/OA_Web_Apps/JS-SDK.html#62
 * 所有JS接口列表见：https://developers.weixin.qq.com/doc/offiaccount/OA_Web_Apps/JS-SDK.html
 */

// 通过设置的JS接口安全域名，获取签名数据（此处参数名 url 由项目而定）
export function wxSignature(callback = {}) {
  api
    .getWxSignature({
      url: window.location.href.split('#')[0],
    })
    .then(response => {
      typeof callback === 'function' && callback(response)
    })
}

// 通过config接口注入权限验证配置
export function wxJsApiAuth(callback = {}) {
  wxSignature(response => {
    const { appId, timestamp, nonceStr, signature } = response.data

    wx.config({
      debug: false, // 开启调试模式,调用的所有api的返回值会在客户端alert出来，若要查看传入的参数，可以在pc端打开，参数信息会通过log打出，仅在pc端时才会打印。
      appId, // 必填，公众号的唯一标识
      timestamp, // 必填，生成签名的时间戳
      nonceStr, // 必填，生成签名的随机串
      signature, // 必填，签名，见附录1
      jsApiList: [
        'hideMenuItems',
        'updateAppMessageShareData',
        'updateTimelineShareData',

        // 录音
        'startRecord',
        'stopRecord',
        'onVoiceRecordEnd',
        'uploadVoice',

        // 其他api
        // ...

        // 所有JS接口列表见：https://developers.weixin.qq.com/doc/offiaccount/OA_Web_Apps/JS-SDK.html
      ],
    })

    wx.ready(callback)
  })
}

// 批量隐藏功能按钮
export function wxHideMenuItems() {
  wxJsApiAuth(() => {
    wx.hideMenuItems({
      menuList: [
        'menuItem:share:qq', // 分享到QQ
        'menuItem:share:weiboApp', // 分享到Weibo
        'menuItem:favorite', // 收藏
      ],
      success: () => {},
      fail: () => {},
    })
  })
}

// 自定义分享
export function wxShare(shareInfo) {
  const {
    title = '未定义标题',
    desc = '未定义描述',
    link = window.location.href.split('#')[0],
    imgUrl,
  } = shareInfo
  const shareConfig = {
    title, // 分享标题
    desc, // 分享描述
    link, // 分享链接，该链接域名或路径必须与当前页面对应的公众号JS安全域名一致
    imgUrl, // 分享图标
    success: () => {},
    fail: () => {},
  }

  wxJsApiAuth(() => {
    // “分享给朋友”及“分享到QQ”
    wx.updateAppMessageShareData(shareConfig)

    // “分享到朋友圈”及“分享到QQ空间”
    wx.updateTimelineShareData(shareConfig)
  })
}
