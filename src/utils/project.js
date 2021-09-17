/**
 * 项目相关
 */

import config from '@/config'

export function getPageTitle(pageTitle) {
  if (pageTitle) {
    return `${pageTitle} - ${config.projectName}`
  }
  return `${config.projectName}`
}
