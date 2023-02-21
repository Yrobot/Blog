---
title: ServiceWorker最佳实践
author: yrobot
keywords: js,service worker,offline,proxy
createTime: 2023年2月15日
---

## Service Worker 是什么

> Service workers essentially act as proxy servers that sit between web applications, the browser, and the network (when available).

> They are intended, among other things, to enable the creation of effective offline experiences, intercept network requests and take appropriate action based on whether the network is available, and update assets residing on the server.

简单来说，Service Worker 是一个处于 客户端和服务器之间的代理服务器，他出现的目的 是为网页提供 离线使用 能力（利用本地逻辑代理请求，从而实现在弱网环境可以无需触及真实服务器就可以使用网站）

Service Worker 和 Web Worker 很像，他以独立的 js 文件形式存在，且运行时也是新开线程运行，拥有自己的上下文。

## Service Worker 的支持情况

[![lc6WBC-22-31-17](https://images.yrobot.top/2023-02-15/lc6WBC-22-31-17.png)](https://caniuse.com/?search=serviceWorker)

截止 23-2-15，已经有 95.63% 的浏览器支持 Service Worker。

### 判断浏览器是否支持 Service Worker

```js
if ("serviceWorker" in navigator) {
  navigator.serviceWorker.register("./sw.js");
}
```

## Service Worker 的特点和限制

### 1. Service Worker 必须通过 remote 的 https 协议 js 文件注册（安全限制）

- [Create service worker from Blob/String URL](https://github.com/w3c/ServiceWorker/issues/578)

- [Create Service Worker from Blob/String that does not persist and auto claims for testing](https://github.com/w3c/ServiceWorker/issues/1642)

### 2. 独立线程运行，无法和主线程 js 一样使用 DOM，也不会阻塞主线程

### 3. service worker 独立于页面运行，不随页面关闭而销毁，除非主动注销 worker；关闭浏览器或者浏览器标签时 service worker 进入睡眠。

### 4. 一个 service worker 注册之后，会作用于所有的同域页面实例

![CjJFYP-20-46-44](https://images.yrobot.top/2023-02-19/CjJFYP-20-46-44.jpg)

比如 在 127.0.0.1 成功注册了 sw.js 的 service worker 之后，打开了 3 个 127.0.0.1 的页面 tab，此时 sw.js 只有一个实例，并控制着这 3 个 clients

![wxhy5e-20-48-59](https://images.yrobot.top/2023-02-19/wxhy5e-20-48-59.jpg)

### 5. sw 注册时的 scope 默认且最大为当前 sw 文件的 path

通俗的讲，Service Worker 最多只能在 Service Worker 文件 URL path 范围内发挥作用。比如 /a/b/sw.js 的 service worker，/a/b/，/a/b/c/，/a/b/c/d/ 下的请求都可以被它控制。但是 /a/、/e/f/ 目录下面的请求是不受它控制的。

## Service Worker 的使用

### Service Worker 的生命周期

![VmCDTN-21-01-42](https://images.yrobot.top/2023-02-19/VmCDTN-21-01-42.jpg)

Service Worker 的生命周期可以解释，浏览器遇到 service worker 注册的代码会以什么逻辑运行。

#### 注册

```ts
navigator.serviceWorker.register("/sw.js");
```

浏览器下载 js 文件

浏览器根据 service worker 的 url 和 文件内容，来判断 service worker 是否需要执行（如果当前 sw 的实例存在且 URL 和 js 内容未改变，则无需实例化）。

如果无需实例化，那么会退出注册流程，直接使用当前的 service worker 实例。

如果需要实例化，浏览器则开始执行 sw.js，进行 service worker 的实例化

#### 实例化

浏览器则执行完 sw.js 成后 触发 `install` 的回调：

```js
self.addEventListener("install", () => {
  console.log("service worker installed");
});
```

新的 sw 安装完成后，会根据 是否有旧的 sw 实例存在 来处理新的 sw 的状态，具体逻辑如下图：

![6mEcdh-22-20-35](https://images.yrobot.top/2023-02-19/6mEcdh-22-20-35.jpg)

如果当前旧的 sw 实例存在 client 引用，且没有 skipWaiting，那么新的 sw 会进入 waiting 状态，直到旧的 sw 不被引用。

当 sw 进入激活状态后，触发 `activate` 的回调：

```js
self.addEventListener("activate", () => {
  console.log("service worker activated");
});
```

sw 进入 激活状态 后，sw 对于 `fetch` 的监听开始生效:

```js
self.addEventListener("fetch", (event) => {
  console.log("service worker 抓取请求成功: " + event.request.url);
});
```

### 利用 fetch 回调对请求进行代理

#### 获取请求数据并返回简单 text 数据

```js
self.addEventListener("fetch", (event) => {
  const { url, method, header } = event.request;
  const { origin, port, pathname } = new URL(url);

  if (origin === self.origin && method === "GET" && pathname === "/hi") {
    // GET http://localhost:3000/hi => "Hello World!"
    event.respondWith(new Response("Hello World!"));
  }
});
```

#### 返回 json 数据

```js
event.respondWith(
  new Response(
    JSON.stringify({
      message: "OK",
    }),
    {
      headers: {
        "Content-Type": "application/json",
      },
    }
  )
);
```

## 一些技巧

### 如何在 Next.ts 中引入 service worker

## 参考资料

[《lavas-project/Service Worker》](https://lavas-project.github.io/pwa-book/chapter04.html)
