/**
 * @param {string} path
 * @returns {Boolean}
 */
export function isExternal(path) {
  return /^(https?:|mailto:|tel:)/.test(path)
}

/**
 * @param {string} str
 * @returns {Boolean}
 */
export function isPhone(str) {
  return /^[1][3,4,5,7,8,9][0-9]{9}$/.test(str)
}

/**
 * @param {string} str
 * @returns {Boolean}
 */
export function isEmail(str) {
  return /^\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/.test(str)
}

/**
 * 验证身份证（粗略）
 * @param {string} str
 * @returns {Boolean}
 */
export function isIdCard(str) {
  return /(^[1-9]\d{14}$)|(^[1-9]\d{17}$)|(^[1-9]\d{16}(\d|X|x)$)/.test(str)
}

/**
 * 验证身份证（完整）
 * @param {string} code
 * @returns {Boolean}
 */
export function isFullIdCard(code) {
  const city = {
    11: '北京',
    12: '天津',
    13: '河北',
    14: '山西',
    15: '内蒙古',
    21: '辽宁',
    22: '吉林',
    23: '黑龙江 ',
    31: '上海',
    32: '江苏',
    33: '浙江',
    34: '安徽',
    35: '福建',
    36: '江西',
    37: '山东',
    41: '河南',
    42: '湖北 ',
    43: '湖南',
    44: '广东',
    45: '广西',
    46: '海南',
    50: '重庆',
    51: '四川',
    52: '贵州',
    53: '云南',
    54: '西藏 ',
    61: '陕西',
    62: '甘肃',
    63: '青海',
    64: '宁夏',
    65: '新疆',
    71: '台湾',
    81: '香港',
    82: '澳门',
    91: '国外 ',
  }
  let tip = ''
  let pass = true

  if (
    !code ||
    !/^\d{6}(18|19|20)?\d{2}(0[1-9]|1[012])(0[1-9]|[12]\d|3[01])\d{3}(\d|X)$/i.test(
      code
    )
  ) {
    tip = '身份证号格式错误'
    pass = false
  } else if (!city[code.substr(0, 2)]) {
    tip = '地址编码错误'
    pass = false
  } else {
    // 18位身份证需要验证最后一位校验位
    if (code.length === 18) {
      code = code.split('')
      // ∑(ai×Wi)(mod 11)
      // 加权因子
      const factor = [7, 9, 10, 5, 8, 4, 2, 1, 6, 3, 7, 9, 10, 5, 8, 4, 2]
      //校验位
      const parity = [1, 0, 'X', 9, 8, 7, 6, 5, 4, 3, 2]
      let sum = 0
      let ai = 0
      let wi = 0

      for (let i = 0; i < 17; i++) {
        ai = code[i]
        wi = factor[i]
        sum += ai * wi
      }

      const last = parity[sum % 11] + ''

      if (last !== code[17]) {
        tip = '校验位错误'
        pass = false
      }
    }
  }

  // if(!pass) alert(tip)

  return pass
}

/**
 * 港澳通行证 或者 台湾通行证
 * @param {*} str
 * @returns {Boolean}
 */
export function isSpecialRegionIdCard(str) {
  return /^[a-zA-Z][0-9]{6,10}$/.test(str)
}
