---
title: WebComponent问题实录
author: yrobot
keywords: web component,html5,development,开发,问题,记录
createTime: 2022年7月23日
---

## web component 在 SRR 的情况下会导致页面回流

| ![unpyOm-23-42-04](https://images.yrobot.top/2022-07-23/unpyOm-23-42-04.png) | ![o2gW6j-23-42-51](https://images.yrobot.top/2022-07-23/o2gW6j-23-42-51.png) |
| ---------------------------------------------------------------------------- | ---------------------------------------------------------------------------- |
| 帧 1                                                                         | 帧 2                                                                         |

可以看到，svg-inline 在 SSR 场景下，初次载入页面时会有明显的回流现象。  
svg-inline 一开始在文本流里占位为 0\*0；过了一会变成空白的 40\*40；最后请求 svg 资源并展示在内部。

事实上，svg-inline 的 class 里已经对 svg-inline 设置了大小为 `w-9 h-9`  
![19FXOj-23-47-54](https://images.yrobot.top/2022-07-23/19FXOj-23-47-54.png)

而从 `帧 1` 看到，页面剩余部分已经完成了 css 的加载和渲染，所以对于 svg-inline 来说已经设置了 `w-9 h-9`，但是宽高并没有生效。

所以猜想到是 web-component 逻辑里对于 svg-inline 默认设置的 `display: inline-block;` 没有生效。而浏览器对于 web-component 的默认 display 的解释是 inline。所以宽高的设置没有生效。

具体浏览器对于 web-component 默认的 display 的处理可以参看 [[Custom Elements]: Custom elements should be display: block by default
](https://github.com/WICG/webcomponents/issues/224)

而 svg-inline 中的 style 设置是通过 js 在 header 里加 style 标签的方式设置的。
所以这部分的 css 逻辑生效在 js 逻辑运行之后。

这就解释了为什么 svg-inline 会在 SSR 场景下有回流现象：

1. 在 SSR 场景下，svg-inline 的 web-component 定义逻辑只能通过在 useEffect 中异步 import 的形式引入（node 不存在 HTMLElement 等变量）
2. 在`帧 1`的时刻，全局 css 已经加载并渲染完毕，但是 useEffect 的引入 svg-inline 定义的逻辑还没运行，所以 svg-inline 是默认的 inline，从而导致对于 svg-inline 的宽高设置无效，即大小为 0\*0
3. 在`帧 1`和`帧 2`之间的某一刻，svg-inline 定义的逻辑已经运行完毕，所以 svg-inline 是 inline-block，所以对于 svg-inline 的宽高设置生效，即大小为 40\*40。但在`帧 2`那一刻 svg 资源不一定加载完成，所以部分 svg-inline 是空白的。

解决方案：

- 确保对于 svg-inline 的 display: block 的设置和宽高设置的生效在同一时刻。
  - 直接设置 svg-inline 的 class 为 `block w-9 h-9`

```tsx
import React, { useEffect } from "react";
import { InlineSVGElement } from "@yrobot/svg-inline";
import cn from "classnames";

function Icon({
  icon,
  className = "",
  ...props
}: { icon: string; className?: string } & Omit<
  InlineSVGElement,
  "src" | "class"
>) {
  useEffect(() => {
    import("@yrobot/svg-inline"); // avoid load svg-inline in SSR
  }, []);
  return (
    <svg-inline
      {...props}
      class={cn("inline-block", className)}
      src={`/icons/${icon}.svg`}
    ></svg-inline>
  );
}

export default Icon;
```
