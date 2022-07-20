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

react-dom 将 react 组件转换为 html 的函数有两个： `renderToString()` 和 `renderToStaticMarkup()`

主要区别是 `renderToStaticMarkup()` 不会创建 React 内部使用的额外 DOM 属性，如 `data-reactroot`。如果你只想把 React 作为简单的静态页面生成器使用，那么使用 `renderToStaticMarkup()` 是更好的选择，它会比 `renderToString()` 节省一些字节占用。

```tsx
import React from "react";

const Header = () => (
  <header key="key" className="header">
    Header
  </header>
);
const Content = ({ name }: { name: string }) => (
  <section className="content">Content:{name}</section>
);
const Footer = () => <footer className="footer">Footer</footer>;
const SvgInline = () => (
  <svg-inline src="https://yrobot.top/icons/svg-inline.svg"></svg-inline>
);
const Page = () => (
  <div className="page">
    <Header />
    <Content name="yrobot" />
    <SvgInline />
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

### 定位主要逻辑位置和数据结构

在 renderToStringImpl 的 3 个主要步骤之后 log 一下结果

```ts
const request = createRequest(children);
console.log("createRequest", request);

startWork(request);
console.log("startWork", request);

startFlowing(request, destination);
console.log("startFlowing", request, destination);
```

log 结果：

```bash
createRequest {
  destination: null,
  responseState: {
    bootstrapChunks: [],
    startInlineScript: '<script>',
    placeholderPrefix: 'P:',
    segmentPrefix: 'S:',
    boundaryPrefix: 'B:',
    idPrefix: '',
    nextSuspenseID: 0,
    sentCompleteSegmentFunction: false,
    sentCompleteBoundaryFunction: false,
    sentClientRenderFunction: false,
    generateStaticMarkup: true
  },
  progressiveChunkSize: Infinity,
  status: 0,
  fatalError: null,
  nextSegmentId: 0,
  allPendingTasks: 1,
  pendingRootTasks: 1,
  completedRootSegment: null,
  abortableTasks: <ref *1> Set(1) {
    {
      node: [Object],
      ping: [Function: ping],
      blockedBoundary: null,
      blockedSegment: [Object],
      abortSet: [Circular *1],
      legacyContext: {},
      context: null,
      treeContext: [Object],
      componentStack: null
    }
  },
  pingedTasks: [
    {
      node: [Object],
      ping: [Function: ping],
      blockedBoundary: null,
      blockedSegment: [Object],
      abortSet: [Set],
      legacyContext: {},
      context: null,
      treeContext: [Object],
      componentStack: null
    }
  ],
  clientRenderedBoundaries: [],
  completedBoundaries: [],
  partialBoundaries: [],
}
startWork {
  destination: null,
  responseState: {
    bootstrapChunks: [],
    startInlineScript: '<script>',
    placeholderPrefix: 'P:',
    segmentPrefix: 'S:',
    boundaryPrefix: 'B:',
    idPrefix: '',
    nextSuspenseID: 0,
    sentCompleteSegmentFunction: false,
    sentCompleteBoundaryFunction: false,
    sentClientRenderFunction: false,
    generateStaticMarkup: true
  },
  progressiveChunkSize: Infinity,
  status: 0,
  fatalError: null,
  nextSegmentId: 0,
  allPendingTasks: 0,
  pendingRootTasks: 0,
  completedRootSegment: {
    status: 1,
    id: -1,
    index: 0,
    parentFlushed: true,
    chunks: [
      '<div',    ' ',      'class',   '="',       'page',
      '"',       '>',      '<header', ' ',        'class',
      '="',      'header', '"',       '>',        'Header',
      '</',      'header', '>',       '<section', ' ',
      'class',   '="',     'content', '"',        '>',
      '<div',    ' ',      'class',   '="',       'title',
      '"',       '>',      'Title',   '</',       'div',
      '>',       '<div',   ' ',       'class',    '="',
      'detail',  '"',      '>',       'Detail',   '</',
      'div',     '>',      '</',      'section',  '>',
      '<footer', ' ',      'class',   '="',       'footer',
      '"',       '>',      'Footer',  '</',       'footer',
      '>',       '</',     'div',     '>'
    ],
    children: [],
    formatContext: { insertionMode: 1, selectedValue: null },
    boundary: null,
    lastPushedText: false,
    textEmbedded: false
  },
  abortableTasks: Set(0) {},
  pingedTasks: [],
  clientRenderedBoundaries: [],
  completedBoundaries: [],
  partialBoundaries: [],
}
startFlowing {
  destination: { push: [Function: push], destroy: [Function: destroy] },
  responseState: {
    bootstrapChunks: [],
    startInlineScript: '<script>',
    placeholderPrefix: 'P:',
    segmentPrefix: 'S:',
    boundaryPrefix: 'B:',
    idPrefix: '',
    nextSuspenseID: 0,
    sentCompleteSegmentFunction: false,
    sentCompleteBoundaryFunction: false,
    sentClientRenderFunction: false,
    generateStaticMarkup: true
  },
  progressiveChunkSize: Infinity,
  status: 0,
  fatalError: null,
  nextSegmentId: 0,
  allPendingTasks: 0,
  pendingRootTasks: 0,
  completedRootSegment: null,
  abortableTasks: Set(0) {},
  pingedTasks: [],
  clientRenderedBoundaries: [],
  completedBoundaries: [],
  partialBoundaries: [],
} { push: [Function: push], destroy: [Function: destroy] }
```

通过 log 可以得出一下 2 点：

- parse 后的主要数据利用 array 的形式储存于 request.completedRootSegment.chunks
- 主要的 parse 工作在 startWork 中完成

由于整个 react-dom/server 还要处理很多场景，如懒加载等。  
后面我们就把注意力主要放在 startWork 是怎么将 react components 转换为 chunks 的。

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
  renderNodeDestructiveImpl(request, task, task.node); // nodes => chunks
  task.abortSet.delete(task);
  segment.status = COMPLETED;
  finishedTask(request, task.blockedBoundary, segment);
}
```

