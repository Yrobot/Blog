---
title: CSS中可以和不可以继承的属性
author: yrobot
keywords: CSS,属性,继承
createTime: 1535040000000
createTimeStr: 2018年08月24日
---
# CSS中可以和不可以继承的属性    
时间：2018年08月24日    
作者：Yrobot    
  
__本页目录：__     
[无继承性的属性](#id1)    
[有继承性的属性](#id2)    
[所有元素可以继承的属性](#id3)    
[内联元素可以继承的属性](#id4)    
[块级元素可以继承的属性](#id5)    
  
<a id='id1'></a>  
  
## 无继承性的属性  
1. display：规定元素应该生成的框的类型  
2. 文本属性：  
vertical-align：垂直文本对齐  
text-decoration：规定添加到文本的装饰  
text-shadow：文本阴影效果  
white-space：空白符的处理  
unicode-bidi：设置文本的方向  
3. 盒子模型的属性：width. height. margin . margin-top. margin-right. margin-bottom. margin-left. border. border-style. border-top-style. border-right-style. border-bottom-style. border-left-style. border-width. border-top-width. border-right-right. border-bottom-width. border-left-width. border-color. border-top-color. border-right-color. border-bottom-color. border-left-color. border-top. border-right. border-bottom. border-left. padding. padding-top. padding-right. padding-bottom. padding-left  
4. 背景属性：background. background-color. background-image. background-repeat. background-position. background-attachment  
5. 定位属性：float. clear. position. top. right. bottom. left. min-width. min-height. max-width. max-height. overflow. clip. z-index  
6. 生成内容属性：content. counter-reset. counter-increment  
7. 轮廓样式属性：outline-style. outline-width. outline-color. outline  
8. 页面样式属性：size. page-break-before. page-break-after  
9. 声音样式属性：pause-before. pause-after. pause. cue-before. cue-after. cue. play-during  
  
<a id='id2'></a>  
  
## 有继承性的属性  
1. 字体系列属性  
font：组合字体  
font-family：规定元素的字体系列  
font-weight：设置字体的粗细  
font-size：设置字体的尺寸  
font-style：定义字体的风格  
font-variant：设置小型大写字母的字体显示文本，这意味着所有的小写字母均会被转换为大写，但是所有使用小型大写字体的字母与其余文本相比，其字体尺寸更小。  
font-stretch：对当前的 font-family 进行伸缩变形。所有主流浏览器都不支持。  
font-size-adjust：为某个元素规定一个 aspect 值，这样就可以保持首选字体的 x-height。  
2. 文本系列属性  
text-indent：文本缩进  
text-align：文本水平对齐  
line-height：行高  
word-spacing：增加或减少单词间的空白（即字间隔）  
letter-spacing：增加或减少字符间的空白（字符间距）  
text-transform：控制文本大小写  
direction：规定文本的书写方向  
color：文本颜色  
3. 元素可见性：visibility  
4. 表格布局属性：caption-side. border-collapse. border-spacing. empty-cells. table-layout  
5. 列表布局属性：list-style-type. list-style-image. list-style-position. list-style  
6. 生成内容属性：quotes  
7. 光标属性：cursor  
8. 页面样式属性：page. page-break-inside. windows. orphans  
9. 声音样式属性：speak. speak-punctuation. speak-numeral. speak-header. speech-rate. volume. voice-family. pitch. pitch-range. stress. richness. . azimuth. elevation  
  
<a id='id3'></a>  
  
## 所有元素可以继承的属性  

1. 元素可见性：visibility
2. 光标属性：cursor  

<a id='id4'></a>  
  
## 内联元素可以继承的属性  
1. 字体系列属性
2. 除text-indent、text-align之外的文本系列属性  

<a id='id5'></a>  
  
## 块级元素可以继承的属性  
1. text-indent、text-align
  
---   
### [讨论专区](https://github.com/Yrobot/Yrobot-FrontEnd-Blog/issues/1)  
### [返回首页](../../README.md)  
