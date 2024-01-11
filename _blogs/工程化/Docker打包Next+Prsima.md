---
title: Docker打包Next+Prsima
author: yrobot
keywords: Docker,前端,Next.js,工程化,Prisma,CI/CD,GitHub,打包,构建,发布
createTime: 2023年10月29日
draft: true
---

## 前言

> 本文主要讲述如何使用 Docker 打包 Next.js + Prisma 应用，并且使用 Github Actions 进行 CI/CD 发布到 docker hub。

最近在开发一个 Mail-Bot 的项目，主要是管理 SMTP 并将其转换为 http 请求暴露到内网，供内网其他服务使用。

私有化部署的方案，我选择了 Docker，但是在使用 Docker 进行打包时，遇到了一些问题，所以记录下来。

## 需求明确

1. 本地 git 开发，代码提交到 github
2. 利用 github release 进行版本管理，每次 release 会自动：
   1. 更新 package.json
   2. 添加 git tag
   3. 触发 CI/CD，将代码打包为 docker image 并发布到 docker hub

## 遇到的一些问题

### Module not found: Can't resolve xxx

当然先排查是不是忘记执行 yarn install 了，我这边从 log 看 build 是在依赖安装完成后执行的。

在 local build 的时候，一切安好，但是进入 docker 之后，即使 build 在 install 之后，也会出现找不到模块的问题。
我找了半天才发现，是因为我将 `ENV NODE_ENV production` 放在了 Dockerfile 最上面，导致了 `yarn install` 的时候，没有安装 devDependencies，所以在 build 的时候找不到 dev deps 的模块。

#### 解决方案

- 将 `ENV NODE_ENV production` 放在 `yarn install` 之后。
- 或 `yarn install --production=false`，这样就会安装所有依赖。

### build 过程一直 lint 报错，prisma/client 的 ts 类型报错

基本逻辑是，@prisma/client 的 ts 类型，是通过 prisma migrate 生成的，并存放在 node_modules 里

docker build 环节，所有依赖重新安装，所以 @prisma/client 中不存在 ts 类型，导致 lint 报错。

#### 解决方案

在 docker build 之前，先执行 `yarn prisma migrate`，生成 ts 类型。