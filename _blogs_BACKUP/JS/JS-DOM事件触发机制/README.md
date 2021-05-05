# JS-DOM事件触发机制  
时间：2018年08月24日  
作者：Yrobot  

__本页目录：__   
[问题的起因](#id1)  
[事件冒泡](#id2)  
[事件捕获](#id3)  
[addEventListener的第三个参数](#id4)  
[事件捕获先还是事件冒泡先？](#id5)  

---

<a id='id'></a>

## 问题的起因
- 事件冒泡和事件捕获分别由微软和网景公司提出，这两个概念都是为了解决页面中事件流（事件发生顺序）的问题。  
- 考虑下面这段代码，就不写html->head,body之类的代码了，自行脑补  
    ```
    <div id="outer">
        <p id="inner">Click me!</p>
    </div>
    ```
- 上面的代码当中一个div元素当中有一个p子元素，如果两个元素都有一个click的处理函数，那么我们怎么才能知道哪一个函数会首先被触发呢？  
- 为了解决这个问题微软和网景提出了两种几乎完全相反的概念：__事件冒泡 和 事件捕获__。 

<a id='id2'></a>

## 事件冒泡
- 微软提出了名为事件冒泡(event bubbling)的事件流。事件冒泡可以形象地比喻为把一颗石头投入水中，泡泡会一直从水底冒出水面。也就是说，事件会从最内层的元素开始发生，一直向上传播，直到document对象。  

- 因此在事件冒泡的概念下在p元素上发生click事件的顺序应该是 __p -> div -> body -> html -> document__ 
<a id='id3'></a>

## 事件捕获
- 网景提出另一种事件流名为事件捕获(event capturing)。与事件冒泡相反，事件会从最外层开始发生，直到最具体的元素。

- 因此在事件捕获的概念下在p元素上发生click事件的顺序应该是 __document -> html -> body -> div -> p__

<a id='id4'></a>

## addEventListener的第三个参数
- 网景 和 微软 曾经的战争还是比较火热的，当时， 网景主张捕获方式，微软主张冒泡方式。后来 w3c 采用折中的方式，平息了战火，制定了统一的标准—— __先捕获再冒泡__。 
- __document -> html -> body -> div -> p -> div -> body -> html -> document__
   
addEventListener的第三个参数就是为冒泡和捕获准备的.   

`element.addEventListener(event, function, useCapture)`

第一个参数`event`是需要绑定的事件(string,例：'click')  
第二个参数`function`是触发事件后要执行的函数  
第三个参数`useCapture`默认值是false，表示在事件冒泡阶段调用事件处理函数; 如果参数为true，则表示在事件捕获阶段调用处理函数。  
 
<a id='id5'></a>

## 事件捕获先还是事件冒泡先？
- 当事件捕获和事件冒泡一起存在的情况，事件又是如何触发呢？  
 
- 这里记被点击的DOM节点为`target`节点：  
    1. `document` 往 `target`节点，捕获前进，遇到注册的捕获事件立即触发执行  

    2. 到达`target`节点，触发事件（对于`target`节点上，是先捕获还是先冒泡则捕获事件和冒泡事件的注册顺序，先注册先执行）  

    3. `target`节点 往 `document `方向，冒泡前进，遇到注册的冒泡事件立即触发

- __总结__ :  
1. 对于非target节点则先执行捕获在执行冒泡  
2. 对于target节点则是先执行先注册的事件，无论冒泡还是捕获

#### 例子
```
<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <title>TestJSevent</title>
    <style>
        #son {
            width: 100px;
            height: 100px;
            background-color: #0f0;
        }
    </style>
</head>

<body>
    <div id="father">
        <div id="mather">
            <div id="son"></div>
        </div>
    </div>
    <div id="text"></div>
    <script>  
        var Son = document.getElementById("son");
        var Father = document.getElementById("father");
        function Click(Id, Type) {
            document.getElementById("text").innerHTML += Id + "  " + Type + " clicked  ||   ";
        }
        Son.addEventListener("click", function () { Click("son", "false") }, false);
        Son.addEventListener("click", function () { Click("son", "true") }, true);
        Father.addEventListener("click", function () { Click("father", "true") }, true);
        Father.addEventListener("click", function () { Click("father", "false") }, false);
        mather.addEventListener("click", function () { Click("mather", "true") }, true);
        mather.addEventListener("click", function () { Click("mather", "false") }, false);  
    </script>
</body>

</html>
```
输出：
father true clicked || mather true clicked || son false clicked || son true clicked || mather false clicked || father false clicked ||
<br><br>
#### IE浏览器兼容  
IE浏览器对addEventListener兼容性并不算太好，只有IE9以上可以使用。要兼容旧版本的IE浏览器，可以使用IE的attachEvent函数

`object.attachEvent(event, function)`

两个参数与`addEventListener`相似，分别是事件和处理函数，默认是事件冒泡阶段调用处理函数，要注意的是，写事件名时候要加上"`on`"前缀（"`onload`"、"`onclick`"等）。

--- 
### [讨论专区](https://github.com/Yrobot/Yrobot-FrontEnd-Blog/issues/1)  
### [返回首页](../../README.md)
