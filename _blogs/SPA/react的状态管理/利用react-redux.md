---
title: react的状态管理3—利用react-redux
author: yrobot
keywords: react,redux,状态管理,react-redux
createTime: 2018年09月23日
updateTime: 2022年02月26日
---

## 场景思考

现在我们用 react 去写一篇博客  
博客包含 `标题` 和 `内容`  
而我期望`标题`和`内容`的主题可以一键修改

首先来看看项目的组件树：  
<img src="https://gitee.com/yrobot/images/raw/master/2022-02-25/QiwCKp-15-35-08.png" width='500' />

那么有什么方式使`Title`和`Content`的主题保持一致呢？

#### 回顾上一节

上一节我们使用 react 自带的 [利用 Context](./利用Context) 方法

利用 react 的 context 实现跨组件数据传递很方便

react 的 context 只是对于数据传递的一种优雅的解决方案；但是状态管理还是利用顶层组件的 useState，在 state 变更后导致传入 Provider 的 value 值变更，从而引起监听组件的 rerender。



## 依然存在问题

当我们的 App 越来越复杂，需要管理的全局状态越来越多时，  
如果使用一个 context 去管理，那么在 context 中的任何一个数据的变化都会引起子组件的 rerender（性能浪费）。

即使我们对所有子组件使用 React.memo 包裹，避免 props 传参一致的组件 rerender，但是还是没法做到监听的具体数据层级的优化（如单纯 context.type 变更时还是会引起 context.theme 监听组件的 rerender）

当然我们可以通过拆分 context 的方式进行优化（拆分成 typeContext 和 themeContext），但是这个解决方案不是很 fancy，管理多个 context 的逻辑也会变得不好维护。

这时 react-redux 就可以很完美的解决了上述场景，只需要声明一个全局 state，在不同的组件里对于 state 中具体值进行监听，组件只会在对应的 selector 的值变化后 rerender。

当然 redux 的优势还是其本身对于全局状态管理的实现设计。



## 利用 react-redux

redux 是一套专业解决应用状态管理的通用模块

它不仅可以和 react 结合，形成 react-redux，也可以和 vue、angular 结合

**react-redux 的作用：** 用户可以自定义全局状态，并在组件中声明式的监听对应状态，组件便可在状态变更后自动更新

**react-redux 的使用方法：**

1. 定义初始化状态数据，定义`reducer`处理状态更新
2. 调用`createStore()`传入`reducer`生成`store`
3. 引入`Provider`并包裹 App，将`store`注入`Provider`
4. 在组件内使用 `connect` 或 `useSelector` 声明式监听对应状态
5. 通过`dispatch()`触发`reducer`，从而更新状态

<img src="https://gitee.com/yrobot/images/raw/master/2022-03-09/NCP8iW-17-48-06.png" width='560' />

**react-redux 的优势：**

- 相对于 react 自带的 context，react-redux 使用更加方便，并支持对子状态单独监听，redux 的设计也可以更好的 debug 状态变更。

**当然优势的前提是场景已经相对复杂的情况了，简单场景使用状态提升就够了**



## 查看代码

store.js 生成全局状态：

```ts
import { createStore } from "redux";

const initState = {
  theme: "black",
  type: "reader",
};

const actions = {
  CHANGE_THEME: "CHANGE_THEME",
  CHANGE_TYPE: "CHANGE_TYPE",
};

const reducer = (state = initState, action) => {
  switch (action.type) {
    case actions.CHANGE_THEME:
      return { ...state, theme: action.value };
    case actions.CHANGE_TYPE:
      return { ...state, type: action.value };
    default:
      return state;
  }
};

const store = createStore(reducer, initState);

export const updateTheme = (value) => {
  store.dispatch({
    type: actions.CHANGE_THEME,
    value,
  });
};

export default store;
```

BlogPage.js 中 生成 store，并利用 Provider 注入顶层组件：

```ts
import { Provider } from "react-redux";
import store from "./store.js";

const BlogPage = () => {
  return (
    <Provider store={store}>
      <Header />
      <Main />
    </Provider>
  );
};

export default BlogPage;
```

Content.js 中利用 connect()函数将状态写入组件 props：

```ts
import { themeMap } from "../config"; // 各种theme的配置文件
import { shallowEqual, useSelector } from "react-redux";
import { updateTheme } from "./store.js";

export default () => {
  const theme = useSelector((state) => state.theme, shallowEqual);
  const { color } = themeMap[theme];
  return (
    <>
      <button
        onClick={() => {
          updateTheme("dark");
        }}
      >
        切换主题
      </button>
      <div className="content" style={{ color: color }}>
        内容...
      </div>
    </>
  );
};
```



## 对比其他方案

之前已经探讨过使用原生 react 技术实现的全局状体的管理方案，[《利用 props 状态提升》](./利用props状态提升)和[《利用 react-redux》](./利用react-redux)

但是多少都存在使用和性能问题。

使用了 react-redux 后，可以发现代码量其实是有所上升的，

关于状态定义和状态使用部分，其实代码量没有很大的差异。

但是 redux 为了实现 可预测性 和 状态的时空旅行，使用纯函数和类型分发来更新状态，这就导致了 redux 比其他方案多了 reducer 和 dispatch 的代码。

所以对于单纯需要一个全局状态管理（无需时空旅行），redux 用起来还是繁琐了些。
