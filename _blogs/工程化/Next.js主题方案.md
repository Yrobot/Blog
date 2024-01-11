---
title: Next.js主题方案
author: yrobot
keywords: 前端,多语言,Next.js,theme,探讨,SSG,SSR,主题
createTime: 2023年11月28日
---

## 简介

本文主要是探讨 最适合 Next.js（SSG、SSR）的 主题方案。

## 当前流行的一些主题方案

### daisyui 官网的 主题方案

[daisyui](https://daisyui.com/) 官网使用的是 svelte，其最核心的主题方案是在 html head 中插入一个 会阻塞 html 解析的 script 来初始化 theme：

```html
<script>
  try {
    document.documentElement.setAttribute(
      "data-theme",
      localStorage.getItem("theme")
    );
  } catch (e) {}
</script>
```

在初始化完 theme 之后再解析 html，所以 1. 页面能正常展示对应的 theme 2. 切换页面时不会闪烁

### NextUI 的 主题方案

[NextUI](https://nextui.org/) 官网使用的是 Next.js，他的 theme 控制用的方案 是 [`next-themes`](https://github.com/pacocoursey/next-themes)

https://github.com/pacocoursey/next-themes

#### 注意点

- `import {ThemeProvider} from "next-themes";` 需要在 'use client' 下使用？
- 但好像不影响 SSR，Provider 内部的组件即使停用浏览器 js，也能正常渲染（html 已经在服务端生成了）（不过 theme 的不正确，所以初始化设置 theme 的逻辑还是和 daisyui 的方案一样利用 script 更新 css 变量）

#### 疑惑点

- 'use client' 到底对组件的影响是什么？
