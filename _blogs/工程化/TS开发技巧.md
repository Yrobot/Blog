---
title: TS开发技巧
author: yrobot
keywords: 前端,ts,typescript,tips,技巧
createTime: 2023年07月25日
---

## 函数后续参数类型依据前面参数类型进行推断

比如埋点函数，LOGIN 和 PAGE_VIEW 事件的参数结构不同，要怎么实现 类型和参数结构一一对应。

### 问题展示

```ts
enum EventType {
  LOGIN = "LOGIN",
  PAGE_VIEW = "PAGE_VIEW",
}
type LOGIN_PARAMS = { userId: string };
type PAGE_VIEW_PARAMS = { pageId: string };
function track(eventType: EventType, params: LOGIN_PARAMS | PAGE_VIEW_PARAMS) {
  // logic inside
}
```

这种实现方式，虽然可以实现，但是调用的时候，ts 无法根据 eventType 推断出 params 的类型，需要手动传入，这样就会导致调用的时候，传入的参数类型和 eventType 不匹配的问题。

### 解决方案: 函数重载

```ts
enum EventType {
  LOGIN = "LOGIN",
  PAGE_VIEW = "PAGE_VIEW",
}
type LOGIN_PARAMS = { userId: string };
type PAGE_VIEW_PARAMS = { pageId: string };
function track(eventType: EventType.LOGIN, params: LOGIN_PARAMS): void;
function track(eventType: EventType.PAGE_VIEW, params: PAGE_VIEW_PARAMS): void;
function track(eventType: string, params: LOGIN_PARAMS | PAGE_VIEW_PARAMS) {
  // logic inside
}
```

这样调用的时候，ts 就可以根据 eventType 推断出 params 的类型了。

## Enum 枚举类型属性支持直接传入字符串

### 问题展示

不能将类型“"button"”分配给类型“Type”。ts(2322)

```tsx
// Component.tsx
enum Type {
  Button = "button",
  Input = "input",
}

export default function Component({ type }: { type: Type }) {
  return <div>{type}</div>;
}

// App.tsx
import Component from "./Component";

export default function App() {
  return (
    <div>
      {/* 此时 ts 会报错，因为 type 期望的是 Type 枚举类型，不支持直接传入字符串 */}
      <Component type="button" />
    </div>
  );
}
```

### 解决方案

```tsx
// Component.tsx
enum Type {
  Button = "button",
  Input = "input",
}

export default function Component({ type }: { type: `${Type}` }) {
  return <div>{type}</div>;
}
```

这样 Component 的 type 属性就是一个支持 字符串 枚举的类型了，type='button' 即可。
