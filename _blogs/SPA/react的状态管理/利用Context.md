---
title: react的状态管理2—利用Context
author: yrobot
keywords: context,状态管理,react,注入
createTime: 2018年09月22日
updateTime: 2022年02月25日
---

**本页目录：**  
[场景思考](#index)  
[利用 Context](#context)  
[查看代码](#code)  
[利用 Context 实现全局状态管理的原理](#principle)  
[存在的问题](#problem)  
[更好的方案](#better)

<a id='index'></a>

## 场景思考

现在我们用 react 去写一篇博客  
博客包含 `标题` 和 `内容`  
而我期望`标题`和`内容`的主题可以一键修改

首先来看看项目的组件树：  
<img src="https://gitee.com/yrobot/images/raw/master/2022-02-25/QiwCKp-15-35-08.png" width='500' />

那么有什么方式使`Title`和`Content`的主题保持一致呢？

#### 回顾上一节

上一节我们使用最基础的[《props 状态提升》](../利用props状态提升)的方法  
但当组件链很长的时候，新增一个状态就必须修改途中每个组件的 props  
那有没有更直接的方法，搞一个共享状态，每个组件可以自由访问呢  
react 自带的 [Context](https://zh-hans.reactjs.org/docs/context.html) 就是用来实现这一点的

<a id='context'></a>

## 利用 Context

> Context 提供了一个无需为每层组件手动添加 props，就能在组件树间进行数据传递的方法。

### context 的作用:

Context 提供了一种在组件之间共享值的方式，而不必显式地通过组件树的逐层传递 props。

Context 会根据引用标识来决定何时进行渲染（本质上是 value 属性值的浅比较）

### context 的使用方法:

1. 利用`React.createContext()`生成一个 `Context` 实例，实例包含`Provider`, `Consumer`
2. 用`Context.Provider`包裹 顶层组件，利用他 props 的 value 字段传入共享状态与方法
   ```ts
   const value: any; // 需要共享的状态
   <Provider value={{ value }}>
     <顶层组件 />
   </Provider>;
   ```
3. 用`Context.Consumer`包裹使用共享状态的组件，Consumer 支持传入一个函数: `(共享状态) => <子组件 />`
   ```ts
   <Consumer>
     {(
       value // 获取共享的状态
     ) => <子组件 />}
   </Consumer>
   ```
4. 保证状态位于顶层组件的`state`中，而共享的方法要更新状态也是利用`setState`，这样 UI 层才会刷新

<img src="https://gitee.com/yrobot/images/raw/master/2022-02-25/FJJRoV-18-39-51.png" width='640' />

### context 的优势:

1. 只需要在顶层组件和用到状态的子组件进行操作，省去了 props 状态提升中对中间组件的数据传递操作。代码也更清晰。
2. 无需引入第三方状态管理，学习成本也相对较低

<a id='code'></a>

## 查看代码

> themeContext.js 暴露 themeContext 实例：

```ts
import React from "react";

export const themeContext = React.createContext(
  {
    theme: "white",
    type: "reader",
  } // 默认值
);
```

> BlogPage.js 中引入 themeContext ，定义全局状态 theme 和方法 changeTheme()并传入 Provider：

```ts
import { themeContext } from "./themeContext";

class BlogPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      theme: "black",
      type: "reader",
    };
  }
  changeTheme = (theme) => {
    this.setState({
      theme,
    });
  };
  changeType = (type) => {
    this.setState({
      type,
    });
  };
  render() {
    const { theme, type } = this.state;
    return (
      <themeContext.Provider
        value={{
          theme,
          changeTheme: this.changeTheme.bind(this),
          type, // 此处引入只是为了展示性能问题
          changeType: this.changeType.bind(this), // 此处引入只是为了展示性能问题
        }}
      >
        <Header></Header>
        <Main></Main>
      </themeContext.Provider>
    );
  }
}
```

> Content.js 组件中获取使用 Consumer 传递的数据和方法：

```ts
import themeMap form '../themeConfig' // 各种theme的配置文件
import { themeContext } from "./themeContext";

class Content extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }
  render() {
    return (
      <themeContext.Consumer>
        {(value) => {
          const { color, changeTheme }  = themeMap[value.theme];
          return <div className="content" style={{ color }}>
            blog文本...
            <button
              onClick={() => {
                changeTheme('dark')
              }}
            >
              切换主题
            </button>
          </div>
        }}
      </themeContext.Consumer>
    );
  }
}
```

<a id='principle'></a>

## 利用 Context 实现全局状态管理的原理

Context 本身只是解决的了跨组件数据传递的问题，即不需要一层层传递 state  
状态管理的实现是利用顶层组件的 useState，在 state 变更后导致传入 Provider 的 value 值变更，从而引起监听组件的 rerender。

<a id='problem'></a>

## 存在的问题

1. 性能问题：由于状态提升到最顶端组件，所以一旦状态变更就会引起最顶端组件 rerender，如果没有 memo 进行优化包裹，那么整个 App 都会 rerender。而且就算全局使用了 memo 优化，上述例子中单纯 type 的更新还是会`Content`组件的更新。
2. 代码冗杂：子组件为了避免无效 rerender，不得不嵌套上 memo 进行性能优化
3. 状态管理混乱，无法像使用中间层一样轻易的给状态管理加上一些统一的逻辑

<a id='better'></a>

## 更好的方案

针对上面提到的 React Context 的问题，我们对于方案又有了进一步的期望：

1. 状态变更时只有在子组件监听的具体状态变更后触发更新（上述例子中 type 变更不会引起`Content`组件的更新
2. 优雅的 debug，可以清晰的知道状态何时发生了变更，变更前后的值是什么

### 请移步进阶的状态管理方案：

- [《利用 react-redux》](../利用react-redux)
