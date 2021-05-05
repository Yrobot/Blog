# THIS的指向
时间：2018年08月24日  
作者：Yrobot

__本页目录：__   
[this的建立](#build)   
[this指向](#index)   
[this规则概括](#rule)  

<a id='build'></a>

## this的建立
- 一般函数在预编译过程中生成的AO上下文  
- AO中除了函数内的一些属性和函数参数外，还有`arguments`和`this`(箭头函数没有)。  
- 所以函数（除了箭头函数）预编译过程会生成`this`隐式对象，并 __默认指向window。__  

<a id='index'></a>

## this指向
- 而在预编译过程中，`this`会默认指向`window`。  
- 而`new`操作时，会在函数内生成一个隐式`this`对象，而同时改变AO中`this`指向为本`this`
- 用`obj.func()`调用的时候，会将`func()`内的`this`指向改为`obj`  
- #### 以上`this`的修改是在`func`有`this`的情况下，箭头函数没有this，直接沿着作用域链向上寻找this  
- #### 注意函数作用域链的数据是由函数参数、函数内声明组成，fun.prop无法增加或更改作用域    

<a id='rule'></a>

## this规则概括

1. 函数编译过程中AO上下文中`this`默认指向`window`  
2. 全局作用域里`this`指向`window`  
3. `call`/`apply`可以利用参数改变`this`的指向  
4. `obj.fun()`调用时，`fun()`AO中`this`指向obj (`new` 生成对象时默认`return this`，所以只有`this.xxx`的属性才能被访问到)  
5. html元素脚本中，函数参数中的`this`指向元素本身  

---
### [讨论专区](https://github.com/Yrobot/Yrobot-FrontEnd-Blog/issues/1)  
### [返回首页](../../README.md)
