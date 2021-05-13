---
title: react的状态管理—利用react-redux
author: yrobot
keywords: react,redux,状态管理,利用
createTime: 2018年09月23日
---

__本页目录：__   
[场景思考](#index)  
[利用react-redux](#redux)  
[查看效果](#result)  
[查看代码](#code)  

<a id='index'></a>

## 场景思考
现在我们用react去写一篇博客  
博客包含 `标题` 和 `内容`  
而我期望`标题`和`内容`的颜色可以一键修改  

当然最暴力的实现方式就是利用dom操作去被动的修改  
但是有没有更优雅更可控的方式呢？  

首先来看看项目的组件树：  
![](https://ws1.sinaimg.cn/large/006tNbRwgy1fvekxo7hlhj30c00aj0sy.jpg)

那么有什么好的优雅的方式使`Title`和`Content`的颜色保持一致呢？  
换句话说，怎么更好的管理`Title`和`Content`的状态呢？ 

#### 回顾上一节  
上一节我们使用react自带的 [利用context注入](./利用context注入) 方法   
利用react的context去实现状态共享很方便  
但是react的context还是实验性的，何时会更新无法预知  
所以为了保证软件的稳定性，我们还是使用react推荐的第三方状态管理redux   

<a id='redux'></a>

## 利用react-redux
redux 是一套专业解决应用状态管理的独立的通用模块  
它不仅可以和react结合，形成react-redux，也可以和vue、angular结合  

__react-redux的作用：__ 类似于react的context，react-redux在顶层组件利用Provider将store注入，在需要用到状态的组件处用connect函数包裹，从组件的props中获取store  

__react-redux的使用方法：__  
1. 根据全局数据，将其拆分为多个`reducer`
2. 对于每个`reducer`分配`state`（`reducers.reducer`）和`action`，处理对应的`action`操作，生成行的`state`
3. 将`reducer`合并成`reducers`,`reducers`分配传入的`state`和`action`操作到`reducer` 
4. `createStore()`传入`reducers`生成`store`，并用`Provider`将`store`注入顶层组件
5. 在要引用`store`的组件部分用`connect()`连接，`connect()`会注册监听、将`dispatch()`[默认写入]和`mapStateToProps`的属性写入`props`，当然如果使用`mapDispatchToProps`生成的`action creator`也会写入`props`。
6. 在组件中通过`props`获取5中写入`props`的数据即可使用。
7. 通过`dispatch()`的参数会触发`reducers`的`action`操作，从而更新状态  

![](https://ws2.sinaimg.cn/large/006tNbRwgy1fvlqv6xb3uj30yu0sagqj.jpg)

__react-redux的优势：__ 
1. 相对于react自带的context，react-redux更加稳定成熟，并对性能进行了优化  
2. 相对于props的状态提升，react-redux更加的方便简洁，整个全局状态也更加清晰   

__老话说的好，杀鸡焉用牛刀，在简单场景直接使用状态提升即可__  

<a id='result'></a>

## 查看效果
1. 
![](https://ws3.sinaimg.cn/large/006tNbRwgy1fvhmmoieh4j31kw0nxdpk.jpg)
2. 
![](https://ws2.sinaimg.cn/large/006tNbRwgy1fvhmmukgfyj31kw0o2qcy.jpg)


<a id='code'></a>

## 查看代码
reducers.js生成全局状态：  
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

BlogPage.js中生成store，并利用Provider注入顶层组件：
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

Content.js中利用connect()函数将状态写入组件props：  
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


