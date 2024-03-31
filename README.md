# 食药监局 CFDA 项目后端

## 持续集成服务状态
[![Build Status](https://drone.paperplane.cc/api/badges/jia-niang/cfda-api/status.svg)](https://drone.paperplane.cc/jia-niang/cfda-api)  

## 介绍
本项目是为食药监局[前台系统](https://git.paperplane.cc/jia-niang/cfda-app)提供 API 接口而准备  
Github 克隆或下载本项目后，使用前需对`src/env/env.js`配置文件进行配置  

## 配置项
`SERVER_NAME`：服务器名称  
`SERVER_DOMAIN`：设置的 Cookie 的`domain`属性，跨域时设置为前端部署的域名  
`DEPLOY_HOST`：API 部署的 IP 地址，如果在云服务器上则设置为内网地址  
`SERVER_PORT`：API 端口  
`MONGODB_HOST`：MongoDB 数据库地址  
`DB_NAME`：MongoDB 数据库名  

## 使用
在命令行中使用`cd`进入本项目根目录  
初次使用必须安装环境与依赖： 
（依赖环境只需要安装一次）  
```bash
npm i
```

本地运行测试：  
```bash
# 需要先运行 Babel 监听并编译文件
npm run dev-build
# 运行项目
npm run dev
```

用于生产环境：  
```bash
# 运行一次 Babel 编译文件（推荐使用持续集成服务）
npm run ci-build
# 运行项目
npm run prod
```