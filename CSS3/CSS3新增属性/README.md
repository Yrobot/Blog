# CSS3新增属性  
时间：2018年08月27日  
作者：Yrobot  

__本页目录：__   
[CSS3 边框](#id1)  
[CSS3 背景](#id2)  
[CSS3 文本效果](#id3)  
[CSS3 字体](#id4)  
[CSS3 2D 转换](#id5)  
[CSS3 3D 转换](#id6)  
[CSS3 过渡](#id7)  
[CSS3 动画](#id8)  
[CSS3 多列](#id9)  
[CSS3 用户界面](#id10)  

本文框架主要参考[W3school的CSS教程](http://www.w3school.com.cn/css3/index.asp)，在此感谢!

<a id='id1'></a>

## CSS3 边框
__CSS3新增的边框属性：__  
1. __border-radius__：设置元素的圆角，还支持单个圆角设置，`border-top(bottom)-left(right)-radius`。  
   __语法：__ `border-radius: 1-4 length|% / 1-4 length|%;`  
   - 按此顺序设置每个 radii 的四个值(类似margin属性设置，对边相同可简写)。   
   - `ength` 定义圆角的形状。    
   - `%` 以百分比定义圆角的形状。  
   __示例：__ `border-radius:2em;`  
   __示例：__ `border-radius: 2em 1em 4em 3em;`  
   ![](https://ws1.sinaimg.cn/large/006tNbRwgy1fuocgpiov7j30hg0380su.jpg)  
2. __box-shadow__：设置元素方框阴影  
   __语法：__`box-shadow: h-shadow v-shadow blur spread color inset;`   
   - `h-shadow` 必需。水平阴影的位置。允许负值    	
   - `v-shadow` 必需。垂直阴影的位置。允许负值    
   - `blur` 可选。模糊距离    
   - `spread` 可选。阴影的尺寸     
   - `color` 可选。阴影的颜色   
   - `inset` 可选。将外部阴影 (outset) 改为内部阴影   
   __示例：__ `box-shadow: 10px 10px 5px #888888;`   
   ![](https://ws4.sinaimg.cn/large/006tNbRwgy1fuoch950z7j30j007kglk.jpg)  
3. __border-image__：设置元素的边框为图片   
   __语法：__   border-image 属性是一个简写属性   
   - `border-image-source` 用在边框的图片的路径。	  
   - `border-image-slice` 图片边框向内偏移。	  
   - `border-image-width` 图片边框的宽度。	  
   - `border-image-outset` 边框图像区域超出边框的量。	  
   - `border-image-repeat` 图像边框是否应平铺(repeated)、铺满(rounded)或拉伸(stretched)。    
   __示例：__   `border-image: url(/i/border_image_button.png) 0 14 0 14 stretch;`  
   ![](https://ws1.sinaimg.cn/large/006tNbRwgy1fuochr5fydj30lo04i0tb.jpg)

__浏览器支持：__
![](https://ws1.sinaimg.cn/large/006tNbRwgy1fuo2czkkuaj318w0eidkx.jpg)

<a id='id2'></a>

## CSS3 背景
__CSS3新增的背景属性：__  
1. __background-size__:  规定背景图像的尺寸  
   __语法：__   `background-size: length|percentage|cover|contain; `  
   - `length` 设置背景图像的高度和宽度。第一个值设置宽度，第二个值设置高度。如果只设置一个值，则第二个值会被设置为 "auto"。     
   - `percentage` 以父元素的百分比来设置背景图像的宽度和高度。第一个值设置宽度，第二个值设置高度。如果只设置一个值，则第二个值会被设置为 "auto"。   
   - __`cover`__ 把背景图像扩展至足够大，以使背景图像完全覆盖背景区域。背景图像的某些部分也许无法显示在背景定位区域中。  
   - __`contain`__ 把图像图像扩展至最大尺寸，以使其宽度和高度完全适应内容区域。     
   __示例：__   `border-radius:50%;`  
2. __background-origin__:  background-origin 属性规定 background-position 属性相对于什么位置来定位  
   __语法：__   `background-origin: padding-box|border-box|content-box; `    
   - `padding-box` 背景图像相对于内边距框来定位。	  
   - `border-box` 背景图像相对于边框盒来定位。 	  
   - `content-box` 背景图像相对于内容框来定位。	  
   __示例：__   `background-origin:content-box;`

__浏览器支持：__
![](https://ws2.sinaimg.cn/large/006tNbRwgy1fuo7a1mn2mj318w09q77m.jpg)

<a id='id3'></a>

## CSS3 文本效果
__CSS3新增的文本效果属性：__  
1. __text-shadow__:  text-shadow 属性向文本设置阴影   
   __语法：__   `text-shadow: h-shadow v-shadow blur color;`  
   - `h-shadow`	必需。水平阴影的位置。允许负值。  
   - `v-shadow`	必需。垂直阴影的位置。允许负值。   
   - `blur`	可选。模糊的距离。  
   - `color` 可选。阴影的颜色。  
   __示例：__   `text-shadow:2px 2px 8px #FF0000;`  
   ![](https://ws2.sinaimg.cn/large/006tNbRwgy1fuocifrqvpj30eo03odgz.jpg)
2. __word-wrap__:  word-wrap 属性允许长单词或 URL 地址换行到下一行  
   __语法：__   `word-wrap: normal|break-word;`  
   - `normal` 只在允许的断字点换行（浏览器保持默认处理）。 
   - `break-word` 在长单词或 URL 地址内部进行换行。   
   __示例：__   `word-wrap:break-word;`  
   ![](https://ws1.sinaimg.cn/large/006tNbRwgy1fuocjavfcdj313y0mogpb.jpg)

__浏览器支持：__
![](https://ws3.sinaimg.cn/large/006tNbRwgy1fuo7ays4aaj318s09iada.jpg)

<a id='id4'></a>

## CSS3 字体
__CSS3新增的字体属性：__  
1. __@font-face__:  它允许网页开发者为其网页指定在线字体,便于在后面font-family中调用   
   __语法：__   
   ```
    @font-face {
    [ font-family: <family-name>; ] ||
    [ src: [ <url> [ format(<string>#) ]? | <font-face-name> ]#; ] ||
    [ unicode-range: <urange>#; ] ||
    [ font-variant: <font-variant>; ] ||
    [ font-feature-settings: normal | <feature-tag-value>#; ] ||
    [ font-variation-settings: normal | [ <string> <number>] # ||
    [ font-stretch: <font-stretch>; ] ||
    [ font-weight: <weight>; ] ||
    [ font-style: <style>; ]
    }
   ```
   - `font-family` name 必需。规定字体的名称。  
   - `src` URL 必需。定义字体文件的 URL。  
   - `font-stretch`  可选。定义如何拉伸字体。默认是 "normal"。  
        normal  
        condensed  
        ultra-condensed  
        extra-condensed  
        semi-condensed  
        expanded  
        semi-expanded  
        extra-expanded  
        ultra-expanded  
   - `font-style`	可选。定义字体的样式。默认是 "normal"。  
        ormal  
        italic  
        oblique  
   - `font-weight` 可选。定义字体的粗细。默认是 "normal"。  
        normal  
        bold  
        100  
        200  
        300  
        400  
        500  
        600  
        700  
        800  
        900  
   - `unicode-range` unicode-range 可选。定义字体支持的 UNICODE 字符范围。默认是 "U+0-10FFFF"。    
   __示例：__   
   ```
    @font-face {
        font-family: "Bitstream Vera Serif Bold";
        src: url("http://developer.mozilla.org/@api/deki/files/2934/=VeraSeBd.ttf");
        }
    
    body { font-family: "Bitstream Vera Serif Bold", serif }
   ``` 

__浏览器支持：__
![](https://ws3.sinaimg.cn/large/006tNbRwgy1fuo7ituu00j318q04odhc.jpg)


<a id='id5'></a>

## CSS3 2D 转换
__CSS3新增的2D变换属性：__   通过 CSS3 转换，我们能够对元素进行移动、缩放、转动、拉长或拉伸。

跳转 [CSS3-2D转换/RAEDME.md](../CSS3-2D转换/README.md)

__浏览器支持：__
![](https://ws4.sinaimg.cn/large/006tNbRwgy1fuo7z8j9byj318s04s3zs.jpg)  
Chrome 和 Safari 需要前缀 -webkit-  
Internet Explorer 9 需要前缀 -ms-  

<a id='id6'></a>

## CSS3 3D 转换
__CSS3新增的3D变换属性：__  

<a id='id7'></a>

## CSS3 过渡
__CSS3的过渡属性：__  过渡属性可以设定元素在某些属性改变时，对变化过程填充逐渐变换的动画，类似于flash的补间动画  

跳转 [CSS3过渡/RAEDME.md](../CSS3过渡/README.md)

__浏览器支持：__
![](https://ws1.sinaimg.cn/large/0069RVTdgy1fup7uarmc3j30u204sjsn.jpg)

<a id='id8'></a>

## CSS3 动画
__CSS3新增的动画属性：__  通过CSS3动画，我们能够创建动画，这可以在许多网页中取代动画图片、Flash动画 以及 JavaScript。作为页面切换的交互动画。  

跳转 [CSS3动画/RAEDME.md](../CSS3动画/README.md)

__浏览器支持：__
![](https://ws2.sinaimg.cn/large/0069RVTdgy1fupd51aiv4j30u209k76w.jpg)  
Internet Explorer 10、Firefox 以及 Opera 支持 @keyframes 规则和 animation 属性。  
Chrome 和 Safari 需要前缀 -webkit-。


<a id='id9'></a>

## CSS3 多列
__CSS3新增的多列属性：__  


<a id='id10'></a>

## CSS3 用户界面
__CSS3新增的用户界面属性：__  

--- 
### [返回首页](/README.md)
