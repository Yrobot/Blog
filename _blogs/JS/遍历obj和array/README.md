---
title: 遍历obj和array
author: yrobot
keywords: array,obj,遍历
createTime: 1535040000000
createTimeStr: 2018年08月24日
length: 1525
---

__本页目录：__   
[基础for循环](#for)  
[for in 循环](#forin)  
[for of 循环](#forof)  
[array.forEach()方法](#foreach)  
[总结](#summary)  

<a id='for'></a>

## 1. 基础for循环
```
for (var index = 0; index < myArray.length; index++) {
  console.log(myArray[index]);
}
```

<a id='forin'></a>

## 2. for in 循环
- for...in 语句用于对数组或者对象的属性进行循环操作。
```
for(let i in array)  // i为数组的index：0，1，2，3.....
for(let i in obj)  // i为obj 的属性名
```
![](https://ws3.sinaimg.cn/large/006tNbRwgy1fukqtphbb9j31e60bwgmv.jpg)
<a id='forof'></a>

## 3. for of 循环
参考链接：https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Statements/for...of
```
for (let value of iterable) {  // value为属性值
    //statements
}
``` 
__value__  
在每次迭代中，将不同属性的值分配给变量。 

__iterable__ ( Array，Map，Set，String，TypedArray，arguments 对象等等) (obj不是iterable)  
被迭代枚举其属性的对象。  
![](https://ws4.sinaimg.cn/large/006tNbRwgy1fukqtq7vk6j31e60fqmzh.jpg)  

<a id='foreach'></a>

## 4. array.forEach()方法
```
arr.forEach(function callback(value[, index[, array]]) { // value:属性值，index:当前索引，array:当前遍历数组
    //your iterator
}[, thisArg]);   // thisArg:作为callback函数的this值
``` 
![](https://ws2.sinaimg.cn/large/006tNbRwgy1fukqto6spyj31ec0c0dh4.jpg)

<a id='summary'></a>

## 总结
1. 少用for of，支持不好。性能也一般。性能基础for优化较好
2. 遍历array，以上方法均可
3. 遍历obj思路：
    1. 获取obj的keys，利用基础for遍历
    2. for in利用属性名获取属性值
    3. 利用object.keys()方法获取keys，再用keys.forEach()遍历获取属性值

