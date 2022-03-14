---
title: CSS3过渡
author: yrobot
keywords: CSS3,过渡
createTime: 2018年08月28日
---

__本页目录：__   
[用前思考](#id1)  
[怎么使用](#id2)  
[浏览器支持](#id3)  

__CSS3的过渡属性：__  过渡属性可以设定元素在某些属性改变时，对变化过程填充逐渐变换的动画，类似于flash的补间动画



## 用前思考
CSS3 过渡是元素从一种样式逐渐改变为另一种的效果  
那么我们仔细来分析一下，机器需要哪些数据来控制这个补间动画
首先我们问问自己，如果别人要求我们来实现一种补间动画，我们会问要求人哪些问题呢？
1. 是对哪些变化进行补间动画效果？- what  
2. 是怎么变的？补间时长、补间线性(渐入渐出|平滑变化) - how  
3. 补间是马上就开始吗？ - when  

好了，有了这些的问题，看下面的内容也就顺多了。    



## 怎么使用  
#### __语法：__   
- `transition`  简写属性，用于在一个属性中设置下面四个过渡属性。   
    __示例：__   `transition: width 1s linear 2s;`  
- `transition-property` all/propertys/none  规定应用过渡的 CSS 属性的名称。propertys间用逗号分隔。
    __示例：__   `transition-property: width,margin;`  
- `transition-duration` Number 定义过渡效果花费的时间。默认是 0。  
- `transition-timing-function`  规定过渡效果的时间曲线。默认是 "ease"。  
_linear_ ： 规定以相同速度开始至结束的过渡效果（等于 cubic-bezier(0,0,1,1)）。  
_ease_ ： 规定慢速开始，然后变快，然后慢速结束的过渡效果（cubic-bezier(0.25,0.1,0.25,1)）。  
_ease-in_ ： 规定以慢速开始的过渡效果（等于 cubic-bezier(0.42,0,1,1)）。  
_ease-out_ ： 规定以慢速结束的过渡效果（等于 cubic-bezier(0,0,0.58,1)）。  
_ease-in-out_ ： 规定以慢速开始和结束的过渡效果（等于 cubic-bezier(0.42,0,0.58,1)）。  
_cubic-bezier(n,n,n,n)_ ： 在 cubic-bezier 函数中定义自己的值。可能的值是 0 至 1 之间的数值。  
- `transition-delay` 规定过渡效果何时开始。默认是 0。     

#### __效果：__
[参考W3school的demo](http://www.w3school.com.cn/tiy/t.asp?f=css3_transition1)



## 浏览器支持
![](https://ws1.sinaimg.cn/large/0069RVTdgy1fup7uarmc3j30u204sjsn.jpg)  
Internet Explorer 10、Firefox、Chrome 以及 Opera 支持 transition 属性。  
Safari 需要前缀 -webkit-。

