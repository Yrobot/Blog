---
title: 在飞书上开发一个App
author: yrobot
keywords: 前端,ts,飞书,app,开发,bot,IM,chat,robot
createTime: 2023年08月15日
---

# 在 飞书 上开发一个 App

> 本文主要的目的是记录一下在 飞书 上开发一个 App（bot 被激活后展示一个表单，用户填写后提交内容到后端） 的过程，以及遇到的一些问题和解决方案。

## 核心需求简述

内部用户 可以利用 飞书 App 将数据轻松的从 聊天工具 发送到 自有平台。

## 飞书 App 是什么，能做什么

> https://open.feishu.cn/document/home/app-types-introduction/overview

应用是开发者向内部或外部用户提供服务的载体，也是开发者调用飞书所提供的开放能力的载体。

根据 应用的上架方式，应用可分为以下两种类型：

- 企业自建应用：由企业内部人员或企业授权的开发人员进行开发，只能在同一企业内发布和使用。
- 应用商店应用：由第三方服务商开发，在飞书应用目录发布，所有飞书租户均可安装和使用。

根据应用的能力形态，飞书应用主要可分为 机器人、网页、小程序、小组件四类。我们常看到的 飞书工作台 中一系列应用均为小程序、网页应用、小组件。

## Lark 应用的入口

https://open.feishu.cn/document/client-docs/extensions/%E2%80%9C+%E2%80%9D-menu-shortcut

主要有 3 个打开应用的入口：

1. 搜索结果快捷入口
1. 聊天框“+”菜单
1. 消息快捷操作

## 选择合适的应用类型和形式

由于核心需求是对内部用户，所以只需要选择 企业自建应用 即可。

配合 聊天框“+”菜单，可以直接在聊天界面打开应用进行表单填写。

聊天框“+”菜单 参看 https://open.feishu.cn/document/client-docs/extensions/%E2%80%9C+%E2%80%9D-menu-shortcut

目前， 小程序应用、网页应用 均可开启聊天框“+”菜单（网页应用从 3.39 版本开始支持）

考虑到多平台一致性和开发成本，选择 网页应用 作为载体。

## lark 网页应用的开发流程

https://open.larksuite.com/document/home/integrating-web-apps-in-5-minutes/configuration-of-sso

![CGMTi9-17-30-27](https://images.yrobot.top/2023-08-17/CGMTi9-17-30-27.png)

大致流程如下：

1. 前往管理后台创建应用
2. 开发者本地启动网页应用（内网环境访问）
3. 管理后台配置网页应用的本地地址（如 http://127.0.0.1:3000）
4. 发布版本
5. 在 lark 客户端打开 网页应用 测试体验

## 注意点

### 1. 需要去 Lark Admin 修改应用可用范围（默认只有本人可用），其他人才能搜索到应用

![4NlbwR-17-34-14](https://images.yrobot.top/2023-08-17/4NlbwR-17-34-14.png)

## bot 主要逻辑链路

![7XdaqE-11-07-15](https://images.yrobot.top/2023-08-15/7XdaqE-11-07-15.png)
