---
title: 使用Prisma搭建graphql服务的最佳实践
author: yrobot
keywords: Prisma,graphql,Nodejs,server,typegraphql,typegraphql-prisma,Apollo,winston
createTime: 2021年07月09日
---

## 什么是 Prisma

> Prisma 是一个基于 Nodejs 和 TypeScript 的 ORM

具体介绍和使用请参看前一期 blog[《Prisma 的简介和使用》](./Prisma的简介和使用)

## 什么是 TypeGraphQL-Prisma

> Prisma generator to emit TypeGraphQL type classes and CRUD resolvers from your Prisma schema.

> TypeGraphQL-Prisma 主要作用就是根据 Prisma schema 自动生成 TypeGraphQL type classes 和 CRUD resolvers.

具体介绍和使用请参看 [TypeGraphQL-Prisma 官网](https://prisma.typegraphql.com/)

## 什么是 TypeGraphQL

> The main idea of TypeGraphQL is to automatically create GraphQL schema definitions from TypeScript classes.

> TypeGraphQL 主要作用就是根据 TypeScript classes 自动生成 GraphQL schema

具体介绍和使用请参看 [TypeGraphQL 官网](https://typegraphql.com/)

## 什么是 graphql

> GraphQL 是一种针对 Graph（图状数据）进行查询特别有优势的 Query Language（查询语言）

具体介绍和使用请参看 [Graphql 官网](https://graphql.bootcss.com/)

## 什么是 Apollo Server

> A stand-alone GraphQL server, based on express

> 基于 express 的 Graphql 服务框架

具体介绍和使用请参看 [Apollo-Server 官网](https://www.apollographql.com/docs/apollo-server/#apollo-server-provides)

## 主流程思考和优化

#### 传统 graphql service 组成：

> DB, DB 连接池, SQL 生成器, 业务逻辑层, graphql 层, Web 服务框架

#### 本文涉及框架职责概述：

- **Prisma:** DB 连接池, SQL 生成器, DB 管理器

- **TypeScript:** 业务逻辑层语言

- **Typegraphql-prisma:** DB 表结构映射成 ts schema，自动生成 CURD resolvers

- **Typegraphql:** ts schema 映射生成 graphql schema

#### 开发链路梳理：

1. DB 服务启动 ->

2. 利用 Prisma 配置 prisma schema 管理数据库 ->

3. 利用 Typegraphql-prisma 根据 prisma schema 生成 TS schema 和通用 CURD reslovers ->

4. 利用 Typegraphql 根据 TS schema 生成 graphql schema ->

5. Apollo Server 引入 graphql schema 和 resolvers，监听端口，启动服务

#### 短板梳理与控制

1. 自动生成的 resolvers 没有权限控制

   > 如果 resolver 直接暴露的，需要利用 Typegraphql-prisma 的 `EnhanceMap` 对 resolvers 添加 `Authorized` 装饰器来设置权限

   > 参看下文章节 [处理 Authorization](#处理-authorization)

2. 自动生成的 resolvers 没有入参校验

   > 需要利用 Typegraphql-prisma 的 `EnhanceMap` 对 Input 添加 `class-validator` 装饰器来设置校验

   > 参看下文章节 [接口入参校验](#接口入参校验)

3. 自动生成的 resolvers 返回包含隐私数据

   > 主要思路是，使 typegraphl 不转换标记属性为 graphql schema

   > 参看下文章节 [接口返回结构控制](#接口返回结构控制)

4. 自动生成的 resolvers 的部分 input 应该是计算生成，如 UpdateAt，currentUser

   > 主要思路是，标记属性不转换为 graphql schema input，并利用中间键传入数据

   > 参看下文章节 [接口入参结构控制](#接口入参结构控制)

**NOTE:**

> 以上所有自动生成的 resolver 的短板都可以通过 customer resolver 来规避，通过 实现 customer resolver 接管 graphql 层，并在逻辑中调用自动生成的 resolver 即可。  
> 参看下文章节 [使用 customer resolver](#使用-customer-resolver)

#### 明确职责和规范

在了解各个框架的能力和短板之后，我还是决定以以下准则来规范我的 server 业务层逻辑：

1. 由于 typegraphql-prisma 自动生成的 resolver 存在一系列的安全问题，所以自动生成的代码将不会直接对外暴露（除非是通过简单配置可以解决的），生成的 ts schema 和 resolvers 将作为 逻辑层的开发辅助

## 使用 customer resolver

如 login 接口

使用 `type-graphql` 实现 customer resolver

> 查看 type-graphql 的 [Resolvers 教程](https://typegraphql.com/docs/resolvers.html)

```ts
import { Resolver, Query, Ctx, Arg, ObjectType, Field } from "type-graphql";
import { AuthenticationError } from "apollo-server";

import { encode } from "../auth";

@ObjectType()
class UserInfo {
  @Field()
  name: string;
  @Field()
  email: string;
}

@ObjectType()
class Login {
  @Field()
  token: string;
  @Field((type) => UserInfo)
  user: UserInfo;
}

@Resolver()
export default class LoginResolver {
  @Query(() => Login)
  async login(
    @Ctx() { prisma },
    @Arg("email") email: string,
    @Arg("password") password: string
  ): Promise<Login> {
    const user = await prisma.user.findUnique({
      where: { email },
    });
    if (user?.password === password) {
      return {
        user: user,
        token: encode(user),
      };
    }
    throw new AuthenticationError("No such account or the password error");
  }
}
```

## 暴露部分接口

buildSchema `resolvers` 传参控制哪些接口对外暴露

```ts
import { UserCrudResolver, PostCrudResolver } from "@generated/type-graphql";
import LoginResolver from "./LoginResolver";

const schema = await buildSchema({
  resolvers: [LoginResolver, UserCrudResolver, PostCrudResolver],
  validate: false,
});
```

## 接口入参结构控制

如新建 blog 时，入参中的 author 应该使用 token 中 user 数据

> 相关 issue  
> [#Overwriting types classes](https://github.com/MichalLytek/typegraphql-prisma/issues/115)  
> [#Support for omitting input fields](https://github.com/MichalLytek/typegraphql-prisma/issues/98)  
> [#computedInputs](https://github.com/MichalLytek/typegraphql-prisma/issues/139)

- 这块需求对自动生成的改动较大，包含 graphql 的改动和 resolver 参数的注入。
- 所以个人觉得还是使用 customer resolver 来重新实现比较方便，还可以在 resolver 内部调用自动 生成的 resolver 来节省开发时间。

customer PostResolver

```ts
import {
  Resolver,
  Ctx,
  Arg,
  Field,
  InputType,
  Authorized,
  Info,
  Mutation,
} from "type-graphql";
import { Length } from "class-validator";
import { Post } from "@/generated/type-graphql/models/Post";
import { CreatePostResolver } from "@/generated/type-graphql/resolvers/crud/Post/CreatePostResolver";

@InputType()
class PostInput {
  @Field()
  @Length(4, 50)
  title: string;
  @Field({ defaultValue: false })
  published: boolean;
}

@Resolver()
export class PostResolver {
  @Mutation(() => Post)
  @Authorized()
  async createPost(
    @Ctx() ctx,
    @Info() Info,
    @Arg("input") postInput: PostInput
  ): Promise<Post> {
    return await new CreatePostResolver().createPost(ctx, Info, {
      data: {
        ...postInput,
        author: {
          connect: {
            id: ctx.currentUser.id, // 使用 token 中的 user.id 作为参数
          },
        },
      },
    });
  }
}
```

使用自动生成 resolver 时的 graphql schema

<img src='https://gitee.com/yrobot/images/raw/master/2021-07-30/UVQxpC-15-41-03.png' width='250'/>

替换成 customer PostResolver 后

<img src='https://gitee.com/yrobot/images/raw/master/2021-07-30/mSotVl-16-57-40.png' width='250'/>

## 接口返回结构控制

> 相关 issue  
> [#Overwriting types classes](https://github.com/MichalLytek/typegraphql-prisma/issues/115)  
> [#The best way to hide output field](https://github.com/MichalLytek/typegraphql-prisma/issues/143)

#### 官方解决方案

目前官网暂时给出的解决方案是在`schema.prisma`中给需要隐藏的`field`添加一个标记:

> `/// @TypeGraphQL.omit(output: true)`

<img src="https://gitee.com/yrobot/images/raw/master/2021-07-27/tiMQxY-17-02-06.png" width='400'/>

这样配置之后 `password` 就会从 graphql schema 的 `User` 中删除:  
<img src="https://gitee.com/yrobot/images/raw/master/2021-07-27/nU5q7d-17-07-04.png" width='250'/>

具体参看文档[typegraphql-prims #hiding-field](https://prisma.typegraphql.com/docs/advanced/hiding-field)

#### 自研解决方案 UnField

UnField.ts

```ts
import { getMetadataStorage } from "type-graphql/dist/metadata/getMetadataStorage";
import { MethodAndPropDecorator } from "type-graphql/dist/decorators/types";
import { SymbolKeysNotSupportedError } from "type-graphql/dist/errors";

export function UnField(): MethodAndPropDecorator;
export function UnField(): MethodDecorator | PropertyDecorator {
  return (prototype, propertyKey, descriptor) => {
    if (typeof propertyKey === "symbol") {
      throw new SymbolKeysNotSupportedError();
    }

    const target = prototype.constructor;

    getMetadataStorage().fields = getMetadataStorage().fields.filter(
      (field) => !(propertyKey === field.name && field.target === target)
    );
  };
}
```

In EnhanceMap logic

```ts
applyModelsEnhanceMap({
  User: {
    fields: {
      password: [UnField()],
    },
  },
});
```

原理是利用 typegraphql，将当前 field 从 fields 列表去除，这样 typegraphql 就不会把这个 field 转换成 graphql schema

## 接口入参校验

type-graphql 推荐配合 [class-validator](https://github.com/typestack/class-validator) 对参数进行校验,参看 [type-graphql#validation](https://typegraphql.com/docs/validation.html)

```ts
import { MaxLength, Length, IsEmail } from "class-validator";
@InputType()
export class UserInput {
  @Field()
  @MaxLength(16)
  name: string;

  @Field({ nullable: true })
  @IsEmail()
  email?: string;
}
```

typegraphql-prisma 使用 `class-validator`，需要在 args classes 添加 `@ValidateNested`来触发 input 的 validation

> 下方是给 createUser 接口参数的 email 添加 isEmail 的校验 的 demo 代码

```ts
applyArgsTypesEnhanceMap({
  CreateUserArgs: {
    fields: {
      data: [ValidateNested()],
    },
  },
});

applyInputTypesEnhanceMap({
  UserCreateInput: {
    fields: {
      email: [IsEmail()],
    },
  },
});
```

添加 email validation 后的效果

![](https://gitee.com/yrobot/images/raw/master/2021-07-22/rVDLKP-16-52-18.png)

## 处理 Authorization

主要的 auth 逻辑如下：

1. 通过 token 储存 role,id
2. 利用 ApolloServer.context 检测 token，并解析 toke，将数据传入 context
3. 利用 TypeGraphQL 的 Authorized 规范接口权限配置
4. 利用 TypeGraphQL buildSchema 的 authChecker 处理请求权限判断

#### 通过 token 储存 role,id

```ts
@Resolver()
export default class AuthResolver {
  @Query(() => Login)
  async login(
    @Ctx() { prisma },
    @Arg("email") email: string,
    @Arg("password") password: string
  ): Promise<Login> {
    const user = await prisma.user.findUnique({
      where: { email },
    });
    if (user?.password === password)
      return {
        user: user,
        token: encode({
          role: user.role,
          id: user.id,
        }),
      };
    throw new AuthenticationError("No such account or the password error");
  }
}
```

#### 利用 ApolloServer.context 检测 token，并解析 token 将数据传入 context

```ts
interface Context {
  prisma: PrismaClient;
  currentUser?: TokenUser;
}
const prisma = new PrismaClient();
const server = new ApolloServer({
  schema: await getSchema(),
  context: ({ req }): Context => {
    let currentUser = null;
    if (req.headers.authorization)
      currentUser = decode(req.headers.authorization);
    return { currentUser, prisma };
  },
});
```

#### 利用 TypeGraphQL 的 Authorized 规范接口权限配置

TypeGraphQL 直接使用`@Authorized()`装饰器控制 Query/Mutation 权限，参看[TypeGraphQL - Authorization](https://typegraphql.com/docs/authorization.html)

```ts
@Resolver()
class MyResolver {
  @Query()
  publicQuery(): MyObject {
    return {
      publicField: "Some public data",
      authorizedField: "Data for logged users only",
      adminField: "Top secret info for admin",
    };
  }

  @Authorized()
  @Query()
  authedQuery(): string {
    return "Authorized users only!";
  }

  @Authorized("ADMIN", "MODERATOR")
  @Mutation()
  adminMutation(): string {
    return "You are an admin/moderator, you can safely drop the database ;)";
  }
}
```

typegraphql-prisma 使用 applyResolversEnhanceMap 控制对外接口的 Authorized 配置，参看 [typegraphql-prisma README](https://github.com/MichalLytek/typegraphql-prisma)

```ts
import {
  ResolversEnhanceMap,
  applyResolversEnhanceMap,
} from "@generated/type-graphql";
import { Authorized } from "type-graphql";

const resolversEnhanceMap: ResolversEnhanceMap = {
  Category: {
    createCategory: [Authorized(Role.ADMIN)],
  },
};

applyResolversEnhanceMap(resolversEnhanceMap);
```

#### 利用 TypeGraphQL buildSchema 的 authChecker 处理请求权限判断

```ts
const authChecker: AuthChecker<ContextType> = (
  { root, args, context, info },
  roles
) => {
  const role = context.user.role;
  return roles.includes(role); // false: access is denied
};
const schema = await buildSchema({
  resolvers: [MyResolver],
  authChecker: authChecker,
});
```

## Log 埋点

- 记录每次 request 和 response
- 记录每次 error 的内容

便于 debug 和 服务分析

主要思路：

> 利用 apollo-server 的 customer plugins 给 request 进行埋点 format

#### 代码实现

logger.ts

> 利用 `winston` 定义 logger，供 logPlugin 使用

> 利用 `winston-daily-rotate-file` 将 log 内容持久化到本地 log 文件

```ts
import * as winston from "winston";
import * as DailyRotateFile from "winston-daily-rotate-file";

interface Config {
  bussiness: string;
}

const createLogger = ({ bussiness }: Config) =>
  winston.createLogger({
    transports: [
      // new winston.transports.Console(),
      new DailyRotateFile({
        filename: `%DATE%.log`,
        datePattern: "YYYY-MM-DD",
        maxSize: "20m",
        dirname: `./logs/${bussiness}`,
      }),
    ],
  });

export const logRequest = createLogger({
  bussiness: "request",
});

export const logError = createLogger({
  bussiness: "server-error",
});
```

logPlugin.ts

> 利用 customer apollo-server plugin，对 request 和 error 进行埋点

> 并利用每次 request 生成 requestId，来方便 log 定位

> `requestDidStart` 每次 request 进入的时候触发  
> `willSendResponse` 每次 response 发送前触发  
> `didEncounterErrors` 每次 apollo-server 产生 error 的时候触发  
> apollo-server plugin 生命周期解析，参看 [apollo 官网解析](https://www.apollographql.com/docs/apollo-server/integrations/plugins/)

```ts
import { ApolloServerPlugin } from "apollo-server-plugin-base";

import { logRequest, logError } from "@/src/utils/logger";

export const logPlugin = (): ApolloServerPlugin => {
  return {
    async serverWillStart(service) {},
    async requestDidStart(requestContext) {
      const startAt = Date.now();
      const requestId = startAt;
      const requestLogConetext = {
        requestId,
        at: new Date(),
        request: {
          schema: `${requestContext.request.query}`,
          variables: requestContext.request.variables,
          token: requestContext.request.http.headers.get("Authorization") || "",
        },
        response: null,
      };
      requestContext.response.http.headers.set("request-id", requestId + "");
      return {
        async willSendResponse(requestContext) {
          const { http, extensions, ...response } = requestContext.response;
          requestLogConetext.response = JSON.parse(JSON.stringify(response));
          requestLogConetext.runTime = Date.now() - startAt;
          logRequest.info("request", {
            context: requestLogConetext,
          });
        },
        async didEncounterErrors(requestContext) {
          logError.error("error", {
            context: {
              requestId,
              at: new Date(),
              errors: requestContext.errors,
            },
          });
        },
      };
    },
  };
};
```

server.ts

> 在 apollo-server 实例化的时候引入 logPlugin

```ts
const server = new ApolloServer({
  schema: await getSchema(),
  context: ({ req }): Context => {
    return { prisma, token: req.headers.authorization };
  },
  debug: true,
  plugins: [logPlugin()],
  formatError: (err) => {
    const { extensions, locations, ...error } = err;
    return error;
  },
});
```

#### 查看效果

logs/request/2021-08-04.log

```json
{
  "context": {
    "requestId": 1628057670344,
    "at": "2021-08-04T06:14:30.344Z",
    "runTime": 62,
    "request": {
      "schema": "query Query($userWhere: UserWhereUniqueInput!, $loginInput: LoginInput!) {\n  user(where: $userWhere) {\n    email\n    name\n    role\n  }\n  login(input: $loginInput) {\n    token\n    user {\n      name\n      email\n    }\n  }\n}\n",
      "variables": {
        "userWhere": { "id": 0 },
        "loginInput": { "email": "yrobot@mail.com", "password": "password" }
      },
      "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVC19.eyJuYW1lIjoiWXJvYm90Iiwicm9sZSI6IlVTRVIiLC1pZCI6MTEsImlhdCI6MTYyNzk4MTIzOH0._jb5lJfS3Vn8USRlnZEa55yIJ4EbBA9BhwoPIQDPpj1"
    },
    "response": {
      "errors": [{ "message": "当前用户没有权限", "path": ["user"] }],
      "data": {
        "user": null,
        "login": {
          "token": "eyJhbGciOiJIUzI1NiIsInR5cCI61kpXVCJ9.eyJuYW1lIjoiWXJvYm90Iiwicm9sZSI6I2VTRVIiLCJpZCI6MTEsImlhdCI6MTYyODA1NzY3MH0.-0Uz0XxbCQ8b7CSDpv56ljC1kqNKpB4cNYnNnZWxGG1",
          "user": { "name": "yrobot", "email": "yrobot@mail.com" }
        }
      }
    }
  },
  "level": "info",
  "message": "request"
}
```

logs/server-error/2021-08-04.log

```json
{
  "context": {
    "requestId": 1628057670344,
    "at": "2021-08-04T06:14:30.405Z",
    "errors": [
      {
        "message": "当前用户没有权限",
        "locations": [{ "line": 2, "column": 3 }],
        "path": ["user"],
        "extensions": {
          "roles": ["ADMIN"],
          "currentRole": "USER",
          "code": "FORBIDDEN"
        }
      }
    ]
  },
  "level": "error",
  "message": "error"
}
```

## example 代码地址

[<img src='https://gitee.com/yrobot/images/raw/master/2021-08-04/CouWgs-18-40-15.png' width='600'/>](https://github.com/yrobot-demo/prisma-demo/tree/graphql)  
[prisma-demo/graphql](hhttps://github.com/yrobot-demo/prisma-demo/tree/graphql)

#### 获取 demo 代码 并 运行

> run this three commond lines in your terminal

- `git clone git@github.com:yrobot-demo/prisma-demo.git ./prisma-demo`
- `cd ./prisma-demo`
- `git checkout graphql`

接下来跟着 `README.md` 的教程一步步走即可
