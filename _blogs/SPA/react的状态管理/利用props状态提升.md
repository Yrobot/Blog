---
title: react的状态管理1—利用props状态提升
author: yrobot
keywords: 状态管理,props,react,状态提升
createTime: 2018年09月18日
updateTime: 2022年02月25日
---

**本页目录：**  
[场景思考](#index)  
[利用 props 状态提升](#props)  
[查看代码](#code)  
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

<a id='props'></a>

## 利用 props 状态提升

在 react 中，组件间数据传递最常用的方式就是利用 props 传递  
而目我们要做的就是 Title 和 Content 引用的是同一个主题状态，而且在主题改变时组件自动重新渲染

所以我们可以把一些共享的状态放在最顶端的组件中，子组件通过 props 去访问和修改这些状态

本场景中需要共享的状态只有一个`theme`和一个修改 theme 的函数`changeTheme()`

**具体流程如下图：**  
![](https://gitee.com/yrobot/images/raw/master/2022-02-25/TnhgMb-15-46-48.png)

> 可以看到，需要在 Content 和 Title 中用 theme，需要通过组件 props 层层传递到需要用状态的组件，更新函数也是同理

<a id='code'></a>

## 查看代码

BlogPage 中定义全局状态 theme 和方法 changeTheme()并传递：

```js
class BlogPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      theme: "white",
    };
  }
  changeTheme = (theme) => {
    this.setState({
      theme,
    });
  };
  render() {
    const { theme } = this.state;
    return (
      <div className="blogContainer">
        <Header theme={theme}></Header>
        <Main theme={theme} changeTheme={this.changeTheme}></Main>
      </div>
    );
  }
}
```

Content 组件中使用 props 传递的数据和方法：

```js

import themeMap form '../themeConfig' // 各种theme的配置文件

class Content extends Component {
    constructor(props) {
        super(props);
        this.state = {}
    }
    changeTheme = () => {
        const { theme } = this.props;
        this.props.changeTheme(theme ==='white' ? 'black' : 'white');
    }
    render() {
        const { theme }=this.props;
        const { color } = themeMap[theme]
        return (
            <div className="content" style={{color}}>
                内容...
                <div className="button" onClick={this.changeTheme}>切换主题</div>
            </div>
        );
    }
}
```

<a id='problem'></a>

## 存在的问题

1. 性能问题：由于状态提升到最顶端组件，所以一旦状态变更就会引起最顶端组件 rerender，如果没有 memo 进行优化包裹，那么整个 App 都会 rerender。
2. 用起来复杂：如果 App 层级较多，最底层逐渐主要用到全局状态的话，那么中间的每一层组件都需要接收并传递全局状态。
3. 代码冗杂：大量重复的代码，单纯只是为了传递状态
4. 状态管理混乱，无法像使用中间层一样轻易的给状态管理加上一些统一的逻辑

<a id='better'></a>

## 更好的方案

针对上面提到的状态提升的问题，我们对于方案有了进一步的期望：

1. 状态变更只会引起监听组件的更新，甚至只有在监听的具体状态变更后触发更新
2. 在全局状态无关的组件里无需添加任何逻辑
3. 优雅的 debug，可以清晰的知道状态何时发生了变更，变更前后的值是什么

### 请移步进阶的状态管理方案：

- [《利用 Context》](../利用Context)
- [《利用 react-redux》](../利用react-redux)
