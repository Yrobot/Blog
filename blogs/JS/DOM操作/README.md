<a id='top'></a>
# DOM操作  
<a href="#top" style="position: fixed;font-size: 30px;color: rgb(88, 153, 226);right: 10px;bottom: 20px;z-index: 999;">TOP</a>

__本页目录：__   
[NodeList 和 HTMLCollection](#nh)  
[获取DOM节点的方法](#get)  
[生成节点的方法](#create)  
[DOM操作方法](#action)  
[关系节点获取](#near)  
[元素属性设置](#props)  
[元素样式修改](#style)  
[获取元素宽高、位置](#position)  

<a id='nh'></a>

## NodeList 和 HTMLCollection

#### 共同点：
  1. 都是类数组对象，都有length属性
  2. 都有共同的方法：item，可以通过item(index)或者item(id)来访问返回结果中的元素
  3. 都是实时变动的（live），document上的更改会反映到相关对象上（例外：document.querySelectorAll返回的NodeList不是实时的） 

#### 不同点：
  1. NodeList可以包含任何节点类型（包括换行、元素间的文字），HTMLCollection只包含元素节点（elementNode），elementNode就是HTML中的标签
  2. HTMLCollection比NodeList多一项方法：namedItem，可以通过传递id或name属性来获取节点信息

<a id='get'></a>

## 获取DOM节点的方法
1. `document.getElementById` ：根据ID查找元素，大小写敏感，如果有多个结果，只返回第一个；只能document调用

2. `DOM.getElementsByClassName` ：根据类名查找元素，多个类名用空格分隔，返回一个 HTMLCollection 。
3. `DOM.getElementsByTagName` ：根据标签查找元素， * 表示查询所有标签，返回一个 HTMLCollection 。
4. `document.getElementsByName` ：根据元素的name属性查找，返回一个 NodeList 。只能document调用
5. `DOM.querySelector` ：返回单个Node，如果匹配到多个结果，只返回第一个。
6. `DOM.querySelectorAll` ：返回一个 NodeList。不是实时的。
7. `document.forms` ：获取当前页面所有form，返回一个 HTMLCollection ；
8. `document.documentElement`：获取html节点
9.  `document.body`：获取body节点

<a id='create'></a>

## 生成节点的方法
1. `document.createElement("p")`：生成HTML节点元素，参数为节点类型

2. `document.createTextNode("text")`:文本内容（无标签包裹），节点间的文本、节点内的文本
3. `DOM.cloneNode()`：方法创建节点的拷贝，并返回该副本。


<a id='action'></a>

## DOM操作方法
### 添加元素：
1. `DOM.appendChild(元素)`：在DOM节点末尾添加元素
2. `parentNode.insertBefore(newNode, refNode)`：在redNode前添加新元素newNode
3. `DOM.insertAdjacentElement(position,ele)`：在DOM指定位置添加元素
4. `DOM.insertAdjacentHTML(position, text)`：同上   
    __position__  
    A DOMString representing the position relative to the element; must be one of the following strings: 相对于p节点  
    取值：`'beforebegin'`、`'afterbegin'`、`'beforeend'`、`'afterend'`  
    ```    
        <!-- beforebegin -->
        <p>
            <!-- afterbegin -->
            foo
            <!-- beforeend -->
        </p>
        <!-- afterend -->
    ```
    __text__  
    text is the string to be parsed as HTML or XML and inserted into the tree.例如`'<div id="two">two</div>'`  
    __element__  
    要插入到树中的元素.  

### 删除元素：
1. `parentNode.removeChild(node)`：删除parentNode下的node节点，注意是实时更新的，删除时index会时时改变
    ```
    function removeNode(node)  
    {  
        if(!node) return;  
        if(node.parentNode) node.parentNode.removeChild(node);  
    }  
    ```
2. `parentNode.replaceChild(newChild, oldChild)`：将oldChild替换为newChild

<a id='near'></a>

## 关系节点获取
1. `parentNode` ：返回元素的父节点。Element的父节点可能是Element，Document或DocumentFragment；

2. `parentElement` ：返回元素的父元素节点，与parentNode的区别在于，其父节点必须是一个Element元素，如果不是，则返回null；
3. `children` ：返回一个实时的 HTMLCollection ，子节点都是Element，IE9以下浏览器不支持；
4. `childNodes` ：返回一个实时的 NodeList ，表示元素的子节点列表，注意子节点可能包含文本节点、注释节点等；
5. `firstChild` ：返回第一个子节点，不存在返回null，与之相对应的还有一个 firstElementChild ；
6. `lastChild` ：返回最后一个子节点，不存在返回null，与之相对应的还有一个 lastElementChild ；
7. `previousSibling` ：返回节点的前一个节点，如果不存在则返回null。注意有可能拿到的节点是文本节点或注释节点。
8. `nextSibling` ：返回节点的后一个节点，如果不存在则返回null。注意有可能拿到的节点是文本节点或注释节点。
9.  `previousElementSibling` ：返回前一个element元素节点，前一个节点必须是Element，注意IE9以下浏览器不支持。
10. `nextElementSibling` ：返回后一个element元素节点，后一个节点必须是Element，注意IE9以下浏览器不支持。


<a id='props'></a>

## 元素属性设置
1. `DOM.setAttribute(name, value)`: name是特性名，value是特性值，如 DOM.setAttribute('name', 'ele');

2. `DOM.getAttribute(name)`: 返回指定的特性名相应的特性值，如果不存在，则返回nul
3. `DOM.hasAttribute(name)`: 判断DOM是否存在name的属性
4. `DOM.dataset`: 获取html data-开头的属性
    ```
    <div id="user" data-id="1234567890" data-user="johndoe" data-date-of-birth>John Doe</div>

    let el = document.querySelector('#user');
    // el.id == 'user'
    // el.dataset.id === '1234567890'
    // el.dataset.user === 'johndoe'
    // el.dataset.dateOfBirth === ''

    el.dataset.dateOfBirth = '1960-10-03'; // set the DOB.
    // 'someDataAttr' in el.dataset === false

    el.dataset.someDataAttr = 'mydata';
    // 'someDataAttr' in el.dataset === true
    ```

<a id='style'></a>

## 元素样式修改
1. 直接修改元素style样式： _`element.sytle.xxx`只能获取到内联样式_  
    ```
    elem.style.color = 'red';    
    elem.style.setProperty('font-size', '16px');    
    elem.style.removeProperty('color'); 
    ```  
2. 动态添加样式规则：  
    ```
    var style = document.createElement('style');  
    style.innerHTML = 'body{color:red} #top:hover{background-color: red;color: white;}';  
    document.head.appendChild(style);  
    ```
3. classList获取样式class  
    __`DOM.classList.xxx()`:__   
    - add( String [, String] )  
    添加指定的类值。如果这些类已经存在于元素的属性中，那么它们将被忽略。
      
    - remove( String [,String] )  
    删除指定的类值。  
    - item ( Number )  
    按集合中的索引返回类值。  
    - toggle ( String [, force] )  
    当只有一个参数时：切换 class value; 即如果类存在，则删除它并返回false，如果不存在，则添加它并返回true。  
    当存在第二个参数时：如果第二个参数的计算结果为true，则添加指定的类值，如果计算结果为false，则删除它  
    - contains( String )  
    检查元素的类属性中是否存在指定的类值。  
    - replace( String, String )  
    用一个新类替换已有类。   
4. 使用`window.getComputedStyle`： _借助`window.getComputedStyle`可以获取应用到元素上的所有样式_   
    `let style = window.getComputedStyle(element, [pseudoElt]);`  
    - element   
    用于获取计算样式的Element。  
    - pseudoElt [可选]  
    指定一个要匹配的伪元素的字符串。必须对普通元素省略（或null）。 

    返回的style是一个实时的 [CSSStyleDeclaration](https://developer.mozilla.org/zh-CN/docs/Web/API/CSSStyleDeclaration) 对象，当元素的样式更改时，它会自动更新本身。   
    ```
    let elem = document.getElementById("elem-container");
    window.getComputedStyle(elem,null).height = '100px';
    ```

<a id='position'></a>

## 获取元素宽高、位置
1. `getBoundingClientRect()`:  
    `DOM.getBoundingClientRect()`的属性：
    | Attribute | Type  | Description                                                   |
    | --------- | ----- | ------------------------------------------------------------- |
    | bottom    | float | Y 轴，相对于视口原点（viewport origin）矩形盒子的底部。只读。 |
    | height    | float | 矩形盒子的高度（等同于 bottom 减 top）。只读。                |
    | left      | float | X 轴，相对于视口原点（viewport origin）矩形盒子的左侧。只读。 |
    | right     | float | X 轴，相对于视口原点（viewport origin）矩形盒子的右侧。只读。 |
    | top       | float | Y 轴，相对于视口原点（viewport origin）矩形盒子的顶部。只读。 |
    | width     | float | 矩形盒子的宽度（等同于 right 减 left）。只读。                |
    | x         | float | X 轴，相对于视口原点（viewport origin）矩形盒子的左侧。只读。 |
    | y         | float | Y 轴，相对于视口原点（viewport origin）矩形盒子的顶部。只读。 |
    clientRect是一个 DOMRect 对象，包含width、height、left、top、right、bottom，它是相对于窗口顶部而不是文档顶部，__滚动页面时它们的值是会发生变化的__。

1. `DOM.clientWidth`：表示元素的内部宽度，以像素计。盒模型的content+padding
2. `DOM.offsetLeft`：返回当前元素左上角相对于  HTMLElement.offsetParent (距离元素的最近的父级定位元素) 节点的左边界偏移的像素值。
3. `DOM.scrollLeft` 属性可以读取或设置元素滚动条到元素左边的距离。


