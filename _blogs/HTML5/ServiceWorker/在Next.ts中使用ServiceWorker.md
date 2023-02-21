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

1. 先利用 tsc 将 sw.ts 转化 public/sw.js
2. 利用 next.js 的能力，将 sw.js 作为静态资源发布
3. 利用 package.json 的 scripts 将 命令合并为一个

## 实操

### 1. 配置 service worker 的 tsconfig.json

`service-worker/tsconfig.json`

```json
{
  "compilerOptions": {
    "lib": ["ES6", "WebWorker"],
    "target": "ES5",
    "moduleResolution": "node",
    "outDir": "../public"
  },
  "include": ["**/*.ts"],
  "files": ["sw.ts"]
}
```

### 2. 添加 输出 sw.js 的命令

`package.json`

```json
{
  // ...
  "scripts": {
    "sw:dev": "tsc -p service-worker -w",
    "sw:build": "tsc -p service-worker",
    "dev": "yarn sw:dev & next dev",
    "build": "yarn sw:build & next build && next export -o build"
  }
  // ...
}
```

### 3. 将 public/sw.js 加入 .gitignore

`.gitignore`

```bash
public/sw.js
```

### 4. sw.ts 支持 tsc 和类型检测

`service-worker/sw.ts`

```ts
const sf: ServiceWorkerGlobalScope = self as any;

// ... replace self with sf below
```
