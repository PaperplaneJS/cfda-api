# 食药监局CFDA项目后端

## 介绍
本项目是为食药监局[前台系统](https://github.com/s1n1an/cfda-client)提供API接口而准备  
Github克隆或下载本项目后，使用前必须修改项目根目录下的webpack配置文件  

## 配置文件
`webpack.dev.js`用于：  
执行`npm run dev`创建开发测试环境后端系统时的配置  
执行`npm run dev-build`打包测试环境部署单文件  

可以在同级目录创建一个`webpack.prod.js`文件  
内容可以直接复制`webpack.dev.js`的内容，然后根据生产环境的需要，修改其中的配置项  

`webpack.prod.js`用于：  
执行`npm run build`打包生产环境部署单文件  

## 配置项
`SERVER_NAME`:服务器名称  
`SERVER_DOMAIN`:设置的Cookie的`domain`属性，跨域时设置为前端部署的域名  
`DEPLOY_HOST`:API部署的IP地址，如果在云服务器上则设置为内网地址  
`SERVER_PORT`:API端口  
`MONGODB_HOST`:MongoDB数据库地址  
`DB_NAME`:MongoDB数据库名  

## 使用
在cmd指令中使用`cd`进入本项目根目录  
初次使用必须安装环境与依赖：  
```
npm i
```
（依赖环境只需要安装一次）

运行测试服务器：  
```
npm run dev
```

开发测试环境打包：  
```
npm run dev-build
```

生产环境打包（需要`webpack.prod.js`）：  
```
npm run build
```