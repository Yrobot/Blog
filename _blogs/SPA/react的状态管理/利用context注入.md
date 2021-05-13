---
title: react的状态管理—利用context注入
author: yrobot
keywords: context,状态管理,react,注入,利用
createTime: 1537545600000
createTimeStr: 2018年09月22日
length: 3544
---

__本页目录：__   
[场景思考](#index)  
[利用context注入](#context)  
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
上一节我们使用最基础的[props状态提升](./利用props状态提升)的方法   
但当组件链很长的时候，新增一个状态就必须修改每个组件的props  
那有没有跟直接的方法，搞一个共享状态，每个组件可以自由访问呢  
react自带的context就是用来实现这一点的  

<a id='context'></a>

## 利用context注入
react的context可以代替props的传递工作  

__context的作用：__ 将顶部组件的状态和方法与子组件共享  

__context的使用方法：__  
1. 利用`React.createContext()`生成一对`{Provider,Consumer}`  
2. 用生成的`Provider`包裹顶部组件，利用他props的value字段传入共享状态与方法  
   ```
    <Provider value={{状态和方法}}>
        <顶层组件>
    </Provider>
   ```
3. 用生成的`Consumer`包裹使用共享状态的组件，在Consumer内子组件外用函数传入共享的状态  
   ```
    <Consumer>
        {value => (
            <子组件 使用value>
        )}
    </Consumer>
   ```
4. 保证状态位于顶层组件的`state`中，而共享的方法要更新状态也是利用`setState`，这样UI层才会刷新  

![](https://ws4.sinaimg.cn/large/006tNbRwgy1fvhm1xim52j30yg0pqads.jpg)

__context的优势：__ 
1. 只需要在顶层组件和用到状态的子组件进行操作，省去了props状态提升中对中间组件的数据传递操作。代码更清晰。   
2. 无需引入第三方状态管理，学习成本也相对较低  

__尽管context相对于props状态提升方便很多，但是react官网还是 _不建议_ 使用context，因为context的API是实验性的，在未来的react版本中会被修改。__  

__在简单场景,推荐使用props状态提升__  
__在较复杂的场景，应该考虑引入第三方状态管理(如Redux、Mobx)__  

<a id='result'></a>

## 查看效果
1. 
![](https://ws3.sinaimg.cn/large/006tNbRwgy1fvhmmoieh4j31kw0nxdpk.jpg)
2. 
![](https://ws2.sinaimg.cn/large/006tNbRwgy1fvhmmukgfyj31kw0o2qcy.jpg)



<a id='code'></a>

## 查看代码
mainColorContext.js暴露React.createContext：  
```
import React from 'react';

export const mainColorContext = React.createContext(
    {
        mainColor:'black'
    } // 默认值
);
```

BlogPage.js中引入mainColorContext，定义全局状态mainColor和方法changeMainColor()并传入Provider： 
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
Content.js组件中获取使用Consumer传递的数据和方法：
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


