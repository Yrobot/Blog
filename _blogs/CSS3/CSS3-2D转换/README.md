---
title: CSS3-2D转换
author: yrobot
keywords: 2D,CSS3,转换
createTime: 2018年08月28日
---

**本页目录：**  
[怎么使用](#id1)

- [平移函数 translate()](#id11)
- [旋转函数 rotate()](#id12)
- [缩放函数 scale()](#id13)
- [倾斜函数 skew()](#id14)
- [矩阵操作 matrix()](#id15)

[浏览器支持](#id2)

**CSS3 新增的 2D 变换属性：** 通过 CSS3 转换，我们能够对元素进行移动、缩放、转动、拉长或拉伸。

<a href="" id="id1"></a>

## 怎么使用

<a href="" id="id11"></a>

1. **translate()**：设置元素相对于当前的位置。  
    **语法：** `transform: translate(length,length);`

   - 设置元素基于当前位置向右向下偏移。
   - `length` 偏离的距离数据。  
      **示例：** `transform: translate(50px,100px);`  
      ![](https://ws1.sinaimg.cn/large/006tNbRwgy1fuockbel15j30ai0euwey.jpg)
     <a href="" id="id12"></a>

2. **rotate()**：将元素进行顺时针旋转，旋转中心`transform-origin`进行设置，默认为元素中心  
    **语法：** `transform: rotate(rot);`

   - `rot` 元素顺时针转动的角度数据。  
      **示例：** `transform: rotate(30deg);`  
      ![](https://ws4.sinaimg.cn/large/006tNbRwgy1fuockq1b1rj308i0aggmc.jpg)
     <a href="" id="id13"></a>

3. **scale()**：使用 scale 方法来实现文字或图像的缩放处理  
    **语法：** `transform: scale(times);`

   - `times` 数字，表示相对于当前元素缩放的倍数。可以有两个参数，表示长宽。  
      **示例：** `transform: scale(0.5, 2);`  
      ![](https://ws4.sinaimg.cn/large/006tNbRwgy1fuoclaoa1uj30fa0lqjsf.jpg)
     <a href="" id="14"></a>

4. **skew()**：使用 skew 方法来实现文字或图像的倾斜处理，默认坐标中心在元素中心  
    **语法：** `transform: skew(rot);`

   - 参数中分布指定水平方向上的倾斜角度与垂直方向上的倾斜角度。第一个围绕 X 轴，第二个围绕 Y 轴
   - `rot` 一方向的倾斜角度。  
      **示例：** `transform: skew(30deg, 30deg);`  
      ![](https://ws1.sinaimg.cn/large/006tNbRwgy1fuocmattrhj30880a4jrw.jpg)
     <a href="" id="15"></a>

5. **matrix()**：矩阵操作。matrix() 方法可以把所有 2D 转换方法组合在一起  
   **语法：** `transform: matrix(a,b,c,d,e,f);`
   - 实际上，这 6 参数，对应的矩阵如下： _注意书写方向是竖着的_  
     ![](https://ws1.sinaimg.cn/large/006tNbRwgy1fuoak0zwuhj304302kq2w.jpg)
   - 进行运算：  
     ![](https://ws1.sinaimg.cn/large/006tNbRwgy1fuoaq82zpxj30cm02xwep.jpg)  
     坐标就从[x,y]变成了[ax+cy+e,bx+dy+f]
   - 关于为什么要`3*3`的矩阵？  
      主要是为了统一用矩阵乘的操作，其实平移只需要`2*2`，为了统一利用`3*3`乘法变相实现加法(平移)效果。具体思想参考计算机图形学  
     **示例：** `transform: matrix(1, 0, 0, 1, 30, 30);`根据运算，可以得出此矩阵可以将元素向右下平移[30,30]

## 浏览器支持

![](https://ws4.sinaimg.cn/large/006tNbRwgy1fuo7z8j9byj318s04s3zs.jpg)  
Chrome 和 Safari 需要前缀 -webkit-  
Internet Explorer 9 需要前缀 -ms-
