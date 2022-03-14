---
title: CSS3动画
author: yrobot
keywords: CSS3,动画
createTime: 2018年08月28日
---

**CSS3 新增的动画属性：** 通过 CSS3 动画，我们能够创建动画，这可以在许多网页中取代动画图片、Flash 动画 以及 JavaScript。作为页面切换的交互动画。

**NOTE：**

1.  一个元素要使用多个动画时（比如前一秒动画 1，后面动画 2），可以在 css 属性中用一个 animation 表示，动画之间用逗号相隔。例子：`animation: animation1 1s, animation2 1s 1s infinite alternate ;`



## 怎么使用

首先用我的话来大致概括一下 css3 动画的使用流程：

1. 首先定义一个动画，使用`@keyframes`来定义动画(包括动画名、动画过程状态)
2. 在一个元素的 class 中引用刚定义的动画，设定相关参数(动画时长、动画线性、动画延迟、元素开始和结束的状态、动画是否暂停 )

这样一个 css3 动画就被定义和使用了。

<a href="" id="id11"></a>

#### 1. 定义动画

#### **语法：**

- `@keyframes` @keyframes 规则用于创建动画。在 @keyframes 中规定某项 CSS 样式，就能作为动画中某一帧的状态。  
   **示例：** 规定一个名叫`myAnimation`的动画

  ```css
  @keyframes myAnimation {
    0% {
      background: red;
    }
    25% {
      background: yellow;
    }
    50% {
      background: blue;
    }
    100% {
      background: green;
    }
  }

  @-moz-keyframes myAnimation /* Firefox */ {
    0% {
      background: red;
    }
    25% {
      background: yellow;
    }
    50% {
      background: blue;
    }
    100% {
      background: green;
    }
  }

  @-webkit-keyframes myAnimation /* Safari 和 Chrome */ {
    0% {
      background: red;
    }
    25% {
      background: yellow;
    }
    50% {
      background: blue;
    }
    100% {
      background: green;
    }
  }

  @-o-keyframes myAnimation /* Opera */ {
    0% {
      background: red;
    }
    25% {
      background: yellow;
    }
    50% {
      background: blue;
    }
    100% {
      background: green;
    }
  }
  ```

<a href="" id="id12"></a>

#### 2. 引用动画，设定参数

在要设定动画的元素 class 上使用

#### **语法：**

- `animation` 所有动画属性的简写属性，除了 animation-play-state 和 animation-fill-mode 属性。  
   **语法：** `animation: name duration timing-function delay iteration-count direction;`  
   语法参数含义参看后面的语法解析。  
   **示例：**
  ```css
  div {
    animation: myAnimation 5s infinite;
    -webkit-animation: myAnimation 5s infinite; /* Safari 和 Chrome */
  }
  ```
- `animation-name` 要引用 @keyframes 动画的名称。

- `animation-duration` 规定动画完成一个周期所花费的秒或毫秒。默认是 0。
- `animation-timing-function` 规定动画的速度曲线。默认是 "ease"。  
   **语法：** `animation-timing-function: value;`  
   _linear_： 动画从头到尾的速度是相同的。  
   _ease_： 默认。动画以低速开始，然后加快，在结束前变慢。  
   _ease-in_： 动画以低速开始。  
   _ease-out_： 动画以低速结束。  
   _ease-in-out_： 动画以低速开始和结束。  
   _cubic-bezier(n,n,n,n)_： 在 cubic-bezier 函数中自己的值。可能的值是从 0 到 1 的数值。  
   **示例：**

  ```css
  /* W3C 和 Opera: */
  #div1 {
    animation-timing-function: linear;
  }

  /* Firefox: */
  #div1 {
    -moz-animation-timing-function: linear;
  }

  /* Safari 和 Chrome: */
  #div1 {
    -webkit-animation-timing-function: linear;
  }
  ```

- `animation-delay` 规定动画何时开始。默认是 0。
- `animation-iteration-count` 规定动画被播放的次数。默认是 1。  
   **语法：** `animation-iteration-count: value;`  
   _n_： 定义动画播放次数的数值。  
   _infinite_： 规定动画应该无限次播放。  
   **示例：**
  ```css
  div {
    animation-iteration-count: 3;
    -webkit-animation-iteration-count: 3; /* Safari 和 Chrome */
  }
  ```
- `animation-direction` 规定动画是否在下一周期逆向地播放。默认是 "normal"。  
   **语法：** `animation-direction: normal|alternate;`  
   _normal_： 默认值。动画应该正常播放。  
   _alternate_： 动画应该轮流反向播放。  
   **示例：**
  ```css
  div {
    animation-direction: alternate;
    -webkit-animation-direction: alternate; /* Safari 和 Chrome */
  }
  ```
- `animation-play-state` 规定动画是否正在运行或暂停。默认是 "running"。  
   **语法：** `animation-play-state: paused|running;`  
   _paused_： 规定动画已暂停。  
   _running_： 规定动画正在播放。  
   **示例：**
  ```css
  div {
    animation-play-state: paused;
    -webkit-animation-play-state: paused; /* Safari 和 Chrome */
  }
  ```
- `animation-fill-mode` 规定对象动画时间之外的状态。  
   **语法：** `animation-fill-mode : none | forwards | backwards | both;`  
   _none_： 不改变默认行为。  
   _forwards_： 当动画完成后，保持最后一个属性值（在最后一个关键帧中定义）。  
   _backwards_： 在 animation-delay 所指定的一段时间内，在动画显示之前，应用开始属性值（在第一个关键帧中定义）。  
   _both_： 向前和向后填充模式都被应用。  
   **示例：**
  ```css
  div {
    animation-fill-mode: forwards;
    -webkit-animation-fill-mode: forwards; /* Safari 和 Chrome */
  }
  ```

#### **效果：**

[ 参考 W3school 的 demo](http://www.w3school.com.cn/tiy/t.asp?f=css3_animation4)

<a href="" id="id3"></a>

## 浏览器支持

![](https://ws2.sinaimg.cn/large/0069RVTdgy1fupd51aiv4j30u209k76w.jpg)  
Internet Explorer 10、Firefox 以及 Opera 支持 @keyframes 规则和 animation 属性。  
Chrome 和 Safari 需要前缀 -webkit-。
