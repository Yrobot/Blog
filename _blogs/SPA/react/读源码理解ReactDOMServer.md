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

retryTask 将 node 解析放入 chunks 中

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

```ts
function renderWithHooks<Props, SecondArg>(
  request: Request,
  task: Task,
  Component: (p: Props, arg: SecondArg) => any,
  props: Props,
  secondArg: SecondArg
): any {
  const componentIdentity = {};
  prepareToUseHooks(task, componentIdentity);
  const result = Component(props, secondArg);
  return finishHooks(Component, props, result, secondArg);
}
```

```ts
let currentlyRenderingComponent: Object | null = null;
let currentlyRenderingTask: Task | null = null;
let localIdCounter: number = 0;

let isInHookUserCodeInDev = false;
export function prepareToUseHooks(task: Task, componentIdentity: Object): void {
  currentlyRenderingComponent = componentIdentity;
  localIdCounter = 0;
}
```

```ts
let didScheduleRenderPhaseUpdate: boolean = false;
export function finishHooks(
  Component: any,
  props: any,
  children: any,
  refOrContext: any
): any {
  while (didScheduleRenderPhaseUpdate) {
    // Updates were scheduled during the render phase. They are stored in
    // the `renderPhaseUpdates` map. Call the component again, reusing the
    // work-in-progress hooks and applying the additional updates on top. Keep
    // restarting until no more updates are scheduled.
    didScheduleRenderPhaseUpdate = false;
    localIdCounter = 0;
    numberOfReRenders += 1;

    // Start over from the beginning of the list
    workInProgressHook = null;

    children = Component(props, refOrContext);
  }
  resetHooksState();
  return children;
}
```

```ts
function flushCompletedQueues(
  request: Request,
  destination: Destination
): void {
  beginWriting(destination);
  try {
    const completedRootSegment = request.completedRootSegment;
    if (completedRootSegment !== null && request.pendingRootTasks === 0) {
      flushSegment(request, destination, completedRootSegment);
      request.completedRootSegment = null;
      writeCompletedRoot(destination, request.responseState);
    }

    const clientRenderedBoundaries = request.clientRenderedBoundaries;
    let i;
    for (i = 0; i < clientRenderedBoundaries.length; i++) {
      const boundary = clientRenderedBoundaries[i];
      if (!flushClientRenderedBoundary(request, destination, boundary)) {
        request.destination = null;
        i++;
        clientRenderedBoundaries.splice(0, i);
        return;
      }
    }
    clientRenderedBoundaries.splice(0, i);

    const completedBoundaries = request.completedBoundaries;
    for (i = 0; i < completedBoundaries.length; i++) {
      const boundary = completedBoundaries[i];
      if (!flushCompletedBoundary(request, destination, boundary)) {
        request.destination = null;
        i++;
        completedBoundaries.splice(0, i);
        return;
      }
    }
    completedBoundaries.splice(0, i);

    completeWriting(destination);
    beginWriting(destination);

    const partialBoundaries = request.partialBoundaries;
    for (i = 0; i < partialBoundaries.length; i++) {
      const boundary = partialBoundaries[i];
      if (!flushPartialBoundary(request, destination, boundary)) {
        request.destination = null;
        i++;
        partialBoundaries.splice(0, i);
        return;
      }
    }
    partialBoundaries.splice(0, i);

    const largeBoundaries = request.completedBoundaries;
    for (i = 0; i < largeBoundaries.length; i++) {
      const boundary = largeBoundaries[i];
      if (!flushCompletedBoundary(request, destination, boundary)) {
        request.destination = null;
        i++;
        largeBoundaries.splice(0, i);
        return;
      }
    }
    largeBoundaries.splice(0, i);
  } finally {
    completeWriting(destination);
    flushBuffered(destination);
    if (
      request.allPendingTasks === 0 &&
      request.pingedTasks.length === 0 &&
      request.clientRenderedBoundaries.length === 0 &&
      request.completedBoundaries.length === 0
    ) {
      close(destination);
    }
  }
}
```

check finish logic:

- request.allPendingTasks === 0
- request.pingedTasks.length === 0
- request.clientRenderedBoundaries.length === 0
- request.completedBoundaries.length === 0

