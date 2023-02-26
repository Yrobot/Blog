---
title: 在Next.ts中使用ServiceWorker
author: yrobot
keywords: ts,service worker,next.js
createTime: 2023年2月21日
---

## 想在 Next.ts 里加入 Service Worker 所遇到的困难

1. service worker ts 开发 self 类型报错
2. next.js 静态资源需要动态生成(sw.ts 编译为 sw.js 后放入 /public)

### 相关 issues 和 discussions

[#46158 - How to update the next.config.js to support compiling ts file to output public folder](https://github.com/vercel/next.js/discussions/46158)

[#33863 - Be able to create service-worker in typescript](https://github.com/vercel/next.js/issues/33863)

## 解决方案主要思路

1. 先利用 rollup 将 sw.ts 转化 public/sw.js
2. 利用 next.js 的能力，将 sw.js 作为静态资源发布
3. 利用 package.json 的 scripts 将 命令合并为一个

## 实操

### 1. 配置 service worker 的 tsconfig.json

ts 代码提示所需

`service-worker/tsconfig.json`

```json
{
  "compilerOptions": {
    "lib": ["ES6", "WebWorker"]
  },
  "include": ["**/*.ts"],
  "files": ["sw.ts"]
}
```

### 安装 并 配置 rollup

#### 安装 rollup 和相关插件

```bash
yarn add -D rollup rollup-plugin-ts @rollup/plugin-typescript @rollup/plugin-node-resolve
```

#### 配置 rollup 编译 ts

将 `service-worker/sw.ts` 打包为 `public/sw.js`

`rollup.config.ts`

```ts
import ts from "rollup-plugin-ts";
import { nodeResolve } from "@rollup/plugin-node-resolve";

/** @type {import('rollup').RollupOptions} */
export default {
  input: "service-worker/sw.ts",
  output: {
    dir: "public",
    format: "cjs",
    name: "sw",
  },
  plugins: [
    ts({
      tsconfig: "service-worker/tsconfig.json",
    }),
    nodeResolve(),
  ],
};
```

### 2. 添加 输出 sw.js 的命令

`package.json`

```json
{
  // ...
  "scripts": {
    "sw:dev": "yarn sw:build -w",
    "sw:build": "rollup --config ./rollup.config.ts --configPlugin typescript",
    "dev": "yarn sw:dev & next dev",
    "build": "yarn sw:build & next build && next export -o build"
  }
  // ...
}
```

### 3. 将 public/sw.js 和 临时文件 加入 .gitignore

`.gitignore`

```bash
# build output files
public/sw.js

# build temp files
.rollup.cache
tsconfig.tsbuildinfo
```

### 4. sw.ts 支持 tsc 和类型检测

`service-worker/sw.ts`

```ts
const sf: ServiceWorkerGlobalScope = self as any;

// ... replace self with sf below
```
