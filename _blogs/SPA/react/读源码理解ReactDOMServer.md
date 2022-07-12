---
title: 读源码理解ReactDOMServer
author: yrobot
keywords: react,react-dom,renderToString,ReactDOMServer,源码,解读,jsx,html,转换
createTime: 2022年7月12日
---

## ReactDOMServer 的作用

> The ReactDOMServer object enables you to render components to static markup.

> ReactDOMServer 可以将 react 组件转换为静态的 html

所以，本文主要是为了弄明白 ReactDOMServer 如何将 react 转换为 html

```tsx
import React from "react";

const Header = () => <header className="header">Header</header>;
const Content = () => <section className="content">Content</section>;
const Footer = () => <footer className="footer">Footer</footer>;
const Page = () => (
  <div className="page">
    <Header />
    <Content />
    <Footer />
  </div>
);

export default Page;
```

=>

```ts
'<div class="page"><header class="header">Header</header><section class="content">Content</section><footer class="footer">Footer</footer></div>'
```