```ts
const VIEW_SIZE = 2048;
let currentView = null;
let writtenBytes = 0;
let destinationHasCapacity = true;

export function beginWriting(destination: Destination) {
  currentView = new Uint8Array(VIEW_SIZE);
  writtenBytes = 0;
  destinationHasCapacity = true;
}
```

```ts
function flushSegment(
  request: Request,
  destination,
  segment: Segment
): boolean {
  const boundary = segment.boundary;
  if (boundary === null) {
    // Not a suspense boundary.
    return flushSubtree(request, destination, segment);
  }
  boundary.parentFlushed = true;
  // This segment is a Suspense boundary. We need to decide whether to
  // emit the content or the fallback now.
  if (boundary.forceClientRender) {
    // Emit a client rendered suspense boundary wrapper.
    // We never queue the inner boundary so we'll never emit its content or partial segments.

    writeStartClientRenderedSuspenseBoundary(
      destination,
      request.responseState,
      boundary.errorDigest,
      boundary.errorMessage,
      boundary.errorComponentStack
    );
    // Flush the fallback.
    flushSubtree(request, destination, segment);

    return writeEndClientRenderedSuspenseBoundary(
      destination,
      request.responseState
    );
  } else if (boundary.pendingTasks > 0) {
    // This boundary is still loading. Emit a pending suspense boundary wrapper.

    // Assign an ID to refer to the future content by.
    boundary.rootSegmentID = request.nextSegmentId++;
    if (boundary.completedSegments.length > 0) {
      // If this is at least partially complete, we can queue it to be partially emitted early.
      request.partialBoundaries.push(boundary);
    }

    /// This is the first time we should have referenced this ID.
    const id = (boundary.id = assignSuspenseBoundaryID(request.responseState));

    writeStartPendingSuspenseBoundary(destination, request.responseState, id);

    // Flush the fallback.
    flushSubtree(request, destination, segment);

    return writeEndPendingSuspenseBoundary(destination, request.responseState);
  } else if (boundary.byteSize > request.progressiveChunkSize) {
    // This boundary is large and will be emitted separately so that we can progressively show
    // other content. We add it to the queue during the flush because we have to ensure that
    // the parent flushes first so that there's something to inject it into.
    // We also have to make sure that it's emitted into the queue in a deterministic slot.
    // I.e. we can't insert it here when it completes.

    // Assign an ID to refer to the future content by.
    boundary.rootSegmentID = request.nextSegmentId++;

    request.completedBoundaries.push(boundary);
    // Emit a pending rendered suspense boundary wrapper.
    writeStartPendingSuspenseBoundary(
      destination,
      request.responseState,
      boundary.id
    );

    // Flush the fallback.
    flushSubtree(request, destination, segment);

    return writeEndPendingSuspenseBoundary(destination, request.responseState);
  } else {
    // We can inline this boundary's content as a complete boundary.
    writeStartCompletedSuspenseBoundary(destination, request.responseState);

    const completedSegments = boundary.completedSegments;

    if (completedSegments.length !== 1) {
      throw new Error(
        "A previously unvisited boundary must have exactly one root segment. This is a bug in React."
      );
    }

    const contentSegment = completedSegments[0];
    flushSegment(request, destination, contentSegment);

    return writeEndCompletedSuspenseBoundary(
      destination,
      request.responseState
    );
  }
}
```

```ts
export function writeCompletedRoot(
  destination: Destination,
  responseState: ResponseState
): boolean {
  const bootstrapChunks = responseState.bootstrapChunks;
  let i = 0;
  for (; i < bootstrapChunks.length - 1; i++) {
    writeChunk(destination, bootstrapChunks[i]);
  }
  if (i < bootstrapChunks.length) {
    return writeChunkAndReturn(destination, bootstrapChunks[i]);
  }
  return true;
}
```

```ts
export function writeChunk(
  destination: Destination,
  chunk: PrecomputedChunk | Chunk,
): void {
  if (typeof chunk === 'string') {
    writeStringChunk(destination, chunk);
  } else {
    writeViewChunk(destination, ((chunk: any): PrecomputedChunk));
  }
}
```

