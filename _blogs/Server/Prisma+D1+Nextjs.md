---
title: Prisma+D1+Nextjs
author: yrobot
keywords: Prisma,ORM,数据库,D1,Cloudflare,Pages,Nextjs,教程
createTime: 2024年07月29日 
---

> 最近发现 Cloudflare 比 vercel 量大，所以开始尝试使用 cloudflare pages 来部署自己的服务，并配合 cloudflare d1 来做数据存储

> 本文主要记录这三者的搭配思路和实践，以及解决这期间遇到的问题

> 本文思路：从目的出发，进行步骤拆解和实践

## 一些前置基础步骤

#### D1 新建数据库

```bash
bunx wrangler d1 create $DB_NAME
```
在你的 cloudflare 账户中建立一个 D1 数据库，名称为：$DB_NAME

#### Prisma 初始化工作

```bash
bunx prisma init --datasource-provider sqlite 
```

`prisma/schema.prisma`
```prisma
generator client {
  provider        = "prisma-client-js"
  previewFeatures = ["driverAdapters"] // 目前需要用 @prisma/adapter-d1 来讲 Prisma 适配到 D1 上
}

datasource db {
  provider = "sqlite"
  url      = "file:./dev.db" // No need for cloudflare D1
}
```

生成 prisma client 的 ts 类型文件

```bash
bunx prisma generate
```


## 目标1: 更新D1数据库表结构

> Prisma migrate 目前无法直接更新数D1据库表结构，需要配合 wrangler CLI 来对 D1 表进行更新

> 并且，为了确保 prisma client 的 ts 类型能够正常工作，需要优先在 schema.prisma 设计编写表结构，再将其映射到 D1 数据库表结构

#### 1. Prisma 添加 User 表

`prisma/schema.prisma`
```prisma
model User {
  id        Int      @id @default(autoincrement()) 
  username  String   @unique
  createdAt DateTime @default(now()) 
}
```

#### 2. 用 wrangler CLI 生成 D1 migrate 文件

```bash
bunx wrangler d1 migrations create $DB_NAME $MIGRATION_NAME
```

命令运行后，会生成一个 空的 `migrations/000n_$MIGRATION_NAME.sql` 文件。它用来储存此次 migration 的 sql 语句，你可以直接编写一些 更新 数据库表结构的 sql 语句在其中。

后续的 `prisma migrate diff` 命令 就是 把 更新 sql 写入到 `migrations/000n_$MIGRATION_NAME.sql` 文件。

#### 3. 将 Prisma schema 的结构更新 转化为 D1 的结构更新

本质就是将 schema.prisma 变更转化为 sql 语句，存入 `migrations/000n_$MIGRATION_NAME.sql` 文件中。

```bash
bunx prisma migrate diff $ACTION_TYPE --to-schema-datamodel ./prisma/schema.prisma --script > migrations/000n_$MIGRATION_NAME.sql
```
- `$ACTION_TYPE`:
  - `--from-empty`: The source for the SQL statement is an empty schema.
  - `--from-local-d1`: The source for the SQL statement is the local D1 database file.

#### 4. 将 `migrations/000n_$MIGRATION_NAME.sql` 应用到 D1 数据库

```bash
bunx wrangler d1 migrations apply $DB_NAME $ENV
```
- `$ENV`:
  - `--local`: For dev, Executes the statement against a local version of D1, This local version of D1 is a SQLite database file that will be located in the .wrangler/state directory of your project.
  - `--remote`: For Production, Executes the statement against your remote version of D1. This version is used by your deployed Cloudflare Workers.

### 阶段结果

会生成一个 sqlite 文件 作为本地 D1 数据库

如：`.wrangler/state/v3/d1/miniflare-D1DatabaseObject/6de0879fcb46a1de6a4d5f51906dc8254b3a1c18d7d21528ed6a5ed129c438a0.sqlite`

查看 这个 .sqlite 文件，会发现 其包含 一个 User 表，有 id\username\createdAt 3列。

## 目标2: 使用 Prisma Client 操作数据库

其实 这一步相对于 Prisma+sqlite 的难点 是，如何正确的获取 cloudflare 开发环境中的 DB 路径

由于生成的 sqlite 文件路径 不是固定的，所以 要配合 `@cloudflare/next-on-pages` 来实现 1. 测试环境和真实环境一样，利用 环境变量 暴露 DB path； 2. 项目逻辑里正确获取 这个环境变量来 实例化 prisma client


#### 1. 测试环境 暴露 DB 到环境变量
> 在运行 `next dev` 的同时，运行 测试环境 模拟暴露 DB 到环境变量 的逻辑

配置 next.config.mjs 添加 dev 副作用
`next.config.mjs`
```mjs
import { setupDevPlatform } from "@cloudflare/next-on-pages/next-dev";

if (process.env.NODE_ENV === "development") {
  await setupDevPlatform();
}

/** @type {import('next').NextConfig} */
const nextConfig = {};

export default nextConfig;
```


#### 2. 实例化 prisma client 时传入 DB

`utils/prisma.ts`
```ts
import { PrismaClient } from "@prisma/client";
import { PrismaD1 } from "@prisma/adapter-d1";
import { getRequestContext } from "@cloudflare/next-on-pages";

interface CloudflareEnv {
	DB: D1Database;
}

export const getPrisma = () => {
  const adapter = new PrismaD1(getRequestContext().env.DB);
  return new PrismaClient({ adapter });
};
```


### 阶段结果

prisma client 的操作就会正确的作用到 `.wrangler/state/v3/d1/miniflare-D1DatabaseObject/6de0879fcb46a1de6a4d5f51906dc8254b3a1c18d7d21528ed6a5ed129c438a0.sqlite` 上

## 目标3: 在 Next.js runtime='nodejs' 下获取 D1 环境变量

> "@cloudflare/next-on-pages" getRequestContext 目前只支持在 runtime=edge 环境下运行
> 如果 项目依赖在 edge 环境 无法运行 就会存在冲突

最合理的情况应该是 getRequestContext 也得支持 nodejs 环境，但是问题还没解决

#### 改为 使用 `cf-bindings-proxy` 获取测试环境 D1 环境变量

> 感谢作者
https://github.com/james-elicx/cf-bindings-proxy

#### 1. 使用 `cf-bindings-proxy` 服务暴露 D1

```bash
npx cf-bindings-proxy 
```

#### 2. 在本地环境 使用 `cf-bindings-proxy` 获取 D1 环境变量


```ts
import { binding } from "cf-bindings-proxy";
import type { D1Database } from "@cloudflare/workers-types";

declare global {
  namespace NodeJS {
    interface ProcessEnv {
      DB: D1Database;
    }
  }
}

const DB =
  process.env.NODE_ENV === "development" ? binding<D1Database>("DB") : process.env.DB;
```