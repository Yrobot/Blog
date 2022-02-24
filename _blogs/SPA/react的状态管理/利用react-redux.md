---
title: react的状态管理—利用react-redux
author: yrobot
keywords: react,redux,状态管理,利用
createTime: 2018年09月23日
updateTime: 2022年02月24日
---

**本页目录：**  
[场景思考](#index)  
[利用 react-redux](#redux)  
[查看效果](#result)  
[查看代码](#code)

<a id='index'></a>

## 场景思考

现在我们用 react 去写一篇博客  
博客包含 `标题` 和 `内容`  
而我期望`标题`和`内容`的颜色可以一键修改

当然最暴力的实现方式就是利用 dom 操作去被动的修改  
但是有没有更优雅更可控的方式呢？

首先来看看项目的组件树：  
![](https://ws1.sinaimg.cn/large/006tNbRwgy1fvekxo7hlhj30c00aj0sy.jpg)

那么有什么好的优雅的方式使`Title`和`Content`的颜色保持一致呢？  
换句话说，怎么更好的管理`Title`和`Content`的状态呢？

#### 回顾上一节

上一节我们使用 react 自带的 [ 利用 context 注入](../利用context注入) 方法  
利用 react 的 context 去实现状态共享很方便  
但是 react 的 context 只适合简单单一状态的管理，useContext 的更新逻辑是对 context 进行浅比较，前后不一致则触发组件 rerender

所以当我们的 App 越来越复杂，需要管理的全局状态越来越多时，  
如果使用一个 context 去管理，那么在 context 中的任何一个数据的变化都会引起所有的 Consumer 组件的 rerender（性能浪费。  
我们可以通过 context 拆分的方式进行优化，但是这个解决方案不是很 fancy，管理不同 context 的逻辑也会变得不好维护。

这时 react-redux 就可以很好的解决了上述场景，只需要声明一个全局 state（当然也可以多个），在不同的组件里对于 state 进行监听，组件只会在对应的 selector 后的值变化后 rerender。

当然 redux 的优势还是其本身对于全局状态管理的实现设计。

<a id='redux'></a>

## 利用 react-redux

redux 是一套专业解决应用状态管理的通用模块  
它不仅可以和 react 结合，形成 react-redux，也可以和 vue、angular 结合

**react-redux 的作用：** 类似于 react 的 context， react-redux 在顶层组件利用 Provider 将 store 注入，在需要用到状态的组件处用 connect 函数包裹，从组件的 props 中获取 store，或直接利用 useSelector 的 hooks 监听状态值和变化。

**react-redux 的使用方法：**

1. 根据全局数据，将其拆分为多个`reducer`
2. 对于每个`reducer`分配`state`（`reducers.reducer`）和`action`，处理对应的`action`操作，生成新的`state` 并 return
3. 将`reducer`合并成`reducers`,`reducers`分配传入的`state`和`action`操作到`reducer`
4. `createStore()`传入`reducers`生成`store`，并用`Provider`将`store`注入顶层组件
5. 在要引用`store`的组件部分用`connect()`连接，`connect()`会注册监听、将`dispatch()`[默认写入]和`mapStateToProps`的属性写入`props`，当然如果使用`mapDispatchToProps`生成的`action creator`也会写入`props`。
6. 在组件中通过`props`获取 5 中写入`props`的数据即可使用。
7. 通过`dispatch()`的参数会触发`reducers`的`action`操作，从而更新状态

**react-redux 的优势：**

- 相对于 react 自带的 context，react-redux 使用更加方便，并支持对子状态单独监听，redux 的设计也可以更好的 debug 状态变更。

**当然优势的前提是场景已经相对复杂的情况了，简单场景使用状态提升就够了**

<a id='result'></a>

## 查看效果

1.  ![](https://ws3.sinaimg.cn/large/006tNbRwgy1fvhmmoieh4j31kw0nxdpk.jpg)
2.  ![](https://ws2.sinaimg.cn/large/006tNbRwgy1fvhmmukgfyj31kw0o2qcy.jpg)

<a id='code'></a>

## 查看代码

reducers.js 生成全局状态：

```
import { combineReducers } from 'redux'

const mainColor = (state = 'black',action)=>{
    switch (action.type){
        case 'CHANGE_COLOR':
            state = action.color;
            return state;
        default:
            return state;
    }
}

export default combineReducers({
    mainColor,
})
```

BlogPage.js 中 生成 store，并利用 Provider 注入顶层组件：

```
import reducers from './reducers.js'

const store = createStore(reducers);

class BlogPage extends Component {
    constructor(props) {
        super(props);
        this.state = {
        }
    }
    render() {
        return (
            <Provider store = {store}>
                <div className ="blogContainer">
                    <Header ></Header>
                    <Main></Main>
                </div>
            </Provider>
        );
    }
}

export default BlogPage;
```

Content.js 中利用 connect()函数将状态写入组件 props：

```
class Content extends Component {
    constructor(props) {
        super(props);
        this.state = {}
    }
    render() {
        const {mainColor,changeMainColor} = this.props;
        return (
            <div className="content" style={{ color: mainColor }}>
                内容...
                <div className="button" onClick={() => { changeMainColor('#' + (Math.random() * 0xffffff << 0).toString(16)) }}>切换颜色</div>
            </div>

        );
    }
}

const mapStateToProps = state => ({  //引入状态到props，并注册监听变化
    mainColor: state.mainColor
})

const mapDispatchToProps = dispatch => ({ //引入方法到props
    changeMainColor: color => {
        dispatch({
            type:'CHANGE_COLOR',
            color,
        })
    }
})

export default connect(  //绑定组件 //高阶组件:函数接受一个组件作为参数，并返回一个新的组件
    mapStateToProps,
    mapDispatchToProps
)(Content);
```
