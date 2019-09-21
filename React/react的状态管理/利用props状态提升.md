# react的状态管理—利用props状态提升  
时间：2018年09月18日  
作者：Yrobot  

__本页目录：__   
[场景思考](#index)  
[利用props状态提升](#props)  
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


<a id='props'></a>

## 利用props状态提升
学习了react，就知道组件间数据交互最普遍的方式就是利用props传递  
而目我们要做的就是Title和Content引用的是同一个颜色变量，而且在变量改变时组件自动重新渲染  
利用react最基础的方法就是利用状态提升:  
把一些共享的状态放在最顶端的组件中，子组件通过props去访问和修改这些状态  

本场景中需要共享的状态只有一个`mainColor`和一个修改mainColor的函数`changeMainColor()`  
具体流程如下图：  
![](https://ws1.sinaimg.cn/large/006tNbRwgy1fvexnc4cbcj30ss0poacx.jpg)
可以看到，需要在content和title中用mainColor，需要通过组件props层层传递到需要用状态的组件，函数也是同理  

<a id='result'></a>

## 查看效果
1. 
![](https://ws3.sinaimg.cn/large/006tNbRwgy1fvey3e0sw6j31kw0lmdoe.jpg)
2. 
![](https://ws1.sinaimg.cn/large/006tNbRwgy1fvey3n6qu4j31kw0n1aju.jpg)
3. 
![](https://ws4.sinaimg.cn/large/006tNbRwgy1fvey3xqxwpj31kw0nntin.jpg)


<a id='code'></a>

## 查看代码

BlogPage中定义全局状态mainColor和方法changeMainColor()并传递： 
```
class BlogPage extends Component {
    constructor(props) {
        super(props);
        this.state = {
            mainColor: 'black'
        }
    }
    changeMainColor = (color) => {
        this.setState({
            mainColor: color
        })
    }
    render() {
        const { mainColor } = this.state;
        return (
            <div className="blogContainer">
                <Header mainColor={mainColor}></Header>
                <Main mainColor={mainColor} changeMainColor={this.changeMainColor}></Main>
            </div>
        );
    }
}
```
Content组件中使用props传递的数据和方法：
```
class Content extends Component {
    constructor(props) {
        super(props);
        this.state = {}
    }
    randomColor = () => {
        this.props.changeMainColor('#' + (Math.random() * 0xffffff << 0).toString(16));
    }
    render() {
        const {mainColor}=this.props;
        return (
            <div className="content" style={{color:mainColor}}>
                内容...
                <div className="button" onClick={this.randomColor}>切换颜色</div>
            </div>
        );
    }
}
```


--- 
*本章节部分参考[React.js 小书](http://huziketang.mangojuice.top/books/react/lesson29)，在此感谢！*
### [讨论专区](https://github.com/Yrobot/Yrobot-FrontEnd-Blog/issues/1)  
### [返回首页](../../README.md)
