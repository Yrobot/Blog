# JS多线程Web Worker
时间：2018年08月23日  
作者：Yrobot  

__本页目录：__   
[为什么使用Web Woker](#why)  
[Web Woker是什么](#what)  
[检测浏览器支持](#support)  
[新建Web Worker](#new)  
[mainjs与worker之间的数据传递](#message)  
[主线程中worker的属性](#workerPro)  
[子线程中的全局属性](#selfPro)  
[关闭子线程](#close) 

<a href="" id="why"></a>

## 为什么使用Web Woker  
核心思想：一些容易阻塞主线程的事情，或者说主线程一个线程完成不了的事情（单页面多连接），可以交给WebWoker
#### 1. 使用专用线程进行数学运算  
Web Worker最简单的应用就是用来做后台计算，而这种计算并不会中断前台用户的操作
#### 2. 图像处理   
通过使用从`<canvas>`或者`<video>`元素中获取的数据，可以把图像分割成几个不同的区域并且把它们推送给并行的不同Workers来做计算
#### 3. 大量数据的检索   
当需要在调用 ajax后处理大量的数据，如果处理这些数据所需的时间长短非常重要，可以在Web Worker中来做这些，避免冻结UI线程。
#### 4. 背景数据分析  
由于在使用Web Worker的时候，我们有更多潜在的CPU可用时间，我们现在可以考虑一下JavaScript中的新应用场景。例如，我们可以想像在不影响UI体验的情况下实时处理用户输入。利用这样一种可能，我们可以想像一个像Word（Office Web Apps 套装）一样的应用：当用户打字时后台在词典中进行查找，帮助用户自动纠错等等。

<a href="" id="what"></a>  

## Web Woker是什么  
Web Worker 是HTML5标准的一部分，这一规范定义了一套 API，它允许一段JavaScript程序运行在主线程之外的另外一个线程中。Web Worker 规范中定义了两类工作线程，分别是专用线程Dedicated Worker和共享线程 Shared Worker，其中，Dedicated Worker只能为一个页面所使用，而Shared Worker则可以被多个页面所共享。

<a href="" id="support"></a>

## 检测浏览器支持  
```
//引入modernizr.js的情况
if(!Modernizr.webworker){
    alert("This browser doesn't support Web Worker!");
}  

//未引入modernizr.js的情况
if(typeof(Worker)!=="undefined"){
    //支持
}else{
    //不支持code
}
```

<a href="" id="new"></a>

## 新建Web Worker  
`var worker = new Worker("task.js"); //在main.js中new一个woker`

浏览器原生提供Worker()构造函数，用来供主线程生成 Worker 线程。  
`var myWorker = new Worker(jsUrl, [options]);`

Worker()构造函数，可以接受两个参数。第一个参数是脚本的网址（必须遵守同源政策），该参数是必需的，且只能加载 JS 脚本，否则会报错。第二个参数是配置对象，该对象可选。它的一个作用就是指定 Worker 的名称，用来区分多个 Worker 线程。
```
// 主线程
var myWorker = new Worker('worker.js', { name : 'myWorker' });

// Worker 线程
self.name // myWorker
```

<a href="" id="message"></a>

## mainjs与worker之间的数据传递  
#### 主线程—send—>worker：  
```
worker.postMessage(data);   
//data可以死各种类型的数据、string、object、array、number。。。  
//子线程通过监听函数参数e的data属性获取上述data  
```  
#### 主线程<—get—worker：  
```
worker.onmessage = function (event) {  
  console.log('Received message ' + event.data);  
  //相应业务操作  
}  
```  
#### worker—send—>主线程：  
`self.postMessage(data);  //self指代worker线程全局对象(同this) `  

#### worker<—get—主线程：  
```
self.addEventListener('message', function (e) {  
  console.log('Main data: ' + e.data);  
}, false);  
```
__so：__  
当主线程或者子线程要传递 命令以及数据 时：可以传递一个对象`{cmd:'go',data:'dt'}`。  
接收者用`event.data.cmd`和`event.data.data`获取命令和数据。  
#### 例子：主线程传参 `{cmd:"", msg:""}`
```
self.addEventListener('message', function (e) {  
  var data = e.data;  
  switch (data.cmd) {  
    case 'start':  
      self.postMessage('WORKER STARTED: ' + data.msg);  
      break;  
    case 'stop':  
      self.postMessage('WORKER STOPPED: ' + data.msg);  
      self.close(); // Terminates the worker.  
      break;  
    default:  
      self.postMessage('Unknown command: ' + data.msg);  
  };  
}, false);  
```

<a href="" id="workerPro"></a>

## 主线程中worker的属性  
- Worker.onerror：指定 error 事件的监听函数。  
- Worker.onmessage：指定 message 事件的监听函数，发送过来的数据在Event.data属性中。  
- Worker.onmessageerror：指定 messageerror 事件的监听函数。发送的数据无法序列化成字符串时，会触发这个事件。   
- Worker.postMessage()：向 Worker 线程发送消息。  
- Worker.terminate()：立即终止 Worker 线程。  

__子线程的错误监听实例：__   
```
worker.onerror(function (event) {
  console.log([
    'ERROR: Line ', e.lineno, ' in ', e.filename, ': ', e.message
  ].join(''));
});

// 或者
worker.addEventListener('error', function (event) {
  // ...
});
```


<a href="" id="selfPro"></a>

## 子线程中的全局属性  
Web Worker 有自己的全局对象，不是主线程的window，而是一个专门为 Worker 定制的全局对象.  
- self.name：Worker 的名字。该属性只读，由构造函数指定。  
- self.onmessage：指定message事件的监听函数。  
- self.onmessageerror：指定 messageerror 事件的监听函数。发送的数据无法序列化成字符串时，会触发这个事件。  
- self.close()：关闭 Worker 线程。  
- self.postMessage()：向产生这个 Worker 线程发送消息。  
- __self.importScripts()：加载 JS 脚本。__  

<a href="" id="close"></a>

## 关闭子线程  
```
// 主线程
worker.terminate();

// Worker 线程
self.close();
```
---
### [返回首页](/README.md)