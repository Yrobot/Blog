---
title: 使用Prisma搭建graphql服务
author: yrobot
keywords: Prisma,graphql,Nodejs,server,typegraphql,typegraphql-prisma
createTime: 2021年07月09日
draft: true
---

**本页目录：**  
[什么是 Prisma](#Prisma)  
[什么是 graphql](#graphql)  
[什么是 TypeGraphQL](#TypeGraphQL)  
[暴露部分接口](#graphql)  
[暴露部分字段](#graphql)  
[接口返回结构控制](#graphql)  
[接口传参控制](#graphql)  
[处理 Authorization](#graphql)

<a id='Prisma'></a>

## 什么是 Prisma

> Prisma 是一个基于 Nodejs 和 TypeScript 的 ORM

具体介绍和使用请参看前一期 blog[《Prisma 的简介和使用》](./Prisma的简介和使用)

<a id='graphql'></a>

## 什么是 graphql

> GraphQL 是一种针对 Graph（图状数据）进行查询特别有优势的 Query Language（查询语言）

具体介绍和使用请参看前一期 blog[《Prisma 的简介和使用》](./Prisma的简介和使用)

<a id='TypeGraphQL'></a>

## 什么是 TypeGraphQL

> The main idea of TypeGraphQL is to automatically create GraphQL schema definitions from TypeScript classes.

> TypeGraphQL 主要作用就是根据 TypeScript classes 自动生成 GraphQL schema

具体介绍和使用请参看 [TypeGraphQL 官网](https://typegraphql.com/)

## 实现 customer 接口，如 Login

使用 `type-graphql` 实现 customer resolver

> 查看 type-graphql 的 [Resolvers 教程](https://typegraphql.com/docs/resolvers.html)

```ts
import { Resolver, Query, Ctx, Arg, ObjectType, Field } from 'type-graphql';
import { AuthenticationError } from 'apollo-server';

import { encode } from '../auth';

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
  async login(@Ctx() { prisma }, @Arg('email') email: string, @Arg('password') password: string): Promise<Login> {
    const user = await prisma.user.findUnique({
      where: { email },
    });
    if (user?.password === password) {
      return {
        user: user,
        token: encode(user),
      };
    }
    throw new AuthenticationError('No such account or the password error');
  }
}
```

## 暴露部分接口

buildSchema `resolvers` 传参控制哪些接口对外暴露

```ts
import { UserCrudResolver, PostCrudResolver } from '@generated/type-graphql';
import LoginResolver from './LoginResolver';

const schema = await buildSchema({
  resolvers: [LoginResolver, UserCrudResolver, PostCrudResolver],
  validate: false,
});
```

## 接口返回结构控制

> 相关 issue [#Overwriting types classes](https://github.com/MichalLytek/typegraphql-prisma/issues/115)

## 接口入参校验

type-graphql 推荐配合 [class-validator](https://github.com/typestack/class-validator) 对参数进行校验,参看 [type-graphql#validation](https://typegraphql.com/docs/validation.html)

```ts
import { MaxLength, Length, IsEmail } from 'class-validator';
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

> 添加 email validation 后的效果

![](https://gitee.com/yrobot/images/raw/master/2021-07-22/rVDLKP-16-52-18.png)

## 接口入参结构控制

> 相关 issue [#Overwriting types classes](https://github.com/MichalLytek/typegraphql-prisma/issues/115)

## 接口使用 token 数据，如新建 blog 时直接绑定 token 内的 `user.id`

> 相关 issue [#Overwriting types classes](https://github.com/MichalLytek/typegraphql-prisma/issues/115)

> 相关 issue [#computedInputs](https://github.com/MichalLytek/typegraphql-prisma/issues/139)

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
  async login(@Ctx() { prisma }, @Arg('email') email: string, @Arg('password') password: string): Promise<Login> {
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
    throw new AuthenticationError('No such account or the password error');
  }
}
```

#### 利用 ApolloServer.context 检测 token，并解析 token 将数据传入 context

```ts
const prisma = new PrismaClient();
const server = new ApolloServer({
  schema: await getSchema(),
  context: ({ req }) => {
    let user = null;
    if (req.headers.authorization) user = decode(req.headers.authorization);
    return { user, prisma };
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
      publicField: 'Some public data',
      authorizedField: 'Data for logged users only',
      adminField: 'Top secret info for admin',
    };
  }

  @Authorized()
  @Query()
  authedQuery(): string {
    return 'Authorized users only!';
  }

  @Authorized('ADMIN', 'MODERATOR')
  @Mutation()
  adminMutation(): string {
    return 'You are an admin/moderator, you can safely drop the database ;)';
  }
}
```

typegraphql-prisma 使用 applyResolversEnhanceMap 控制对外接口的 Authorized 配置，参看 [typegraphql-prisma README](https://github.com/MichalLytek/typegraphql-prisma)

```ts
import { ResolversEnhanceMap, applyResolversEnhanceMap } from '@generated/type-graphql';
import { Authorized } from 'type-graphql';

const resolversEnhanceMap: ResolversEnhanceMap = {
  Category: {
    createCategory: [Authorized(Role.ADMIN)],
  },
};

applyResolversEnhanceMap(resolversEnhanceMap);
```

#### 利用 TypeGraphQL buildSchema 的 authChecker 处理请求权限判断

```ts
const authChecker: AuthChecker<ContextType> = ({ root, args, context, info }, roles) => {
  const role = context.user.role;
  return roles.includes(role); // false: access is denied
};
const schema = await buildSchema({
  resolvers: [MyResolver],
  authChecker: authChecker,
});
```

## 埋点 log
