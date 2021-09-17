# vue-h5-scaffold

vue h5 scaffold 是一个基于 vue 的移动端开发脚手架。

## 本地开发及打包部署

首先，在项目根目录打开命令行工具，安装相关开发依赖包（如果已安装，忽略该步骤）：

```
npm install
```

注： `npm install` 可能会出现安装速度过慢的问题，可考虑使用国内镜像 [cnpm](https://npm.taobao.org/) 进行安装。

待依赖包安装完成。可通过以下命令启动本地开发服务，浏览器会自动打开相关界面（若未打开，则在浏览器里手动输入 `http://localhost:9999`）：

```
npm run serve
```

开发环境打包：

```
npm run build:dev
```

测试环境打包：

```
npm run build:test
```

生产环境打包：

```
npm run build:prod
```

打包完成后，会在根目录新生成 `dist`（打包目录名根据项目配置规则而定）文件夹，即为发布上线的内容。

## 页面

- 主页 - /home
- 详情 - /post/:id
- 评论详情页 - /post/:id/comment-list

## 环境及账号

### 开发环境

### 测试环境

### 生产环境

## 其他
