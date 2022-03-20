---
title: 实用js语法糖
author: yrobot
keywords: js,ES6,ES,语法糖,实用,方便,前端
createTime: 2022年03月20日
---

## 帮助减少防御性代码: 可选链操作符(?.)

由于 JavaScript 是一门动态语言，所以我们访问对象属性的时候总是会很小心的做一系列的防御性编程

为了确保不出现`Can't read property xxx of null/undefined`，我们一般会在读取前判断一下

可选链操作符就可以很好的避免这种情况的报错

```js
const obj = { a: { b: [{ name: "yrobot" }] } };

// old
console.log(obj && obj.a && obj.a.b.length && obj.a.b[0].name); // yrobot

// new
console.log(obj?.a?.b?.[0]?.name); // yrobot
console.log(obj?.b?.c?.d); // undefined
```

## 减少声明赋值代码: 结构赋值

支持对象解构

```js
const obj = {
  a: 1,
  b: 2,
  c: 3,
  d: 4,
  e: 5,
};
// old
const a = obj.a;
const b = obj.b;
const newC = obj.c;
const newD = obj.d;
const e = obj.e;

// new
const { a, b, c: newC, d: newD, e } = obj;
```

还支持数组结解构

```js
const arr = [1, 2, 3, 4, 5];

// old
const num1 = arr[0];
const num2 = arr[1];
const num3 = arr[2];
const num5 = arr[4];

// new
const [num1, num2, num3, _, num5] = arr;
```

## 快速合并数组&对象: 扩展运算符(...)

```js
const a = [1, 2, 3];
const b = [1, 5, 6];
const c = [1, 4, 7];
// old
const arr = a.concat(b).concat(c); //[1,2,3,1,5,6,1,4,7]
// new
const arr = [...a, ...b, ...c]; //[1,2,3,1,5,6,1,4,7]
```

```js
const obj1 = {
  a: 1,
};
const obj2 = {
  b: 1,
};
// old
const obj = Object.assign({}, obj1, obj2); // {a:1,b:1}
// new
const obj = { ...obj1, ...obj2 }; // {a:1,b:1}
```

## 数组相对索引项: Array.prototype.at()

```js
// 获取最后一项
var arr = [1, 2, 3, 4, 5];

// old
console.log(arr[arr.length - 1]); //5
// new
console.log(arr.at(-1)); // 5
```

## 使用 Proxy 替代 Object.defineProperty

为什么使用 Proxy 替代 Object.defineProperty，简单总结 Proxy 的几点优势:

- Proxy 是对整个对象的代理，而 Object.defineProperty 只能代理某个属性
- 对象上新增属性，Proxy 可以监听到，Object.defineProperty 不能
- 数组新增修改，Proxy 可以监听到，Object.defineProperty 不能
- 若对象内部属性要全部递归代理，Proxy 可以只在调用的时候递归，而 Object.defineProperty 需要一次完成所有递归，性能比 Proxy 差

使用也很简单，Proxy 本质是构造函数，通过 new 即可产生对象，它接收两个参数：

- **target**: 表示的就是要拦截（代理）的目标对象
- **handler**: 是用来定制拦截行为（13 种）

例如响应式 reactive 的基本实现：

```js
function reactive(obj) {
  return new Proxy(obj, {
    get(target, key) {
      // 可以做依赖收集
      track(target, key);
      return target[key];
    },
    set(target, key, val) {
      target[key] = val;
      // 触发依赖
      trigger(target, key);
    },
  });
}
```

## 使用动态导入 import()实现按需加载

我们可以使用 import  语句初始化的加载依赖项

```js
import defaultExport from "module-name";
import \* as name from "module-name";
```

但是静态引入的 import  语句需要依赖于 type="module" 的 script 标签，而且有的时候我们希望可以根据条件来按需加载模块，比如以下场景：

- 当静态导入的模块很明显的降低了代码的加载速度且被使用的可能性很低，或者并不需要马上使用它
- 当静态导入的模块很明显的占用了大量系统内存且被使用的可能性很低
- 当被导入的模块，在加载时并不存在，需要异步获取
- 当被导入的模块有副作用，这些副作用只有在触发了某些条件才被需要时

这个时候我们就可以使用动态引入 import()，它跟函数一样可以用于各种地方，返回的是一个  promise

基本使用如下两种形式

```js
// way 1
import("/modules/my-module.js").then((module) => {
  // Do something with the module.
});

// way 2
let module = await import("/modules/my-module.js");
```

## 使用哈希前缀#将类字段设为私有

```js
class ClassWithPrivateField {
  #privateField;
  #privateMethod() {
    return "hello world";
  }
  constructor() {
    supper();
    this.privateField = 99;
  }
}

const instance = new ClassWithPrivateField();
console.log(instance.privateField); //undefined
console.log(instance.privateMethod); //undefined
```

## 数组扁平化: Array.prototype.flat()

```js
const deepArr = [[1, [2, 2], 1]];

// depth = 1
deepArr.flat(); // [1, [2, 2], 1]

// depth = 2
deepArr.flat(2); // [1, 2, 2, 1]
```

展开所有嵌套数组

```js
const deepArr = [[1, [2, 2, [3, [4, [5, [6]]]]], 1]];

deepArr.flat(Infinity); // [1, 2, 2, 3, 4, 5, 6, 1]
```

flat() 还能移除数组中的空位（Empty Slots）

```js
const arr = [1, , 3, , 5];

arr.flat(); // [1, 3, 5];
```

##
