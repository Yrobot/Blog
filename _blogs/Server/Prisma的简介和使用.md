---
title: Prisma的简介和使用
author: yrobot
keywords: Prisma,ORM,数据库,graphql,Nodejs,server,简介,使用
createTime: 2021年06月30日
draft: true
---

**本页目录：**  
[什么是 Prisma](#what)  
[Prisma](#what)

<a id='what'></a>

## 什么是 Prisma

这是 Prisma 官网的 slogan
![](https://gitee.com/yrobot/images/raw/master/2021-06-30/l6SvHF-14-58-19.png)
翻译过来就是说：

> Prisma 是一个基于 Nodejs 和 TypeScript 的 ORM，它可以帮助开发者以 更快的开发速度 和 更少的错误 来 管理数据库。

关于是 ORM (Object/Relational Mapping)，简单的来说就是一个可以像操作对象一样操作数据库的工具。  
具体 ORM 介绍可以参看 阮一峰 老师的[《ORM 实例教程》](http://www.ruanyifeng.com/blog/2019/02/orm-tutorial.html)

### Prisma 组成

> Prisma 主要由 3 块组成

1. Prisma Client

   > Auto-generated and type-safe query builder for Node.js & TypeScript

   - 自动生成 和 类型安全 的 查询器，将对象操作映射数据库

   - 这是 ORM 最主要的能力

2. Prisma Migrate

   > Migration tool to easily evolve your database schema from prototyping to production

   - 工具可以将你的 schema 设计 转化为 数据库结构

3. Prisma Studio

   > GUI to view and edit data in your database

   - 一个查看编辑数据库的可视化工具

## 使用 Prisma

### 安装

run `yarn add -D prisma` or `npm install prisma -D`

### 项目 init - 生成配置

run `npx prisma init`  
![](https://gitee.com/yrobot/images/raw/master/2021-07-01/tnhyG4-17-48-55.png)
主要是生成了一个文件`/prisma/schema.prisma`

```js
datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}
generator client {
  provider = "prisma-client-js"
}
```

可以看出，文件包含 2 个配置：

1. DB 连接的配置
2. Prisma Client 配置

> `schema.prisma`配置参看 [Prisma schema](https://www.prisma.io/docs/concepts/components/prisma-schema)

###

## Prisma 的不足

### ORM 通病，对象关系不匹配

参看 [《Object–relational impedance mismatch》](https://en.wikipedia.org/wiki/Object%E2%80%93relational_impedance_mismatch)  
但是在中小型简单业务中影响忽略不计

## Prisma 的优势

### 优秀的代码提示

<div align='center'>
  <img src='https://gitee.com/yrobot/images/raw/master/2021-06-30/jbsle4-16-57-42.png' width='600' />
</div>

> prisma-vscode: 不仅支持 prisma 相关 API 的 Snippets。 在运行 `migrate` 生成 database 之后，还支持数据库字段的代码提示。

### 优秀的数据库 GUI 管理工具 Prisma Studio

<div align='center'>
  <img src='https://gitee.com/yrobot/images/raw/master/2021-06-30/KeOrAp-17-17-51.png' width='600' />
  <img src='https://gitee.com/yrobot/images/raw/master/2021-06-30/bR6AzK-17-10-07.png' width='600' />
</div>

> 可以在 Prisma Studio 查看有哪些表，查看表内数据。并支持 筛选，修改，暂存修改，保存修改，放弃修改，等等能力。
