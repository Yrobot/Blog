---
title: JS异步编程
author: yrobot
keywords: JS,异步,编程
createTime: 2018年08月24日
---

__本页目录：__   
[概念学习](#gn)   
[浏览器线程和Event Loop](#eventLoop)   
[JS的任务执行机制](#mechanism)   
[JS异步的理解](#unds)   
[JS的异步编程实现](#cometrue)   
[JS异步优化页面卡顿](#better)   



## 概念学习
- __并发__：同一时间段有几个程序都处于已经启动到运行完毕之间，并且这几个程序都在同一个处理机上运行，并发的两种关系是同步和互斥；

- __互斥__：进程之间访问临界资源时相互排斥的现象；

- __同步__：进程之间存在依赖关系，一个进程结束的输出作为另一个进程的输入。具有同步关系的一组并发进程之间发送的信息称为消息或者事件；

- __并行__：单处理器中进程被交替执行，表现出一种并发的外部特征；在多处理器中，进程可以交替执行，还能重叠执行，实现并行处理，并行就是同事发生的多个并发事件，具有并发的含义，但并发不一定是并行，也就是说事件之间不一定要同一时刻发生；

- __多线程__：多线程是进程中并发运行的一段代码，能够实现线程之间的切换执行；

- __异步(不按顺序)__：和同步相对，同步是顺序执行，而异步是彼此独立，在等待某个事件的过程中继续做自己的事，不要等待这一事件完成后再工作。线程是实现异步的一个方式，异步是让调用方法的主线程不需要同步等待另一个线程的完成，从而让主线程干其他事情。  
-- 所谓"异步"，简单说就是一个任务分成两段，先执行第一段，然后转而执行其他任务，等做好了准备，再回过头执行第二段。比如，有一个任务是读取文件进行处理，异步的执行过程就是下面这样。  
-- 这种不连续的执行，就叫做异步。相应地，连续的执行，就叫做同步。
![](https://ws3.sinaimg.cn/large/006tNbRwgy1fukonjqddzj30t20gs0yu.jpg)

- __异步和多线程__：不是同等关系，异步是目的，多线程只是实现异步的一个手段，实现异步可以采用多线程技术或者交给其他进程来处理。



## 浏览器线程和Event Loop

- js既然是单线程,那么肯定是排队执行代码，那么怎么去排这个队，就是Event Loop。虽然JS是单线程，但浏览器不是单线程。  
- 浏览器中分为以下几个线程:
  1. js线程
  2. UI线程(浏览器内核)
  2. 事件线程(onclick,onchange,...)：触发事件发生后，绑定的函数由Event Table移入Event Queue，等待被js主线程调用
  4. 定时器线程(setTimeout, setInterval)： 确保js定时器和异步触发的准确性
  3. 异步http请求线程(ajax)  
  - 其中JS线程和UI线程相互互斥，也就是说，当UI线程在渲染的时候，JS线程会挂起，等待UI线程完成，再执行JS线程

- 名词解析：
  1. __浏览器事件触发线程__：当一个事件被触发时该线程会把事件添加到待处理队列的队尾，等待 JavaScript 引擎的处理。这些事件可以是当前执行的代码块如定时任务、也可来自浏览器内核的其他线程如鼠标点击、AJAX 异步请求等，但由于 JavaScript 的单线程关系所有这些事件都得排队等待 JavaScript 引擎处理；
  2. __定时触发器线程__：浏览器定时计数器并不是由 JavaScript 引擎计数的, 因为 JavaScript 引擎是单线程的, 如果处于阻塞线程状态就会影响记计时的准确, 因此通过单独线程来计时并触发定时是更为合理的方案；
  3. __异步 HTTP 请求线程__：在 XMLHttpRequest 在连接后是通过浏览器新开一个线程请求， 将检测到状态变更时，如果设置有回调函数，异步线程就产生状态变更事件放到 JavaScript 引擎的处理队列中等待处理；

![](https://ws3.sinaimg.cn/large/006tNbRwgy1fukonkymdvj30cv08v751.jpg)  
- 在点击按钮之后，页面卡顿，连续点击按钮时，页面无反应，等到loop运行完时，连续弹出alert。证明 事件线程 独立于 js线程，而同时 UI线程 被挂起。 
代码：
```
<button onclick="myClick()">yep</button>
    <script>
        let count =0;
        function myClick(){
            alert(count++)
            if(count==1)
                loop();
        }
        function loop(){
            let i=99999;
            while(i--){
                console.log(1);
            }
        }
    </script>
``` 


## JS的任务执行机制
![](https://ws4.sinaimg.cn/large/006tNbRwgy1fukopfdw9oj30vk0ugwpy.jpg)  
__导图要表达的内容用文字来表述的话：__
- 同步和异步任务分别进入不同的执行"场所"，同步的进入主线程，异步的进入Event Table并注册函数。
- 当指定的事情完成时(条件函数完成，绑定的按钮发生点击，请求返回etc)，Event Table会将这个函数移入Event Queue。
- 主线程内的任务执行完毕为空，会去Event Queue读取对应的函数，进入主线程执行。
- 上述过程会不断重复，也就是常说的Event Loop(事件循环)。



## JS异步的理解

- 如概念学习里所说的，js异步主要是：对于占用主线程的操作，利用js任务执行机制，将其放入Event Queue中，等待主线程空闲了才执行。 



## JS的异步编程实现

ES 6以前：
  - 定时器(setTimeout, setInterval)
  - 回调函数
  - 事件监听(事件发布/订阅)
  - Promise对象  

ES 6：
  - Generator函数(协程coroutine) 

ES 7:
  - async和await



## JS异步优化页面卡顿

__方案1__：针对支持html5 webworker的现代浏览器方案:   
_代码1._ 你的大量计算，放到一个js文件中。如下：
```
//job.js
onmessage = function (evt){  //do massive job.在这里你进行大量耗时的计算过程。 
  postMessage( data );//将计算结果的数据发送会主线程
}
```
你的页面代码：
```
<!DOCTYPE HTML>
<html>

<head>
    <meta http-equiv="Content-Type"  content="text/html; charset=utf-8" />
    <script type="text/javascript">
        //WEB页主线程var worker =new Worker("job.js"); 
        //创建一个Worker对象并向它传递将在新线程中执行的脚本的URL 
        worker.postMessage('开始计算');
        worker.onmessage = function (evt) {//接收worker传过来的数据函数   
            console.log(evt.data);//输出worker发送来的数据，这里就获取到了大量计算的结果。 
        } 
    </script>
</head>

<body></body>

</html>
```
_方案2：_ 对于不支持WebWorker线程的浏览器。
可以考虑分批处理。即是说创造一个间隔定时器setInterval。  
每隔一小段时间，处理大量数据中的一部分。  
这样就可以避免大量计算导致浏览器卡死。  
大致代码如下(这里是简单的例子，具体情况具体分析)   
假设我们要计算1000万个数据的和：  
```
var jobData = [];//假设是一个数组。里面有1000万个数据  
function  sliceJob() {
    var  num  =  (jobData.length  /  100)  +  1;//把任务数据划分为100份。    
    var  portion  =  100000;//每份有10万个数字。    
    var  addition  =  0;//这里用来保存最后的结果。一开始是0；    
    var  intv  =  setInterval(function () {
            if (num--) {            //然后每一份结果。            
        additoin  +=  every;
    }  else  {            //计算最后一份，然后输出结果。            
        alert('最终结果是:',  addition);
        window.clearInterval(intv);
    }
        },  50);
}
```
此外。jQuery的deferred对象无法实现你的要求。  
因为deferred对象的目的是为了串行处理异步过程。  
但是异步过程在执行的过程中，如果耗时过长，仍然会阻塞浏览器线程，导致浏览器不可操作（卡死）。  
---


