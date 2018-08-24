# JS的三个定时器  
时间：2018年08月24日   
作者：Yrobot  

__本页目录：__   
[setTimeout](#setTimeout)  
[setInterval](#setInterval)  
[requestAnimationFrame](#requestAnimationFrame)  
[JS动画](#jsAnimation)   
[推荐使用requestAnimationFrame绘制JS动画](#useAnimation)   

<a id='setTimeout'></a>

## setTimeout
- 在执行时,是在载入后延迟指定时间后执行一次表达式（仅执行一次）  

<a id='setInterval'></a>

## setInterval
- 在执行时,它从载入后,每隔指定的时间就执行一次表达式  
- 在代码运行到间歇调用和超时调用时，定时器（浏览器中 __独立于js线程的一个线程__）会在相应的时间，将相应的代码放入宏代码队列中，所以不必考虑放代码时，js是否有程序在运行。所以这两个函数只能保证按时将代码放入队列，但具体的执行时间要看队列前的函数执行情况（什么时候轮到放入的函数）。由于这三个函数都是js异步编程的一种实现，所以详情参看[JS异步编程 #浏览器线程和Event Loop](/JS/JS异步编程/README.md#eventLoop)
![](https://ws1.sinaimg.cn/large/006tNbRwgy1fukmxrd5ixj30m409smxx.jpg)

<a id='requestAnimationFrame'></a>

## requestAnimationFrame 
- 不能指定延迟时间，而是根据浏览器的刷新频率而定（帧），即浏览器页面刷新一次函数就执行一次，适合实现页面动画  

<a id='jsAnimation'></a>

## JS动画
理解了上面的概念以后，我们不难发现，setTimeout 其实就是通过设置一个间隔时间来不断的改变元素属性，从而达到动画效果的。但我们会发现，利用 seTimeout 实现的动画在某些低端机上会出现卡顿、抖动的现象。 这种现象的产生有两个原因：
1. setTimeout 的执行时间并不是确定的。在JavaScript中， setTimeout 任务被放进了异步队列中，只有当主线程上的任务执行完以后，才会去检查该队列里的任务是否需要开始执行，所以 setTimeout 的实际执行时机一般要比其设定的时间晚一些。
2. 刷新频率受 屏幕分辨率 和 屏幕尺寸 的影响，不同设备的屏幕绘制频率可能会不同，而 setTimeout 只能设置一个固定的时间间隔，这个时间不一定和屏幕的刷新时间相同。  

以上两种情况都会导致 setTimeout 的执行步调和屏幕的刷新步调不一致，从而引起丢帧现象。 那为什么步调不一致就会引起丢帧呢？   

首先要明白，setTimeout 的执行只是在内存中对元素属性进行改变，这个变化必须要等到屏幕下次绘制时才会被更新到屏幕上。如果两者的步调不一致，就可能会导致中间某一帧的操作被跨越过去，而直接更新下一帧的元素。假设屏幕每隔16.7ms刷新一次，而setTimeout 每隔10ms设置图像向左移动1px， 就会出现如下绘制过程：
- 第0ms：屏幕未绘制，  等待中，setTimeout 也未执行，等待中；
- 第10ms：屏幕未绘制，等待中，setTimeout 开始执行并设置元素属性 left=1px；
- 第16.7ms：屏幕开始绘制，屏幕上的元素向左移动了 1px， setTimeout 未执行，继续等待中；
- 第20ms：屏幕未绘制，等待中，setTimeout 开始执行并设置 left=2px;
- 第30ms：屏幕未绘制，等待中，setTimeout 开始执行并设置 left=3px;
- 第33.4ms：屏幕开始绘制，屏幕上的元素向左移动了 3px， setTimeout 未执行，继续等待中；
- ...  

从上面的绘制过程中可以看出，屏幕没有更新 left=2px 的那一帧画面，元素直接从left=1px 的位置跳到了 left=3px 的的位置，这就是丢帧现象，这种现象就会引起动画卡顿。

<a href="" id="useAnimation"></a>

## 推荐使用requestAnimationFrame绘制JS动画 
与 setTimeout 相比，requestAnimationFrame() 最大的优势是 __由系统来决定回调函数的执行时机__。具体一点讲就是，系统每次绘制之前会主动调用 requestAnimationFrame() 中的回调函数，如果系统绘制率是 60Hz，那么回调函数就每16.7ms 被执行一次，如果绘制频率是75Hz，那么这个间隔时间就变成了 1000/75=13.3ms。换句话说就是，requestAnimationFrame() 的执行步伐跟着系统的绘制频率走。它能保证回调函数在屏幕每一次的绘制间隔中只被执行一次，这样就不会引起丢帧现象，也不会导致动画出现卡顿的问题。

这个API的调用很简单，如下所示：
```
var progress = 0;
//回调函数
function render() {
    progress += 1; //修改图像的位置
 
    if (progress < 100) {
           //在动画没有结束前，递归渲染
           window.requestAnimationFrame(render);
    }
}
 
//第一帧渲染
window.requestAnimationFrame(render);
```
除此之外，requestAnimationFrame 还有以下两个优势：

1. __PU节能__：使用 setTimeout 实现的动画，当页面被隐藏或最小化时，setTimeout 仍然在后台执行动画任务，由于此时页面处于不可见或不可用状态，刷新动画是没有意义的，而且还浪费 CPU 资源。而 rAF 则完全不同，当页面处理未激活的状态下，该页面的屏幕绘制任务也会被系统暂停，因此跟着系统步伐走的 rAF 也会停止渲染，当页面被激活时，动画就从上次停留的地方继续执行，有效节省了 CPU 开销。

2. __函数节流__：在高频率事件(resize,scroll 等)中，为了防止在一个刷新间隔内发生多次函数执行，使用 rAF 可保证每个绘制间隔内，函数只被执行一次，这样既能保证流畅性，也能更好的节省函数执行的开销。一个绘制间隔内函数执行多次时没有意义的，因为显示器每16.7ms 绘制一次，多次绘制并不会在屏幕上体现出来。

<a href="" id="suitDown"></a>

## 适配低版本
以下代码考虑到部分浏览器不支持requestAnimationFrame的情况，对requestAnimationFrame和cancelAnimationFrame进行降级适配。
```
if (!Date.now)
    Date.now = function() { return new Date().getTime(); };
 
(function() {
    'use strict';
     
    var vendors = ['webkit', 'moz'];
    for (var i = 0; i < vendors.length && !window.requestAnimationFrame; ++i) {
        var vp = vendors[i];
        window.requestAnimationFrame = window[vp+'RequestAnimationFrame'];
        window.cancelAnimationFrame = (window[vp+'CancelAnimationFrame']
                                   || window[vp+'CancelRequestAnimationFrame']);
    }
    if (/iP(ad|hone|od).*OS 6/.test(window.navigator.userAgent) // iOS6 is buggy
        || !window.requestAnimationFrame || !window.cancelAnimationFrame) {
        var lastTime = 0;
        window.requestAnimationFrame = function(callback) {
            var now = Date.now();
            var nextTime = Math.max(lastTime + 16, now);
            return setTimeout(function() { callback(lastTime = nextTime); },
                              nextTime - now);
        };
        window.cancelAnimationFrame = clearTimeout;
    }
}());
```
---  
*本章节部分参考[一像素 博客](https://www.cnblogs.com/onepixel/p/7078617.html)，在此感谢！*
### [返回首页](/README.md)
