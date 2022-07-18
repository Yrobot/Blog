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

#### 简单猜想一下

1. `createRequest` 和 `startWork` 是转译服务的初始化工作
2. `startFlowing(request, { push: chunk => {} })` 开始转译的触发函数，`push`作为结果的回调

接下来就从 `createRequest` 、`startWork` 和 `startFlowing` 进行源码解读

### createRequest

```ts
export function createRequest(children: ReactNodeList): Request {
  const pingedTasks = [];
  var abortSet = new Set();
  const request = {
    destination: null, // 储存startFlowing中传入的destination，用来回调输出stream
    pingedTasks: pingedTasks,
    abortableTasks: abortSet,
    nextSegmentId: 0,
    allPendingTasks: 0,
    pendingRootTasks: 0,
  };

  const rootSegment = {
    status: PENDING,
    parentFlushed: true,
    chunks: [],
    children: [],
    formatContext: {},
    boundary: null,
  };

  const rootTask = createTask(request, children, null, rootSegment, abortSet);
  pingedTasks.push(rootTask);
  return request;
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
  request.allPendingTasks++;
  if (blockedBoundary === null) {
    request.pendingRootTasks++;
  } else {
    blockedBoundary.pendingTasks++;
  }

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

```ts
function renderElement(
  request: Request,
  task: Task,
  type: any,
  props: Object,
  ref: any
): void {
  if (typeof type === "function") {
    if (shouldConstruct(type)) {
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

  switch (type) {
    case REACT_LEGACY_HIDDEN_TYPE:
    case REACT_DEBUG_TRACING_MODE_TYPE:
    case REACT_STRICT_MODE_TYPE:
    case REACT_PROFILER_TYPE:
    case REACT_FRAGMENT_TYPE: {
      renderNodeDestructive(request, task, props.children);
      return;
    }
    case REACT_SUSPENSE_LIST_TYPE: {
      pushBuiltInComponentStackInDEV(task, "SuspenseList");
      renderNodeDestructive(request, task, props.children);
      popComponentStackInDEV(task);
      return;
    }
    case REACT_SCOPE_TYPE: {
      if (enableScopeAPI) {
        renderNodeDestructive(request, task, props.children);
        return;
      }
      throw new Error("ReactDOMServer does not yet support scope components.");
    }
    case REACT_SUSPENSE_TYPE: {
      if (
        enableSuspenseAvoidThisFallbackFizz &&
        props.unstable_avoidThisFallback === true
      ) {
        renderBackupSuspenseBoundary(request, task, props);
      } else {
        renderSuspenseBoundary(request, task, props);
      }
      return;
    }
  }

  if (typeof type === "object" && type !== null) {
    switch (type.$$typeof) {
      case REACT_FORWARD_REF_TYPE: {
        renderForwardRef(request, task, type, props, ref);
        return;
      }
      case REACT_MEMO_TYPE: {
        renderMemo(request, task, type, props, ref);
        return;
      }
      case REACT_PROVIDER_TYPE: {
        renderContextProvider(request, task, type, props);
        return;
      }
      case REACT_CONTEXT_TYPE: {
        renderContextConsumer(request, task, type, props);
        return;
      }
      case REACT_LAZY_TYPE: {
        renderLazyComponent(request, task, type, props);
        return;
      }
    }
  }

  throw new Error(
    "Element type is invalid: expected a string (for built-in " +
      "components) or a class/function (for composite components) " +
      `but got: ${type == null ? type : typeof type}.${info}`
  );
}
```

render function component:

```ts
function renderIndeterminateComponent(
  request: Request,
  task: Task,
  Component: any,
  props: any
): void {
  let legacyContext;
  if (!disableLegacyContext) {
    legacyContext = getMaskedContext(Component, task.legacyContext);
  }
  pushFunctionComponentStackInDEV(task, Component);

  const value = renderWithHooks(request, task, Component, props, legacyContext);
  const hasId = checkDidRenderIdHook();

  if (
    !disableModulePatternComponents &&
    typeof value === "object" &&
    value !== null &&
    typeof value.render === "function" &&
    value.$$typeof === undefined
  ) {
    mountClassInstance(value, Component, props, legacyContext);
    finishClassComponent(request, task, value, Component, props);
  } else {
    if (hasId) {
      const prevTreeContext = task.treeContext;
      const totalChildren = 1;
      const index = 0;
      task.treeContext = pushTreeContext(prevTreeContext, totalChildren, index);
      try {
        renderNodeDestructive(request, task, value);
      } finally {
        task.treeContext = prevTreeContext;
      }
    } else {
      renderNodeDestructive(request, task, value);
    }
  }
  popComponentStackInDEV(task);
}
```

### startFlowing
