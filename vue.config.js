const path = require('path')
const fs = require('fs')

const FileManagerPlugin = require('filemanager-webpack-plugin')

const outputDir = 'dist'
const assetsDir = 'static'

const config = require('./src/config.js')
const node = require('./src/utils/node.js')
const { version } = require('./package')

const port = process.env.port || config.port
const projectName = process.env.name || config.projectName
const projectPlatform = config.projectPlatform

const NODE_ENV = process.env.ENV || 'local'
const env = config.env[NODE_ENV]

const getZipName = (() => {
  const time = node
    .formatTime(new Date())
    .replace(/\/|:|\d{2}$/g, '')
    .replace(/\s/g, '-')

  VUE_APP_VERSION = `v${version}`
  VUE_APP_PUBLISH_TIME = time

  const zipName = [
    projectName,
    projectPlatform,
    env.name,
    VUE_APP_VERSION,
    VUE_APP_PUBLISH_TIME,
  ].join('-')

  return `${zipName}.zip`
})()

function resolve(dir) {
  return path.join(__dirname, dir)
}

module.exports = {
  // App deploy path
  publicPath: env.publicPath,

  // Build folder name
  outputDir: outputDir,

  // Assets folder name
  assetsDir: assetsDir,

  // Check the code when the local environment is saved
  lintOnSave: process.env.ENV === 'local',

  // Close sourcemap for production environment
  productionSourceMap: false,

  // webpack-dev-server config
  devServer: {
    port: port,
    open: true,
    overlay: {
      warnings: true,
      errors: true,
    },

    // enable https protocol
    // https: true,
  },

  configureWebpack: config => {
    if (process.env.ENV !== 'local') {
      config.plugins.push({
        apply: compiler => {
          compiler.hooks.afterEmit.tap('open-dist-webpack-plugin', stats => {
            const zipIsExist = async () => {
              const distPath = resolve(`${outputDir}/` + getZipName)
              const isExistPath = await node.getStat(distPath, false)

              if (isExistPath) {
                const exec = require('child_process').exec
                const platform = process.platform

                // Open `outputDir` directory folder and selected zip file for windows or mac
                if (platform === 'win32' || platform === 'win64') {
                  exec(
                    'explorer.exe /select,' +
                      resolve(`${outputDir}/` + getZipName)
                  )
                } else if (platform === 'darwin') {
                  exec(`open -R ${outputDir}/` + getZipName)
                }
              } else {
                zipIsExist()
              }
            }

            zipIsExist()
          })
        },
      })
    }
  },

  chainWebpack(config) {
    config.plugin('html').tap(args => {
      if (process.env.NODE_ENV === 'production') {
        args[0].minify.removeComments = false
      }
      return args
    })

    config.plugin('define').tap(args => {
      args[0]['env'] = JSON.stringify(env)
      return args
    })

    config.when(process.env.ENV !== 'local', config => {
      config.optimization.splitChunks({
        chunks: 'all',
        cacheGroups: {
          libs: {
            name: 'chunk-libs',
            test: /[\\/]node_modules[\\/]/,
            priority: 10,
            chunks: 'initial', // only package third parties that are initially dependent
          },
          vantUI: {
            name: 'chunk-vantUI', // split vantUI into a single package
            priority: 20, // the weight needs to be larger than libs and app or it will be packaged into libs or app
            test: /[\\/]node_modules[\\/]_?vant(.*)/, // in order to adapt to cnpm
          },
          commons: {
            name: 'chunk-commons',
            test: resolve('src/components'), // can customize your rules
            minChunks: 3, //  minimum common number
            priority: 5,
            reuseExistingChunk: true,
          },
        },
      })
      config.optimization.runtimeChunk('single')

      config.plugin('filemanager-webpack-plugin').use(FileManagerPlugin, [
        {
          onEnd: {
            archive: [
              {
                source: `${outputDir}`,
                destination: `${outputDir}/` + getZipName,
              },
            ],
          },
        },
      ])
    })
  },

  // 自定义 vant 主题
  css: {
    loaderOptions: {
      less: {
        modifyVars: {
          blue: '#2eb6f7',
        },
      },
    },
  },
}
