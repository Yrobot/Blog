---
title: react-redux 源码阅读 和 设计理解 与 使用优化
author: yrobot
keywords: react,redux,状态管理,优化,hooks,useSelector,重渲染,rerender,源码
createTime: 2022年02月23日
updateTime: 2022年03月11日
draft: true
---

## 使用 redux 的心里负担

和大多数人一样，我第一次接触 redux，就是单纯的为了处理跨组件状态。

但是首先遇到的困惑就是 redux 繁琐的编码流程，redux 需要额外定义 reducers 和 actions，redux 为什么不允许用户直接修改 state 呢（如果 reducer 不纯会怎么样呢）？

然后，由于刚接触 redux，使用不是很规范，导致 dispatch 更新 state 之后多个组件发生了 rerender。怎么才能做到最大的性能优化呢？

## 一些共识

## 我在使用 redux 过程中的一些发问

### 可以直接使用 store.dispatch 吗？

- [Can I import my store directly, and use it in components myself? - redux](https://redux.js.org/faq/store-setup#can-or-should-i-create-multiple-stores-can-i-import-my-store-directly-and-use-it-in-components-myself)

- [Is mapDispatch2Props really necessary? - github.issue ](https://github.com/reduxjs/react-redux/issues/1026#issuecomment-424715225)
