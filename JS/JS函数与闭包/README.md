# JS函数与闭包  
时间：2018年08月24日  
作者：Yrobot  

__本页目录：__   
[JS函数](#func)  
[闭包](#bibao)  

<a id='func'></a>

## JS函数

#### 1. __js函数的[[scope]]__  
- 每个javascript函数都是一个对象，对象中有些属性我们可以访问，但有些仅供javascript引擎存取，比如[[scope]]，他就是我们所指的作用域，其中储存了 __运行期上下文的集合__。
- 可以将[[scope]]理解为函数仓库链，函数寻找变量的时候就根据这个链来查找。  

#### 2. __运行期上下文__  
- 函数执行前创建的对象（AO=运行期上下文：理解为本函数自带的仓库），用于定义函数运行时的环境。函数被多次调用时，会创建多个运行期上下文。
- 当函数执行完毕，其运行期上下文引用被自动销毁（只是切断引用，其AO仍然存在，AO只有在没有被函数链接时才被回收）。

#### 3. __运行期上下文如何从内存中销毁__  
- 当此上下文没有被任何函数链接时，js引擎会自动将其回收。但只要还有函数在引用此上下文（存在闭包的情况），则此上下文不会被回收。
- 所以只要通过 __将闭包变量设置为等于null__ 解除该函数（以及其上下文）的引用，就等于通知垃圾回收例程将其清除。

#### 4. __函数如何查找变量__  
- 从[[scope]]作用域链的顶端开始向下查找。即从自身的执行器上下文开始找变量，未找到则转向[[scope]]的下一个上下文。 

#### 例子
- 例1：  
![](https://ws4.sinaimg.cn/large/006tNbRwgy1fukrtxws7nj30jf0o0n3w.jpg)   
![](https://ws3.sinaimg.cn/large/006tNbRwgy1fukru71y2pj30s30lhqpc.jpg)  
![](https://ws4.sinaimg.cn/large/006tNbRwgy1fukrucycgnj30tl0nekhv.jpg)  

- 例2：  
![](https://ws4.sinaimg.cn/large/006tNbRwgy1fukrw1ajtzj30ki0m2wr1.jpg)  
![](https://ws4.sinaimg.cn/large/006tNbRwgy1fukrw1ajtzj30ki0m2wr1.jpg)  

<a id='bibao'></a>

## 闭包 
- __闭包是指 有权访问另一个函数作用域中的变量 的函数__  
- 由于在Javascript语言中，只有函数内部的子函数才能读取局部变量，因此可以把闭包简单理解成“定义在一个函数内部的函数”。所以，在本质上，__闭包就是将函数内部和函数外部连接起来的一座桥梁__。
```
function createComparisonFunction(propertyName) {
  return function (object1, object2) {
    var value1 = object1[propertyName];
    var value2 = object2[propertyName];
    if (value1 < value2) {
      return -1;
    } else if (value1 > value2) {
      return 1;
    } else {
      return 0;
    }
  };
}

//创建函数 
var compareNames = createComparisonFunction("name");

//调用函数 
var result = compareNames({name: "Nicholas"}, {name: "Greg"});

//解除对匿名函数的引用（以便释放内存）
compareNames = null;
```

#### 闭包作用：
  1. 实现公有变量  
  2. 可以做缓存  
  3. 可以实现封装，属性私有化  
  4. 模块化开发，防止污染全局变量   

#### 闭包注意点：
  1. 由于闭包会携带包含它的函数的作用域，因此会比其他函数占用更多的内存。过度使用闭包可能会导致内存占用过多，造成内存泄漏。  
  2. 作用域链的这种配置机制引出了一个值得注意的副作用，即闭包只能取得包含函数中任何变量的后一个值。  


--- 
### [返回首页](/README.md)
