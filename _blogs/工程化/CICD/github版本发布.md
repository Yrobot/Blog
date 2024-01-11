---
title: github版本发布
author: yrobot
keywords: CI,CD,github,自动部署,github,actions,release,yml
createTime: 2023年10月31日
draft: true
---

## 简介

本文主要是介绍如何使用 github actions 实现 各种类型的 服务/软件/网站 的发布。

## 阐述需求

明确自身需求很重要，对于我来说，大部分是前端项目。针对前端项目，列举了下我的需求：

1. 自动更新 package.json 中的 version 字段
2. 自动生成 changelog
3. 自动发布 github release
4. 

## 基本逻辑

其实 有很多种 可行的发布流程，如：

- 根据 production 分支的 merge、push，触发 CI/CD， 并触发 github release 自动新建 release，生成 changelog
- 根据 git tag 来触发 后续链路， 如 git tag 符合 'v\*' 规则，触发后续链路
- 根据 github 新建 release 操作，触发后续链路
- xxx

## 问题记录

### 1. Github Action 获取 release version 步骤报错：[semantic-release] › ✘ EGITNOPERMISSION Cannot push to the Git repository.

原因：代码仓库的 github action 推送代码权限默认没有写权限，而 semantic-release 就算在 dry run 模式下还是会检查 github 的仓库读写权限。

需要在 github 仓库的 settings -> Actions -> General 中, 修改 `Workflow permissions` 为 `Read and write permissions`。

参考：https://www.raulmelo.me/en/til/how-to-solve-permission-to-x-denied-to-github-actions-bot

### 2. 希望更新 package.json 中的 version 字段，但不 publish 到 npm

在 .releaserc.json 中对 "@semantic-release/npm" 进行设置：`"npmPublish": false`

```json
{
  "plugins": [
    "@semantic-release/commit-analyzer",
    "@semantic-release/release-notes-generator",
    [
      "@semantic-release/npm", // step [prepare]: will update the version of 'package.json' // 参看 https://github.com/semantic-release/npm
      {
        "npmPublish": false
      }
    ],
    "@semantic-release/github"
  ]
}
```

## 参考资料

- https://www.jianshu.com/p/738f13665bee
