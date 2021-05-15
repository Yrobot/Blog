---
title: Meta标签—Viewport
author: yrobot
keywords: Meta,Viewport,标签
createTime: 2018年08月25日
---

**本页目录：**  
[Viewport 概念](#id1)  
[看下效果](#id2)  
[关于缩放](#id3)  
[布局视口的大小](#id4)  
[javascript 相关](#id5)  
[总结](#id6)

<a id='id1'></a>

## Viewport 概念

#### 三个视口

1. 布局视口
   - 本文的重点，meta 属性设置的对象。
   - 布局视口 可以理解为  包含整个页面的区域，所以布局视口可能比可视区域还要大。
     ![](https://ws2.sinaimg.cn/large/006tNbRwgy1fun61b567vj317g0wan4b.jpg)
1. 视觉视口
   - 视觉视口 是用户正在看到的网站的区域。用户可以通过缩放来操作视觉视口，同时不会影响布局视口，布局视口仍保持原来的宽度。
     ![](https://ws3.sinaimg.cn/large/006tNbRwgy1fun62jqutdj317c0w8gsh.jpg)
     <a href="" id="ideal-viewport"></a>
1. 理想视口
   - 移动端浏览器还有一个理想视口的概念。其宽度就是  下文提到的 **理想视口宽度**
   - 布局视口的默认宽度并不是一个理想的宽度，大家从上面的图就可以看出来了，所以苹果公司就引进了理想窗口这个概念。
   - 理想视口就是  最理想的布局视口的尺寸。将布局视口设置成理想视口，页面就能够适应到合适的尺寸，用户就不再需要自己去缩放和拖动网页了。
   - 在  移动端，只有布局视口和理想视口一样大时，移动端显示在和 PC 预期一样，否则浏览器会缩放(不是修改布局视口，而是将整个内容缩小或放大)，以适应移动端显示。从而导致了移动端字体过小等问题。
     ![](https://ws4.sinaimg.cn/large/006tNbRwgy1fun6qqa0xrj30my04s3z4.jpg)

### **以下 viewport 默认指的是布局视口**

- 通俗的讲，viewport 就是 html 的  外层区域，在使用百分比布局时，html 设置 width：100%就是根据 viewport 宽度来的，所以 viewport 可以  理解为 html 的父素。
  <a href="" id="default"></a>

#### 默认 viewport 的宽度

- 下图列出了一些设备上浏览器的默认 viewport 的宽度。
- 要注意的是在 PC 浏览器中，布局视口和视觉视口是相同的，布局视口默认视口宽度会被覆盖。
  ![](https://ws4.sinaimg.cn/large/006tNbRwgy1fun4nndiqkj30r304caar.jpg)
  <a href="" id="initial-scale"></a>

#### initial-scale

- 而 viewport 还有一个 initial-scale 的概念，这个 initial-scale 是一个数值，用于记录 [理想视口宽度](#ideal-viewport) / viewport 宽度 的值。即 initial-scale = 理想视口宽度 / viewport 宽度 。
- 而每个设备的 理想视口宽度 又是固定的，所以通过设置 initial-scale 就可确定 viewport 的值。以下是一些设备 理想视口宽度 的  值：
  ![](https://ws4.sinaimg.cn/large/006tNbRwgy1fun4n9lduzj30pw04cgme.jpg)

<a id='id2'></a>

## 看下效果

#### 代码：

```html
<body>
  <p class="title">My Title</p>
  <p class="content">
    Apple documentation: Using the Viewport Meta Tag Mozilla: Using the viewport meta tag to control layout on mobile
    browsers quirksmode.org: A tale of two viewports w3.org Mobile Web Application Best Practices: Use Meta Viewport
    Element To Identify Desired Screen Size Quick Tip: Never use maximum-scale=1.0 on the A11y Project Tim Kadlec
    explains IE10 Snap Mode and Responsive Design The @viewport rule proposal
  </p>
</body>
```

#### PC 端 Chrome 显示效果：

![](https://ws4.sinaimg.cn/large/006tNbRwgy1fum93ooxmzj31720j6q7b.jpg)

- width：775px

#### 移动端不加 meta 的 Viewport 标签：

![](https://ws4.sinaimg.cn/large/006tNbRwgy1fum9642gi8j30ie0fgdil.jpg)

- width：980px（iPhone6 的[viewport 的默认宽度](#default)为 980px）

#### 移动端加 meta 的 Viewport 标签：

- head 添加  标签 ：`<meta name="viewport" content="initial-scale=1.0">`
  ![](https://ws1.sinaimg.cn/large/006tNbRwgy1fum9bgbjjgj30ig0so78a.jpg)
- width：375px (iphone6 设备的 理想视口宽度 为 375px，所以`viewport = 375px / 1`, 参考[initial-scale](#initial-scale))

#### 差别

- 使用了`initial-scale=1.0`之后，浏览器的 viewport 从默认的 980px 变为  理想视口宽度 375px 的 1：1 关系的宽度 375px
-  设置`initial-scale=2.0`后 viewport 变为`375px/2=187px`
  ![](https://ws2.sinaimg.cn/large/006tNbRwgy1fumb1i32fjj30i60gimy4.jpg)
- 可见 **`viewport宽度 = 理想视口宽度 / initial-scale值`**

<a id='id3'></a>

## 关于缩放

- 手机上放大，视觉视口缩小，布局视口不变，所以我们看到的 css 布局是不变的。
- PC 上放大，视觉视口缩小，由于 PC 的布局视口和视觉视口是相同的，所以布局视口也变小，这就是我们在桌面端缩放的时候样式有时候会错乱的原因。

- 据说移动端 css 布局不改变也是因为移动端进行重绘的成本太高

<a id='id4'></a>

## 布局视口的大小

下面根据页面的解析过程来说明一下，浏览器在页面布局时的计算 viewport 的流程：

**没有 viewport**

- 当页面没有声明 viewport 时，手机浏览器会取 980px 作为默认 viewport 的 width 值（IE/BlackBerry：1024px），然后全部显示，所以 默认的 scale 值 = 理想视口宽度 / 默认 viewport 宽度 。

**存在 viewport**  
当页面声明了 viewport 标签时，存在以下情况：

- 仅对于`width=device-width`，则 viewport 的宽高采用 理想视口 的尺寸(iPhone，iPad 横屏时宽度是 理想视口 的宽度，而非高度)
- 仅对于`initial-scale=1`，则 viewport 的宽高采用 理想视口 的尺寸( IE 横屏时宽度是 理想视口 的宽度，而非高度)
- 单独设置`width=x`或者`initial-scale=x`时，可以通过 width 直接获得或者通过 initial-scale（理想视口宽度/initial-scale）计算出 viewport 的尺寸，需要注意的是 viewport 是有范围的(最小: 1/5 \* 理想视口宽度)，所以当超出尺寸范围时，浏览器会选择相应的最大值或者最小值。
- 如果 width 和 initial-scale 都存在时，会根据 initial-scale 计算出来的结果（理想视口宽度/initial-scale）与 width 值进行比较，取较大的值。（而 Android Webkit 则采用 width 值，IE 永远认为`initial-scale=1`，但是需要注意 layout 的取值范围）。

<a id='id5'></a>

## javascript 相关

厂商间基本遵循的规范：

- `document.documentElement.clientWidth`： 表示 **布局窗口宽度**，可进行类似媒体查询；
- `window.innerWidth`：表示 **视觉窗口宽度**，一般不会用；
- `screen.width`: 表示 **理想窗口宽度**，兼容性据说差别很大；一般没啥用；
- `orientationchange`事件，只要设备改变了方向都会触发，兼容性好；
- 移动端最好不要用`resize`事件，支持很差;

可以通过 js 模拟类似 media 查询的功能，在布局足够宽的时候才加载某些第三方组件：

```js
if (document.documentElement.clientWidth >= 600) {
  // 加载组件
}
```

<a id='id6'></a>

## 总结

1. 影响显示排版的是布局视口，布局视口变了，整个页面排版位置才会改变。
2. 一般移动端进行适配：`<meta name="viewport" content="width=device-width,initial-scale=1.0,userscalable=no">`
3. 当然还可以  利用 js 获取布局视口大小，进一步设置，适配出自己想要的效果。
