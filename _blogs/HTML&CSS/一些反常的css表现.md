---
title: 一些反常的css表现
author: yrobot
keywords: css,反常,奇怪,表现,weird
createTime: 2024年02月18日
---

## `overflow-x:hidden`+`relative` 容器 包含 `absolute` 子元素 会导致容器滚动

```html
<style>
  .container {
    position: relative;
    overflow-x: hidden;
    border: 1px solid #000;
    padding: 60px 0;
  }
  .content {
    height: 300px;
    background-color: #a3a3a3;
  }
  .absolute {
    position: absolute;
    width: 200px;
    height: 200px;
    bottom: -36px;
    left: -8px;
    background-color: #40644c;
  }
</style>

<div class="container">
  <div class="content"></div>
  <div class="absolute"></div>
</div>
```

### 代码效果预期

`overflow-x: hidden` 会隐藏 x 方向超出容器的部分内容

`absolute` 元素 不会影响 文本流（如 尺寸，位置）

所以 .container 应该只展示 .absolute 在 y 方向超出的部分

### 实际效果

![HSegja-11-40-01](https://images.yrobot.top/2024-02-18/HSegja-11-40-01.png)

可以看到 .container 出现滚动条，以及 .container 下方的 空白区域比上方的大

demo 查看地址：https://codesandbox.io/p/sandbox/hidden-absolute-7yty4c

### 效果理解和解决方案

理想效果：

- .absolute 元素在 x 方向超出部分被隐藏，y 方向超出部分被展示（和没有 overflow 的属性一样，并不引起容器滚动）

原因解析：

- overflow-x/y 设置为 hidden 时, overflow-y/x 的 visible 会变更为 auto

解决方案：

- 方案 1. 将容器的 `overflow-x: hidden` 改为 `overflow-x: clip`

`hidden`和`clip`区别：The difference between clip and hidden is that the clip keyword also forbids all scrolling, including programmatic scrolling.

解决效果：

![ip4omZ-17-31-54](https://images.yrobot.top/2024-02-18/ip4omZ-17-31-54.png)

相关资料：

- https://stackoverflow.com/questions/6421966/css-overflow-x-visible-and-overflow-y-hidden-causing-scrollbar-issue
- https://www.cnblogs.com/coco1s/p/16627152.html
- https://www.zhangxinxu.com/wordpress/2015/02/css-deep-understand-flow-bfc-column-two-auto-layout/
