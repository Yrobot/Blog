---
title: Next.js SSG 国际化方案
author: yrobot
keywords: 前端,多语言,Next.js,国际化,探讨,international,SSG,static,export
createTime: 2022年09月08日
---

## 为什么 Next.js 国际化路由还不支持 SSG

看到 Next.js 国际化路由，支持的能力包括很多需要服务端逻辑支持的能力，比如 域名国际化策略，accept-language 探测，cookie 更新语言探测策略，

这些能力都是 SSG 无法支持的

## SSG 下的国际化 是什么样的

正如上一篇文章 [《前端多语言国际化方案探讨》](./前端多语言国际化方案探讨) 中提到的

|                           | 客户端修改           | 部署要求               | 其他                               |
| ------------------------- | -------------------- | ---------------------- | ---------------------------------- |
| 利用 Accept-Language 分发 | 客户端 js 无法修改   | 需要服务端进行逻辑分发 |
| 利用 域名 分发            | 利用重定向设置       | 需要服务端进行逻辑分发 | 不同域名的资源无法缓存（流量浪费） |
| 利用 路由 分发            | 利用重定向设置       | 无需服务端支持         |
| 利用 cookie 分发          | 通过更新 cookie 修改 | 需要服务端进行逻辑分发 |

只有 `利用 域名 分发` 是纯前端的可以实现，其他的能力都需要服务端逻辑加持。

所以 SSG 前提下，我们能做到的，便是根据配置化的语言宽度 动态生成 多个 html：

- `/` => `/en`,`/ch`,`/jp`
- `/console` => `/en/console`,`/ch/console`,`/jp/console`

而这些页面的 资源文件 都是可以直接复用的。

## 实现方案设计

首先 动态路由 可以用来为一个 页面 生成 多个语言 html。

```
.
└── pages
    └── [locale]
        ├── index.tsx
        └── console.tsx
```

利用 `getStaticPaths` 将 locale 列表暴露

```ts
export async function getStaticPaths() {
  return {
    paths: ["en", "ch", "jp"].map((lng) => ({
      params: {
        locale: lng,
      },
    })),
    fallback: false,
  };
}
```

利用 `getStaticProps` 将 语言数据暴露给 i18n 实例

```ts
export async function getStaticProps(ctx) {
  const locale = ctx?.params?.locale;
  return {
    props: await getI18nProps(locale, ["common", "home"]),
  };
}
```

`getI18nProps`: 获取当前语言和对应模块，将语言数据上下文传入 Page 组件，供 i18next 进行初始化

```ts
//
const getI18nProps = async (
  initialLocale: string,
  namespacesRequired: string[] | undefined = undefined
): Promise<SSRConfig> => {
  return {
    _i18n: {
      resources,
      lng,
    },
  };
};
```

在 client 获取 获取上下文，并初始化 i18next

```ts
import React, { useMemo } from "react";
import i18n from "i18next";
import { initReactI18next, I18nextProvider } from "react-i18next";

const appWithTranslation = (Page) => {
  const I18nWrapper = (props: Props) => {
    const { _i18n } = props.pageProps as SSRConfig;
    let lng: string | null = _i18n?.lng ?? props?.router?.locale;
    const resources = _i18n?.resources;

    const i18n = useMemo(
      () =>
        i18n
          .use(initReactI18next) // bind react-i18next to the instance
          .init({
            resources,
            lng,
          }),
      [locale, ns]
    );

    return (
      <I18nextProvider i18n={i18n}>
        <Page key={locale} {...props} />
      </I18nextProvider>
    );
  };
  return I18nWrapper;
};

const App = (props) => {
  // page logic ...
  return <></>;
};

export default appWithTranslation(App);
```

## 方案存在问题

- `/`,`/console`将失效

## 参考文献

- [《Internationalized Routing》- Next.js](https://www.nextjs.cn/docs/advanced-features/i18n-routing)
- [《Static HTML Export with i18n compatibility in Next.js》](https://locize.com/blog/next-i18n-static/)
