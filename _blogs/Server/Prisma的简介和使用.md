---
title: Prisma的简介和使用
author: yrobot
keywords: Prisma,ORM,数据库,graphql,Nodejs,server,简介,使用
createTime: 2021年06月30日
updateTime: 2025年10月26日
---

## 什么是 Prisma

这是 Prisma 官网的 slogan
![Prisma 官网 slogan](https://images.yrobot.top/2021-06-30/l6SvHF-14-58-19.png)
翻译过来就是说：

> Prisma 是一个基于 Node.js 和 TypeScript 的 ORM，它可以帮助开发者以更快的开发速度和更少的错误来管理数据库。

关于 ORM（Object/Relational Mapping），简单来说就是一个可以像操作对象一样操作数据库的工具。
具体 ORM 介绍可以参看 阮一峰 老师的[《ORM 实例教程》](http://www.ruanyifeng.com/blog/2019/02/orm-tutorial.html)

### 明确几个实体

基本上所有 ORM 都在处理这几个实体之间的关系：数据库 DB、ORM 客户端、数据结构描述文件

一个完整的 ORM 需要做的事有以下几个：

- 一种支持特别语法的数据结构描述文件，用于声明数据库结构并生成客户端类型声明代码
- 编译时可以根据数据结构描述文件更新数据库结构
- 运行时可以通过操作 ORM 客户端来操作数据库

### Prisma 组成

> Prisma 主要由 3 块组成

1. Prisma Client

   > Auto-generated and type-safe query builder for Node.js and TypeScript

   - 自动生成和类型安全的查询器，将对象操作映射到数据库

   - 这是 ORM 最主要的能力

2. Prisma Migrate

   > Migration tool to easily evolve your database schema from prototyping to production

   - 工具可以将你的 schema 设计转化为数据库结构

3. Prisma Studio

   > GUI to view and edit data in your database

   - 一个查看编辑数据库的可视化工具

## 使用 Prisma

### 1. 安装 Prisma

run `yarn add -D prisma` or `npm install prisma -D`

### 2. 项目 init - 生成配置

run `npx prisma init`
![prisma init 命令执行结果](https://images.yrobot.top/2021-07-01/tnhyG4-17-48-55.png)
主要是生成了一个文件`/prisma/schema.prisma`

```prisma
datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}
generator client {
  provider = "prisma-client-js"
}
```

### 3. 配置 schema.prisma

> `schema.prisma` 是 Prisma 主要的配置文件

`schema.prisma` 配置维度主要包含以下 3 点：

1. DB 连接的配置
2. Prisma Client 配置
3. data model 定义

`schema.prisma`配置参看 [Prisma schema](https://www.prisma.io/docs/concepts/components/prisma-schema)

#### example:

> 方便起见，我选用 SQLite 作为 Prisma 的数据库，并定义一个 User 的数据模型

`schema.prisma`:

```prisma
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

### 4. 运行 prisma migrate 生成数据表和 client

> 使用 `migrate` 将定义的数据模型映射到数据库表结构。

> 在开发环境中，`migrate dev` 会自动调用 `prisma generate`，生成 node_modules/.prisma/client，一个 runtime 的 Prisma 客户端，提供良好的代码提示等能力。

运行 migrate，并指定 环境为 dev，名字为 init

run: `npx prisma migrate dev --name init`

#### example:

DB 生成：
<img src='https://images.yrobot.top/2021-07-02/C4ExSd-14-45-26.png' alt='SQLite 数据库文件生成' width='200' />

client 生成：
<img src='https://images.yrobot.top/2021-07-02/iHwCiy-14-47-58.png' alt='Prisma Client 自动生成的文件结构' width='600' />

#### 深入理解 Migrate

##### Migrate 的核心作用

Prisma Migrate 是连接 schema 定义和数据库的桥梁，它的核心作用包括：

1. **版本控制**：每次执行 migrate 都会在 `prisma/migrations` 目录下生成一个迁移文件，记录数据库结构的变更历史
2. **自动同步**：将 `schema.prisma` 中定义的数据模型自动转换为对应的 SQL 语句并执行
3. **触发 Client 生成**：`migrate dev` 会自动调用 `prisma generate` 生成 TypeScript 类型定义和 Prisma Client（注意：`migrate deploy` 不会自动生成，需要手动执行）

##### 日常开发流程

**开发环境**（快速迭代）：

```bash
# 修改 schema.prisma 后执行
npx prisma migrate dev --name describe_your_changes

# 该命令会：
# 1. 创建新的迁移文件
# 2. 应用迁移到数据库
# 3. 自动调用 `npx prisma generate` 重新生成 Prisma Client
```

**生产环境**（严格迁移）：

```bash
# 只应用迁移，不创建新迁移
npx prisma migrate deploy

# 该命令会：
# 1. 检查待应用的迁移
# 2. 按顺序执行所有未应用的迁移
# 3. 不会重新生成 Client（需要单独执行 prisma generate）
```

##### 重要注意事项

1. **理解 `prisma generate` 的作用**
   - `prisma generate` 是生成 Prisma Client 和 TypeScript 类型的命令
   - `migrate dev` 会自动调用它，但 `migrate deploy` 不会
   - 如果只修改了 `schema.prisma` 而不涉及数据库结构变更，只需运行 `npx prisma generate`
   - 生产部署时记得在 `migrate deploy` 后执行 `npx prisma generate`

2. **迁移文件不可手动修改**
   - 迁移文件生成后，不要手动编辑 SQL 内容
   - 如需修改，应该创建新的迁移而不是修改已有迁移
   - 已经应用到数据库的迁移更是绝对不能修改

3. **团队协作时的冲突处理**
   - 多人同时修改 schema 可能产生迁移冲突
   - 拉取代码后，记得执行 `npx prisma migrate dev` 应用其他人的迁移
   - 如遇到冲突，可能需要重置数据库（开发环境）：`npx prisma migrate reset`

4. **数据丢失风险警示**
   - 删除字段、修改字段类型等操作可能导致数据丢失
   - 生产环境迁移前务必备份数据库
   - 使用 `prisma migrate diff` 预览迁移将执行的 SQL

5. **迁移历史的重要性**
   - `prisma/migrations` 目录应该提交到版本控制（Git）
   - 这些文件是数据库演变历史的完整记录
   - 不要删除已经应用的迁移文件

### 5. 使用 client 对数据库进行 CRUD

> 接下来就可以使用 Prisma Client 对数据库进行 增删改查了

> **链式对象操作** + **优秀的代码提示**，行云流水的开发体验，真的舒服

[Prisma CRUD 文档](https://www.prisma.io/docs/concepts/components/prisma-client/crud)

#### example:

本节示例我将直接使用 node 对 client 进行操作，去增删改查数据库

<details>
<summary>test.js:  // 点击展开代码  </summary>

```js
// 导入 Prisma Client
const { PrismaClient } = require("@prisma/client");

// 实例化 Prisma Client
const prisma = new PrismaClient();

async function main() {
  // Create 创建 3 个用户
  await Promise.all(
    [
      { email: "user1@mail.com", name: "user1" },
      { email: "user2@mail.com", name: "user2" },
      { email: "user3@mail.com", name: "user3" },
    ].map(async (user) =>
      // 使用 create 方法创建用户
      prisma.user.create({
        data: user,
      })
    )
  );

  // Read 查询所有用户
  console.log(await prisma.user.findMany());

  // Update 更新 user2 的名字为 yrobot
  await prisma.user.update({
    where: {
      email: "user2@mail.com", // 通过 email 定位用户
    },
    data: {
      name: "yrobot", // 更新 name 字段
    },
  });

  // Delete 删除 user3
  await prisma.user.delete({
    where: {
      email: "user3@mail.com", // 通过 email 定位要删除的用户
    },
  });

  // Read 再次查询所有用户，验证更新和删除操作
  console.log(await prisma.user.findMany());
}

main()
  .catch((e) => {
    throw e;
  })
  .finally(async () => {
    // 断开数据库连接
    await prisma.$disconnect();
  });
```

</details>

<details open>
<summary> node logs:  </summary>

<img src="https://images.yrobot.top/2021-07-02/fBZUo6-16-05-57.png" alt='node 执行 CRUD 操作的输出日志' width='400'/>

</details>

### 6. 使用 Prisma Studio GUI 查看并操作数据库

> Prisma Studio 算是 Prisma 作为 ORM 的另一个亮点
> 优秀的使用体验，省去了传统查看数据库的繁琐操作和配置

run: `npx prisma studio`

terminal logs:
<img src="https://images.yrobot.top/2021-07-02/S0BCat-16-18-48.png" alt='Prisma Studio 启动日志' width='400'>

open studio in Browser: [`http://localhost:5555`](http://localhost:5555)
<img src="https://images.yrobot.top/2021-07-02/LDw1Hb-16-20-39.png" alt='Prisma Studio 界面展示' width='650'>

### 7. 配合 Express 快速搭建 RESTful 服务

主要代码逻辑：server.js

```js
// 导入 Prisma Client
const { PrismaClient } = require("@prisma/client");
const express = require("express");
const bodyParser = require("body-parser");

// 实例化 Prisma Client
const prisma = new PrismaClient();
const app = express();
app.use(bodyParser());
const port = 3000;

// GET 获取所有用户列表
app.get("/users", async function (req, res) {
  const users = await prisma.user.findMany();
  res.send(users);
});

// GET 根据 id 获取单个用户详情
app.get("/user/:id", async function (req, res) {
  const { id } = req.params;
  const user = await prisma.user.findUnique({
    where: {
      id: parseInt(id), // 将字符串 id 转换为数字
    },
  });
  res.send(user);
});

// POST 创建新用户
app.post("/user/create", async function (req, res) {
  const { user } = req.body;
  const result = await prisma.user.create({
    data: user,
  });
  res.send(result);
});

// POST 更新用户信息
app.post("/user/update", async function (req, res) {
  const { user, id } = req.body;
  const result = await prisma.user.update({
    where: {
      id: parseInt(id), // 通过 id 定位要更新的用户
    },
    data: user, // 更新的数据
  });
  res.send(result);
});

// DELETE 删除用户
app.delete("/user/delete", async function (req, res) {
  const { id } = req.body;
  const result = await prisma.user.delete({
    where: {
      id: parseInt(id), // 通过 id 定位要删除的用户
    },
  });
  res.send(result);
});

// 启动服务器
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

[<img src='https://images.yrobot.top/2021-07-02/tGQsQN-17-51-18.png' alt='GitHub 仓库 prisma-demo' width='600'/>](https://github.com/yrobot-demo/prisma-demo)
[prisma-demo](https://github.com/yrobot-demo/prisma-demo)

## 常见问题与解决方案

### 问题 1：Migrate 执行失败

**问题现象：**

执行 `npx prisma migrate dev` 时报错，提示 migration failed 或 database connection error。

**常见原因：**

1. 数据库连接配置错误（检查 `.env` 文件中的 `DATABASE_URL`）
2. 数据库服务未启动
3. Schema 定义存在语法错误
4. 数据库中已有数据与新的 schema 冲突

**解决方案：**

```bash
# 1. 检查数据库连接
npx prisma db push --preview-feature  # 测试连接是否正常

# 2. 查看详细错误信息
npx prisma migrate dev --name test --create-only  # 只创建迁移文件不执行
# 然后手动检查生成的 SQL 文件

# 3. 开发环境重置数据库（会丢失所有数据！）
npx prisma migrate reset
```

### 问题 2：Prisma Client 类型不更新

**问题现象：**

修改了 `schema.prisma` 并执行了 migrate，但代码中的类型提示没有更新。

**常见原因：**

1. 忘记重新生成 Client
2. IDE 缓存未刷新
3. TypeScript 服务未重启

**解决方案：**

```bash
# 1. 手动重新生成 Prisma Client
npx prisma generate

# 2. 重启 TypeScript 服务（VS Code）
# 按 Cmd+Shift+P（Mac）或 Ctrl+Shift+P（Windows）
# 输入 "TypeScript: Restart TS Server"

# 3. 清理 node_modules 后重新安装（最后手段）
rm -rf node_modules .prisma
npm install
npx prisma generate
```

### 问题 3：数据库连接错误

**问题现象：**

运行应用时提示 `Can't reach database server` 或类似的连接错误。

**常见原因：**

1. `.env` 文件中的 `DATABASE_URL` 配置错误
2. 数据库服务未运行
3. 防火墙阻止连接
4. SSL 连接配置问题

**解决方案：**

```bash
# 1. 检查 .env 文件格式
# PostgreSQL 示例：
DATABASE_URL="postgresql://user:password@localhost:5432/mydb?schema=public"

# MySQL 示例：
DATABASE_URL="mysql://user:password@localhost:3306/mydb"

# SQLite 示例（本地开发）：
DATABASE_URL="file:./dev.db"

# 2. 验证数据库是否运行
# PostgreSQL：
psql -U user -d mydb

# MySQL：
mysql -u user -p mydb

# 3. 如遇到 SSL 错误，可以临时禁用（仅限开发环境）
DATABASE_URL="postgresql://user:password@localhost:5432/mydb?sslmode=disable"
```

### 问题 4：生产环境迁移

**问题现象：**

不确定如何安全地在生产环境执行数据库迁移。

**最佳实践：**

1. **迁移前准备：**

```bash
# 1. 备份生产数据库
pg_dump mydb > backup_$(date +%Y%m%d_%H%M%S).sql

# 2. 在测试环境验证迁移
npx prisma migrate deploy --preview-feature

# 3. 预览将要执行的 SQL
npx prisma migrate diff \
  --from-schema-datamodel prisma/schema.prisma \
  --to-schema-datasource prisma/schema.prisma \
  --script
```

2. **执行迁移：**

```bash
# 生产环境只执行 deploy，不要用 dev
npx prisma migrate deploy

# 如果使用 CI/CD，可以在部署脚本中添加：
npx prisma migrate deploy && npx prisma generate && npm start
```

3. **回滚计划：**
   - 保留迁移前的数据库备份
   - 准备回滚 SQL 脚本（手动编写反向操作）
   - 必要时可以恢复备份并重新部署旧版本代码

## Prisma 的不足

### ORM 通病，对象关系不匹配

参看 [《Object–relational impedance mismatch》](https://en.wikipedia.org/wiki/Object%E2%80%93relational_impedance_mismatch)
但是在中小型简单业务中影响忽略不计

## Prisma 的优势

### 优秀的代码提示

<img src='https://images.yrobot.top/2021-06-30/jbsle4-16-57-42.png' alt='Prisma 在 VSCode 中的智能代码提示' width='600' />

> prisma-vscode: 不仅支持 prisma 相关 API 的 Snippets。
> 在运行 `migrate` 生成 database 之后，还支持数据库字段的代码提示。

### 优秀的数据库 GUI 管理工具 Prisma Studio

<img src='https://images.yrobot.top/2021-06-30/KeOrAp-17-17-51.png' alt='Prisma Studio 表格列表视图' width='600' />
<img src='https://images.yrobot.top/2021-06-30/bR6AzK-17-10-07.png' alt='Prisma Studio 数据编辑界面' width='600' />

> 可以在 Prisma Studio 查看有哪些表，查看表内数据。
> 支持 筛选，修改，暂存修改，保存修改，放弃修改，等等能力。

## 总结

### 核心要点回顾

1. **Prisma 是什么**
   - 基于 Node.js 和 TypeScript 的现代化 ORM 工具
   - 由 Prisma Client、Prisma Migrate、Prisma Studio 三部分组成
   - 提供类型安全的数据库操作体验

2. **使用 Prisma 的关键步骤**
   - 安装 Prisma 并初始化项目
   - 在 `schema.prisma` 中定义数据模型
   - 使用 `prisma migrate` 同步数据库结构
   - 通过 Prisma Client 进行 CRUD 操作

3. **Migrate 最佳实践**
   - 开发环境使用 `migrate dev` 快速迭代
   - 生产环境使用 `migrate deploy` 严格迁移
   - 迁移文件必须纳入版本控制
   - 生产迁移前务必备份数据库

4. **开发体验优势**
   - 优秀的 TypeScript 类型提示
   - 直观的 Prisma Studio 可视化工具
   - 链式对象操作，代码简洁优雅

### 适用场景

Prisma 特别适合以下场景：

- 中小型项目的快速开发
- TypeScript/Node.js 技术栈的后端服务
- 需要类型安全的团队协作项目
- 频繁迭代的原型开发

### 注意事项

- ORM 存在对象关系不匹配的通病，复杂查询可能需要原生 SQL
- 大型项目应评估 ORM 的性能影响
- 迁移操作需谨慎，特别是在生产环境

### 进一步学习

- [Prisma 官方文档](https://www.prisma.io/docs)
- [Prisma GitHub 仓库](https://github.com/prisma/prisma)
- [Prisma 最佳实践指南](https://www.prisma.io/docs/guides)
