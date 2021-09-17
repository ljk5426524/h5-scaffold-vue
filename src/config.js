const apiUrlList = {
  // 本地研发环境
  local: 'http://jsonplaceholder.typicode.com',
  developer1: 'http://1.1.1.1:8080/project', // developer1
  developer2: 'http://1.1.1.2:8080/project', // developer2

  // 服务器环境
  dev: '/interface', // 开发
  test: '/interface', // 测试
  production: '/interface', // 生产
}

module.exports = {
  port: '8000',

  projectName: 'xx项目',

  // h5 or cms web
  projectPlatform: 'h5',

  apiUrlList,

  env: {
    local: {
      name: 'local',
      api: apiUrlList['local'],
      publicPath: '/h5',
      routerPath: '/h5',
      showApiSelect: true,
    },
    development: {
      name: 'development',
      api: apiUrlList['dev'],
      publicPath: '/h5',
      routerPath: '/h5',
    },
    test: {
      name: 'test',
      api: apiUrlList['test'],
      publicPath: '/h5',
      routerPath: '/h5',
    },
    production: {
      name: 'production',
      api: apiUrlList['production'],
      publicPath: '/h5',
      routerPath: '/h5',
    },
  },
}