chunks = task.blockedSegment.chunks = segment.chunks

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

可以看到 `renderNodeDestructiveImpl` 是一个递归函数，它从 rootNode 开始递归，利用 `renderElement` 对每一个节点进行处理。

我们后面就着重解析 `renderElement` 是怎么将 node 转化为 html string 的

### 在解读 renderElement 之前，我们需要先了解 node 的结构

推荐优先阅读[《React 是怎么运行起来的》](./React%E6%98%AF%E6%80%8E%E4%B9%88%E8%BF%90%E8%A1%8C%E8%B5%B7%E6%9D%A5%E7%9A%84)

node 的结构如下：

```ts
{
  '$$typeof': Symbol(react.element), // symbol
  type: [Function: Page], // string|function|object
  key: null,
  ref: null,
  props: {},
  _owner: null,
  _store: {}
}
```

简单的解释一下：

- `$$typeof`: 表示 node 的类型，这里的类型是 Symbol(react.element)，表示一个 ReactElement
- `type`: 表示 tag name, 可能的类型包括 string、function。
  - html tag 在这里就是 string，比如'div'；
  - react hooks component 在这里就是 function, 比如 [Function: Page]
- `key`: 节点的 key 属性
- `ref`: 节点的 ref 属性
- `props`: 节点的剩余属性的集合

```tsx
<type key ref {...props} />
```

### renderElement

```ts
function renderElement(
  request: Request,
  task: Task,
  type: any,
  props: Object,
  ref: any
): void {
  if (typeof type === "function") {
    if (type.prototype && type.prototype.isReactComponent) {
      renderClassComponent(request, task, type, props);
      return;
    } else {
      renderIndeterminateComponent(request, task, type, props);
      return;
    }
  }
  if (typeof type === "string") {
    renderHostElement(request, task, type, props);
    return;
  }

  // ...other types handlers

  throw new Error(
    "Element type is invalid: expected a string (for built-in " +
      "components) or a class/function (for composite components) " +
      `but got: ${type == null ? type : typeof type}.${info}`
  );
}
```

### Hooks Component Handler

```ts
function renderIndeterminateComponent(
  request: Request,
  task: Task,
  Component: any,
  props: any
): void {
  const value = renderWithHooks(request, task, Component, props, {});

  renderNodeDestructiveImpl(request, task, value);
}
```

renderWithHooks 将会调用 `Component` ，并且返回一个 ReactNode。

将这个 ReactNode 重新利用 renderNodeDestructiveImpl 进行递归，直到 type 变为 string 类型，即 html tag 本身。

### html tag handler

```ts
function renderHostElement(
  request: Request,
  task: Task,
  type: string,
  props: Object
): void {
  const segment = task.blockedSegment;
  const children = pushStartInstance(
    segment.chunks,
    type,
    props,
    request.responseState,
    segment.formatContext
  );
  segment.lastPushedText = false;
  const prevContext = segment.formatContext;
  segment.formatContext = getChildFormatContext(prevContext, type, props);

  renderNode(request, task, children);

  segment.formatContext = prevContext;
  pushEndInstance(segment.chunks, type, props);
  segment.lastPushedText = false;
}
```
