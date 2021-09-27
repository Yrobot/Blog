---
title: postMessage安全
author: yrobot
keywords: iframe,postMessage,security,跨域,通信,安全,白名单
createTime: 2021年09月27日
---

## 什么是 postMessage

> window.postMessage() 方法可以安全地实现跨源通信。  
> 通常，对于两个不同页面的脚本，只有当执行它们的页面位于具有相同的协议（通常为 https），端口号（443 为 https 的默认值），以及主机 (两个页面的模数 Document.domain 设置为相同的值) 时，这两个脚本才能相互通信。window.postMessage() 方法提供了一种受控机制来规避此限制，只要正确的使用，这种方法就很安全。

更多细节参看 [postMessage](https://developer.mozilla.org/zh-CN/docs/Web/API/Window/postMessage)

## postMessage 的使用

```js
otherWindow.postMessage(message, targetOrigin, [transfer]);
```

#### targetOrigin

通过窗口的 origin 属性来指定哪些窗口能接收到消息事件，其值可以是字符串"_"（表示无限制）或者一个 URI。在发送消息的时候，如果目标窗口的协议、主机地址或端口这三者的任意一项不匹配 targetOrigin 提供的值，那么消息就不会被发送；只有三者完全匹配，消息才会被发送。这个机制用来控制消息可以发送到哪些窗口；例如，当用 postMessage 传送密码时，这个参数就显得尤为重要，必须保证它的值与这条包含密码的信息的预期接受者的 origin 属性完全一致，来防止密码被恶意的第三方截获。如果你明确的知道消息应该发送到哪个窗口，那么请始终提供一个有确切值的 targetOrigin，而不是_。不提供确切的目标将导致数据泄露到任何对数据感兴趣的恶意站点。

## 安全问题

### 相关漏洞文章：

[《利用 postmessage 偷取用户的 cookies》](https://zhuanlan.zhihu.com/p/51564814)
[《PostMessage 跨域漏洞分析》](https://www.secpulse.com/archives/56637.html)

### 安全漏洞原因分析：

1. targetOrigin 指定为 \*，信任任何父域名
2. targetOrigin 动态配置，但是动态逻辑来自于父网站，或者 url 参数

### 规避方案

1. targetOrigin 严格指定，且其中逻辑父网站无法干预

```js
window.parent.postMessage("secret", "https://yrobot.top");
```

2. 只对白名单域名运行 postMessage 逻辑

```js
const getParentOrigin = () => {
  var url = null;
  if (parent !== window) {
    try {
      url = parent.location.origin;
    } catch (e) {
      url = document.referrer;
    }
  }
  return url && /^https?:\/\/[\w-.]+(:\d+)?/i.exec(url)[0];
};

const whitelist = ["https://yrobot.top"];
if (whitelist.includes(getParentOrigin())) {
  window.parent.postMessage("secret", getParentOrigin());
}
```
