---
title: Hello
slug: home
---

# JSON使用注意点  
时间：2018年08月23日  
作者：Yrobot  

__本页目录：__   
[关于引入](#import)  
[关于操作](#todo)  


<a href="" id="import"></a>

## 关于引入？
早期的JSON解析器基本上就是使用JavaScript的eval()函数。由于JSON是JavaScript语法的自己，因此eval()函数可以解析、解释并返回JavaScript的对象和数组。

ECMAScript 5对解析JSON的行为进行了规范，定义了全局对象JSON。

![](https://ws2.sinaimg.cn/large/006tNbRwgy1fuklqfg3zcj30hi06sjro.jpg)
据网上资料，浏览器对JSON的支持情况 ： IE8 chrome1+ safari3+ firefox3+，所以在这些浏览器中使用JSON可以不引入json2.js，在其他低版本浏览器中需要引入json2.js。所以，默认引入即可，去除注释的json2也才8kb不到。

<a href="" id="todo"></a>

## 关于操作？
-  __JSON.parse(string) ：接受一个 JSON字符串 并将其转换成一个 JavaScript 对象。__
-  __JSON.stringify(obj) ：接受一个 JavaScript 对象并将其转换为一个 JSON字符串。__

#### 1. __JSON.parse() 不允许在末尾添加多余的逗号__  
- 下面两行代码都会抛出错误:  
1 JSON.parse('[1, 2, 3, 4, ]');  
2 JSON.parse('{"foo" : 1, }');  
3 // SyntaxError JSON.parse: unexpected character   
4 // at line 1 column 14 of the JSON data  
- 省略末尾多余的逗号解析 JSON 就是正确:  
1 JSON.parse('[1, 2, 3, 4 ]');  
2 JSON.parse('{"foo" : 1 }');  

#### 2. __JSON 的属性名必须使用双引号__  
- 属性名上不能使用单引号，例如： 'foo'。  
1 JSON.parse("{'foo' : 1 }");  
2 // SyntaxError: JSON.parse: expected property name or '}'   
3 // at line 1 column 2 of the JSON data  
- 取而代之，写成 "foo"：  
1 JSON.parse('{"foo" : 1 }');  

#### 3. __数字不能用 0 开头，比如01，并且你的小数点后面必须跟着至少一个数字。__  
- 数字不能用 0 开头，比如01 ,小数点后面必须跟着至少一个数字。
1 JSON.parse('{"foo" : 01 }');  
2 // SyntaxError: JSON.parse: expected ',' or '}' after property value   
3 // in object at line 1 column 2 of the JSON data  
|
4 JSON.parse('{"foo" : 1. }');   
5 // SyntaxError: JSON.parse: unterminated fractional number   
6 // at line 1 column 2 of the JSON data  
- 正确的写法应该是只写一个1，不书写前面的0。在小数点的后面至少要跟上一个数字:  
1 JSON.parse('{"foo" : 1 }');  
2 JSON.parse('{"foo" : 1.0 }');  
   


### [讨论专区](https://github.com/Yrobot/Yrobot-FrontEnd-Blog/issues/1)  
### [返回首页](../../README.md)

