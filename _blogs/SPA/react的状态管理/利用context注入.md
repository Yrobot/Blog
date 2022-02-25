---
title: react的状态管理2—利用context注入
author: yrobot
keywords: context,状态管理,react,注入
createTime: 2018年09月22日
updateTime: 2022年02月25日
---

**本页目录：**  
[场景思考](#index)  
[利用 context 注入](#context)  
[查看效果](#result)  
[查看代码](#code)

<a id='index'></a>

## 场景思考

现在我们用 react 去写一篇博客  
博客包含 `标题` 和 `内容`  
而我期望`标题`和`内容`的主题可以一键修改

首先来看看项目的组件树：  
<img src="https://gitee.com/yrobot/images/raw/master/2022-02-25/QiwCKp-15-35-08.png" width='400' />

那么有什么方式使`Title`和`Content`的主题保持一致呢？

#### 回顾上一节

上一节我们使用最基础的[props 状态提升](../利用props状态提升)的方法  
但当组件链很长的时候，新增一个状态就必须修改每个组件的 props  
那有没有跟直接的方法，搞一个共享状态，每个组件可以自由访问呢  
react 自带的 context 就是用来实现这一点的

<a id='context'></a>

## 利用 context 注入

react 的 context 可以代替 props 的传递工作

**context 的作用：** 将顶部  组件的状态和方法与子组件共享

**context 的使用方法：**

1. 利用`React.createContext()`生成一对`{Provider,Consumer}`
2. 用生成的`Provider`包裹  顶部组件，利用他 props 的 value 字段传入共享状态与方法
   ```
    <Provider value={{状态和方法}}>
        <顶层组件>
    </Provider>
   ```
3. 用生成的`Consumer`包裹使用共享状态的组件，在 Consumer 内子组件外用函数传入共享的状态
   ```
    <Consumer>
        {value => (
            <子组件 使用value>
        )}
    </Consumer>
   ```
4. 保证状态位于顶层组件的`state`中，而共享的方法要更新状态也是利用`setState`，这样 UI 层才会刷新

![](https://ws4.sinaimg.cn/large/006tNbRwgy1fvhm1xim52j30yg0pqads.jpg)

**context 的优势：**

1. 只需要在顶层组件和用到状态的子组件进行操作，省去了 props 状态提升中对中间组件的数据传递操作。代码更清晰。
2. 无需引入第三方状态管理，学习成本也相对较低

**尽管 context 相对于 props 状态提升方便很多， 但是 react 官网还是 _不建议_ 使用 context，因为 context 的 API 是实验性的，在未来的 react 版本中会被修改。**

**在简单场景,推荐使用 props 状态提升**  
**在较复杂的场景，应该考虑引入第三方状态管理(如 Redux、Mobx)**

<a id='result'></a>

## 查看效果

1.  ![](https://ws3.sinaimg.cn/large/006tNbRwgy1fvhmmoieh4j31kw0nxdpk.jpg)
2.  ![](https://ws2.sinaimg.cn/large/006tNbRwgy1fvhmmukgfyj31kw0o2qcy.jpg)

<a id='code'></a>

## 查看代码

mainColorContext.js 暴露 React.createContext：

```
import React from 'react';

export const mainColorContext = React.createContext(
    {
        mainColor:'black'
    } // 默认值
);
```

BlogPage.js 中引入 mainColorContext，定义全局状态 mainColor 和方法 changeMainColor()并传入 Provider：

```
import {mainColorContext} from './mainColorContext.js'

class BlogPage extends Component {
    constructor(props) {
        super(props);
        this.state = {
            mainColor: 'black'
        }
    }
    changeMainColor = (color) => {
        this.setState({ //this的绑定//运行时//但是箭头函数没有this//直接沿着作用域链往上找找到BlogPage类的this //换成function就不行了，obj.func()会修改this指向为obj
            mainColor: color
        })
    }
    render() {
        const { mainColor } = this.state;
        return (
            <mainColorContext.Provider value={{mainColor,changeMainColor:this.changeMainColor}}>
                <div className="blogContainer">
                    <Header ></Header>
                    <Main></Main>
                </div>
            </mainColorContext.Provider>
        );
    }
}
```

Content.js 组件中获取使用 Consumer 传递的数据和方法：

```
import {mainColorContext} from '../../BlogPage/mainColorContext.js'

class Content extends Component {
    constructor(props) {
        super(props);
        this.state = {}
    }
    render() {
        return (
            <mainColorContext.Consumer>
                {value => (
                    <div className="content" style={{ color: value.mainColor }}>
                        文本...
                    <div className="button" onClick={()=>{value.changeMainColor('#' + (Math.random() * 0xffffff << 0).toString(16))}}>切换颜色</div>
                    </div>
                )}
            </mainColorContext.Consumer>

        );
    }
}
```
