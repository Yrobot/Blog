---
title: 读源码理解ReactDOMServer
author: yrobot
keywords: react,react-dom,renderToString,ReactDOMServer,源码,解读,jsx,html,转换
createTime: 2022年7月12日
---

## ReactDOMServer 的作用

> The ReactDOMServer object enables you to render components to static markup.

> ReactDOMServer 可以将 react 组件转换为静态的 html

所以，本文主要是为了弄明白 ReactDOMServer 如何将 react 转换为 html

```tsx
import React from "react";

const Header = () => <header className="header">Header</header>;
const Content = () => <section className="content">Content</section>;
const Footer = () => <footer className="footer">Footer</footer>;
const Page = () => (
  <div className="page">
    <Header />
    <Content />
    <Footer />
  </div>
);

export default Page;
```

=> `ReactDOMServer.renderToString(<Page />)` =>

```ts
'<div class="page"><header class="header">Header</header><section class="content">Content</section><footer class="footer">Footer</footer></div>';
```

## 疏理 react-dom 源码

> 下述源码经过精简，仅保留主流程的逻辑

### 主干逻辑解析

```js
function renderToString(
  children: ReactNodeList,
  options?: ServerOptions
): string {
  return renderToStringImpl(children, options);
}
```

```js
function renderToStringImpl(
  children: ReactNodeList,
  options: void | ServerOptions
): string {
  let result = "";
  const destination = {
    push(chunk) {
      if (chunk !== null) {
        result += chunk;
      }
      return true;
    },
  };

  const request = createRequest(children);

  startWork(request);

  startFlowing(request, destination);

  return result;
}
```

这部分代码主要是 `renderToString` 的主干逻辑，可以看到：

1. `renderToString` 只是对于 `renderToStringImpl` 做了一层封装
2. `renderToStringImpl` 返回 `result` 字符串，而 `result` 是通过 `startFlowing(request, destination)` 利用 `destination.push` 来拼接 stream。

#### 通过 log 验证一下

在 destination.push 中添加一个 log，然后跑一下逻辑：

```js
const destination = {
  push(chunk) {
    if (chunk !== null) {
      result += chunk;
      console.log(result);
    }
    return true;
  },
};
```

log 结果：  
![zPSQyZ-21-10-21](https://images.yrobot.top/2022-07-13/zPSQyZ-21-10-21.png)

#### 简单猜想一下

1. `createRequest` 和 `startWork` 是转译服务的初始化工作
2. `startFlowing(request, { push: chunk => {} })` 开始转译的触发函数，`push`作为结果的回调

接下来就从 `createRequest` 、`startWork` 和 `startFlowing` 进行源码解读

### createRequest

```js
export function createRequest(children: ReactNodeList): Request {
  const pingedTasks = [];
  const request = {
    destination: null, // 储存startFlowing中传入的destination，用来回调输出stream
    pingedTasks: pingedTasks,
  };
  // This segment represents the root fallback.
  const rootSegment = createPendingSegment(request);
  // There is no parent so conceptually, we're unblocked to flush this segment.
  rootSegment.parentFlushed = true;
  const rootTask = createTask(request, children, null, rootSegment);
  pingedTasks.push(rootTask);
  return request;
}
```

```js
function createPendingSegment(request: Request): Segment {
  return {
    status: PENDING,
    id: -1, // lazily assigned later
    index,
    parentFlushed: false,
    chunks: [],
    children: [],
    formatContext,
    boundary,
    lastPushedText,
    textEmbedded,
  };
}
```

```js
function createTask(
  request: Request,
  node: ReactNodeList,
  blockedBoundary: Root | SuspenseBoundary,
  blockedSegment: Segment
): Task {
  const task: Task = ({
    node,
    ping: () => pingTask(request, task),
    blockedBoundary,
    blockedSegment,
  }: any);
  return task;
}
```

从数据流看逻辑：

- children => rootTask.node
- rootTask => request.pingedTasks.push(rootTask)

### startWork

```js
export function startWork(request: Request): void {
  setImmediate(() => performWork(request));
}
```

```js
export function performWork(request: Request): void {
  const pingedTasks = request.pingedTasks;
  let i;
  for (i = 0; i < pingedTasks.length; i++) {
    const task = pingedTasks[i];
    retryTask(request, task);
  }
  pingedTasks.splice(0, i);
  if (request.destination !== null) {
    flushCompletedQueues(request, request.destination);
  }
}
```

```js
function retryTask(request: Request, task: Task): void {
  const segment = task.blockedSegment;
  if (segment.status !== PENDING) return;
  renderNodeDestructive(request, task, task.node);
  pushSegmentFinale(
    segment.chunks,
    request.responseState,
    segment.lastPushedText,
    segment.textEmbedded
  );
  segment.status = COMPLETED;
  finishedTask(request, task.blockedBoundary, segment);
}
```

```js
function renderNodeDestructive(
  request: Request,
  task: Task,
  node: ReactNodeList
): void {
  return renderNodeDestructiveImpl(request, task, node);
}
```

```js
function renderNodeDestructiveImpl(
  request: Request,
  task: Task,
  node: ReactNodeList
): void {
  task.node = node;

  if (typeof node === "object" && node !== null) {
    switch ((node: any).$$typeof) {
      case REACT_ELEMENT_TYPE: {
        const element: React$Element<any> = (node: any);
        const type = element.type;
        const props = element.props;
        const ref = element.ref;
        renderElement(request, task, type, props, ref);
        return;
      }
      case REACT_LAZY_TYPE: {
        const lazyNode: LazyComponentType<any, any> = (node: any);
        const payload = lazyNode._payload;
        const init = lazyNode._init;
        let resolvedNode;
        resolvedNode = init(payload);
        renderNodeDestructive(request, task, resolvedNode);
        return;
      }
    }

    if (isArray(node)) {
      renderChildrenArray(request, task, node);
      return;
    }

    const iteratorFn = getIteratorFn(node);
    if (iteratorFn) {
      const iterator = iteratorFn.call(node);
      if (iterator) {
        let step = iterator.next();
        if (!step.done) {
          const children = [];
          do {
            children.push(step.value);
            step = iterator.next();
          } while (!step.done);
          renderChildrenArray(request, task, children);
          return;
        }
        return;
      }
    }

    const childString = Object.prototype.toString.call(node);
  }

  if (typeof node === "string") {
    const segment = task.blockedSegment;
    segment.lastPushedText = pushTextInstance(
      task.blockedSegment.chunks,
      node,
      request.responseState,
      segment.lastPushedText
    );
    return;
  }

  if (typeof node === "number") {
    const segment = task.blockedSegment;
    segment.lastPushedText = pushTextInstance(
      task.blockedSegment.chunks,
      "" + node,
      request.responseState,
      segment.lastPushedText
    );
    return;
  }
}
```

### startFlowing
