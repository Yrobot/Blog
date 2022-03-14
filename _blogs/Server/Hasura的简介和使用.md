---
title: Hasura的简介和使用
author: yrobot
keywords: Hasura,BackEnd,数据库,graphql,server,简介,使用
createTime: 2021年07月01日
draft: true
---

## 什么是 Prisma

这是 Prisma 官网的 slogan
![](https://gitee.com/yrobot/images/raw/master/2021-06-30/l6SvHF-14-58-19.png)
翻译过来就是说：

> Prisma 是一个基于 Nodejs 和 TypeScript 的 ORM，它可以帮助开发者以 更快的开发速度 和 更少的错误 来 管理数据库。

关于是 ORM (Object/Relational Mapping)，简单的来说就是一个可以像操作对象一样操作数据库的工具。  
具体 ORM 介绍可以参看 阮一峰 老师的[《ORM 实例教程》](http://www.ruanyifeng.com/blog/2019/02/orm-tutorial.html)

## 优秀的代码提示

<div align='center'>
  <img src='https://gitee.com/yrobot/images/raw/master/2021-06-30/jbsle4-16-57-42.png' width='600' />
</div>

> prisma-vscode: 不仅支持 prisma 相关 API 的 Snippets。 在运行 `migrate` 生成 database 之后，还支持数据库字段的代码提示。

## 优秀的数据库 GUI 管理工具 Prisma Studio

<div align='center'>
  <img src='https://gitee.com/yrobot/images/raw/master/2021-06-30/KeOrAp-17-17-51.png' width='600' />
  <img src='https://gitee.com/yrobot/images/raw/master/2021-06-30/bR6AzK-17-10-07.png' width='600' />
</div>

> 可以在 Prisma Studio 查看有哪些表，查看表内数据。并支持 筛选，修改，暂存修改，保存修改，放弃修改，等等能力。
