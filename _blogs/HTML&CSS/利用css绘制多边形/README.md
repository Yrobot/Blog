---
title: 利用css绘制多边形
author: yrobot
keywords: css,多边形,绘制,利用
createTime: 2018年09月03日
---

本文主要讲解内容：

1. css 绘制多边形的原理(一定要理解)
2. 一些简单多边形的绘制示例

**本页目录：**  
[css 绘制多边形的原理](#id1)

- [首先我们要知道 css 盒模型是什么样的](#id11)
- [然后我们还要理解 border](#id12)
- [还要会用 css 伪元素](#id13)

[css 绘制正四边形](#id2)  
[css 绘制非正四边形](#id3)  
[css 绘制三角形](#id4)  
[css 绘制圆形](#id5)  
[css 绘制梯形](#id6)  
[css 绘制正五边形](#id7)  
[css 绘制正七边形](#id8)

<a id='id1'></a>

## css 绘制多边形的原理

<a href="" id="id11"></a>

### **首先我们要知道 css 盒模型是什么样的**

![](https://ws3.sinaimg.cn/large/0069RVTdgy1fuw4xid010j30a809aq38.jpg)  
所谓的盒模型，可以理解为元素的表现内容，看上图可以发现：

```
盒模型 = 内容 + padding + border + margin
```

组成理解(_简单介绍_ )：  
`内容` 元素内 文本、内元素 所包含的区域  
`padding`  内容 与 border 之间的距离，用于处理 border 和内容的表现关系  
`border` 边框，将内容包围的轮廓  
`margin` 元素 与 其他元素之间的距离，用于处理元素间的表现关系，位置样式

一般理解的 元素 由 内容、padding、border 组成，因为这 3 个影响到元素的表现样式。  
css2 中`width`的默认指向是内容宽度，而不是元素(包括 padding、border)的宽度。  
 可以 利用 `box-sizing` 去修改 width 的指向：

- `box-sizing: content-box;` width、height 指向内容  
   ![](https://ws2.sinaimg.cn/large/0069RVTdgy1fuw5olkw8wj303o010mx2.jpg)
- `box-sizing: border-box;` width、height 指向一般元素  
   ![](https://ws1.sinaimg.cn/large/0069RVTdgy1fuw5p6zb80j305q04wdgb.jpg)

看下结果：_语言:stylus_

```css
.boxsize1
    width 100px
    height 80px
    background-color #393
    border 20px solid #999
.boxsize2
    width 100px
    height 80px
    background-color #393
    border 20px solid #999
    box-sizing border-box  //默认元素宽高指定，内容宽高自适应;
```

![](https://ws4.sinaimg.cn/large/0069RVTdgy1fuw6rtydjoj30ci0egweo.jpg)

本章我们就要利用元素的表现样式(内容、padding、border )进行图形绘制  
<a href="" id="id12"></a>

### **然后我们还要理解 border**

我们先来看一段有趣的代码：

```css
.square1 {
  width: 0px;
  height: 0px;
  border-width: 40px 50px;
  border-style: solid;
  border-color: #f00 #008000 #808080 #00f;
}
```

想想一下，这段代码的渲染效果是什么样的?  
css 是怎么处理 border 重叠的部分的？
好了，想清楚了，就来看一下结果吧。  
![](https://ws3.sinaimg.cn/large/0069RVTdgy1fuw65nqy85j309001u0sr.jpg)  
![](https://ws4.sinaimg.cn/large/0069RVTdgy1fuw60spn4lj306i05g0sm.jpg)  
他的盒模型：  
![](https://ws4.sinaimg.cn/large/0069RVTdgy1fuw62e6752j307y05umxa.jpg)  
可以得出规律：

1. border 的长 = 盒模型对应的长或宽
2. 相邻方向 border 冲突时，进行等比均分。

在接下来的很多例子中都会用到 border 的这个规律  
<a href="" id="id13"></a>

### **还要会用 css 伪元素**

**css 的伪元素：** 之所以被称为伪元素，是因为他们不是真正的页面元素，html 没有对应的元素，但是其所有用法和表现行为与真正的页面元素一样，可以对其使用诸如页面元素一样的 css 样式，表面上看上去貌似是页面的某些元素来展现，实际上是 css 样式展现的行为，因此被称为伪元素。

我们在绘制图形发现需要进行元素组装时，就可以利用伪元素 来减少对 HTML 元素的使用。

[css 伪元素的用法](https://www.cnblogs.com/wonyun/p/5807191.html)

<a id='id2'></a>

## css 绘制正四边形

绘制正四边形最简单的方法就是利用内容，直接使用 width、height

```css
.square2 {
  width: 80px;
  height: 80px;
  background-color: #393;
}
```

![](https://ws3.sinaimg.cn/large/0069RVTdgy1fuw6wmpdi1j309w092q31.jpg)

当然利用 border 也可以

```css
.square3 {
  width: 0px;
  height: 0px;
  border-width: 40px;
  border-style: solid;
  border-color: #008000;
}
```

![](https://ws3.sinaimg.cn/large/0069RVTdgy1fuw6ypx233j30a208s74d.jpg)

<a id='id3'></a>

## css 绘制非正四边形

#### 绘制平行四边形

平行四边形利用[css3 的倾斜函数 skew()](/blog/CSS3/CSS3-2D转换#14)比较方便

```css
.parallelogram {
  width: 100px;
  height: 80px;
  background: #393;
  -webkit-transform: skew(-30deg);
  -moz-transform: skew(-30deg);
  -o-transform: skew(-30deg);
  transform: skew(-30deg);
}
```

![](https://ws2.sinaimg.cn/large/0069RVTdgy1fuw79w9e6dj30bk08cweo.jpg)

当然使用 `border` + `:after`伪类也是可以的

```css
.parallelogram2 {
  width: 0px;
  height: 0px;
  border-bottom: 80px solid #393;
  border-left: 80px solid transparent;
}
.parallelogram2:after {
  display: block;
  content: '';
  width: 0px;
  height: 0px;
  border-top: 80px solid #393;
  border-right: 80px solid transparent;
}
```

![](https://ws3.sinaimg.cn/large/0069RVTdgy1fuw7opf0mhj30bq06qwee.jpg)

#### 绘制菱形

思路：绘制两个等边三角形，进行拼接（`height = sqr(3)*width/2`）

```css
.rhombus {
  width: 0px;
  height: 0px;
  border-bottom: 69.3px solid #393;
  border-left: 40px solid transparent;
  border-right: 40px solid transparent;
}
.rhombus:after {
  display: block;
  content: '';
  width: 0px;
  width: 0px;
  border-top: 69.3px solid #393;
  border-left: 40px solid transparent;
  border-right: 40px solid transparent;
}
```

![](https://ws4.sinaimg.cn/large/0069RVTdgy1fuwb07zx8zj308605o748.jpg)

<a id='id4'></a>

## css 绘制三角形

#### 绘制直角三角形

```css
.rightTriangle width 0px height 0px border-bottom 80px solid #393 border-left 80px solid transparent;
```

![](https://ws2.sinaimg.cn/large/0069RVTdgy1fuwcpx6dhfj306s06aa9x.jpg)

#### 绘制等边三角形

等边三角形的宽高比为 1 : sqr(3)/2  
所以  可以根据底边长计算三角形高`height = sqr(3)*width/2`  
本例中左右 border 宽为 40，所以底边长为 80，从而计算出底部 border 宽应为 69.3

```css
.triangle
  width
  0px
  height
  0px
  border-bottom
  69.3px
  solid
  #393
  border-left
  40px
  solid
  transparent
  border-right
  40px
  solid
  transparent;
```

![](https://ws1.sinaimg.cn/large/0069RVTdgy1fuwb2kyyzqj306g064746.jpg)

<a id='id5'></a>

## css 绘制圆形

圆形最简单的方式就是设置`border-radius`为 50%

```css
.circle1 width 80px height 80px border-radius 50% background-color #393;
```

![](https://ws1.sinaimg.cn/large/0069RVTdgy1fuwcsqggv5j306c068a9z.jpg)

也可以使用 border 实现

```css
.circle2 width 0px height 0px border 40px solid #393 border-radius 50%;
```

 哎？猜猜这时候设置 padding 是什么样子的

```css
.circle3 width 0px height 0px border 40px solid #393 border-radius 50% padding 20px;
```

![](https://ws3.sinaimg.cn/large/0069RVTdgy1fuwcyjhdw6j308408874b.jpg)  
看来 border-radius 把内外角度都设置了

<a id='id6'></a>

## css 绘制梯形

```css
.trapezoid
  width
  40px
  height
  0px
  border-top
  40px
  solid
  #393
  border-left
  20px
  solid
  transparent
  border-right
  20px
  solid
  transparent;
```

![](https://ws1.sinaimg.cn/large/0069RVTdgy1fuwd59x6bsj306w04gwec.jpg)

<a id='id7'></a>

## css 绘制正五边形

正五边形可以拆分成上下两个部分：上边一个等腰三角形，下面一个等腰梯形，具体长宽计算这里不做介绍

```css
.pentagon {
  width: 0px;
  height: 0px;
  border-top: 0px;
  border-right: 81px solid transparent;
  border-left: 81px solid transparent;
  border-bottom: 59px solid #393;
}
.pentagon:after {
  position: relative;
  left: -81px;
  top: 59px;
  display: block;
  content: '';
  width: 100px;
  height: 0px;
  border-top: 95px solid #393;
  border-left: 31px solid transparent;
  border-right: 31px solid transparent;
}
```

![](https://ws3.sinaimg.cn/large/0069RVTdgy1fuwdlbgoi3j30be0a8t8r.jpg)

<a id='id8'></a>

## css 绘制正七边形

正七边形比较复杂，需要将整个图形分成 3 份来做  
![](https://ws1.sinaimg.cn/large/0069RVTdgy1fuwdo5l0qrj307s07974m.jpg)  
上：等腰三角形  
中：等腰梯形  
下：等腰梯形

```css
.heptagon {
  height: 0px;
  width: 180px;
  border-left: 22px solid transparent;
  border-right: 22px solid transparent;
  border-bottom: 97px solid #393;
  margin-top: 63px;
}
.heptagon:before {
  display: block;
  content: '';
  width: 0px;
  height: 0px;
  border-right: 90px solid transparent;
  border-left: 90px solid transparent;
  border-bottom: 43px solid #393;
  position: relative;
  top: -43px;
}
.heptagon:after {
  width: 100px;
  height: 0px;
  content: '';
  display: block;
  border-top: 78px solid #393;
  border-left: 62px solid transparent;
  border-right: 62px solid transparent;
  position: relative;
  left: -22px;
  bottom: -54px;
}
```

![](https://ws3.sinaimg.cn/large/0069RVTdgy1fuwe4xtv6lj30ec0dowen.jpg)
