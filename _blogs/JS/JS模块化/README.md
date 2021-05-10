---
title: JS模块化
author: yrobot
keywords: JS,模块化
createTime: 1571068800000
createTimeStr: 2019年10月15日
length: 5233
---
<a id='top'></a>

# JS模块化  
<a href="#top" style="position: fixed;font-size: 30px;color: rgb(88, 153, 226);right: 10px;bottom: 20px;z-index: 999;">TOP</a>

__本页目录：__   
[前言](#pre)  
[无模块化](#none)  
[CommonJS规范](#commonjs)  
[AMD规范](#AMD)  
[CMD规范](#CMD)  
[ES6模块化](#ES6)  
[CommonJs和ES6区别](#ES6CMJS)  

__友情连接：__  
Q：那么新的ES6模块化对我们前端开发有什么意义呢？webpack就没有用了嘛？  
A：[探讨ESM对当前开发的意义或影响](../探讨ESM对当前开发的意义或影响/README.md)

<a id='pre'></a>

## 前言  
其实一直以来我在前端开发中都会用到模块化的相关知识，但是我总是一知半解的。  
而且目前完善的构建工具让我无需深入的了解前端模块的知识（用就得了，莽就行了）。  
但是有一天，我的后端室友发给我了一篇 [《愿未来没有 Webpack》](https://juejin.im/post/5d4bcdb7e51d453b386a62c6)

读完我不禁陷入了沉思。。。  
不知道是什么时候开始接收了webpack作为前端开发必备工具这件事了。  
而为什么要用webpack这件事，却从来没有问过自己。  
而文中提到的[@pika/web](https://github.com/pikapkg/web)，又是一个什么神奇的操作？

经过一段时间的学习理解，发现这原来是JS模块化造成的，总结成一句话就是：  
`浏览器无法支持commonjs模块化，所以需要打包工具将所有依赖和自写代码打包到一个文件中；而因为浏览器渐渐开始原生支持ESM，所以只要将commonjs规范转换成ESM规范，就可以直接在浏览器中静态引用了`  

所以在这探索的过程中，就不得不好好学习JS模块化的知识，本文就是对JS模块的一个学习总结 

by the way, 以下讲的是一些规范（用于模块化的理论而已），具体实现参看具体实现框架/库  


<a id='none'></a>

## 无模块化  
表现形式：
```
    <script src="jquery.js"></script>
    <script src="main.js"></script>
    <script src="other.js"></script>
```
直接在html中利用script标签引入js文件，并按照引入顺序一个一个执行，每个js都是用window全局作用域  

#### 无模块化的问题：
1. 文件有依赖关系时，被依赖的文件必须在依赖文件前利用script标签引入并执行
2. js引入文件声明的全局变量等会 __污染全局作用域__ ，如果两个文件的全局变量重名，还会出现报错（甚至出现因为变量共用导致逻辑出错而发现不了的问题）
3. 维护时， __模块之间的依赖关系隐蔽__ ，直接通过全局变量使用，而不是声明式的

<a id='commonjs'></a>

## CommonJS规范  
表现形式：
```
    // utils.js (导出)
    const log = s=>{ console.log(s) };
    module.exports={ log };  //exports 是对 module.exports 的引用,注意js对象引用使用（直接对exports赋值无法修改module.exports）

    ------------------文件分割线-----------------

    // index.js
    const {log} = require('./utils.js');
    log("you see see you");
```

#### commonjs解决：  
1. 声明依赖关系：利用exports和require声明暴露和引入，将模块的依赖关系展示出来
2. 可避免全局作用域的变量污染：打包完的模块代码在新的函数作用域中，所以可以避免同名变量的全局污染。
PS：由于js遇到未声明变量的赋值操作会将该变量将被自动作为全局变量声明([点击此查看](https://www.iteye.com/blog/huangqiqing123-1788646))，使用严格模式可以避免这种情况的发生

#### commonjs弊端：  
1. 当然最主要的弊端是浏览器并不原生支持commonjs模块化  
2. 对于网上说的网络问题造成的模块引入慢，其实任何模块规范遇到网上模块引入到会有这个问题（从请求到执行很慢，多引用就多请求），所以也不算commonjs的弊端啦  

#### 那么现在前端是怎么用commonjs的呢？：  
目前前端使用commonjs的路子是：使用webpack等打包工具，在开发时可进使用commonjs，开发完成利用模块化工具会将模块的依赖关系进行梳理优化并将依赖打包到同一个文件中，这样就没有引用的问题了，以这种曲线救国的方法让开发可以使用commonjs进行模块引用。  
 
这点可以参看webpack的[demo](https://webpack.toobug.net/zh-cn/chapter2/commonjs.html)  
![](https://tva1.sinaimg.cn/large/006y8mN6ly1g7z1up3quqj30b60aumxq.jpg)   
打包生成文件  
![](https://tva1.sinaimg.cn/large/006y8mN6ly1g7z1vvc9tfj30np0z00xq.jpg)  

ps：这也是造成当前前端难以离开webpack等打包工具的尴尬现状的原因之一，但由于es6有了自己的模块导出和引入方法，而且目前浏览器对es6支持很好，所以@pika/web等依赖安装工具出现了。  

回到最开始的问题，@pika/web依赖安装工具做了什么事： 
1. 将commonjs导出的依赖模块进行打包，打包成一个js，并用es6导出语法进行导出  
2. 将所有生成模块js放入web_modules中  
而我们就可以直接在js中根据路径引用这些依赖，只要在html中引入根script时加上type="module"属性即可（告知浏览器这是个模块js）    


<a id='AMD'></a>

## AMD规范  
非同步加载模块:Asynchronous module definition  
所以AMD的优势就是可以异步加载模块  

AMD 是 RequireJS 在推广过程中对模块定义的规范化产出   

AMD标准中，定义了下面三个API：   
1. require([module], callback)  
2. define(id, [depends], callback)  
3. require.config()  
即通过define来定义一个模块，然后使用require来加载一个模块, 使用require.config()指定引用路径。  

使用时在html引入<script data-main="./alert" src="./require.js"></script>，data-main指定根js文件（原理就是遍历script标签，利用dom的getAttribute函数获取标签属性）  

require.js实现原理参考：https://www.jianshu.com/p/5a39535909e4  

__关键逻辑__   
根据执行文件中的引用将对应模块文件利用dom操作将script标签加入html执行，然后将返回的方法进行保存，在使用的时候返回缓存的依赖方法  


#### AMD优点：  
1. 相比传统script标签引入，AMD依赖无需考虑引入顺序，依赖关系也清晰多了  
2. 采用异步加载，a加载不阻塞页面渲染，b不阻塞下文js执行（用到模块的代码必须放到回调函数里）  


<a id='CMD'></a>

## CMD规范  
通用模块定义：Common Module Definition   
CMD规范是国内发展出来的，就像AMD有个requireJS，CMD有个浏览器的实现SeaJS  

CMD推崇就近依赖，不像AMD在一开始就指明依赖，CMD只有在用到某个模块的时候再去require  
这样，CMD就可以通过逻辑判断，避免用不到的模块的加载了  

#### CMD优势： 
1. 相比AMD，可以在执行到引入模块的代码时才去加载模块（即按需加载，提升性能） 

#### CMD弊端： 
1. 内部引入，依赖关系就不像commonjs和AMD那样明显了

<a id='ES6'></a>

## ES6模块化  
通过 `exprot` 关键字导出模块，使用 `import` 关键字引入模块  
```
    // utils.js (导出)
    const log = s=>{ console.log(s) };
    export { log }; 

    ------------------文件分割线-----------------

    // index.js
    import { log } from './utils.js'
    log("you see see you");
```
根脚本script标签要添加 type=module 属性来标记来告诉浏览器用es6模块来引入这个脚本  

兼容就浏览器的方法：  
```
    <script type="module" src="app.js"></script>
    <script nomodule src="fallback.js"></script>
```
新版浏览器加载第一个 script 标签，忽略第二个；旧版不支持 type=module 的浏览器则忽略第一个，加载第二个。

#### note： 
1. 脚本加载方式默认为 defer，不会因为执行拥塞页面渲染，也支持 async  
2. 同一模块（url相同，包括后缀参数）用es6引入方法多次引入只执行一次  
3. 添加type=module的script标签CORS 跨域限制会更严格，如果服务器未返回有效的 Allow-Origin 相关 CORS 头，浏览器会禁止加载改脚本 

#### es6模块化的优势： 
1. 当然当然当然是浏览器的原生支持啦，大部分浏览器以及支持es6模块化语法，查看[can i use](https://caniuse.com/#feat=es6-module)  
2. 使用es6模块引入的js脚本不会像普通脚本一样污染全局作用域（根层变量不会被声明到window中)  


<a id='ES6CMJS'></a>

## CommonJs和ES6区别  
1. CommonJS 模块输出的是一个值的拷贝，ES6 模块输出的是值的引用  
    commonjs在输出时一般这么操作  
    ```
    module.exports = {
      counter: counter1,
      incCounter: incCounter,
    };
    ```
    module.exposrts.counter是非引用变量赋值来的，所以值和counter1是分离的。  
    可以使用函数获取来动态获取最新的counter1值  
    ```
    module.exports = {
      get counter() {
        return counter1
      },
      incCounter: incCounter,
    };
    ```
2. CommonJS 模块是运行时加载，ES6 模块是编译时输出接口

