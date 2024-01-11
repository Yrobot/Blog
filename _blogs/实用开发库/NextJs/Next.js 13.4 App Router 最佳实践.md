---
title: Next.js 13.4 App Router 最佳实践
author: yrobot
keywords: app router,最佳实践,Next.js,server component,client component
createTime: 2023年08月19日
---

NOTE: 阅读此文前需要有一定的 Next.js 使用经验，对旧版本的 Next.js 有一定了解。

## Next.js 13.4 更新了什么特性

https://nextjs.org/blog/next-13-4

主要更新了 3 大特性：

1. App router
   - React Server Components
   - Nested Routes & Layouts
   - Simplified Data Fetching
   - Streaming & Suspense
   - Built-in SEO Support
2. Turbopack
3. Server Actions

### App Router

#### React Server Components

旧的 pages router 实现：

```ts
// Pages Router
// pages/index.ts
import React from "react";
export default () => <h1>Hello, Next.js!</h1>;
```

新的 App Router 实现：

```ts
// New: App Router ✨
// app/page.ts
export default async function Page() {
  return <h1>Hello, Next.js!</h1>;
}
```

主要的更新点如下：

1. 当前路由的页面文件名由 `xxx/index.ts` 变为了 `xxx/page.ts`
2. 组件支持 async 函数，可以直接在组件内部进行异步操作（因为 app router 的组件默认是 server component，他只运行在 server 的 node 环境中）

##### Server Component 和 Client Component 的区别

[![EVDtVM-20-25-08](https://images.yrobot.top/2023-08-19/EVDtVM-20-25-08.png)](https://nextjs.org/docs/getting-started/react-essentials)

##### Server Component 的好处和限制

好处：

- 异步依赖可以直接在组件内部直接使用 await 请求，代码逻辑更清晰
- 数据直接嵌入 html 中，无需再次请求（接口安全和数据精简）
- 请求直接在 server 端完成，页面初始化时间更短（减少了一次 server-client 的请求时间和 react 初始化时间）（可以使用 Suspense(xxx/loading.ts) 来优化页面加载体验）
- server component 的 大依赖只在 server 端引入，不会打包到 js 里，减少了客户端下载压力

### 实际上组件作为 server/client component 处理 和 jsx 渲染的结构（组件树结构）无关，而是和 import 相关联

所以 client component 中不要直接 `import` server component，而是在 client 上层通过 props 传入 子 server component 的实例。

```tsx
// app/layout.tsx
import "./globals.css";
import ThemeContextProvider from "./ThemeContext"; // client component

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <ThemeContextProvider>{children}</ThemeContextProvider>
      </body>
    </html>
  );
}
```

#### 所以可以将一些 client 逻辑独立出来做一个 Wrapper 组件，来最大化 server component 的好处

```tsx
// ListPage.tsx

import { fetchList } from "@/services";
import { DeleteItemWrapper } from "@/clientActions"; // client component

const ItemView = ({ item }) => {
  return (
    <div>
      // ...
      <DeleteItemWrapper id={item.id}>
        <button>Delete</button> // 可能有一些复杂的format逻辑，放在server
        component里可以减少js包大小
      </DeleteItemWrapper>
      // ...
    </div>
  );
};

export default async function ListPage() {
  const list = await fetchList();
  return (
    <main>
      {list.map((item) => (
        <ItemView item={item} />
      ))}
    </main>
  );
}
```

### Turbopack

### Server Actions

## 一些开发场景和技巧

### Server Component 列表页 下滑加载更多

#### 问题思考

1. 为了最好的用户体验和 SEO，SSR 返回的 html 应该包含默认的 10 条数据
2. 下滑加载更多需要用到 DOM 操作，所以需要在 使用 Client Component 实现

#### 方案设计

1. 先在 server component 中初始化 10 条数据 作为 SSR 的数据
2. 在 List 组件中使用 Client Component 实现下滑加载更多的逻辑

#### 实现

```tsx
// app/page.tsx
import List from "./List";

const fetchList = async ({ offset }: { offset?: number } = {}) => {
  "use server";
  const list = await db.list({ offset });
  return list;
};

export default async function Home() {
  const list = await fetchList(); // get 10 items as default data
  const total = await db.total(); // get total count
  return (
    <main className="p-4">
      <List initialItems={list} fetch={fetchList} total={total} />
    </main>
  );
}
```

```tsx
// app/List.tsx
import React, { useState } from "react";
import InfiniteScroll from "react-infinite-scroller";

const PAGE_SIZE = 10;
export default function List({ initialItems, fetch }) {
  const [pages, setPages] = useState<Product[][]>([initialItems]);
  const items = pages.flat();
  return (
    <InfiniteScroll
      loadMore={async (page: number) => {
        const data = await fetch({ offset: page * PAGE_SIZE });
        setPages((prev) => [...prev, data]);
      }}
    >
      {items.map((product) => (
        <ListCard key={product.id} {...product} />
      ))}
    </InfiniteScroll>
  );
}
```
