---
title: 使用tailwindcss开发web-component
author: yrobot
keywords: web component,tailwind,css,lit,svelte,js,ts,vite
createTime: 2024年03月05日
---

## 需求明确

最近由于个人主站和产品详情页架构设计优化，遇到需要主站暴露 web component，在产品详情页引入使用的需求。

由于一直以来都是用 tailwindcss 开发页面，并且旧的主站也是用 tailwind 开发的，所以根据成本考虑 希望可以继续沿用 tailwindcss 来开发 web component。

而且为了展示一致性考虑，由于 shadow dom 可以穿透 css 变量，所以 主题可以应用到 web component 中，内外皆是同一种 css 方案可以规避很多主题问题。

所以目前就要寻求一种可以使用 tailwindcss 开发 web-component 的方案。

## 是否需要 shadow dom

shadow dom 在 带来一些好处的同时会引起一些麻烦

### shadow dom 的作用

1. 支持 slot，可以将 html 内容插入到 web component 中
2. css js 隔离，外部 css 不会影响 web component

### shadow dom 的成本

1. 内部样式才能生效：
   - 必须从 web component 内部引入样式
   - 外部无法通过覆盖样式来修改展示
2. 外部无法直接进行 dom 操作

所以对于是否需要用 shadow dom 构建 web component，需要根据现实需求来决定

在我的需求场景下，需要 slot 功能，所以选用 shadow dom 构建 web component

## 如何为 web component 添加样式

### 未使用 shadow dom

和普通页面开发一样，直接利用 inline css 或者 link 引入的形式，在 html 中引入需要的 css 即可

### 使用 shadow dom

1. inline style

```js
this.shadowRoot.innerHTML = `
<style>
  :host {
    display: block;
  }
</style>
<div />
`;
```

2. link 引入

```js
this.shadowRoot.innerHTML = `
<link rel="stylesheet" href="/style.css" />
<div />
`;
```

## 一些思考

### 可行性节点罗列

#### dev 流程 + 打包流程 两者可行性分析

dev 环境下，tailwind 生成内容，会以 inline style 的形式插入到 head 中

#### 扫描 html，生成 tailwind css output（打包时/运行时）

```html
<div class="h-4 w-12 bg-black"></div>
```

=>

```css
.h-4 {
  height: 1rem;
}
.w-12 {
  width: 3rem;
}
.bg-black {
  --tw-bg-opacity: 1;
  background-color: rgb(0 0 0 / var(--tw-bg-opacity));
}
```

**打包时的生成是最完美的**，这样可以只打包 html 中用到的 css，做到 css 最精简。

而 运行时的生成，需要将整个 tailwindcss 字典/生成逻辑 打包到 js 中，然后在运行时扫描 html 再生成 css，导致打包内容会大很多，而且运行时效率也下降（需要运行时生成完 css 才能展示 web component）

#### 将 css output 注入 web component

inline style 或 link 引入

## 最佳方案评定

由于用到 tailwindcss，所以最佳方案肯定经历打包流程（根据 content 生成最精简的 tailwindcss output），并且 content 是可以根据每次的打包 entry 动态生成的（只将当前 component 里用到的 css 打包进去）。最终 css 通过 inline style 或者 link 引入都可以。

```ts
class MyWebComponent extends HTMLElement {
  constructor() {
    // @tailwind base; 会引入大量覆盖默认样式的 css，所以默认不引入。建议直接手动覆盖默认样式
    const style = `
    @tailwind components;
    @tailwind utilities;
    `;
    const html = `
    <style>${style}</style>
    <div class="h-4 w-12 bg-black"></div>
    `;
    const template = document.createRange().createContextualFragment(html);
    this.attachShadow({ mode: "open" }).append(template);
  }
}
```

经历打包流程呢后可以输出为：

```ts
class MyWebComponent extends HTMLElement {
  constructor() {
    const style = `
    .h-4 {
      height: 1rem;
    }
    .w-12 {
      width: 3rem;
    }
    .bg-black {
      --tw-bg-opacity: 1;
      background-color: rgb(0 0 0 / var(--tw-bg-opacity));
    }
    `;
    const html = `
    <style>${style}</style>
    <div class="h-4 w-12 bg-black"></div>
    `;
    const template = document.createRange().createContextualFragment(html);
    this.attachShadow({ mode: "open" }).append(template);
  }
}
```

## 可行方案分析

### svelte [推荐]

#### 官方 web component 支持

https://svelte.dev/docs/custom-elements-api

在 dev 环境和打包环境下，都支持 web component 流程

#### tailwindcss 支持

经过测试，在 svelte component 里使用 tailwind，css output 会被直接打包到 component 文件中（inline style），这符合 web component 的样式规范，打包体积和运行效率最佳。（dev 环境和打包环境结果一致）

#### daisyui 支持

由于直接使用 tailwind，所以 daisyui 也可以被完全支持

#### 方案 demo

https://github.com/Yrobot/svelte-to-web-components

```
dist
├─index.html
├─wc
| ├─my-badge.js
| ├─my-button.js
| └my-dropdown.js
├─assets
|   ├─app.css
|   ├─app.js
|   └index-DfBbDRyK.js
```

打包结果 `dist/wc/*` 中的所有 web components 都可以直接使用

### React

目前官方还没有一套 React Component 生成 Web Component 的标准方案

听说会在 React19 推出一个方案

不过很好奇 React 组织要怎么解决 React 运行时体积大的问题，因为这会导致打包完的 web component 初始体积就比别的方案大很多

### Vue3

和 React 一样，vue 打包后核心文件体积相对较大，可能超过主要交互逻辑和样式的代码体积

#### 官方 web component 支持

https://vuejs.org/guide/extras/web-components

## 参考资料

- https://github.com/tailwindlabs/tailwindcss/discussions/7217#discussioncomment-2123754
- https://dev.to/43081j/using-tailwind-at-build-time-with-web-components-1bhm
- https://dev.to/43081j/using-tailwind-at-run-time-with-web-components-47c
