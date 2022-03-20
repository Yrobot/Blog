---
title: THIS的指向
author: yrobot
keywords: THIS,指向
createTime: 2018年08月24日
---

**本页目录：**  
[this 的建立](#build)  
[this 指向](#index)  
[this 规则概括](#rule)

## this 的建立

- 一般函数在预编译过程中生成的 AO 上下文
- AO 中除了函数内的一些属性和函数参数外，还有`arguments`和`this`(箭头函数没有)。
- 所以函数（除了箭头函数）预编译过程会生成`this`隐式对象，并 **默认指向 window。**

## this 指向

- 而在预编译过程中，`this`会默认指向`window`。
- 而`new`操作时，会在函数内生成一个隐式`this`对象，而同时改变 AO 中`this`指向为本`this`
- 用`obj.func()`调用的时候，会将`func()`内的`this`指向改为`obj`

以上`this`的修改是在`func`有`this`的情况下，箭头函数没有 this，直接沿着作用域链向上寻找 this

注意函数作用域链的数据是由函数参数、函数内声明组成，fun.prop 无法 增加或更改作用域

## this 规则概括

1. 函数编译过程中 AO 上下文中`this`默认指向`window`
2. 全局作用域里`this`指向`window`
3. `call`/`apply`可以利用参数改变`this`的指向
4. `obj.fun()`调用时，`fun()`AO 中`this`指向 obj (`new` 生成对象时默认`return this`，所以只有`this.xxx`的属性才能被访问到)
5. html 元素脚本中，函数参数中的`this`指向元素本身

---
