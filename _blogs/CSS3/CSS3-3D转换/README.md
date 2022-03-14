---
title: CSS3-3D转换
author: yrobot
keywords: 3D,CSS3,转换
createTime: 2018年08月31日
---

**CSS3 新增的 3D 变换属性：** CSS3 3D 转换支持开发者在 css 代码中利用 css3 的 3D 函数，在页面里开发出一些简单的 3D 效果。

**本节内容要点：**

- 利用 transform 改变各个元素位置
- 利用 transition 增加动态效果
- 利用 perspective 属性改变视角

<a href="" id="id1"></a>

## 3D 元素的属性

<a href="" id="id11"></a>

1. **transform**：利用一些方法对元素进行 2D 或者 3D 转换。具体  转换方法参看 [3D 元素的方法](#id2)  
   **语法：** `transform: none|transform-functions;`
   - `none` 定义不进行转换。
   - `transform-functions` 使用[3D 元素的方法](#id2)

<a href="" id="id12"></a>

2. **transform-origin**：设置元素坐标系原点的位置，影响到 2D、3D 的旋转效果  
    **语法：** `transform-origin: x-axis y-axis z-axis;`

   - x-axis 定义视图被置于 X 轴的何处。可能的值：  
     _left_  
     _center_  
     _right_  
     _length_  
     _%_
   - y-axis 定义视图被置于 Y 轴的何处。可能的值：  
     _top_  
     _center_  
     _bottom_  
     _length_  
     _%_
   - z-axis 定义视图被置于 Z 轴的何处。可能的值：  
     _length_

   **示例：** `-webkit-transform-origin:20% 40%; /* Safari 和 Chrome */`

   **取值对比：** 1.数字和百分比相对于左上角 2.关键字相对于整个元素

   ```
    top = top center = center top = 50% 0
    right = right center = center right = 100%或(100% 50%)
    bottom = bottom center = center bottom = 50% 100%
    left = left center = center left = 0或(0 50%)
    center = center center = 50%或（50% 50%）
    top left = left top = 0 0
    right top = top right = 100% 0
    bottom right = right bottom = 100% 100%
    bottom left = left bottom = 0 100%
   ```

   **浏览器支持**  
   ![](https://ws1.sinaimg.cn/large/006tNbRwgy1fut27g9rczj30v806oabn.jpg)
   Internet Explorer 10、Firefox、Opera 支持 transform-origin 属性。  
   Internet Explorer 9 支持替代的 -ms-transform-origin 属性（仅适用于 2D 转换）。  
   Safari 和 Chrome 支持替代的 -webkit-transform-origin 属性（3D 和 2D 转换）。  
   Opera 只支持 2D 转换。

<a href="" id="id13"></a>

3. **transform-style**：规定如何在 3D 空间中呈现被嵌套的元素  
    **语法：** `transform-style: flat|preserve-3d;` 

   - `flat` 所有子元素在 2D 平面呈现。  
      沿着 X 轴或 Y 轴方向旋转该元素将导致位于正或负 Z 轴位置的子元素显示在该元素的平面上，而不是它的前面或者后面。著作权归作者所有。
   - `preserve-3d` 子元素将保留其 3D 位置。

   **示例：** `-webkit-transform-style: preserve-3d; /* Safari 和 Chrome */`

   **浏览器支持**  
   ![](https://ws1.sinaimg.cn/large/006tNbRwgy1fut2ohsc19j30v006mtae.jpg)
   Firefox 支持 transform-style 属性。  
   Chrome、Safari 和 Opera 支持替代的 -webkit-transform-style 属性。

<a href="" id="id14"></a>

4. **perspective**：perspective 属性定义 3D 元素距视图的距离，以像素计。（改变视角距离）

   - 提示：请与 perspective-origin 属性一同使用该属性，这样您就能够改变 3D 元素的底部位置。
     **语法：** `perspective: number|none;`
   - `number` 元素距离视图的距离，以像素计。
   - `none` 默认值。与 0 相同。不设置透视。

   **示例：**

   ```css
   div {
     perspective: 500;
     -webkit-perspective: 500; /* Safari 和 Chrome */
   }
   ```

   **浏览器支持**  
   目前浏览器都不支持 perspective 属性。  
   Chrome 和 Safari 支持替代的 -webkit-perspective 属性。

<a href="" id="id15"></a>

5. **perspective-origin**：改变 3D 元素的底部位置（改变视角的朝向）  
    **语法：** `perspective-origin: x-axis y-axis;` 数字和百分比相对于左上角

   - x-axis 定义视图被置于 X 轴的何处。可能的值：  
     _left_  
     _center_  
     _right_  
     _length_  
     _%_
   - y-axis 定义视图被置于 Y 轴的何处。可能的值：  
     _top_  
     _center_  
     _bottom_  
     _length_  
     _%_

   **示例：**

   ```css
   div {
     perspective: 150;
     perspective-origin: 10% 10%;
     -webkit-perspective: 150; /* Safari 和 Chrome */
     -webkit-perspective-origin: 10% 10%; /* Safari 和 Chrome */
   }
   ```

   **浏览器支持**  
   目前浏览器都不支持 perspective-origin 属性。  
   Chrome 和 Safari 支持替代的 -webkit-perspecitve-origin 属性。

<a href="" id="id16"></a>

6. **backface-visibility**：backface-visibility 属性定义当元素不面向屏幕时是否可见。  
    **语法：** `backface-visibility 属性定义当元素不面向屏幕时是否可见。`

   - `visible` 背面是可见的。
   - `hidden` 背面是不可见的。

   **示例：**

   ```css
   div {
     backface-visibility: hidden;
     -webkit-backface-visibility: hidden; /* Chrome 和 Safari */
     -moz-backface-visibility: hidden; /* Firefox */
     -ms-backface-visibility: hidden; /* Internet Explorer */
   }
   ```

   **浏览器支持**  
    只有 Internet Explorer 10+ 和 Firefox 支持 backface-visibility 属性。  
    Opera 15+、Safari 和 Chrome 支持替代的 -webkit-backface-visibility 属性。  
   

## 3D 元素的方法

**语法：** `transform: none|transform-functions;` 方法使用应该加`transform:`前缀

- `none` 定义不进行转换。
- `transform-functions` 3D 变换函数。具体函数及功能如下：
  - _matrix3d(n,n,n,n,n,n,n,n,n,n,n,n,n,n,n,n)_ 定义 3D 转换，使用 16 个值的 4x4 矩阵。
  - _translate3d(x,y,z)_ 定义 3D 转化。
  - _translateX(x)_ 定义 3D 转化，仅使用用于 X 轴的值。
  - _translateY(y)_ 定义 3D 转化，仅使用用于 Y 轴的值。
  - _translateZ(z)_ 定义 3D 转化，仅使用用于 Z 轴的值。
  - _scale3d(x,y,z)_ 定义 3D 缩放转换。
  - _scaleX(x)_ 定义 3D 缩放转换，通过给定一个 X 轴的值。
  - _scaleY(y)_ 定义 3D 缩放转换，通过给定一个 Y 轴的值。
  - _scaleZ(z)_ 定义 3D 缩放转换，通过给定一个 Z 轴的值。
  - _rotate3d(x,y,z,angle)_ 定义 3D 旋转。
  - _rotateX(angle)_ 定义沿 X 轴的 3D 旋转。
  - _rotateY(angle)_ 定义沿 Y 轴的 3D 旋转。
  - _rotateZ(angle)_ 定义沿 Z 轴的 3D 旋转。
  - _perspective(n)_ 定义 3D 转换元素的透视视图。

**示例：**

```css
div {
  transform: rotate(7deg);
  -ms-transform: rotate(7deg); /* IE 9 */
  -moz-transform: rotate(7deg); /* Firefox */
  -webkit-transform: rotate(7deg); /* Safari 和 Chrome */
  -o-transform: rotate(7deg); /* Opera */
}
```

**浏览器支持**  
![](https://ws4.sinaimg.cn/large/006tNbRwgy1fuqf7u1vz0j30u204ot9y.jpg)
Internet Explorer 10、Firefox、Opera 支持 transform 属性。  
Internet Explorer 9 支持替代的 -ms-transform 属性（仅适用于 2D 转换）。  
Safari 和 Chrome 支持替代的 -webkit-transform 属性（3D 和 2D 转换）。  
Opera 只支持 2D 转换。
