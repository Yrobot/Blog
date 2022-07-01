---
title: Github Pages 最佳实践
author: yrobot
keywords: github,pages,deploy,base,url,domain,web component
createTime: 2022年07月01日
---

## Github Pages 是什么

摘自 Github Pages 的文档：

> GitHub Pages is a static site hosting service that takes HTML, CSS, and JavaScript files straight from a repository on GitHub, optionally runs the files through a build process, and publishes a website.

简单的来说，Github Pages 就是一个静态文件服务器，可以将你 github 仓库里的代码直接拷贝到一个服务器上，然后可以通过指定的 url 访问这些文件。

这时如果你的代码刚好是 html，css，js 组成的前端页面，那么 Github Pages 就成为了静态页面服务器。

## Github Pages 的一些限制

GitHub Pages sites are subject to the following usage limits:

- GitHub Pages source repositories have a recommended limit of 1 GB.
- Published GitHub Pages sites may be no larger than 1 GB.
- GitHub Pages sites have a soft bandwidth limit of 100 GB per month.
- GitHub Pages sites have a soft limit of 10 builds per hour.

- 发布的静态页面资源不能超过 1G
- 对应的源码仓库大小不推荐大于 1G
- 每月的带宽流量最多 100G
- 一个仓库每小时最多可以发布 10 次

## Github Pages 的基本使用方法

### 1. 建立一个仓库储存 Github Pages 的代码

- 如果已有仓库可跳过这一步

### 2. 配置仓库的 Pages 设置

- 在仓库名称下，单击 Settings（设置）。
- 在边栏的“Code and automation（代码和自动化）”部分中，单击 Pages。
- 在“GitHub Pages”下，选择发布分支作为发布源。（此分支代码变更后即会触发重新发布
- 使用下拉菜单选择发布源的文件夹（如果你的发布源码不再根目录，即可用此设置发布目录。比如 webpack 打包后的文件夹名

### 3. 在发布分支添加一个页面并发布

> 假设步骤 2 中配置的是 master 分支 /build 目录

那么现在本地将分支切换到 master，在/build 中建立 index.html.
在 index.html 中添加 `<h1>Hello World</h1>` ，然后 commit。
将本地 master 分支 push 到 github。

提交成功后，就可以在 https://<username>.github.io/<repository>/ 中访问刚刚发布 Hello world 页面

## Github Pages 高阶用法与问题

### 1. 页面发布需要经历打包流程

一些大型项目无法避免需要打包流程，利用 webpack、rollup、vite 等打包工具，将项目打包成浏览器可以直接加载的模块格式。

这个有两种方案来解决：

#### 1. 利用 github action 将打包过程放到云端 [推荐]

- 首先配置 github action，将项目在线上进行打包

```yml
name: CI
on:
  push:
    branches: [master]
jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - name: yarn install & yarn json & yarn build
        run: |
          yarn
          yarn json
          yarn build
```

- 利用 actions-gh-pages 将 build 完的文件夹 push 到 gh-pages 分支

在 build step 之后加入

```yml
- name: Deploy to Github Page
  uses: peaceiris/actions-gh-pages@v3
  with:
    github_token: ${{ secrets.GITHUB_TOKEN }}
    publish_dir: ./build
```

[参考线上.github/workflows/main.yml 配置](https://github.com/Yrobot/svg-inline/blob/master/.github/workflows/main.yml)

这样配置之后，没次 push 完就可以在 gh-pages 分支上看到最新的 build 之后的代码

- 修改发布源设置为 hg-pages ，发布源的文件夹设置为 /

#### 2. 将 /build 加入 git 管理

这样在 master 分支就可以直接将/build 文件夹 push 到 origin 到 master 上。

这时候将配置改为发布源设置为 master，发布源的文件夹设置为 /build 即可

### 2. 静态资源（js、css 文件）的请求 404

这是由于 build 后资源的 url 为绝对路径导致的

对于默认配置下，打包后的资源 url 映射关系如下：

- `https://yrobot.github.io/svg-inline/` => `index.html`
- `https://yrobot.github.io/svg-inline/index.<hash>.js` => `index.<hash>.js`

打包软件在默认配置下会将资源 url 转换为绝对路径：`./src/index.ts` => `/index.<hash>.js`

这样刚才的 js 资源的 url 在请求时就会被转换为 `https://yrobot.github.io/index.<hash>.js`

这个 uri 是不存在的，导致请求 404。

此时我们也能想到 2 中方案来解决：

#### 1. 确保生成资源 url 为相对路径；配置打包工具的 base 为 `./`

拿 vite 来举例，只需在`vite.config.ts`中设置 base 即可:

```ts
import { defineConfig } from "vite";
export default defineConfig({
  base: "./",
});
```

这样 build 后的资源 url 都会变为相对路径: `./src/index.ts` => `./index.<hash>.js`

js 静态文件请求也会被解释成 `https://yrobot.github.io/svg-inline/index.<hash>.js`

**TIPS**：

- vite 不支持 web component 和自定义属性 url 的转换(参看 [#8816](https://github.com/vitejs/vite/issues/8816#issuecomment-1167434632) 和 [assetAttrsConfig](https://github.com/vitejs/vite/blob/f38654fd331316f496008f3a118d2628c65b071b/packages/vite/src/node/plugins/html.ts#L114-L121))， 所以在编写代码时直接使用相对路径去请求即可， 如：

```html
<svg-inline src="./svg-inline.svg"></svg-inline>
```

#### 2. 利用 custom domain 将页面提升到域名根目录

此部分请先阅读 [Github Pages 配置自定义域名文档](https://docs.github.com/cn/pages/configuring-a-custom-domain-for-your-github-pages-site/about-custom-domains-and-github-pages)

此方案的原理就是直接使用域名根目录访问，这样打包工具转换后的 url 就是可行的

- `https://custom.domain/` => `index.html`
- `https://custom.domain/index.<hash>.js` => `index.<hash>.js`

## DEMOS

[@yrobot/svg-inline](https://github.com/yrobot/svg-inline)
