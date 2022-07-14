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

```ts
function renderToString(
  children: ReactNodeList,
  options?: ServerOptions
): string {
  return renderToStringImpl(children, options);
}
```

```ts
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

  function onShellReady() {
    readyToStream = true;
  }

  const request = createRequest(
    children,
    createResponseState(
      generateStaticMarkup,
      options ? options.identifierPrefix : undefined
    ),
    createRootFormatContext(),
    Infinity,
    onError,
    undefined,
    onShellReady
  );

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

```ts
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

```ts
export function createRequest(
  children: ReactNodeList,
  responseState: ResponseState,
  rootFormatContext: FormatContext,
  progressiveChunkSize: void | number,
  onError: void | ((error: mixed) => ?string),
  onAllReady: void | (() => void),
  onShellReady: void | (() => void)
): Request {
  const pingedTasks = [];
  var abortSet = new Set();
  const request = {
    destination: null, // 储存startFlowing中传入的destination，用来回调输出stream
    pingedTasks: pingedTasks,
    abortableTasks: abortSet,
    onAllReady,
    onShellReady,
  };
  // This segment represents the root fallback.
  const rootSegment = createPendingSegment(request);
  // There is no parent so conceptually, we're unblocked to flush this segment.
  rootSegment.parentFlushed = true;
  const rootTask = createTask(request, children, null, rootSegment, abortSet);
  pingedTasks.push(rootTask);
  return request;
}
```

```ts
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

```ts
function createTask(
  request: Request,
  node: ReactNodeList,
  blockedBoundary: Root | SuspenseBoundary,
  blockedSegment: Segment,
  abortSet: Set<Task>
): Task {
  const task: Task = ({
    node,
    ping: () => pingTask(request, task),
    abortSet,
    blockedBoundary,
    blockedSegment,
  }: any);
  abortSet.add(task);
  return task;
}
```

从数据流看逻辑：

- children => rootTask.node
- rootTask => request.pingedTasks.push(rootTask)
- task|rootTask => request.abortableTasks.add(task) | rootTask.abortSet.add(task)

### startWork

```ts
export function startWork(request: Request): void {
  setImmediate(() => performWork(request));
}
```

```ts
export function performWork(request: Request): void {
  const pingedTasks = request.pingedTasks;
  let i;
  for (i = 0; i < pingedTasks.length; i++) {
    const task = pingedTasks[i];
    retryTask(request, task);
  }
}
```

```ts
function retryTask(request: Request, task: Task): void {
  const segment = task.blockedSegment;
  if (segment.status !== PENDING) return;
  renderNodeDestructiveImpl(request, task, task.node);
  task.abortSet.delete(task);
  segment.status = COMPLETED;
  finishedTask(request, task.blockedBoundary, segment);
}
```

```ts
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
    }
    if (isArray(node)) {
      renderChildrenArray(request, task, node);
      return;
    }
  }
}
```

```ts
function renderChildrenArray(request, task, children) {
  const totalChildren = children.length;
  for (let i = 0; i < totalChildren; i++) {
    renderNodeDestructiveImpl(request, task, children[i]);
  }
}
```

### startFlowing
