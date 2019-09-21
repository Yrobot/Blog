# CSS3动画  
时间：2018年08月28日  
作者：Yrobot  

__本页目录：__   
[怎么使用](#id1)  
- [定义动画](#id11)
- [引用动画，设定参数](#id12)  

[浏览器支持](#id3)  

__CSS3新增的动画属性：__  通过CSS3动画，我们能够创建动画，这可以在许多网页中取代动画图片、Flash动画 以及 JavaScript。作为页面切换的交互动画。

__NOTE：__  
1. 一个元素要使用多个动画时（比如前一秒动画1，后面动画2），可以在css属性中用一个animation表示，动画之间用逗号相隔。例子：`animation: animation1 1s, animation2 1s 1s infinite alternate ;`

<a id='id1'></a>

## 怎么使用
首先用我的话来大致概括一下css3动画的使用流程：
1. 首先定义一个动画，使用`@keyframes`来定义动画(包括动画名、动画过程状态)
2. 在一个元素的class中引用刚定义的动画，设定相关参数(动画时长、动画线性、动画延迟、元素开始和结束的状态、动画是否暂停)    

这样一个css3动画就被定义和使用了。

<a href="" id="id11"></a>

#### 1. 定义动画  
#### __语法：__   
- `@keyframes`  @keyframes 规则用于创建动画。在 @keyframes 中规定某项 CSS 样式，就能作为动画中某一帧的状态。   
    __示例：__ 规定一个名叫``myAnimation``的动画   
    ```
    @keyframes myAnimation
    {
    0%   {background: red;}
    25%  {background: yellow;}
    50%  {background: blue;}
    100% {background: green;}
    }

    @-moz-keyframes myAnimation /* Firefox */
    {
    0%   {background: red;}
    25%  {background: yellow;}
    50%  {background: blue;}
    100% {background: green;}
    }

    @-webkit-keyframes myAnimation /* Safari 和 Chrome */
    {
    0%   {background: red;}
    25%  {background: yellow;}
    50%  {background: blue;}
    100% {background: green;}
    }

    @-o-keyframes myAnimation /* Opera */
    {
    0%   {background: red;}
    25%  {background: yellow;}
    50%  {background: blue;}
    100% {background: green;}
    }
    ```  

<a href="" id="id12"></a>

#### 2. 引用动画，设定参数  
在要设定动画的元素class上使用  
#### __语法：__   
- `animation`	所有动画属性的简写属性，除了 animation-play-state 和 animation-fill-mode 属性。  
    __语法：__ `animation: name duration timing-function delay iteration-count direction;`   
    语法参数含义参看后面的语法解析。   
    __示例：__ 
    ```
    div
    {
    animation: myAnimation 5s infinite;
    -webkit-animation: myAnimation 5s infinite; /* Safari 和 Chrome */
    }
    ```   
- `animation-name`	要引用 @keyframes 动画的名称。  
    
- `animation-duration`	规定动画完成一个周期所花费的秒或毫秒。默认是 0。
     
- `animation-timing-function`	规定动画的速度曲线。默认是 "ease"。  
    __语法：__ `animation-timing-function: value;`     
    _linear_：	动画从头到尾的速度是相同的。  
    _ease_：	默认。动画以低速开始，然后加快，在结束前变慢。  
    _ease-in_：	动画以低速开始。  
    _ease-out_：	动画以低速结束。  
    _ease-in-out_：	动画以低速开始和结束。  
    _cubic-bezier(n,n,n,n)_： 在 cubic-bezier 函数中自己的值。可能的值是从 0 到 1 的数值。   
    __示例：__   
    ```
    /* W3C 和 Opera: */
    #div1 {animation-timing-function: linear;}

    /* Firefox: */
    #div1 {-moz-animation-timing-function: linear;}

    /* Safari 和 Chrome: */
    #div1 {-webkit-animation-timing-function: linear;}
    ```
- `animation-delay`	规定动画何时开始。默认是 0。  
  
- `animation-iteration-count`	规定动画被播放的次数。默认是 1。    
    __语法：__ `animation-iteration-count: value;`       
    _n_：	 定义动画播放次数的数值。  
    _infinite_：	规定动画应该无限次播放。    
    __示例：__   
    ```
    div
    {
    animation-iteration-count: 3;
    -webkit-animation-iteration-count: 3; /* Safari 和 Chrome */
    }
    ```
- `animation-direction`	规定动画是否在下一周期逆向地播放。默认是 "normal"。  
    __语法：__ `animation-direction: normal|alternate;`       
    _normal_：	默认值。动画应该正常播放。  
    _alternate_：	动画应该轮流反向播放。      
    __示例：__   
    ```
    div
    {
    animation-direction: alternate;
    -webkit-animation-direction: alternate; /* Safari 和 Chrome */
    }
    ```
- `animation-play-state`	规定动画是否正在运行或暂停。默认是 "running"。  
   __语法：__ `animation-play-state: paused|running;`       
    _paused_： 规定动画已暂停。  
    _running_：	规定动画正在播放。       
    __示例：__   
    ```
    div
    {
    animation-play-state: paused;
    -webkit-animation-play-state: paused; /* Safari 和 Chrome */
    }
    ```
- `animation-fill-mode`	规定对象动画时间之外的状态。     
   __语法：__ `animation-fill-mode : none | forwards | backwards | both;`       
    _none_： 不改变默认行为。   
    _forwards_： 当动画完成后，保持最后一个属性值（在最后一个关键帧中定义）。  
    _backwards_： 在 animation-delay 所指定的一段时间内，在动画显示之前，应用开始属性值（在第一个关键帧中定义）。  
    _both_： 向前和向后填充模式都被应用。         
    __示例：__   
    ```
    div
    {
    animation-fill-mode: forwards;
    -webkit-animation-fill-mode: forwards; /* Safari 和 Chrome */
    }
    ``` 

#### __效果：__
[参考W3school的demo](http://www.w3school.com.cn/tiy/t.asp?f=css3_animation4)

<a href="" id="id3"></a>

## 浏览器支持
![](https://ws2.sinaimg.cn/large/0069RVTdgy1fupd51aiv4j30u209k76w.jpg)  
Internet Explorer 10、Firefox 以及 Opera 支持 @keyframes 规则和 animation 属性。  
Chrome 和 Safari 需要前缀 -webkit-。

--- 
### [评论专区](https://github.com/Yrobot/Yrobot-FrontEnd-Blog/issues/1)  
### [返回首页](../../README.md)
