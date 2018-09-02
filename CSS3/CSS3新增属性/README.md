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
__CSS3新增的3D变换属性：__  CSS3 3D 转换支持开发者在css代码中利用css3的3D函数，在页面里开发出一些简单的3D效果。  

跳转 [CSS3-3D转换/RAEDME.md](../CSS3-3D转换/README.md)

__浏览器支持：__
![](https://ws4.sinaimg.cn/large/006tNbRwgy1fuqf7u1vz0j30u204ot9y.jpg)
Internet Explorer 10 和 Firefox 支持 3D 转换。  
Chrome 和 Safari 需要前缀 -webkit-。  
Opera 仍然不支持 3D 转换（它只支持 2D 转换）。

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
__CSS3新增的多列属性：__ 使用css3多列属性，可以将内容分成几列，类似报纸中文章的形式。   
1. __column-count__: 规定元素应该被分隔的列数。  
   __语法：__   `column-count: number|auto;`  
   - `number` 元素内容将被划分的最佳列数。   
   - `auto` 由其他属性决定列数，比如 "column-width"。      
   __示例：__   
   ```
    div
    {
    -moz-column-count: 3; /* Firefox */
    -webkit-column-count: 3; /* Safari 和 Chrome */
    column-count: 3;
    }
   ``` 
   ![](https://ws2.sinaimg.cn/large/006tNbRwgy1fuqrbczw9jj30x80d679n.jpg)

2. __column-fill__: 规定如何填充列。  
   __语法：__   `column-fill: balance|auto;`  
   - `balance` 对列进行协调。浏览器应对列长度的差异进行最小化处理。   
   - `auto` 按顺序对列进行填充，列长度会各有不同。      
   __示例：__   
   ```
    div
    {
    column-fill:auto;
    }
   ``` 

3. __column-gap__: 规定列之间的间隔。  
   __语法：__   `column-gap: length|normal;`  
   - `length` 把列间的间隔设置为指定的长度。   
   - `normal` 规定列间间隔为一个常规的间隔。W3C 建议的值是 1em。      
   __示例：__   
   ```
    div
    {
    -moz-column-gap:40px; /* Firefox */
    -webkit-column-gap:40px; /* Safari 和 Chrome */
    column-gap:40px;
    }
   ``` 
   ![](https://ws3.sinaimg.cn/large/006tNbRwgy1fuqrjcfhi9j30xi08wdiy.jpg)
   
4. __column-rule__: 设置所有 column-rule-* 属性的简写属性。包括 列之间 的 颜色、样式、宽度    
   __语法：__   `column-rule: column-rule-width column-rule-style column-rule-color;`  
   - __`column-rule-width`__	设置列之间的宽度规则。 
        - __语法：__   `column-rule-width: thin|medium|thick|length;`   
        - `thin`	定义纤细规则。  
        - `medium`	定义中等规则。  
        - `thick`	定义宽厚规则。    
        - `length`	规定规则的宽度。
   - __`column-rule-style`__	设置列之间的样式规则。  
        - __语法：__   `column-rule-style: none|hidden|dotted|dashed|solid|double|groove|ridge|inset|outset;`   
        - `none`	定义没有规则。	  
        - `hidden`	定义隐藏规则。	  
        - `dotted`	定义点状规则。	  
        - `dashed`	定义虚线规则。	  
        - `solid`	定义实线规则。	  
        - `double`	定义双线规则。	  
        - `groove`	定义 3D grooved 规则。该效果取决于宽度和颜色值。	  
        - `ridge`	定义 3D ridged 规则。该效果取决于宽度和颜色值。	  
        - `inset`	定义 3D inset 规则。该效果取决于宽度和颜色值。	  
        - `outset`	定义 3D outset 规则。该效果取决于宽度和颜色值。	  

   - __`column-rule-color`__	设置列之间的颜色规则。   
        - __语法：__   `column-rule-color: color;`   
        - `color`	规定颜色规则。请参阅 [CSS 颜色值](http://www.w3school.com.cn/cssref/css_colors_legal.asp)。  
  
   __示例：__   
   ```
    div
    {
    -moz-column-rule:3px outset #ff0000;	/* Firefox */
    -webkit-column-rule:3px outset #ff0000;	/* Safari and Chrome */
    column-rule:3px outset #ff0000;
    }
   ``` 
   ![](https://ws2.sinaimg.cn/large/006tNbRwgy1fusmomdnszj30xg09mgpn.jpg)
   
__浏览器支持：__
![](https://ws3.sinaimg.cn/large/006tNbRwgy1fuqqzk5gl6j30u20eewi4.jpg) 
Internet Explorer 10 和 Opera 支持多列属性。  
Firefox 需要前缀 -moz-。  
Chrome 和 Safari 需要前缀 -webkit-。  

<a id='id10'></a>

## CSS3 用户界面
__CSS3新增的用户界面属性：__ 利用css3的用户界面属性，可以重设元素尺寸、盒尺寸以及轮廓等。  

__先看所有的用户界面属性__   
- `appearance`	允许您将元素设置为标准用户界面元素的外观  
- `box-sizing`	允许您以确切的方式定义适应某个区域的具体内容。  
- `icon`	为创作者提供使用图标化等价物来设置元素样式的能力。  
- `nav-down`	规定在使用 arrow-down 导航键时向何处导航。  
- `nav-index`	设置元素的 tab 键控制次序。	  
- `nav-left`	规定在使用 arrow-left 导航键时向何处导航。	  
- `nav-right`	规定在使用 arrow-right 导航键时向何处导航。	  
- `nav-up`	规定在使用 arrow-up 导航键时向何处导航。	  
- `outline-offset`	对轮廓进行偏移，并在超出边框边缘的位置绘制轮廓。	  
- `resize`	规定是否可由用户对元素的尺寸进行调整。	  

__我这边简单介绍一下 浏览器支持比较好的 几个属性__  
1. __box-sizing__: 改变css 的 width、height 在盒模型中的指向。  
   - 因为css默认width指向的是盒模型的内容宽度(图中蓝色部分)，而 整个盒模型的宽度 = padding + border + 内容width，整个盒模型所占据文本流的位置还要包括其margin值。  
   - 而一般我们所想的，我们设置的width值，应该是 整个盒模型的宽度，所以问题就产生了。  
   - 那么这个`box-sizing`，就是用来解决width、height 在盒模型中的指向问题的。  
   ![](https://ws4.sinaimg.cn/large/006tNbRwgy1fusoa0l7n5j30ak0aa74j.jpg)  

   __语法：__   `box-sizing: content-box|border-box|inherit;`  
   - `content-box` 默认，CSS2.1 规定的宽度高度行为。将width、height指向内容宽度，padding、border不被包括在内。  
    _width、height指向如下图：_  
    ![](https://ws3.sinaimg.cn/large/006tNbRwgy1fusob65rl6j30au0aeaam.jpg) 
   - `border-box` width指向 内容宽度+padding+border，内容宽度根据减法自适应。height同理。  
    _width、height指向如下图：_  
    ![](https://ws2.sinaimg.cn/large/006tNbRwgy1fusob3mmr2j30au0aeq3i.jpg)
   - `inherit`   继承 父元素 box-sizing属性的值。  
   
   __示例：__   
   ```
    div
    {
    box-sizing:border-box;
    -moz-box-sizing:border-box; /* Firefox */
    -webkit-box-sizing:border-box; /* Safari */
    }
   ``` 
   __浏览器支持：__
    ![](https://ws4.sinaimg.cn/large/006tNbRwgy1fusofkoju7j30vc06oabn.jpg)
    Internet Explorer、Opera 以及 Chrome 支持 box-sizing 属性。  
    Firefox 支持替代的 -moz-box-sizing 属性。   

2. __outline-offset__: 此属性对轮廓进行偏移。  
   __语法：__   `outline-offset: length|inherit;`  
   - `length`	轮廓与边框边缘的距离。  
   - `inherit`	规定应从父元素继承 outline-offset 属性的值。  
   
   __示例：__   
   ```
    div
    {
    border:2px solid black;
    outline:2px solid red;
    outline-offset:15px;
    }
   ```  
   __使用对比：__ _后者为使用了`outline-offset:15px;`_   
   ![](https://ws1.sinaimg.cn/large/006tNbRwgy1fuson2ha9gj30ck07mwev.jpg)
   ![](https://ws2.sinaimg.cn/large/006tNbRwgy1fusomvlpg6j30cs08ajrs.jpg)  
   __浏览器支持：__   
    所有主流浏览器都支持 outline-offset 属性，除了 Internet Explorer。  

__其余几个属性只有小部分浏览器支持__   
[__参看所有转换属性的使用__](http://www.w3school.com.cn/css3/css3_user_interface.asp)  


--- 
### [返回首页](/README.md)
