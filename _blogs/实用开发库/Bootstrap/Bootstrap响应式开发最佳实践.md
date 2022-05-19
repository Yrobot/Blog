---
title: Bootstrap 响应式开发最佳实践
author: yrobot
keywords: bootstrap,响应式,最佳实践,responsive,
createTime: 2021年05月31日
draft: true
---

## 首先了解 container 的作用和效果

| | Extra small <576px | Small ≥576px | Medium ≥768px | Large ≥992px | Extra large ≥1200px |
|------------------|----------------------------|----------------------|-----------------------|----------------------|-----------------------------|
| .container | 100% | 540px | 720px | 960px | 1140px |
| .container-sm | 100% | 540px | 720px | 960px | 1140px |
| .container-md | 100% | 100% | 720px | 960px | 1140px |
| .container-lg | 100% | 100% | 100% | 960px | 1140px |
| .container-xl | 100% | 100% | 100% | 100% | 1140px |
| .container-fluid | 100% | 100% | 100% | 100% | 100% |

**width:** Extra small <576px
![](https://images.yrobot.top/2021-05-31/syL9xi-15-49-07.png)

**width:** Small ≥576px
![](https://images.yrobot.top/2021-05-31/ET5jDP-15-50-01.png)

**width:** Medium ≥768px
![](https://images.yrobot.top/2021-05-31/WMSZJo-15-50-28.png)

**width:** Extra large ≥1200px
![](https://images.yrobot.top/2021-05-31/HDJPws-15-51-02.png)

[在 codepen 体验](https://codepen.io/yrobot/pen/RwpjEdO)