```ts
function writeStringChunk(destination: Destination, stringChunk: string) {
  if (stringChunk.length === 0) {
    return;
  }
  // maximum possible view needed to encode entire string
  if (stringChunk.length * 3 > VIEW_SIZE) {
    if (writtenBytes > 0) {
      writeToDestination(
        destination,
        ((currentView: any): Uint8Array).subarray(0, writtenBytes),
      );
      currentView = new Uint8Array(VIEW_SIZE);
      writtenBytes = 0;
    }
    writeToDestination(destination, textEncoder.encode(stringChunk));
    return;
  }

  let target: Uint8Array = (currentView: any);
  if (writtenBytes > 0) {
    target = ((currentView: any): Uint8Array).subarray(writtenBytes);
  }
  const {read, written} = textEncoder.encodeInto(stringChunk, target);
  writtenBytes += written;

  if (read < stringChunk.length) {
    writeToDestination(destination, (currentView: any));
    currentView = new Uint8Array(VIEW_SIZE);
    writtenBytes = textEncoder.encodeInto(stringChunk.slice(read), currentView)
      .written;
  }

  if (writtenBytes === VIEW_SIZE) {
    writeToDestination(destination, (currentView: any));
    currentView = new Uint8Array(VIEW_SIZE);
    writtenBytes = 0;
  }
}
```

```ts
function writeViewChunk(destination: Destination, chunk: PrecomputedChunk) {
  if (chunk.byteLength === 0) {
    return;
  }
  if (chunk.byteLength > VIEW_SIZE) {
    // this chunk may overflow a single view which implies it was not
    // one that is cached by the streaming renderer. We will enqueu
    // it directly and expect it is not re-used
    if (writtenBytes > 0) {
      writeToDestination(
        destination,
        ((currentView: any): Uint8Array).subarray(0, writtenBytes),
      );
      currentView = new Uint8Array(VIEW_SIZE);
      writtenBytes = 0;
    }
    writeToDestination(destination, chunk);
    return;
  }

  let bytesToWrite = chunk;
  const allowableBytes = ((currentView: any): Uint8Array).length - writtenBytes;
  if (allowableBytes < bytesToWrite.byteLength) {
    // this chunk would overflow the current view. We enqueue a full view
    // and start a new view with the remaining chunk
    if (allowableBytes === 0) {
      // the current view is already full, send it
      writeToDestination(destination, (currentView: any));
    } else {
      // fill up the current view and apply the remaining chunk bytes
      // to a new view.
      ((currentView: any): Uint8Array).set(
        bytesToWrite.subarray(0, allowableBytes),
        writtenBytes,
      );
      writtenBytes += allowableBytes;
      writeToDestination(destination, (currentView: any));
      bytesToWrite = bytesToWrite.subarray(allowableBytes);
    }
    currentView = new Uint8Array(VIEW_SIZE);
    writtenBytes = 0;
  }
  ((currentView: any): Uint8Array).set(bytesToWrite, writtenBytes);
  writtenBytes += bytesToWrite.byteLength;

  if (writtenBytes === VIEW_SIZE) {
    writeToDestination(destination, (currentView: any));
    currentView = new Uint8Array(VIEW_SIZE);
    writtenBytes = 0;
  }
}
```

```ts
export function writeChunkAndReturn(
  destination: Destination,
  chunk: PrecomputedChunk | Chunk
): boolean {
  writeChunk(destination, chunk);
  return destinationHasCapacity;
}
```

```ts
function flushSubtree(
  request: Request,
  destination: Destination,
  segment: Segment
): boolean {
  segment.parentFlushed = true;
  switch (segment.status) {
    case PENDING: {
      const segmentID = (segment.id = request.nextSegmentId++);
      return writePlaceholder(destination, request.responseState, segmentID);
    }
    case COMPLETED: {
      segment.status = FLUSHED;
      let r = true;
      const chunks = segment.chunks;
      let chunkIdx = 0;
      const children = segment.children;
      for (let childIdx = 0; childIdx < children.length; childIdx++) {
        const nextChild = children[childIdx];
        // Write all the chunks up until the next child.
        for (; chunkIdx < nextChild.index; chunkIdx++) {
          writeChunk(destination, chunks[chunkIdx]);
        }
        r = flushSegment(request, destination, nextChild);
      }
      // Finally just write all the remaining chunks
      for (; chunkIdx < chunks.length - 1; chunkIdx++) {
        writeChunk(destination, chunks[chunkIdx]);
      }
      if (chunkIdx < chunks.length) {
        r = writeChunkAndReturn(destination, chunks[chunkIdx]);
      }
      return r;
    }
  }
}
```
