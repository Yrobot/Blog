<a id='top'></a>
# 探讨ESM对当前开发的意义或影响  
<a href="#top" style="position: fixed;font-size: 30px;color: rgb(88, 153, 226);right: 10px;bottom: 20px;z-index: 999;">TOP</a>

__本页目录：__   
[对比当前模块开发和ES6模块化开发](#compare)  
[ESM init 优化方案](#ESMinit)  
[总的来说](#All)  

__友情连接：__  
Q：浏览器遇到多个script资源的时候是怎么做的呢？  
A：[浏览器是怎么处理多个defer或async的script的](../浏览器是怎么处理多个defer或async的script的/README.md)

<a id='compare'></a>

## 对比当前模块开发和ES6模块化开发  
#### 开发方式对比  
- commonjs的模块化流程：  
  - 利用commonjs的模块规范进行引入使用，而npm大部分包也是用的commonjs规范写的。前端为了解决浏览器不支持commonjs模块，利用webpack等打包工具，将模块打包到一个js文件中，最后引入html。

- es6模块化开发流程：  
  - 保证所有依赖支持es6的模块化规范，在html利用type=“module”来引入根js（cdn的js只能使用script引入）

#### 资源加载对比  
- commonjs的模块化：  
  - 原来的js文件被整合到一个js文件中，请求网页时，对于这些js只需发送一个script请求即可，只是这个js文件比较大。

- es6模块化开发：  
  - 对于es6模块，浏览器解析到`<script type="module" src=".."/>`时，因为type="module"的script默认defer，所以页面会继续解析渲染不受js下载执行阻塞，但是对于依赖，浏览器只能在解析js的步骤中获取依赖然后进行请求下载，依赖下载运行后才能继续执行。


<a id='ESMinit'></a>

## ESM init 优化方案   
- 当然通过服务器在请求页面时主动将依赖js一起传给浏览器来直接减少请求数量，但是这就需要服务器知道项目依赖关系，这超出了一些静态文件服务器的职能范围了。  
- 或者服务器将依赖关系网传给浏览器，让浏览器解析当前需要的js依赖，一次性向服务器请求完，而且因为http1.1的keep alivia的存在会让项目init js的时间比单纯原生请求要少去 __1.一步步解析js获取依赖再请求依赖的时间__ 以及 __2.浏览器多次和服务器tcp连接的时间__，但是需要维护依赖关系网作为牺牲。

<a id='All'></a>

## 总的来说  
1. 对于一些大项目，势必会用到打包工具进行优化（代码压缩，label，eslint），然而es6原生模块支持即使在良好的关系网维护以及浏览器预解析关系网并预加载依赖的最好情况下，加载时间也不比commonjs打包成一整个js文件快多少。但是维护依赖关系网这件事也并不轻松。所以大项目使用ESM的意义目前来看并不是很大。  
2. 但是对于一些小项目，总共js依赖文件没多少的那种，使用webpack这种臃肿的大包工具并不会对项目起到多大的优化作用，那么何尝不试试直接使用ESM，开发静态网页的快感谁试谁知道，所以出现了将commonjs模块标准转换成ESM的工具[@pika/web](https://github.com/pikapkg/web)。

