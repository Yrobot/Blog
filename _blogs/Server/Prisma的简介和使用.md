---
title: Prisma的简介和使用
author: yrobot
keywords: Prisma,ORM,数据库,graphql,Nodejs,server,简介,使用
createTime: 2021年06月30日
updateTime: 2023年11月10日
---

## 什么是 Prisma

这是 Prisma 官网的 slogan
![](https://images.yrobot.top/2021-06-30/l6SvHF-14-58-19.png)
翻译过来就是说：

> Prisma 是一个基于 Nodejs 和 TypeScript 的 ORM，它可以帮助开发者以 更快的开发速度 和 更少的错误 来 管理数据库。

关于是 ORM (Object/Relational Mapping)，简单的来说就是一个可以像操作对象一样操作数据库的工具。  
具体 ORM 介绍可以参看 阮一峰 老师的[《ORM 实例教程》](http://www.ruanyifeng.com/blog/2019/02/orm-tutorial.html)

### 明确几个实体

基本上所有 ORM 都在处理这几个实体之间的关系：数据库 DB、ORM 客户端、数据结构描述文件

一个完整的 ORM 需要做的事有以下几个：

- 一种支持特别语法的数据结构描述文件，来 1 声明数据库结构 和 2 生成客户端类型声明代码：`/prisma/schema.prisma`
- 编译时 可以根据数据结构描述文件更新数据库结构
- 运行时 可以通过操作 ORM 客户端 操作 数据库

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

### 1.安装 prisma

run `yarn add -D prisma` or `npm install prisma -D`

### 2.项目 init - 生成配置

run `npx prisma init`  
![](https://images.yrobot.top/2021-07-01/tnhyG4-17-48-55.png)
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

### 3.配置`schema.prisma`

> `schema.prisma` 是 Prisma 主要的配置文件

`schema.prisma` 配置纬度主要包含以下 3 点：

1. DB 连接的配置
2. Prisma Client 配置
3. data model 定义

`schema.prisma`配置参看 [Prisma schema](https://www.prisma.io/docs/concepts/components/prisma-schema)

#### example:

> 方便起见，我选用 sqlite 作为 prisma 的数据库，并定义一个 User 的数据模型

`schema.prisma`:

```js
datasource db {
  provider = "sqlite"
  url      = "file:dev.db"
}

generator client {
  provider = "prisma-client-js"
}

model User {
  id    Int     @id @default(autoincrement())
  email String  @unique
  name  String?
}
```

### 4.运行 `prisma migrate` 生成数据表和 client

> 使用 `migrate` 将定义的数据模型映射到数据库表结构。

> `migrate`还会自动生成 node_modules/.prisma/client，一个 runtime 的 prisma 客户端，提供良好的代码提示等能力。

运行 migrate，并指定 环境为 dev，名字为 init

run: `npx prisma migrate dev --name init`

#### example:

DB 生成：  
<img src='https://images.yrobot.top/2021-07-02/C4ExSd-14-45-26.png' width='200' />

client 生成：  
<img src='https://images.yrobot.top/2021-07-02/iHwCiy-14-47-58.png' width='600' />

### 5.使用 client 对数据库进行 CRUD

> 接下来就可以使用 Prisma Client 对数据库进行 增删改查了

> **链式对象操作** + **优秀的代码提示**，行云流水的开发体验，真的舒服

[Prisma CRUD 文档](https://www.prisma.io/docs/concepts/components/prisma-client/crud)

#### example:

本节示例我将直接使用 node 对 client 进行操作，去增删改查数据库

<details>
<summary>test.js:  // 点击展开代码  </summary>

```js
const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

async function main() {
  // Create 3 users
  await Promise.all(
    [
      { email: "user1@mail.com", name: "user1" },
      { email: "user2@mail.com", name: "user2" },
      { email: "user3@mail.com", name: "user3" },
    ].map(async (user) =>
      prisma.user.create({
        data: user,
      })
    )
  );

  // Read
  console.log(await prisma.user.findMany());

  // Update user2 name as yrobot
  await prisma.user.update({
    where: {
      email: "user2@mail.com",
    },
    data: {
      name: "yrobot",
    },
  });

  // Delete user3
  await prisma.user.delete({
    where: {
      email: "user3@mail.com",
    },
  });

  // Read
  console.log(await prisma.user.findMany());
}

main()
  .catch((e) => {
    throw e;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
```

</details>

<details open>
<summary> node logs:  </summary>

<img src="https://images.yrobot.top/2021-07-02/fBZUo6-16-05-57.png" width='400'/>

</details>

### 6.使用 Prisma Studio GUI 查看并操作数据库

> Prisma Studio 算是 Prisma 作为 ORM 的另一个亮点
> 优秀的使用体验，省去了传统查看数据库的繁琐操作和配置

run: `npx prisma studio`

terminal logs:
<img src="https://images.yrobot.top/2021-07-02/S0BCat-16-18-48.png" width='400'>

open studio in Browser: [`http://localhost:5555`](http://localhost:5555)
<img src="https://images.yrobot.top/2021-07-02/LDw1Hb-16-20-39.png" width='650'>

### 7.配合 Express 快速搭建 RESTful 服务

主要代码逻辑：server.js

```js
const { PrismaClient } = require("@prisma/client");
const express = require("express");
const bodyParser = require("body-parser");

const prisma = new PrismaClient();
const app = express();
app.use(bodyParser());
const port = 3000;

app.get("/users", async function (req, res) {
  const users = await prisma.user.findMany();
  res.send(users);
});

app.get("/user/:id", async function (req, res) {
  const { id } = req.params;
  const user = await prisma.user.findUnique({
    where: {
      id: parseInt(id),
    },
  });
  res.send(user);
});

app.post("/user/create", async function (req, res) {
  const { user } = req.body;
  const result = await prisma.user.create({
    data: user,
  });
  res.send(result);
});

app.post("/user/update", async function (req, res) {
  const { user, id } = req.body;
  const result = await prisma.user.update({
    where: {
      id: parseInt(id),
    },
    data: user,
  });
  res.send(result);
});

app.delete("/user/delete", async function (req, res) {
  const { id } = req.body;
  const result = await prisma.user.delete({
    where: {
      id: parseInt(id),
    },
  });
  res.send(result);
});

app.listen(port, () => {
  console.log(`Server run at http://localhost:${port}`);
});
```

测试逻辑：

```
### get user list
GET http://localhost:3000/users

### get user detail
GET http://localhost:3000/user/8

### create user
POST http://localhost:3000/user/create

### update user
POST http://localhost:3000/user/update

### delete user
DELETE http://localhost:3000/user/delete
```

## example 代码地址

[<img src='https://images.yrobot.top/2021-07-02/tGQsQN-17-51-18.png' width='600'/>](https://github.com/yrobot-demo/prisma-demo)  
[prisma-demo](https://github.com/yrobot-demo/prisma-demo)

## Prisma 的不足

### ORM 通病，对象关系不匹配

参看 [《Object–relational impedance mismatch》](https://en.wikipedia.org/wiki/Object%E2%80%93relational_impedance_mismatch)
但是在中小型简单业务中影响忽略不计

## Prisma 的优势

### 优秀的代码提示

<img src='https://images.yrobot.top/2021-06-30/jbsle4-16-57-42.png' width='600' />

> prisma-vscode: 不仅支持 prisma 相关 API 的 Snippets。
> 在运行 `migrate` 生成 database 之后，还支持数据库字段的代码提示。

### 优秀的数据库 GUI 管理工具 Prisma Studio

<img src='https://images.yrobot.top/2021-06-30/KeOrAp-17-17-51.png' width='600' />
<img src='https://images.yrobot.top/2021-06-30/bR6AzK-17-10-07.png' width='600' />

> 可以在 Prisma Studio 查看有哪些表，查看表内数据。
> 支持 筛选，修改，暂存修改，保存修改，放弃修改，等等能力。
