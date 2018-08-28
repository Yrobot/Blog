# CSS3-2D转换  
时间：2018年08月28日  
作者：Yrobot  

__本页目录：__    
[怎么使用](#id1)  
- [平移函数translate()](#id11)
- [旋转函数rotate()](#id12)
- [缩放函数scale()](#id13)
- [倾斜函数skew()](#id14)
- [矩阵操作matrix()](#id15)  

[浏览器支持](#id2)  

__CSS3新增的2D变换属性：__   通过 CSS3 转换，我们能够对元素进行移动、缩放、转动、拉长或拉伸。

<a href="" id="id1"></a>

## 怎么使用
<a href="" id="id11"></a>

1. __translate()__：设置元素相对于当前的位置。  
   __语法：__ `transform: translate(length,length);`  
   - 设置元素基于当前位置向右向下偏移。   
   - `length` 偏离的距离数据。  
   __示例：__ `transform: translate(50px,100px);`  
   ![](https://ws1.sinaimg.cn/large/006tNbRwgy1fuockbel15j30ai0euwey.jpg) 
<a href="" id="id12"></a>

2. __rotate()__：将元素进行顺时针旋转，旋转中心`transform-origin`进行设置，默认为元素中心  
   __语法：__ `transform: rotate(rot);`     
   - `rot` 元素顺时针转动的角度数据。   
   __示例：__ `transform: rotate(30deg);`   
   ![](https://ws4.sinaimg.cn/large/006tNbRwgy1fuockq1b1rj308i0aggmc.jpg)
<a href="" id="id13"></a>   

3. __scale()__：使用scale方法来实现文字或图像的缩放处理  
   __语法：__ `transform: scale(times);`     
   - `times` 数字，表示相对于当前元素缩放的倍数。可以有两个参数，表示长宽。  
   __示例：__ `transform: scale(0.5, 2);`   
   ![](https://ws4.sinaimg.cn/large/006tNbRwgy1fuoclaoa1uj30fa0lqjsf.jpg)
<a href="" id="14"></a>

4. __skew()__：使用skew方法来实现文字或图像的倾斜处理，默认坐标中心在元素中心   
   __语法：__ `transform: skew(rot);`  
   - 参数中分布指定水平方向上的倾斜角度与垂直方向上的倾斜角度。第一个围绕X轴，第二个围绕Y轴    
   - `rot` 一方向的倾斜角度。  
   __示例：__ `transform: skew(30deg, 30deg);`   
   ![](https://ws1.sinaimg.cn/large/006tNbRwgy1fuocmattrhj30880a4jrw.jpg)
<a href="" id="15"></a>

5. __matrix()__：矩阵操作。matrix() 方法可以把所有 2D 转换方法组合在一起  
   __语法：__ `transform: matrix(a,b,c,d,e,f);`  
   - 实际上，这6参数，对应的矩阵如下： _注意书写方向是竖着的_   
     ![](https://ws1.sinaimg.cn/large/006tNbRwgy1fuoak0zwuhj304302kq2w.jpg)  
   - 进行运算：  
     ![](https://ws1.sinaimg.cn/large/006tNbRwgy1fuoaq82zpxj30cm02xwep.jpg)  
     坐标就从[x,y]变成了[ax+cy+e,bx+dy+f]  
   - 关于为什么要`3*3`的矩阵？   
     主要是为了统一用矩阵乘的操作，其实平移只需要`2*2`，为了统一利用`3*3`乘法变相实现加法(平移)效果。具体思想参考计算机图形学    
   __示例：__ `transform: matrix(1, 0, 0, 1, 30, 30);`根据运算，可以得出此矩阵可以将元素向右下平移[30,30]   

<a id='id2'></a>

## 浏览器支持
![](https://ws4.sinaimg.cn/large/006tNbRwgy1fuo7z8j9byj318s04s3zs.jpg)  
Chrome 和 Safari 需要前缀 -webkit-  
Internet Explorer 9 需要前缀 -ms-  

--- 
### [返回首页](/README.md)
