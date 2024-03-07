---
title: 运行时扫描html生成css
author: yrobot
keywords: Tailwindcss,运行时,postcss,css
createTime: 2024年03月04日
---

## 需求明确

运行时根据输入的 html 字符串，生成对应 tailwindcss 的 css 样式内容

```ts
generateCss(html: string): string
// '<div class="m-4">HTML content</div>' => '.m-4{...}'
```

## 实现方案

### 利用 postcss 配合 tailwindcss 实现(仅限 node 环境)

```ts
import postcss from "postcss";
import tailwindcss from "tailwindcss";
import autoprefixer from "autoprefixer";
import cssnano from "cssnano";

async function generateTailwindCss(
  html,
  basicCss = `
    @tailwind base;
    @tailwind components;
    @tailwind utilities;
  `
) {
  return (
    await postcss([
      tailwindcss({
        content: [{ raw: html }],
        theme: {
          extend: {},
        },
        plugins: [],
      }),
      autoprefixer, // 自动补全
      cssnano, // 压缩
    ]).process(basicCss)
  ).css;
}

const css = generateTailwindCss('<div class="m-4">HTML content</div>');
```

方案目前只能在 node 环境运行，浏览器运行会报以下错误：

```
Uncaught TypeError: os.platform is not a function
    at node_modules/fast-glob/out/utils/path.js (tailwindcss.js?v=b4fd177d:14484:34)
```

tailwindcss 运行时逻辑包含 os.platform 导致报错
